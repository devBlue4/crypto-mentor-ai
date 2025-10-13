import axios from 'axios'
import { auraResponseCache, generateCacheKey } from './cache'

// AdEx AURA API configuration
const AURA_API_BASE = 'https://api.adex.network/aura/v1'
const AURA_API_KEY = import.meta.env.VITE_AURA_API_KEY

// Configured axios client
const auraClient = axios.create({
  baseURL: AURA_API_BASE,
  headers: {
    'Authorization': `Bearer ${AURA_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000
})

export const auraAPI = {
  // Send message to AURA chat
  async sendMessage(message, context = {}) {
    const cacheKey = generateCacheKey('aura-message', message, JSON.stringify(context))
    
    // Try to get from cache first (only for demo responses)
    if (!AURA_API_KEY) {
      const cached = auraResponseCache.get(cacheKey)
      if (cached !== null) {
        return cached
      }
    }
    
    try {
      const response = await auraClient.post('/chat', {
        message,
        context: {
          user_type: 'crypto_enthusiast',
          experience_level: 'intermediate',
          interests: ['trading', 'portfolio_management', 'market_analysis'],
          ...context
        },
        options: {
          include_analysis: true,
          include_recommendations: true,
          language: 'en'
        }
      })

      const result = {
        content: response.data.response,
        analysis: response.data.analysis,
        recommendations: response.data.recommendations,
        confidence: response.data.confidence
      }
      
      // Cache successful responses
      auraResponseCache.set(cacheKey, result)
      return result
    } catch (error) {
      // Fallback for demo if no API key
      if (!AURA_API_KEY) {
        const result = this.getDemoResponse(message, context)
        auraResponseCache.set(cacheKey, result)
        return result
      }
      throw error
    }
  },

  // Analyze user portfolio
  async analyzePortfolio(tokens, balance) {
    const cacheKey = generateCacheKey('portfolio-analysis', JSON.stringify(tokens), balance)
    
    // Try to get from cache first (only for demo responses)
    if (!AURA_API_KEY) {
      const cached = auraResponseCache.get(cacheKey)
      if (cached !== null) {
        return cached
      }
    }
    
    try {
      const portfolioData = {
        tokens: tokens.map(token => ({
          symbol: token.symbol,
          balance: token.balance,
          value_usd: token.balance * (token.price_usd || 0)
        })),
        total_balance_eth: parseFloat(balance),
        portfolio_diversity: this.calculateDiversity(tokens),
        risk_level: this.calculateRiskLevel(tokens)
      }

      const response = await auraClient.post('/analyze/portfolio', portfolioData)
      const result = response.data
      
      // Cache successful responses
      auraResponseCache.set(cacheKey, result)
      return result
    } catch (error) {
      if (!AURA_API_KEY) {
        const result = this.getDemoPortfolioAnalysis(tokens, balance)
        auraResponseCache.set(cacheKey, result)
        return result
      }
      throw error
    }
  },

  // Get market insights
  async getMarketInsights() {
    try {
      const response = await auraClient.get('/market/insights', {
        params: {
          timeframe: '24h',
          include_sentiment: true,
          include_technical: true
        }
      })
      return response.data
    } catch (error) {
      if (!AURA_API_KEY) {
        return this.getDemoMarketInsights()
      }
      throw error
    }
  },

  // Get personalized recommendations
  async getPersonalizedRecommendations(userProfile) {
    try {
      const response = await auraClient.post('/recommendations/personalized', userProfile)
      return response.data
    } catch (error) {
      if (!AURA_API_KEY) {
        return this.getDemoRecommendations(userProfile)
      }
      throw error
    }
  },

  // Setup smart alerts
  async setupSmartAlerts(alertConfig) {
    try {
      const response = await auraClient.post('/alerts/smart', alertConfig)
      return response.data
    } catch (error) {
      if (!AURA_API_KEY) {
        return { success: true, alert_id: 'demo_' + Date.now() }
      }
      throw error
    }
  },

  // Demo responses when no API key
  getDemoResponse(message, context) {
    const responses = {
      'hello': 'Hello! I\'m AURA, your Web3 trading assistant. How can I help you today?',
      'bitcoin price': 'The current Bitcoin price is $43,250 USD. Based on technical analysis, I see an upward trend in the short term with support at $42,000.',
      'portfolio': 'I see you have a diversified portfolio. I recommend considering more exposure to DeFi tokens and maintaining at least 30% in stablecoins.',
      'recommendations': 'Based on the current market, I suggest: 1) Consider DCA in ETH, 2) Rebalance towards infrastructure tokens, 3) Maintain liquidity for opportunities.',
      'default': 'Interesting question. Based on the current market analysis and your risk profile, I suggest researching more about this topic and considering portfolio diversification.'
    }

    const lowerMessage = message.toLowerCase()
    let response = responses.default

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value
        break
      }
    }

    return {
      content: response,
      analysis: {
        sentiment: 'neutral',
        confidence: 0.8,
        key_points: ['Favorable technical analysis', 'Diversification recommended']
      },
      recommendations: [
        'Consider DCA in main assets',
        'Maintain portfolio diversification',
        'Set stop-loss to manage risk'
      ]
    }
  },

  getDemoPortfolioAnalysis(tokens, balance) {
    return {
      total_value_usd: parseFloat(balance) * 2500, // Assuming ETH at $2500
      diversity_score: 7.5,
      risk_level: 'medium',
      allocation_analysis: {
        ethereum: 60,
        stablecoins: 25,
        altcoins: 15
      },
      recommendations: [
        'Consider increasing Bitcoin exposure',
        'Reduce concentration in a single token',
        'Add more stablecoins for liquidity'
      ],
      performance_metrics: {
        daily_change: '+2.5%',
        weekly_change: '+8.3%',
        monthly_change: '+15.7%'
      }
    }
  },

  getDemoMarketInsights() {
    return {
      overall_sentiment: 'bullish',
      market_cap_change: '+3.2%',
      fear_greed_index: 65,
      top_performers: [
        { symbol: 'BTC', change: '+5.2%' },
        { symbol: 'ETH', change: '+4.8%' },
        { symbol: 'SOL', change: '+7.1%' }
      ],
      insights: [
        'Market in upward trend',
        'Institutions increasing exposure',
        'Volatility at normal levels'
      ],
      technical_analysis: {
        btc_support: '$42,000',
        btc_resistance: '$45,000',
        trend: 'ascending'
      }
    }
  },

  getDemoRecommendations(userProfile) {
    return {
      immediate_actions: [
        'Review and rebalance portfolio',
        'Set up price alerts',
        'Consider DCA in BTC and ETH'
      ],
      long_term_strategy: [
        'Diversify towards DeFi protocols',
        'Explore infrastructure tokens',
        'Maintain liquidity for opportunities'
      ],
      risk_management: [
        'Set stop-loss on main positions',
        'Don\'t invest more than 5% in speculative altcoins',
        'Maintain emergency fund in stablecoins'
      ]
    }
  },

  calculateDiversity(tokens) {
    if (tokens.length === 0) return 0
    if (tokens.length === 1) return 1
    return Math.min(tokens.length * 0.3, 10)
  },

  calculateRiskLevel(tokens) {
    const highRiskTokens = ['MEME', 'DOGE', 'SHIB']
    const hasHighRisk = tokens.some(token => 
      highRiskTokens.some(risk => token.symbol.includes(risk))
    )
    return hasHighRisk ? 'high' : 'medium'
  }
}
