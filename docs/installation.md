# Installation Guide - CryptoMentor AI

This guide will help you set up the development environment for CryptoMentor AI.

## 📋 Prerequisites

### Required Software

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: To clone the repository
- **MetaMask**: Browser extension for Web3

### Verify Installations

```bash
# Verify Node.js
node --version
# Should show: v18.x.x or higher

# Verify npm
npm --version
# Should show: 8.x.x or higher

# Verify Git
git --version
```

### Supported Browsers

- **Chrome**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Edge**: Version 90+

## 🚀 Step-by-Step Installation

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/crypto-mentor-ai.git

# Navigate to the directory
cd crypto-mentor-ai
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Or use yarn if you prefer
yarn install
```

### 3. Configure Environment Variables

```bash
# Copy example file
cp env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

**Required variables:**

```env
# AdEx AURA API (Required)
VITE_AURA_API_KEY=your_aura_api_key_here

# Optional APIs for extended functionality
VITE_COINGECKO_API_KEY=your_coingecko_api_key
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_INFURA_API_KEY=your_infura_api_key

# App configuration
VITE_APP_NAME=CryptoMentor AI
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

### 4. Get API Keys

#### AdEx AURA API Key (Required)
1. Register at [AdEx Network](https://adex.network)
2. Access the developer dashboard
3. Create a new application
4. Copy the API key

#### CoinGecko API Key (Optional)
1. Go to [CoinGecko API](https://www.coingecko.com/en/api)
2. Register for a free account
3. Get the API key from the dashboard

#### Alchemy/Infura (Optional)
1. **Alchemy**: [alchemy.com](https://alchemy.com)
2. **Infura**: [infura.io](https://infura.io)

### 5. Install MetaMask

1. Go to [metamask.io](https://metamask.io/download/)
2. Download the extension for your browser
3. Create a new wallet or import an existing one
4. **Important**: Use a test network for development

### 6. Configure Test Network

For development, configure a test network:

1. Open MetaMask
2. Go to Settings > Networks
3. Add custom network:
   - **Network Name**: Ethereum Testnet
   - **RPC URL**: `https://goerli.infura.io/v3/YOUR_PROJECT_ID`
   - **Chain ID**: 5
   - **Currency Symbol**: ETH
   - **Block Explorer**: `https://goerli.etherscan.io`

### 7. Run the Application

```bash
# Development mode
npm run dev

# The application will be available at:
# http://localhost:3000
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Development server with hot reload
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting errors automatically

# Utilities
npm run setup        # Automatic configuration script
npm run clean        # Clean build files
```

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 is already in use"
```bash
# Use a different port
npm run dev -- --port 3001
```

### Error: "MetaMask not found"
- Verify MetaMask is installed
- Make sure it's enabled in the browser
- Reload the page

### Error: "Invalid API key"
- Verify the API key is in the `.env` file
- Confirm the API key is valid
- Check there are no extra spaces in the `.env` file

## 🏗️ Project Structure

```
crypto-mentor-ai/
├── public/                 # Static files
├── src/                   # Source code
│   ├── components/        # React components
│   ├── contexts/         # React Contexts
│   ├── services/         # Services and APIs
│   ├── App.jsx          # Main component
│   └── main.jsx         # Entry point
├── docs/                # Documentation
├── scripts/             # Utility scripts
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── .env                 # Environment variables
```

## 🔄 Updates

To keep the project updated:

```bash
# Check dependency updates
npm outdated

# Update dependencies
npm update

# Update to latest versions (be careful)
npm install package@latest
```

## 📝 Development Notes

### Environment Variables
- All variables must start with `VITE_` to be accessible in the frontend
- Never commit the `.env` file to the repository
- Use `.env.example` as a template

### MetaMask for Development
- Always use test networks for development
- Never use real private keys in development
- Configure test funds from faucets

### Hot Reload
- Vite provides automatic hot reload
- Component changes are reflected immediately
- Configuration changes require server restart

## 🆘 Getting Help

If you have problems:

1. **Check logs**: Verify browser console and terminal
2. **Documentation**: Consult files in `/docs`
3. **Issues**: Search in [GitHub Issues](https://github.com/your-username/crypto-mentor-ai/issues)
4. **Community**: Join [Discord](https://discord.gg/cryptomentor)

---

Happy coding! 🚀
