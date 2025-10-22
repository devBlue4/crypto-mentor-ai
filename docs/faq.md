# FAQ - CryptoMentor AI

Frequently asked questions about CryptoMentor AI, its use, configuration and features.

## 🚀 Installation and Configuration

### How do I install CryptoMentor AI?

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/crypto-mentor-ai.git
   cd crypto-mentor-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp env.example .env
   # Edit .env and add your AURA API key
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

### What do I need to use CryptoMentor AI?

**Minimum requirements:**
- Node.js 18+
- Modern browser (Chrome, Firefox, Safari, Edge)
- MetaMask installed
- AdEx AURA API key

**Optional:**
- CoinGecko, Alchemy, Infura API keys for extended functionality

### Where do I get the AdEx AURA API key?

1. Go to [adex.network](https://adex.network)
2. Register for an account
3. Access the developer dashboard
4. Create a new application
5. Copy the generated API key

### Does the application work without AURA API key?

Yes, CryptoMentor AI includes a **demo mode** that works without an API key. However, responses will be limited and won't include real personalized analysis.

## 💼 Wallet and Web3

### What wallets are compatible?

Currently CryptoMentor AI supports:
- **MetaMask** (recommended)
- **WalletConnect** (coming soon)
- **Coinbase Wallet** (coming soon)

### Is it safe to connect my wallet?

Yes, CryptoMentor AI:
- **Only reads** public data from your wallet
- **Does not request** transaction permissions
- **Does not store** private keys
- **Cannot** access your funds

### What blockchain networks does it support?

**Main networks:**
- Ethereum Mainnet
- Polygon Mainnet
- Binance Smart Chain (coming soon)

**Test networks:**
- Goerli Testnet
- Mumbai Testnet

### Can I use the application without connecting a wallet?

Yes, you can use:
- Chat with AURA
- Market analysis
- Education center
- Alert system

However, for portfolio analysis you need to connect your wallet.

## 🤖 AURA AI

### What is AURA?

AURA is AdEx Network's AI specialized in:
- Cryptocurrency analysis
- Trading recommendations
- Market insights
- Crypto education

### How does chat with AURA work?

1. **Type your question** in the text field
2. **AURA analyzes** your message and context
3. **Generates a personalized** response
4. **Includes recommendations** if relevant

### Can AURA do trading for me?

No, AURA only provides:
- **Analysis** of the market and your portfolio
- **Educational recommendations**
- **Insights** about trends
- **Information** to help you decide

### Are AURA's recommendations guaranteed?

No, AURA provides analysis and recommendations based on:
- Historical data
- Market trends
- Your risk profile

**Important:** Always do your own research before investing.

### How does AURA improve its recommendations?

AURA learns from:
- User interactions
- Real-time market data
- Community feedback
- AI updates

## 📊 Portfolio and Analysis

### How does AURA analyze my portfolio?

AURA evaluates:
- **Diversification**: Asset distribution
- **Risk**: Volatility and concentration
- **Performance**: Value changes
- **Liquidity**: Fund availability

### What tokens does it automatically detect?

CryptoMentor AI detects popular ERC-20 tokens:
- USDC, USDT, WBTC
- LINK, UNI, MATIC
- And many more

### Can I add custom tokens?

Currently no, but you can suggest tokens to add in future versions.

### How does it calculate my portfolio value?

The value is calculated using:
- Current CoinGecko prices
- Token balances in your wallet
- USD conversion

### How often is my portfolio updated?

- **Automatically**: Every 30 seconds
- **Manual**: Using the "Update" button
- **On connect**: When you connect your wallet

## 🔔 Alerts

### What types of alerts can I create?

**Price alerts:**
- Above a value
- Below a value

**Change alerts:**
- Positive change %
- Negative change %

**Volume alerts:**
- High volume
- Low volume

### How do I receive alerts?

Alerts are shown:
- **In the application** (notifications)
- **By email** (if configured)
- **Push notifications** (coming soon)

### How many alerts can I have?

There's no technical limit, but we recommend:
- **Maximum 10 active alerts**
- **Relevant alerts** for your strategy
- **Review regularly** and remove unnecessary ones

### Do alerts work offline?

No, alerts require:
- Internet connection
- Application open or active service
- APIs working correctly

## 📚 Education

### What can I learn in the education center?

**Basic concepts:**
- What are cryptocurrencies?
- How blockchain works
- Types of wallets

**Trading:**
- Trading fundamentals
- Technical analysis
- Risk management

**DeFi:**
- Decentralized protocols
- Yield farming
- Liquidity pools

**Security:**
- Wallet protection
- Scam prevention
- Best practices

### Are there certifications or diplomas?

Currently no, but we're considering:
- **Progress badges**
- **Competency certificates**
- **Points system**

### Is the content updated?

Yes, educational content is updated:
- **Monthly** with new lessons
- **According to market** trends
- **Based on user** feedback

## 🔧 Technical Issues

### Why won't my wallet connect?

**Possible causes:**
- MetaMask is not installed
- MetaMask is not unlocked
- You're on the wrong network
- Permissions denied

**Solutions:**
1. Install/update MetaMask
2. Unlock your wallet
3. Switch to the correct network
4. Reload the page

### Why isn't AURA responding?

**Possible causes:**
- No internet connection
- Invalid or expired API key
- Rate limit exceeded
- Server error

**Solutions:**
1. Check your connection
2. Review your API key
3. Wait a few minutes
4. Contact support

### Why aren't prices updating?

**Possible causes:**
- Price APIs down
- Request limit exceeded
- Outdated cache

**Solutions:**
1. Reload the page
2. Wait a few minutes
3. Check your API keys

### Is the application slow?

**Optimizations:**
- Close unnecessary tabs
- Use a modern browser
- Check your internet connection
- Clear browser cache

## 💰 Costs and Pricing

### Is CryptoMentor AI free?

**Basic version:**
- ✅ Completely free
- ✅ All main features
- ✅ Chat with AURA
- ✅ Portfolio analysis

**Premium version (future):**
- 🔄 Advanced features
- 🔄 Premium APIs
- 🔄 Priority support

### Are there hidden costs?

No, CryptoMentor AI is completely free. The only costs might be:
- **Gas fees** for blockchain transactions
- **Premium API keys** (optional)

### How is the project maintained?

The project is maintained with:
- **Community** sponsorships
- **Voluntary** donations
- **Partnerships** with partners
- **Development** programs

## 🔒 Privacy and Security

### What data does CryptoMentor AI collect?

**Data collected:**
- Wallet address (public)
- Token balances (public)
- AURA interactions
- User preferences

**Data NOT collected:**
- Private keys
- Personal data
- Private financial information
- Transaction history

### Where is my data stored?

**Locally:**
- User settings
- Chat history
- Alert preferences

**On servers:**
- Anonymous analytics
- Usage metrics
- Market data

### Can I delete my data?

Yes, you can:
- **Clear chat** history
- **Delete alerts**
- **Disconnect wallet**
- **Contact support** for complete deletion

### Is it safe for beginners?

Yes, CryptoMentor AI is safe because:
- **Read-only** public data
- **Cannot** access your funds
- **Education** before trading
- **Risk warnings** included

## 🌐 Languages and Regions

### What languages is it available in?

Currently:
- **Spanish** (complete)
- **English** (coming soon)

Coming soon:
- Portuguese, French, German, Chinese

### Does it work in my country?

CryptoMentor AI works globally, but:
- **Check local** crypto regulations
- **Consult legal** advice if necessary
- **Use networks** appropriate for your region

### Are there geographic restrictions?

No technical restrictions, but:
- Some APIs may have limitations
- Local regulations may apply
- We recommend checking local compliance

## 🚀 Future and Development

### What new features are coming?

**Upcoming features:**
- Direct trading from the app
- Integration with more exchanges
- Advanced technical analysis
- Dark mode
- Native mobile app

### How can I contribute to the project?

**Ways to contribute:**
- **Code**: Pull requests on GitHub
- **Documentation**: Improve docs
- **Testing**: Report bugs
- **Feedback**: Feature suggestions
- **Community**: Help other users

### Is there a public roadmap?

Yes, you can see the roadmap at:
- [GitHub Issues](https://github.com/your-username/crypto-mentor-ai/issues)
- [Discord](https://discord.gg/cryptomentor)
- Project documentation

### How do I report bugs or suggestions?

**Options:**
1. **GitHub Issues**: For technical bugs
2. **Discord**: For discussion
3. **Email**: support@cryptomentor.ai
4. **Form**: In the application

## 📞 Support and Community

### Where do I get help?

**Support channels:**
- **FAQ**: This document
- **Documentation**: docs/ folder
- **Discord**: Active community
- **Email**: Technical support
- **GitHub**: Issues and discussions

### Is there a user community?

Yes, join:
- **Discord**: Real-time chat
- **GitHub**: Technical discussions
- **Twitter**: Updates
- **Reddit**: General discussions

### Do you offer technical support?

**Available support:**
- **Community**: Discord and GitHub
- **Documentation**: Detailed guides
- **Email**: For complex cases
- **Video calls**: For partners (future)

### Is there a beta testing program?

Yes, you can join the beta program:
1. Join Discord
2. Request beta access
3. Test new features
4. Provide feedback

---

Didn't find your question? Join our community on Discord or contact support! 🚀
