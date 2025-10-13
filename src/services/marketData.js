import axios from 'axios'
import { marketDataCache, newsCache, generateCacheKey } from './cache'

// Market data simulation for demo
const MOCK_MARKET_DATA = {
  bitcoin: {
    price: 43250.50,
    change24h: 2.5,
    volume: 28500000000,
    marketCap: 850000000000,
    high24h: 44500,
    low24h: 42500
  },
  ethereum: {
    price: 2650.75,
    change24h: 3.2,
    volume: 15000000000,
    marketCap: 320000000000,
    high24h: 2700,
    low24h: 2580
  },
  totalMarketCap: 1750000000000,
  totalVolume: 85000000000,
  fearGreedIndex: 65,
  dominance: {
    bitcoin: 42.5,
    ethereum: 18.3,
    others: 39.2
  }
}

export const marketDataService = {
  // Get general market data
  async getMarketOverview() {
    const cacheKey = generateCacheKey('market-overview')
    
    // Try to get from cache first
    const cached = marketDataCache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    try {
      // In a real project, this would come from CoinGecko API
      // const response = await axios.get('https://api.coingecko.com/api/v3/global')
      
      // For demo, return simulated data
      const data = MOCK_MARKET_DATA
      marketDataCache.set(cacheKey, data)
      return data
    } catch (error) {
      console.error('Error getting market data:', error)
      const data = MOCK_MARKET_DATA
      marketDataCache.set(cacheKey, data)
      return data
    }
  },

  // Get specific token prices
  async getTokenPrices(symbols) {
    const cacheKey = generateCacheKey('token-prices', ...symbols)
    
    // Try to get from cache first
    const cached = marketDataCache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    try {
      // const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_change=true`)
      
      // Simulated data
      const mockPrices = {
        bitcoin: { usd: 43250.50, usd_24h_change: 2.5 },
        ethereum: { usd: 2650.75, usd_24h_change: 3.2 },
        cardano: { usd: 0.52, usd_24h_change: 1.8 },
        solana: { usd: 98.45, usd_24h_change: 5.2 },
        polygon: { usd: 0.85, usd_24h_change: 2.1 }
      }

      marketDataCache.set(cacheKey, mockPrices)
      return mockPrices
    } catch (error) {
      console.error('Error getting prices:', error)
      const emptyPrices = {}
      marketDataCache.set(cacheKey, emptyPrices)
      return emptyPrices
    }
  },

  // Get historical price data
  async getHistoricalData(symbol, days = 7) {
    const cacheKey = generateCacheKey('historical-data', symbol, days.toString())
    
    // Try to get from cache first
    const cached = marketDataCache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    try {
      // Historical data simulation
      const now = Date.now()
      const historicalData = []
      
      for (let i = days; i >= 0; i--) {
        const date = new Date(now - i * 24 * 60 * 60 * 1000)
        const basePrice = symbol === 'bitcoin' ? 40000 : symbol === 'ethereum' ? 2400 : 100
        const variation = (Math.random() - 0.5) * 0.1
        const price = basePrice * (1 + variation)
        
        historicalData.push({
          date: date.toISOString().split('T')[0],
          price: price,
          volume: Math.random() * 1000000000
        })
      }

      marketDataCache.set(cacheKey, historicalData)
      return historicalData
    } catch (error) {
      console.error('Error getting historical data:', error)
      const emptyData = []
      marketDataCache.set(cacheKey, emptyData)
      return emptyData
    }
  },

  // Get market news
  async getMarketNews() {
    const cacheKey = generateCacheKey('market-news')
    
    // Try to get from cache first
    const cached = newsCache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    try {
      // News simulation
      const news = [
        {
          id: 1,
          title: 'Bitcoin reaches new monthly high',
          summary: 'Bitcoin price surpassed $43,000 USD with record trading volume.',
          source: 'CryptoNews',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          sentiment: 'positive'
        },
        {
          id: 2,
          title: 'Ethereum 2.0 successful update',
          summary: 'The Ethereum network continues to improve its scalability with the latest updates.',
          source: 'Ethereum.org',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          sentiment: 'positive'
        },
        {
          id: 3,
          title: 'Crypto regulations under discussion',
          summary: 'Regulators are working on new guidelines for the cryptocurrency market.',
          source: 'Financial Times',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          sentiment: 'neutral'
        }
      ]
      
      newsCache.set(cacheKey, news)
      return news
    } catch (error) {
      console.error('Error getting news:', error)
      const emptyNews = []
      newsCache.set(cacheKey, emptyNews)
      return emptyNews
    }
  },

  // Get technical analysis
  async getTechnicalAnalysis(symbol) {
    try {
      // Technical analysis simulation
      return {
        symbol,
        indicators: {
          rsi: 58.5,
          macd: {
            macd: 125.3,
            signal: 118.7,
            histogram: 6.6
          },
          bollinger: {
            upper: 44500,
            middle: 43250,
            lower: 42000
          },
          movingAverages: {
            ma20: 42800,
            ma50: 41500,
            ma200: 38500
          }
        },
        signals: {
          trend: 'bullish',
          strength: 'medium',
          recommendation: 'buy'
        },
        support: 42000,
        resistance: 45000
      }
    } catch (error) {
      console.error('Error getting technical analysis:', error)
      return null
    }
  },

  // Calculate portfolio metrics
  calculatePortfolioMetrics(tokens, totalValue) {
    if (!tokens || tokens.length === 0) {
      return {
        diversity: 0,
        riskScore: 0,
        volatility: 0
      }
    }

    // Calculate diversity (simplified)
    const diversity = Math.min(tokens.length * 0.2, 1)

    // Calculate risk score based on token types
    const riskFactors = tokens.map(token => {
      const highRiskTokens = ['MEME', 'DOGE', 'SHIB']
      return highRiskTokens.some(risk => token.symbol.includes(risk)) ? 0.8 : 0.3
    })
    const riskScore = riskFactors.reduce((sum, risk) => sum + risk, 0) / tokens.length

    // Simulated volatility
    const volatility = Math.random() * 0.3 + 0.2

    return {
      diversity,
      riskScore,
      volatility,
      recommendation: riskScore > 0.6 ? 'high_risk' : riskScore > 0.4 ? 'medium_risk' : 'low_risk'
    }
  },

  // Format numbers for display
  formatNumber(number, decimals = 2) {
    if (number >= 1e12) return (number / 1e12).toFixed(decimals) + 'T'
    if (number >= 1e9) return (number / 1e9).toFixed(decimals) + 'B'
    if (number >= 1e6) return (number / 1e6).toFixed(decimals) + 'M'
    if (number >= 1e3) return (number / 1e3).toFixed(decimals) + 'K'
    return number.toFixed(decimals)
  },

  // Format percentage
  formatPercentage(number, decimals = 2) {
    const sign = number >= 0 ? '+' : ''
    return `${sign}${number.toFixed(decimals)}%`
  }
}
