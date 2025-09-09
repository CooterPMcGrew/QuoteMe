// Quote Game Server - Run this with Node.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const QRCode = require('qrcode');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Game state
let gameState = {
    phase: 'SETUP', // SETUP, COLLECTING, VOTING, REVEALING, FINISHED
    players: new Map(), // playerId -> {name, quote, points}
    votes: new Map(), // playerId -> Map(quoteId -> authorId)
    currentRevealIndex: 0,
    quotes: []
};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

const PORT = 3000;
const LOCAL_IP = getLocalIP();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // Send current game state to new connections
    socket.emit('gameState', {
        phase: gameState.phase,
        players: Array.from(gameState.players.values()),
        quotes: gameState.quotes,
        currentRevealIndex: gameState.currentRevealIndex
    });

    // Player joins game
    socket.on('joinGame', (data) => {
        const { name, quote } = data;
        if (gameState.phase === 'COLLECTING') {
            gameState.players.set(socket.id, {
                id: socket.id,
                name: name.trim(),
                quote: quote.trim(),
                points: 0
            });
            
            // Broadcast updated player list
            io.emit('playerUpdate', Array.from(gameState.players.values()));
            console.log(`Player joined: ${name}`);
        }
    });

    // Admin controls
    socket.on('startCollecting', () => {
        gameState.phase = 'COLLECTING';
        gameState.players.clear();
        gameState.votes.clear();
        gameState.currentRevealIndex = 0;
        gameState.quotes = [];
        io.emit('phaseChange', 'COLLECTING');
        console.log('Started collecting phase');
    });

    socket.on('startVoting', () => {
        if (gameState.players.size < 2) {
            socket.emit('error', 'Need at least 2 players to start voting');
            return;
        }
        
        gameState.phase = 'VOTING';
        gameState.quotes = Array.from(gameState.players.values()).map(player => ({
            id: player.id,
            quote: player.quote,
            author: player.name
        }));
        
        // Shuffle quotes for display
        for (let i = gameState.quotes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameState.quotes[i], gameState.quotes[j]] = [gameState.quotes[j], gameState.quotes[i]];
        }
        
        io.emit('phaseChange', 'VOTING');
        io.emit('quotesForVoting', {
            quotes: gameState.quotes,
            players: Array.from(gameState.players.values())
        });
        console.log('Started voting phase');
    });

    socket.on('submitVotes', (votes) => {
        if (gameState.phase === 'VOTING') {
            gameState.votes.set(socket.id, new Map(Object.entries(votes)));
            console.log(`Received votes from ${gameState.players.get(socket.id)?.name}`);
            
            // Check if all players have voted
            if (gameState.votes.size === gameState.players.size) {
                gameState.phase = 'REVEALING';
                io.emit('phaseChange', 'REVEALING');
                console.log('All votes received, starting reveal phase');
            }
        }
    });

    socket.on('revealNext', () => {
        if (gameState.phase === 'REVEALING' && gameState.currentRevealIndex < gameState.quotes.length) {
            const quote = gameState.quotes[gameState.currentRevealIndex];
            
            // Calculate vote results for this quote
            const voteResults = new Map();
            const totalVotes = gameState.votes.size;
            
            // Initialize vote counts
            for (const player of gameState.players.values()) {
                voteResults.set(player.id, { name: player.name, count: 0, percentage: 0 });
            }
            
            // Count votes for this quote
            for (const playerVotes of gameState.votes.values()) {
                const votedFor = playerVotes.get(quote.id);
                if (votedFor && voteResults.has(votedFor)) {
                    const current = voteResults.get(votedFor);
                    current.count++;
                }
            }
            
            // Calculate percentages and find most popular choice
            let mostPopularId = null;
            let maxVotes = -1;
            
            for (const [playerId, result] of voteResults) {
                result.percentage = totalVotes > 0 ? Math.round((result.count / totalVotes) * 100) : 0;
                if (result.count > maxVotes) {
                    maxVotes = result.count;
                    mostPopularId = playerId;
                }
            }
            
            // Award points
            const correctAuthorId = quote.id;
            const authorWasMostPopular = mostPopularId === correctAuthorId;
            
            // Give points to correct guessers
            for (const [playerId, playerVotes] of gameState.votes) {
                const votedFor = playerVotes.get(quote.id);
                if (votedFor === correctAuthorId) {
                    gameState.players.get(playerId).points += 1;
                }
            }
            
            // Subtract points from author if they were most popular
            if (authorWasMostPopular && maxVotes > 0) {
                gameState.players.get(correctAuthorId).points -= 2;
            }
            
            // Send reveal data
            io.emit('quoteReveal', {
                quote: quote.quote,
                author: quote.author,
                voteResults: Array.from(voteResults.values()),
                authorWasMostPopular,
                players: Array.from(gameState.players.values()),
                isLastQuote: gameState.currentRevealIndex === gameState.quotes.length - 1
            });
            
            gameState.currentRevealIndex++;
            
            if (gameState.currentRevealIndex >= gameState.quotes.length) {
                gameState.phase = 'FINISHED';
                setTimeout(() => {
                    io.emit('gameFinished', {
                        players: Array.from(gameState.players.values()).sort((a, b) => b.points - a.points)
                    });
                }, 3000);
            }
            
            console.log(`Revealed quote ${gameState.currentRevealIndex}/${gameState.quotes.length}`);
        }
    });

    socket.on('resetGame', () => {
        gameState = {
            phase: 'SETUP',
            players: new Map(),
            votes: new Map(),
            currentRevealIndex: 0,
            quotes: []
        };
        io.emit('gameReset');
        console.log('Game reset');
    });

    socket.on('disconnect', () => {
        if (gameState.players.has(socket.id)) {
            const player = gameState.players.get(socket.id);
            gameState.players.delete(socket.id);
            gameState.votes.delete(socket.id);
            io.emit('playerUpdate', Array.from(gameState.players.values()));
            console.log(`Player disconnected: ${player.name}`);
        }
    });
});

// Generate QR code endpoint
app.get('/qr', async (req, res) => {
    try {
        const url = `http://${LOCAL_IP}:${PORT}/mobile`;
        const qrCode = await QRCode.toDataURL(url);
        res.json({ qrCode, url });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎮 Quote Game Server running!`);
    console.log(`📱 Mobile URL: http://${LOCAL_IP}:${PORT}/mobile`);
    console.log(`🖥️  TV Display: http://${LOCAL_IP}:${PORT}/display`);
    console.log(`⚙️  Admin Control: http://${LOCAL_IP}:${PORT}/admin`);
    console.log(`\nMake sure all devices are connected to the same WiFi network!\n`);
});