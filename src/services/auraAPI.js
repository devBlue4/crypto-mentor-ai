import axios from 'axios'
import { auraResponseCache, generateCacheKey } from './cache'

// AdEx AURA API configuration
const AURA_API_BASE = import.meta.env.DEV
  ? '/aura/aura/v1' // usar proxy de Vite en desarrollo
  : (import.meta.env.VITE_AURA_API_BASE || 'https://api.adex.network/aura/v1')
const AURA_API_KEY = import.meta.env.VITE_AURA_API_KEY
const OPENAI_API_KEY_PRESENT = !!import.meta.env.VITE_OPENAI_API_KEY

// Log configuration (only in development)
if (import.meta.env.DEV) {
  console.log('🤖 AURA API Configuration:')
  console.log('  Base URL:', AURA_API_BASE)
  console.log('  API Key:', AURA_API_KEY ? `${AURA_API_KEY.substring(0, 8)}...` : 'Not configured')
}

// Configured axios client
const auraClient = axios.create({
  baseURL: AURA_API_BASE,
  headers: {
    'Authorization': `Bearer ${AURA_API_KEY}`,
    'X-API-Key': AURA_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
  validateStatus: (status) => status >= 200 && status < 300 // deja que axios lance en 4xx/5xx
})

export const auraAPI = {
  // Normaliza la respuesta del API a un objeto estándar
  normalizeResponse(apiData) {
    return {
      content: apiData?.response || apiData?.content || apiData?.text || '',
      analysis: apiData?.analysis,
      recommendations: apiData?.recommendations,
      confidence: apiData?.confidence
    }
  },

  // Intenta múltiples variantes de payload para maximizar compatibilidad
  async tryChatPayloads(message, context) {
    const baseContext = {
      user_type: 'crypto_enthusiast',
      experience_level: 'intermediate',
      interests: ['trading', 'portfolio_management', 'market_analysis'],
      ...context
    }

    const payloadVariants = [
      {
        message,
        context: baseContext,
        options: { include_analysis: true, include_recommendations: true, language: 'en' }
      },
      { message },
      { prompt: message, context: baseContext },
      { text: message }
    ]

    let lastError = null
    for (const payload of payloadVariants) {
      try {
        const response = await auraClient.post('/chat', payload)
        return this.normalizeResponse(response.data)
      } catch (err) {
        lastError = err
        continue
      }
    }
    throw lastError
  },

  // Fallback: short definition from Wikipedia (es -> en)
  async fetchWikipediaSummary(query) {
    const title = encodeURIComponent(query.trim())
    const endpoints = [
      `https://es.wikipedia.org/api/rest_v1/page/summary/${title}`,
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
    ]
    for (const url of endpoints) {
      try {
        const { data } = await axios.get(url, { timeout: 8000 })
        if (data?.extract) {
          return {
            content: data.extract,
            analysis: `Wikipedia summary (${data.lang || 'es/en'})`,
            recommendations: [
              'Cross-check information with official sources',
              'Dive into technical documentation if applicable'
            ]
          }
        }
      } catch (_) { /* intentar siguiente idioma */ }
    }
    throw new Error('Wikipedia unavailable')
  },
  // Send message to AURA chat
  async sendMessage(message, context = {}) {
    const cacheKey = generateCacheKey('aura-message', message, JSON.stringify(context))
    
    // Check cache first
      const cached = auraResponseCache.get(cacheKey)
      if (cached !== null) {
        return cached
      }
    
    // If no API key, use demo mode
    if (!AURA_API_KEY || AURA_API_KEY === 'your_aura_api_key_here') {
      console.log('🔸 AURA API: Using demo mode (no API key configured)')
      const result = this.getDemoResponse(message, context)
      auraResponseCache.set(cacheKey, result, 2 * 60 * 1000) // Cache for 2 minutes
      return result
    }
    
    try {
      console.log('🚀 AURA API: Sending message to real API...', {
        messageLength: message.length,
        hasContext: Object.keys(context).length > 0
      })
      
      const result = await this.tryChatPayloads(message, context)

      console.log('✅ AURA API: Response received')

      // Cache successful responses
      auraResponseCache.set(cacheKey, result, 5 * 60 * 1000) // Cache for 5 minutes
      return result
    } catch (error) {
      console.error('❌ AURA API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })

      // Si hay API key configurada y es un 500
      const status = error.response?.status
      if (AURA_API_KEY && status === 500) {
        // Si hay clave de OpenAI configurada, dejamos que AuraContext haga fallback a GPT
        if (OPENAI_API_KEY_PRESENT) {
          console.warn('⚠️ AURA API: 500. Propagando error para usar fallback GPT.')
          throw error
        }
        // Si NO hay OpenAI, intentamos Wikipedia y, si falla, demo
        console.warn('⚠️ AURA API: 500 sin OpenAI. Intentando fallback Wikipedia')
        const isDefinition = /^(que es|qué es|what is)\s+/i.test(message.trim())
        if (isDefinition) {
          const term = message.replace(/^(que es|qué es|what is)\s+/i, '').replace(/[?¿]/g, '').trim()
          if (term.length > 0) {
            try {
              const wiki = await this.fetchWikipediaSummary(term)
              auraResponseCache.set(cacheKey, wiki, 2 * 60 * 1000)
              return wiki
            } catch (_) { /* si falla, continuamos al demo */ }
          }
        }
        console.warn('⚠️ AURA API: usando modo demo temporalmente')
        const demo = this.getDemoResponse(message, context)
        auraResponseCache.set(cacheKey, demo, 2 * 60 * 1000)
        return demo
      }

      // Con API key y errores distintos a 500: propagar para que la UI lo muestre (401, 403, 404, 429, etc.)
      if (AURA_API_KEY) throw error

      // Sin API key: usar respuestas de demostración
      console.warn('⚠️ AURA API: No API key, usando modo demo')
      const result = this.getDemoResponse(message, context)
      auraResponseCache.set(cacheKey, result, 2 * 60 * 1000)
      return result
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
    const lowerMessage = message.toLowerCase()
    
    // Greetings
    if (lowerMessage.match(/hola|hello|hi|hey/)) {
      return {
        content: 'Hi! I\'m AURA, your Web3 trading assistant. I can help with market analysis, portfolio recommendations, and crypto education. How can I help you today?',
        analysis: 'User started conversation',
        recommendations: [
          'Ask about current market conditions',
          'Request a portfolio analysis',
          'Learn about a specific cryptocurrency'
        ]
      }
    }

    // What is AURA / AdEx AURA?
    if (lowerMessage.match(/\b(aura|adex aura)\b|que es aura|qué es aura|what is aura|que es adex|qué es adex|what is adex/i)) {
      return {
        content: 'AdEx AURA is a crypto-focused AI/API that provides portfolio analysis, trading recommendations, and real-time market insights. In this app, AURA can use your connected wallet context, analyze your tokens, and reply with clear explanations.',
        analysis: 'Capabilities: chat, portfolio analysis, recommendations, market insights.',
        recommendations: [
          'Connect your wallet for personalized analysis',
          'Ask about market trends or your portfolio risk',
          'Set up smart alerts aligned with your goals'
        ]
      }
    }
    
    // Bitcoin price
    if (lowerMessage.match(/bitcoin|btc.*price|precio.*bitcoin/i)) {
      return {
        content: 'Bitcoin is trading around $67,500. Recent weeks show an uptrend with strong support at $65k and resistance near $70k. Rising volume suggests increasing institutional interest.',
        analysis: 'Technical view: Uptrend with positive momentum. RSI ~58 (neutral). MACD signaling buy.',
        recommendations: [
          'Consider a DCA strategy for gradual entries',
          'Set a stop-loss near $64k for risk management',
          'Watch the $70k resistance for potential profit-taking'
        ]
      }
    }
    
    // General market
    if (lowerMessage.match(/market|mercado|como.*esta/i)) {
      return {
        content: 'Crypto market currently shows a moderate uptrend. Total market cap is ~$3.84T with 24h volume at ~$85B. The Fear & Greed Index is 65 (Greed), indicating positive but not extreme sentiment. BTC dominance ~57.1%.',
        analysis: 'Market in an accumulation phase with reduced volatility versus prior months.',
        recommendations: [
          'Reasonable timing for core positions in majors',
          'Keep 20–30% in stablecoins for opportunities',
          'Consider rebalancing toward infrastructure projects'
        ]
      }
    }
    
    // Portfolio
    if (lowerMessage.match(/portfolio|portafolio|analiz.*mi/i)) {
      if (context.hasWallet) {
        return {
          content: `I analyzed your connected portfolio. You hold ${context.tokenCount} different tokens, indicating ${context.tokenCount >= 5 ? 'strong' : 'moderate'} diversification. Your current balance suggests a ${context.hasBalance ? 'proactive' : 'conservative'} approach.`,
          analysis: `Diversification: ${context.tokenCount >= 5 ? 'High' : 'Medium'}. Risk: Medium. Balance: ${context.hasBalance ? 'Active' : 'Needs attention'}.`,
          recommendations: [
            context.tokenCount < 5 ? 'Consider diversifying further' : 'Maintain current diversification level',
            'Rebalance every 2–3 months to keep your target allocation',
            'Consider holding at least 20% in stablecoins for liquidity'
          ]
        }
      } else {
        return {
          content: 'To analyze your portfolio, please connect your wallet. Click "Connect Wallet" in the top-right corner. Once connected, I can provide detailed holdings, diversification, and recommendations.',
          analysis: 'Wallet not connected – analysis unavailable',
          recommendations: [
            'Connect your wallet for personalized analysis',
            'Use a compatible wallet (MetaMask, WalletConnect)',
            'Never share your seed phrase with anyone'
          ]
        }
      }
    }
    
    // Ethereum
    if (lowerMessage.match(/ethereum|eth(?!\w)/i)) {
      return {
        content: 'Ethereum trades around $3,850. With the successful PoS transition and growth across DeFi/NFTs, fundamentals remain solid. Staked ETH exceeds 34M, reducing circulating supply.',
        analysis: 'Strong fundamentals with growing institutional adoption. Staking yield ~4–5% APY.',
        recommendations: [
          'ETH is a strong long-term core holding',
          'Consider staking to generate passive yield',
          'Diversify within the Ethereum ecosystem (DeFi, Layer 2s)'
        ]
      }
    }
    
    // DeFi
    if (lowerMessage.match(/defi|decentralized finance|finanzas descentralizadas/i)) {
      return {
        content: 'DeFi (Decentralized Finance) are financial apps built on blockchain without intermediaries: lending/borrowing (Aave, Compound), DEXs (Uniswap, SushiSwap), and yield farming. TVL exceeds $100B.',
        analysis: 'DeFi can outperform traditional finance but carries added risks (smart contracts, impermanent loss).',
        recommendations: [
          'Start with established, audited protocols (Aave, Uniswap)',
          'Avoid allocating more than 10–20% to high‑risk DeFi',
          'Understand risks: impermanent loss, contract bugs, rug pulls'
        ]
      }
    }
    
    // General recommendations
    if (lowerMessage.match(/recommend|recomend|sugiere|aconsejas/i)) {
      return {
        content: 'Based on current market conditions and best practices, consider a balanced allocation: 40–50% BTC/ETH (majors), 20–30% solid altcoins (e.g., SOL, LINK, AVAX), 20–30% stablecoins for liquidity, and 5–10% high‑risk/high‑reward projects depending on your profile.',
        analysis: 'This mix balances growth potential with risk management.',
        recommendations: [
          'Use DCA (periodic buys) instead of timing the market',
          'Rebalance quarterly',
          'Keep an emergency fund outside of crypto',
          'Never invest more than you can afford to lose'
        ]
      }
    }
    
    // Default response
    return {
      content: 'Great question. Based on current market conditions and industry trends, I recommend researching this topic further. Crypto markets are dynamic—stay informed and make decisions aligned with your risk profile.',
      analysis: 'Crypto requires continuous learning and careful analysis before investing.',
      recommendations: [
        'Use reputable sources like CoinDesk, The Block, and CoinGecko',
        'Maintain a disciplined investment strategy',
        'Consult professional advisors for major decisions',
        'Diversify your portfolio to manage risk'
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
