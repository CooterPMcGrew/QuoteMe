# 🎯 QuoteMe - The Ultimate Party Quote Game

*Can you guess who said what? A hilarious party game where players submit quotes and try to match them to their authors!*

![QuoteMe Demo](https://via.placeholder.com/800x400/667eea/white?text=QuoteMe+Party+Game)

## 🎮 What is QuoteMe?

QuoteMe is a real-time multiplayer party game perfect for gatherings, family nights, or virtual hangouts! Players submit funny quotes that sound like something they'd say, then everyone tries to guess who wrote each quote. The twist? Authors get penalized if they fool too many people!

### ✨ Features
- 📱 **Mobile-First Design** - Players use their phones, no app needed
- 📺 **TV Display** - Beautiful big-screen experience for everyone to see
- 🎯 **QR Code Joining** - Just scan and play!
- 📊 **Live Scoring** - Real-time scoreboard updates
- 🎭 **Strategic Gameplay** - Balance being recognizable vs. fooling everyone
- 🔄 **Easy Reset** - Play multiple rounds seamlessly

## 🚀 Quick Start

### Prerequisites
- Node.js installed on your laptop
- All players on the same WiFi network
- A TV or projector to display results

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/quoteme.git
cd quoteme

# Install dependencies
npm install

# Start the game server
npm start
```

### Game Setup
1. **Connect laptop to TV** (HDMI or screen mirroring)
2. **Open TV Display** - Navigate to the display URL in your browser
3. **Open Admin Panel** - Use the admin URL on your phone/tablet  
4. **Players Join** - Everyone scans the QR code with their phones
5. **Start Playing!** - Follow the admin panel to control game flow

## 🎯 How to Play

### Phase 1: Quote Collection
- Players scan QR code and join the game
- Everyone submits their name and a silly quote
- Quotes should sound like something you'd actually say!

### Phase 2: Voting
- All quotes appear on the TV (anonymously)
- Players use their phones to match quotes to authors
- Strategy: Think about each person's personality and speaking style

### Phase 3: The Big Reveal
- Quotes are revealed one by one with voting results
- See who got fooled and who nailed it!
- Watch the scoreboard update in real time

### Scoring System
- ✅ **+1 point** for each correct guess
- 🎭 **-2 points** for authors whose quote was the most popular choice
- 🏆 **Highest score wins!**

## 📱 Screenshots

| TV Display | Mobile Interface | Admin Panel |
|------------|------------------|-------------|
| Beautiful big-screen experience | Simple mobile voting | Easy game control |

## 🛠️ Technical Details

### Built With
- **Backend**: Node.js + Express + Socket.IO
- **Frontend**: Vanilla HTML/CSS/JS
- **Real-time**: WebSocket connections
- **QR Codes**: Built-in QR code generation

### Network Options
- **Home WiFi** (recommended) - Everyone on same network
- **Mobile Hotspot** - Great for locations without WiFi  
- **Port Forwarding** - Advanced setup for remote players

## 🎨 Customization

Want to make QuoteMe your own? Easy peasy!

- **Themes**: Modify the CSS gradients and colors
- **Game Modes**: Add timers, team play, or themed rounds
- **Sounds**: Add sound effects for reveals and scoring
- **Branding**: Change the name and styling to match your event

## 🤝 Contributing

Love QuoteMe? We'd love your contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Sound effects and animations
- [ ] Team mode for larger groups
- [ ] Export game results to share
- [ ] Custom themes and branding
- [ ] Mobile app version
- [ ] Tournament bracket mode

## 🐛 Troubleshooting

**Players can't connect?**
- Ensure everyone is on the same WiFi network
- Try refreshing the QR code
- Check firewall settings

**Game not syncing?**
- Refresh all browser windows
- Restart the server with `npm start`
- Use the admin panel to reset if needed

**More help needed?**
- Check our [Wiki](link-to-wiki)
- Open an [Issue](link-to-issues)
- Join our [Discord](link-to-discord)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Credits

Created with ❤️ for party people everywhere!

**Special thanks to:**
- Coffee ☕ for fueling late-night coding sessions
- Friends who beta-tested with hilarious quotes
- The open-source community for amazing tools

---

*Ready to find out who really said what? Let's play QuoteMe!* 🎯

[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/yourusername/quoteme)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=flat&logo=socket.io&badgeColor=010101)](https://socket.io)