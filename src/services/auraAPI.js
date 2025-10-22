import axios from 'axios'
import { auraResponseCache, generateCacheKey } from './cache'
import { gptAPI } from './gptAPI'

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
  // Generate AI quiz questions (English) for a given topic
  async generateQuiz(topic, options = {}) {
    const {
      questionCount = 5,
      difficulty = 'beginner', // beginner | intermediate | advanced
    } = options

    const cacheKey = generateCacheKey('education-quiz', topic, difficulty, String(questionCount))
    const cached = auraResponseCache.get(cacheKey)
    if (cached !== null) return cached

    // If no AURA API key, try OpenAI only if configured; otherwise use demo directly
    if (!AURA_API_KEY || AURA_API_KEY === 'your_aura_api_key_here') {
      if (OPENAI_API_KEY_PRESENT) {
        try {
          const quiz = await this.generateQuizWithGPT(topic, { questionCount, difficulty })
          auraResponseCache.set(cacheKey, quiz, 5 * 60 * 1000)
          return quiz
        } catch (_) {
          const quiz = this.getDemoQuiz(topic, questionCount)
          auraResponseCache.set(cacheKey, quiz, 2 * 60 * 1000)
          return quiz
        }
      }
      const quiz = this.getDemoQuiz(topic, questionCount)
      auraResponseCache.set(cacheKey, quiz, 2 * 60 * 1000)
      return quiz
    }

    // Try AURA native endpoint first
    try {
      const payload = {
        topic,
        language: 'en',
        difficulty,
        question_count: questionCount
      }
      const response = await auraClient.post('/education/quiz', payload)
      const data = response.data

      // Normalize structure
      const quiz = (data?.questions || []).map((q, idx) => ({
        id: q.id || `q_${idx + 1}`,
        question: q.question || q.text || '',
        options: q.options || q.choices || [],
        correctIndex: typeof q.correctIndex === 'number'
          ? q.correctIndex
          : (typeof q.correct === 'number' ? q.correct : 0),
        explanation: q.explanation || ''
      }))

      const result = { topic, difficulty, questions: quiz }
      auraResponseCache.set(cacheKey, result, 5 * 60 * 1000)
      return result
    } catch (error) {
      console.warn('⚠️ AURA quiz endpoint failed, trying GPT fallback...')
      try {
        const quiz = await this.generateQuizWithGPT(topic, { questionCount, difficulty })
        auraResponseCache.set(cacheKey, quiz, 5 * 60 * 1000)
        return quiz
      } catch (_) {
        const quiz = this.getDemoQuiz(topic, questionCount)
        auraResponseCache.set(cacheKey, quiz, 2 * 60 * 1000)
        return quiz
      }
    }
  },

  async generateQuizWithGPT(topic, { questionCount, difficulty }) {
    // Use a deterministic prompt to obtain a JSON we can parse safely
    const prompt = [
      'Create a multiple-choice quiz in JSON for the given crypto topic.',
      'Rules:',
      '- Language: English',
      '- Number of questions: ' + questionCount,
      '- Difficulty: ' + difficulty,
      '- Each question must have exactly 4 options',
      '- Provide the index of the correct option (0-3) and a short explanation',
      'Output JSON only with this shape:',
      '{ "questions": [ { "question": string, "options": string[4], "correctIndex": number, "explanation": string } ] }',
      'Topic: ' + topic
    ].join('\n')

    const res = await gptAPI.sendMessage(prompt)
    let data
    try {
      data = JSON.parse(res.content)
    } catch (_) {
      // Try to extract JSON block if model added prose
      const match = res.content.match(/\{[\s\S]*\}/)
      data = match ? JSON.parse(match[0]) : null
    }
    if (!data || !Array.isArray(data.questions)) {
      return this.getDemoQuiz(topic, questionCount)
    }
    return { topic, difficulty, questions: data.questions }
  },

  getDemoQuiz(topic, questionCount = 5) {
    const baseQuestions = [
      {
        question: 'What is a blockchain?',
        options: [
          'A centralized database controlled by a single entity',
          'A distributed ledger maintained by a network of nodes',
          'A type of cryptocurrency wallet',
          'A government registry for financial assets'
        ],
        correctIndex: 1,
        explanation: 'A blockchain is a distributed ledger where transactions are recorded across many nodes.'
      },
      {
        question: 'What does DEX stand for?',
        options: [
          'Digital Exchange',
          'Decentralized Exchange',
          'Derivative Exchange',
          'Dedicated Exchange'
        ],
        correctIndex: 1,
        explanation: 'DEX stands for Decentralized Exchange, where trades occur on-chain without intermediaries.'
      },
      {
        question: 'What is impermanent loss?',
        options: [
          'A permanent loss due to hacks',
          'A temporary portfolio loss from price divergence in liquidity pools',
          'Loss from forgetting seed phrase',
          'Loss due to transaction fees'
        ],
        correctIndex: 1,
        explanation: 'Impermanent loss occurs when deposited token prices diverge compared to holding them.'
      },
      {
        question: 'What is a private key?',
        options: [
          'A public identifier for your wallet',
          'A secret that proves ownership and signs transactions',
          'A crypto exchange password',
          'A blockchain explorer feature'
        ],
        correctIndex: 1,
        explanation: 'Private keys are secrets used to sign transactions and control funds.'
      },
      {
        question: 'What does staking typically provide?',
        options: [
          'Instant transactions without fees',
          'Passive rewards for securing the network',
          'Inflation protection for fiat',
          'KYC compliance'
        ],
        correctIndex: 1,
        explanation: 'Staking helps secure PoS networks and provides rewards to participants.'
      }
    ]
    const questions = baseQuestions.slice(0, questionCount).map((q, idx) => ({
      id: `demo_${idx + 1}`,
      ...q
    }))
    return { topic, difficulty: 'beginner', questions }
  },
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
    
    // Saludos
    if (lowerMessage.match(/hola|hello|hi|hey/)) {
      return {
        content: '¡Hola! Soy AURA, tu asistente de trading Web3. ¿En qué puedo ayudarte hoy? Puedo ayudarte con análisis de mercado, recomendaciones de portafolio y educación sobre criptomonedas.',
        analysis: 'Usuario iniciando conversación',
        recommendations: [
          'Pregunta sobre el mercado actual',
          'Solicita análisis de tu portafolio',
          'Aprende sobre criptomonedas específicas'
        ]
      }
    }

    // ¿Qué es AURA / AdEx AURA?
    if (lowerMessage.match(/\b(aura|adex aura)\b|que es aura|qué es aura|what is aura|que es adex|qué es adex|what is adex/i)) {
      return {
        content: 'AdEx AURA es una API/IA especializada en cripto que ofrece análisis de portafolio, recomendaciones de trading y insights de mercado en tiempo real. En esta app, AURA contextualiza tu wallet (si está conectada), analiza tus tokens y responde en español con explicaciones claras.',
        analysis: 'Explicación de capacidades: chat, análisis de portafolio, recomendaciones, mercado.',
        recommendations: [
          'Conecta tu wallet para un análisis personalizado',
          'Pregunta por tendencias de mercado o riesgo de tu portafolio',
          'Configura alertas inteligentes según tus objetivos'
        ]
      }
    }
    
    // Precio de Bitcoin
    if (lowerMessage.match(/bitcoin|btc.*price|precio.*bitcoin/i)) {
      return {
        content: 'El precio actual de Bitcoin es aproximadamente $67,500 USD. Bitcoin ha mostrado una tendencia alcista en las últimas semanas con un soporte fuerte en $65,000 y resistencia en $70,000. El volumen de trading ha aumentado, lo que indica un interés institucional creciente.',
        analysis: 'Análisis técnico: Tendencia alcista con momentum positivo. RSI en 58 (neutral). MACD mostrando señal de compra.',
        recommendations: [
          'Considera una estrategia DCA (Dollar Cost Averaging) para entradas graduales',
          'Establece stop-loss en $64,000 para gestionar riesgo',
          'Monitorea el nivel de resistencia de $70,000 para posibles toma de ganancias'
        ]
      }
    }
    
    // Mercado general
    if (lowerMessage.match(/market|mercado|como.*esta/i)) {
      return {
        content: 'El mercado cripto actual muestra una tendencia alcista moderada. La capitalización total del mercado es de $3.84T con un volumen de 24h de $85B. El índice Fear & Greed está en 65 (Optimista), indicando un sentimiento positivo pero no extremo. Bitcoin mantiene su dominancia en 57.1%.',
        analysis: 'El mercado se encuentra en una fase de acumulación institucional con volatilidad reducida comparada con meses anteriores.',
        recommendations: [
          'Buen momento para posiciones largas en activos principales',
          'Mantén 20-30% en stablecoins para oportunidades',
          'Considera rebalancear hacia proyectos de infraestructura'
        ]
      }
    }
    
    // Portfolio
    if (lowerMessage.match(/portfolio|portafolio|analiz.*mi/i)) {
      if (context.hasWallet) {
        return {
          content: `He analizado tu portafolio conectado. Tienes ${context.tokenCount} tokens diferentes, lo cual muestra una diversificación ${context.tokenCount >= 5 ? 'excelente' : 'moderada'}. Tu balance actual demuestra un enfoque ${context.hasBalance ? 'activo' : 'conservador'} en el mercado.`,
          analysis: `Diversificación: ${context.tokenCount >= 5 ? 'Alta' : 'Media'}. Riesgo: Medio. Balance: ${context.hasBalance ? 'Activo' : 'Requiere atención'}.`,
          recommendations: [
            context.tokenCount < 5 ? 'Considera diversificar más tu portafolio' : 'Mantén tu nivel de diversificación actual',
            'Rebalancea cada 2-3 meses para mantener tu asignación objetivo',
            'Considera tener al menos 20% en stablecoins para liquidez'
          ]
        }
      } else {
        return {
          content: 'Para analizar tu portafolio necesito que conectes tu wallet. Haz clic en "Connect Wallet" en la esquina superior derecha. Una vez conectada, podré darte un análisis detallado de tus holdings, diversificación y recomendaciones personalizadas.',
          analysis: 'Wallet no conectada - análisis no disponible',
          recommendations: [
            'Conecta tu wallet para análisis personalizado',
            'Asegúrate de usar una wallet compatible (MetaMask, WalletConnect)',
            'Nunca compartas tu frase semilla con nadie'
          ]
        }
      }
    }
    
    // Ethereum
    if (lowerMessage.match(/ethereum|eth(?!\w)/i)) {
      return {
        content: 'Ethereum está cotizando alrededor de $3,850 USD. Con la actualización exitosa a Proof of Stake y el crecimiento del ecosistema DeFi y NFT, ETH muestra fundamentos sólidos. El volumen de staking ha superado los 34M ETH, reduciendo la oferta circulante.',
        analysis: 'Fundamentos fuertes con adopción institucional creciente. Rendimiento de staking ~4-5% APY.',
        recommendations: [
          'ETH es una excelente opción para holdings a largo plazo',
          'Considera hacer staking para generar rendimientos pasivos',
          'Diversifica dentro del ecosistema Ethereum (DeFi, Layer 2s)'
        ]
      }
    }
    
    // DeFi
    if (lowerMessage.match(/defi|decentralized finance|finanzas descentralizadas/i)) {
      return {
        content: 'DeFi (Finanzas Descentralizadas) son aplicaciones financieras construidas sobre blockchain que operan sin intermediarios. Incluyen lending/borrowing (Aave, Compound), exchanges descentralizados (Uniswap, SushiSwap), y yield farming. El TVL total en DeFi supera los $100B.',
        analysis: 'DeFi ofrece oportunidades de rendimiento superiores a finanzas tradicionales pero con riesgos adicionales (smart contracts, impermanent loss).',
        recommendations: [
          'Comienza con protocolos establecidos y auditados (Aave, Uniswap)',
          'Nunca inviertas más del 10-20% de tu portfolio en DeFi de alto riesgo',
          'Entiende los riesgos: impermanent loss, smart contract bugs, rug pulls'
        ]
      }
    }
    
    // Recomendaciones generales
    if (lowerMessage.match(/recommend|recomend|sugiere|aconsejas/i)) {
      return {
        content: 'Basándome en el mercado actual y las mejores prácticas, te recomiendo una estrategia balanceada: 40-50% en BTC/ETH (activos principales), 20-30% en altcoins de proyectos sólidos (SOL, LINK, AVAX), 20-30% en stablecoins para liquidez, y 5-10% en proyectos de alto riesgo/alto rendimiento si tu perfil lo permite.',
        analysis: 'Esta distribución balancea crecimiento potencial con gestión de riesgo adecuada.',
        recommendations: [
          'Implementa DCA (compras periódicas) en lugar de intentar timing del mercado',
          'Rebalancea tu portafolio trimestralmente',
          'Mantén un fondo de emergencia fuera de cripto',
          'Nunca inviertas más de lo que puedes permitirte perder'
        ]
      }
    }
    
    // Default response
    return {
      content: 'Esa es una excelente pregunta. Basándome en el análisis del mercado actual y las tendencias de la industria, te recomendaría investigar más sobre este tema específico. El mercado cripto es muy dinámico, por lo que es importante mantenerse informado y tomar decisiones basadas en investigación sólida y tu perfil de riesgo personal.',
      analysis: 'El mercado cripto requiere educación continua y análisis cuidadoso antes de tomar decisiones de inversión.',
      recommendations: [
        'Investiga fuentes confiables como CoinDesk, The Block, y CoinGecko',
        'Mantén una estrategia de inversión disciplinada',
        'Considera consultar con asesores financieros para decisiones importantes',
        'Diversifica tu portafolio para gestionar el riesgo'
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
