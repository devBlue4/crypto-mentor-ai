# CryptoMentor AI 🚀

An intelligent Web3 trading assistant that uses the AdEx AURA API to provide real-time market analysis, personalized recommendations, and cryptocurrency education.

## ✨ Key Features

- **🤖 AI AURA Chat**: Intelligent chat interface for crypto questions
- **💼 Portfolio Analysis**: Connect your wallet and receive personalized analysis
- **📊 Market Dashboard**: Real-time market data visualization
- **🔔 Smart Alerts**: Configure personalized alerts with AI
- **📚 Education Center**: Interactive cryptocurrency lessons
- **🔗 Web3 Integration**: Secure connection with MetaMask

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Web3**: Ethers.js v6
- **Charts**: Recharts
- **AI**: AdEx AURA API
- **Notifications**: React Hot Toast

## 🚀 Installation and Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask installed in your browser

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/crypto-mentor-ai.git
   cd crypto-mentor-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file and add your AdEx AURA API key:
   ```env
   VITE_AURA_API_KEY=your_aura_api_key_here
   ```

4. **Run the project**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Go to `http://localhost:3000`

## 📱 Features

### Main Dashboard
- Real-time market summary
- Interactive price charts
- Crypto market news
- Fear & Greed Index metrics

### Portfolio Management
- MetaMask connection
- ETH balance and ERC-20 tokens visualization
- Diversification and risk analysis
- Personalized AURA recommendations

### AI Chat
- Intuitive conversational interface
- Contextual portfolio analysis
- Trading recommendations
- Educational explanations

### Alert System
- Personalized price alerts
- Market change notifications
- Intelligent AI configuration
- Centralized alert management

### Education Center
- Lessons categorized by difficulty
- Learning progress tracking
- Tips and best practices
- Updated content

## 🔧 Advanced Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_AURA_API_KEY` | AdEx AURA API Key | ✅ |
| `VITE_COINGECKO_API_KEY` | CoinGecko API Key | ❌ |
| `VITE_ALCHEMY_API_KEY` | Alchemy API Key | ❌ |

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Build preview
npm run lint         # Code linter
```

## 🌐 API Integrations

### AdEx AURA API
- Intelligent chat with contextual analysis
- Personalized recommendations
- Market sentiment analysis
- Trading insights

### CoinGecko API (Optional)
- Real-time price data
- Market cap information
- Historical price data

### Alchemy/Infura (Optional)
- Real-time blockchain data
- Transaction information
- Network status

## 🔒 Security

- **No private key storage**: We only read public data
- **Secure MetaMask connection**: Using standard protocol
- **Input validation**: All inputs are validated
- **HTTPS required**: For production

## 📊 Project Architecture

```
src/
├── components/          # React components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Portfolio.jsx   # Portfolio management
│   ├── ChatInterface.jsx # AI chat
│   ├── MarketOverview.jsx # Market view
│   └── ...
├── contexts/           # React contexts
│   ├── WalletContext.jsx # Wallet state
│   └── AuraContext.jsx  # AI state
├── services/           # Services and APIs
│   ├── auraAPI.js     # AURA integration
│   ├── walletService.js # Wallet services
│   └── marketData.js  # Market data
└── App.jsx            # Main component
```

## 🎯 Roadmap

- [ ] **Phase 1**: ✅ Initial setup and base components
- [ ] **Phase 2**: ✅ Web3 and MetaMask integration
- [ ] **Phase 3**: ✅ AURA API integration
- [ ] **Phase 4**: ✅ Advanced features
- [ ] **Phase 5**: 🚧 Optimization and polish

### Upcoming Features
- [ ] Direct trading from the app
- [ ] Integration with more exchanges
- [ ] Advanced technical analysis
- [ ] Automatic portfolio tracking
- [ ] Push notifications
- [ ] Dark mode

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 🙏 Acknowledgments

- **AdEx Team** for the AURA API
- **Ethers.js** for the excellent Web3 library
- **TailwindCSS** for the styling framework
- **React Team** for the amazing framework

## 📞 Support

If you have questions or need help:

- 📧 Email: support@cryptomentor.ai
- 💬 Discord: [Join our server](https://discord.gg/cryptomentor)
- 📖 Documentation: [Project wiki](https://github.com/your-username/crypto-mentor-ai/wiki)

---

**Made with ❤️ for the crypto community**

*CryptoMentor AI - Your intelligent Web3 trading assistant*