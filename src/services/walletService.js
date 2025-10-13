import { ethers } from 'ethers'
import { portfolioCache, generateCacheKey } from './cache'

// List of popular ERC-20 tokens
export const POPULAR_TOKENS = [
  {
    address: '0xA0b86a33E6441c8C3C7d4A5e2E2B4C4F4F4F4F4F',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png'
  },
  {
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  },
  {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  }
]

export const walletService = {
  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && window.ethereum
  },

  // Connect to MetaMask
  async connectWallet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed')
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      return accounts[0]
    } catch (error) {
      throw new Error('Error connecting wallet: ' + error.message)
    }
  },

  // Get ETH balance
  async getEthBalance(address) {
    const cacheKey = generateCacheKey('eth-balance', address)
    
    // Try to get from cache first
    const cached = portfolioCache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(address)
      const formattedBalance = ethers.formatEther(balance)
      
      // Cache for 30 seconds
      portfolioCache.set(cacheKey, formattedBalance, 30000)
      return formattedBalance
    } catch (error) {
      throw new Error('Error getting ETH balance: ' + error.message)
    }
  },

  // Get ERC-20 token balance
  async getTokenBalance(tokenAddress, walletAddress) {
    const cacheKey = generateCacheKey('token-balance', tokenAddress, walletAddress)
    
    // Try to get from cache first
    const cached = portfolioCache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(
        tokenAddress,
        ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
        provider
      )

      const [balance, decimals] = await Promise.all([
        contract.balanceOf(walletAddress),
        contract.decimals()
      ])

      const formattedBalance = ethers.formatUnits(balance, decimals)
      
      // Cache for 30 seconds
      portfolioCache.set(cacheKey, formattedBalance, 30000)
      return formattedBalance
    } catch (error) {
      console.error('Error getting token balance:', error)
      return '0'
    }
  },

  // Get complete token information
  async getTokensWithBalance(walletAddress, tokens = POPULAR_TOKENS) {
    const tokensWithBalance = []

    for (const token of tokens) {
      try {
        const balance = await this.getTokenBalance(token.address, walletAddress)
        if (parseFloat(balance) > 0) {
          tokensWithBalance.push({
            ...token,
            balance,
            balanceFormatted: parseFloat(balance).toFixed(6)
          })
        }
      } catch (error) {
        console.error(`Error procesando ${token.symbol}:`, error)
      }
    }

    return tokensWithBalance
  },

  // Get current network
  async getCurrentNetwork() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      return {
        chainId: network.chainId.toString(),
        name: network.name
      }
    } catch (error) {
      throw new Error('Error getting network: ' + error.message)
    }
  },

  // Switch to specific network
  async switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error) {
      if (error.code === 4902) {
        // Network is not added, try to add it
        throw new Error('This network is not added to your wallet')
      }
      throw error
    }
  },

  // Format address for display
  formatAddress(address) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },

  // Format balance
  formatBalance(balance, decimals = 4) {
    const num = parseFloat(balance)
    if (num === 0) return '0'
    if (num < 0.0001) return '< 0.0001'
    return num.toFixed(decimals)
  },

  // Get token price (simulated for demo)
  async getTokenPrice(symbol) {
    const cacheKey = generateCacheKey('token-price', symbol)
    
    // Try to get from cache first
    const cached = portfolioCache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    // In a real project, this would come from an API like CoinGecko
    const mockPrices = {
      'ETH': 2500,
      'USDC': 1,
      'USDT': 1,
      'WBTC': 43000,
      'LINK': 15,
      'UNI': 8,
      'MATIC': 0.8
    }
    
    const price = mockPrices[symbol] || 0
    
    // Cache for 60 seconds
    portfolioCache.set(cacheKey, price, 60000)
    return price
  },

  // Calculate total portfolio value
  async calculatePortfolioValue(tokens, ethBalance) {
    let totalValue = 0

    // Add ETH value
    const ethPrice = await this.getTokenPrice('ETH')
    totalValue += parseFloat(ethBalance) * ethPrice

    // Add token values
    for (const token of tokens) {
      const price = await this.getTokenPrice(token.symbol)
      totalValue += parseFloat(token.balance) * price
    }

    return totalValue
  }
}
