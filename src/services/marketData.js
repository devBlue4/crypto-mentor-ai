import axios from 'axios'
import { marketDataCache, newsCache, generateCacheKey } from './cache'

// API Configuration
const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const FEAR_GREED_API = 'https://api.alternative.me/fng/'

// Market data simulation for demo (fallback)
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
  fearGreedLabel: 'Neutral',
  dominance: {
    bitcoin: 42.5,
    ethereum: 18.3,
    others: 39.2
  }
}

export const marketDataService = {
  // Get general market data from real APIs
  async getMarketOverview() {
    const cacheKey = generateCacheKey('market-overview')
    
    // Try to get from cache first (5 minute cache)
    const cached = marketDataCache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    try {
      // Fetch data from multiple APIs in parallel
      const [globalData, bitcoinData, fearGreedData] = await Promise.allSettled([
        this.fetchGlobalMarketData(),
        this.fetchBitcoinData(),
        this.fetchFearGreedIndex()
      ])

      // Process successful responses
      const global = globalData.status === 'fulfilled' ? globalData.value : null
      const bitcoin = bitcoinData.status === 'fulfilled' ? bitcoinData.value : null
      const fearGreed = fearGreedData.status === 'fulfilled' ? fearGreedData.value : null

      // Combine data with fallbacks
      // Calculate dominance with proper rounding and "Others" calculation
      const btcDominance = global?.dominance?.bitcoin || MOCK_MARKET_DATA.dominance.bitcoin
      const ethDominance = global?.dominance?.ethereum || MOCK_MARKET_DATA.dominance.ethereum
      const othersDominance = Math.max(0, 100 - btcDominance - ethDominance)

      const data = {
        totalMarketCap: global?.totalMarketCap || MOCK_MARKET_DATA.totalMarketCap,
        totalVolume: global?.totalVolume || MOCK_MARKET_DATA.totalVolume,
        bitcoin: bitcoin || MOCK_MARKET_DATA.bitcoin,
        fearGreedIndex: fearGreed?.value || MOCK_MARKET_DATA.fearGreedIndex,
        fearGreedLabel: fearGreed?.label || MOCK_MARKET_DATA.fearGreedLabel,
        dominance: {
          bitcoin: parseFloat(btcDominance.toFixed(1)),
          ethereum: parseFloat(ethDominance.toFixed(1)),
          others: parseFloat(othersDominance.toFixed(1))
        },
        lastUpdated: new Date().toISOString(),
        isRealData: true
      }

      // Cache for 5 minutes
      marketDataCache.set(cacheKey, data, 5 * 60 * 1000)
      return data
    } catch (error) {
      console.error('Error getting market data:', error)
      // Return mock data with error flag
      const fallbackData = { ...MOCK_MARKET_DATA, isRealData: false, error: true }
      marketDataCache.set(cacheKey, fallbackData, 60000) // Cache for 1 minute on error
      return fallbackData
    }
  },

  // Fetch global market data from CoinGecko
  async fetchGlobalMarketData() {
    try {
      const response = await axios.get(`${COINGECKO_API}/global`, {
        timeout: 10000
      })
      
      const global = response.data.data
      return {
        totalMarketCap: global.total_market_cap.usd,
        totalVolume: global.total_volume.usd,
        dominance: {
          bitcoin: global.market_cap_percentage.btc,
          ethereum: global.market_cap_percentage.eth,
          others: 100 - global.market_cap_percentage.btc - global.market_cap_percentage.eth
        }
      }
    } catch (error) {
      console.error('Error fetching global market data:', error)
      throw error
    }
  },

  // Fetch Bitcoin specific data
  async fetchBitcoinData() {
    try {
      const response = await axios.get(`${COINGECKO_API}/simple/price`, {
        params: {
          ids: 'bitcoin',
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_24hr_vol: true,
          include_market_cap: true
        },
        timeout: 10000
      })

      const btcData = response.data.bitcoin
      return {
        price: btcData.usd,
        change24h: btcData.usd_24h_change,
        volume: btcData.usd_24h_vol,
        marketCap: btcData.usd_market_cap
      }
    } catch (error) {
      console.error('Error fetching Bitcoin data:', error)
      throw error
    }
  },

  // Fetch Fear & Greed Index
  async fetchFearGreedIndex() {
    try {
      const response = await axios.get(FEAR_GREED_API, {
        timeout: 10000
      })

      const fngData = response.data.data[0]
      return {
        value: parseInt(fngData.value),
        label: fngData.value_classification
      }
    } catch (error) {
      console.error('Error fetching Fear & Greed Index:', error)
      throw error
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

  // Get real Bitcoin historical price data from CoinGecko
  async getHistoricalData(symbol, days = 7) {
    const cacheKey = generateCacheKey('historical-data', symbol, days.toString())
    
    // Try to get from cache first
    const cached = marketDataCache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    try {
      let response
      
      if (days === 1) {
        // Use range endpoint for 24H to avoid timezone issues
        const now = Math.floor(Date.now() / 1000)
        const dayAgo = now - (24 * 60 * 60)
        
        response = await axios.get(`${COINGECKO_API}/coins/bitcoin/market_chart/range`, {
          params: {
            vs_currency: 'usd',
            from: dayAgo,
            to: now
          },
          timeout: 15000
        })
      } else if (days === 90) {
        // Use market_chart for 3M with daily interval
        response = await axios.get(`${COINGECKO_API}/coins/bitcoin/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: 90,
            interval: 'daily'
          },
          timeout: 15000
        })
      } else {
        // Use standard market_chart for other ranges
        let interval = 'daily'
        if (days <= 7) {
          interval = 'hourly'
        }
        
        response = await axios.get(`${COINGECKO_API}/coins/bitcoin/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: days,
            interval: interval
          },
          timeout: 15000
        })
      }

      const { prices } = response.data
      
      if (!prices || !Array.isArray(prices) || prices.length === 0) {
        throw new Error('No price data received from API')
      }

      // Map API data correctly: each item is [timestamp, price]
      let historicalData = prices
        .map(([timestamp, price]) => ({
          date: new Date(timestamp).toISOString(),
          price: price,
          volume: 0 // Volume data not needed for price chart
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by timestamp ascending

      // De-duplicate repeated timestamps (keep latest)
      const uniqueData = new Map()
      historicalData.forEach(item => {
        const timestamp = new Date(item.date).getTime()
        if (!uniqueData.has(timestamp) || uniqueData.get(timestamp).price !== item.price) {
          uniqueData.set(timestamp, item)
        }
      })
      historicalData = Array.from(uniqueData.values()).sort((a, b) => new Date(a.date) - new Date(b.date))

      // Data validation and sanity check
      const priceValues = historicalData.map(item => item.price)
      const minPrice = Math.min(...priceValues)
      const maxPrice = Math.max(...priceValues)
      
      // Check for flat data with different timestamps (potential bad data)
      const isFlat = (maxPrice - minPrice) / minPrice < 0.001 && historicalData.length > 1
      
      if (minPrice < 1000 || maxPrice > 200000 || isFlat) {
        console.error(`Invalid price data detected: min=$${minPrice}, max=$${maxPrice}, flat=${isFlat}`)
        throw new Error('Price data failed validation')
      }

      // Log first and last points for verification
      if (historicalData.length > 0) {
        const first = historicalData[0]
        const last = historicalData[historicalData.length - 1]
        console.log(`Bitcoin data loaded: ${days}d range, ${historicalData.length} points`)
        console.log(`First: ${new Date(first.date).toISOString()} - $${first.price}`)
        console.log(`Last: ${new Date(last.date).toISOString()} - $${last.price}`)
      }

      // Cache for 5 minutes for real data
      marketDataCache.set(cacheKey, historicalData, 5 * 60 * 1000)
      return historicalData
      
    } catch (error) {
      console.error('Error fetching real Bitcoin data:', error)
      
      // Fallback to demo data if API fails
      const fallbackData = this.generateFallbackData(days)
      marketDataCache.set(cacheKey, fallbackData, 60000) // Cache fallback for 1 minute
      return fallbackData
    }
  },

  // Generate fallback data when API fails
  generateFallbackData(days) {
    const now = Date.now()
    const historicalData = []
    
    // Base price around current Bitcoin levels
    const basePrice = 43000
    let currentPrice = basePrice
    
    // For 24h data, use more frequent intervals
    const intervalHours = days === 1 ? 2 : 24 // Every 2 hours for 24h, daily for others
    const totalPoints = days === 1 ? 12 : days + 1 // 12 points for 24h, days+1 for others
    
    for (let i = 0; i < totalPoints; i++) {
      const date = new Date(now - (totalPoints - 1 - i) * intervalHours * 60 * 60 * 1000)
      
      // Generate realistic price movement with better variation
      const variation = (Math.random() - 0.5) * (days === 1 ? 0.03 : 0.08) // ±1.5% for 24h, ±4% for others
      const trendFactor = days === 1 ? (Math.random() - 0.5) * 0.01 : (i > totalPoints * 0.6 ? -0.002 : 0.003)
      const volatility = Math.sin(i * 0.8) * (days === 1 ? 0.015 : 0.03)
      
      currentPrice = currentPrice * (1 + variation + trendFactor + volatility)
      
      // Ensure price stays within reasonable bounds with more variation for 24h
      const minPrice = days === 1 ? 42000 : 35000
      const maxPrice = days === 1 ? 45000 : 55000
      currentPrice = Math.max(minPrice, Math.min(maxPrice, currentPrice))
      
      historicalData.push({
        date: date.toISOString(),
        price: Math.round(currentPrice),
        volume: Math.random() * 20000000000 + 10000000000
      })
    }
    
    return historicalData
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
