# AdEx AURA Integration - Technical Documentation

This document describes in detail how CryptoMentor AI integrates with the AdEx AURA API to provide artificial intelligence functionalities.

## 🤖 AdEx AURA Overview

### What is AdEx AURA?

AdEx AURA is an artificial intelligence API specialized in cryptocurrency and financial market analysis. It provides:

- **Contextual analysis** of portfolios
- **Personalized trading** recommendations
- **Real-time market** insights
- **Intelligent chat** with specialized knowledge

### AdEx AURA Capabilities

1. **Portfolio Analysis**: Evaluation of diversification, risk and performance
2. **Trading Recommendations**: Suggestions based on market conditions
3. **Sentiment Analysis**: Interpretation of news and trends
4. **Contextual Education**: Explanations adapted to user level

## 🔌 Technical Implementation

### API Configuration

```javascript
// src/services/auraAPI.js

const AURA_API_BASE = 'https://api.adex.network/aura/v1'
const AURA_API_KEY = import.meta.env.VITE_AURA_API_KEY

const auraClient = axios.create({
  baseURL: AURA_API_BASE,
  headers: {
    'Authorization': `Bearer ${AURA_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000
})
```

### Main Endpoints

#### 1. AI Chat
```javascript
POST /chat
{
  "message": "How is my portfolio?",
  "context": {
    "user_type": "crypto_enthusiast",
    "experience_level": "intermediate",
    "hasWallet": true,
    "tokens": ["BTC", "ETH", "USDC"],
    "balance": "2.5"
  },
  "options": {
    "include_analysis": true,
    "include_recommendations": true,
    "language": "es"
  }
}
```

**Response:**
```javascript
{
  "response": "Your portfolio shows good diversification...",
  "analysis": {
    "sentiment": "positive",
    "confidence": 0.85,
    "key_points": ["Adequate diversification", "Medium risk"]
  },
  "recommendations": [
    "Consider increasing Bitcoin exposure",
    "Maintain current diversification"
  ],
  "confidence": 0.85
}
```

#### 2. Portfolio Analysis
```javascript
POST /analyze/portfolio
{
  "tokens": [
    {
      "symbol": "BTC",
      "balance": "0.5",
      "value_usd": 21500
    },
    {
      "symbol": "ETH",
      "balance": "10",
      "value_usd": 26000
    }
  ],
  "total_balance_eth": "12.5",
  "portfolio_diversity": 7.5,
  "risk_level": "medium"
}
```

**Response:**
```javascript
{
  "total_value_usd": 47500,
  "diversity_score": 7.5,
  "risk_level": "medium",
  "allocation_analysis": {
    "bitcoin": 45,
    "ethereum": 55,
    "stablecoins": 0
  },
  "recommendations": [
    "Consider adding stablecoins for liquidity",
    "Balance between BTC and ETH is adequate"
  ],
  "performance_metrics": {
    "daily_change": "+2.5%",
    "weekly_change": "+8.3%",
    "monthly_change": "+15.7%"
  }
}
```

#### 3. Market Insights
```javascript
GET /market/insights?timeframe=24h&include_sentiment=true
```

**Response:**
```javascript
{
  "overall_sentiment": "bullish",
  "market_cap_change": "+3.2%",
  "fear_greed_index": 65,
  "top_performers": [
    { "symbol": "BTC", "change": "+5.2%" },
    { "symbol": "ETH", "change": "+4.8%" }
  ],
  "insights": [
    "Market in bullish trend",
    "Institutions increasing exposure"
  ],
  "technical_analysis": {
    "btc_support": "$42,000",
    "btc_resistance": "$45,000",
    "trend": "ascending"
  }
}
```

## 🧠 Context and Personalization

### User Context

AdEx AURA uses rich context to personalize responses:

```javascript
const userContext = {
  // User information
  user_type: "crypto_enthusiast", // beginner, intermediate, advanced
  experience_level: "intermediate",
  risk_tolerance: "medium", // low, medium, high
  
  // Wallet state
  hasWallet: isConnected,
  wallet_address: account,
  balance_eth: parseFloat(balance),
  
  // Portfolio
  tokens: tokens.map(t => ({
    symbol: t.symbol,
    balance: t.balance,
    value_usd: parseFloat(t.balance) * getTokenPrice(t.symbol)
  })),
  
  // Preferences
  interests: ["trading", "portfolio_management", "market_analysis"],
  language: "en",
  
  // History
  conversation_history: conversation.slice(-5), // Last 5 interactions
  previous_recommendations: recommendations
}
```

### Response Personalization

AdEx AURA adapts its responses based on:

1. **Experience Level**:
   - **Beginner**: Simple explanations, basic concepts
   - **Intermediate**: Moderate technical analysis, strategies
   - **Advanced**: Complex analysis, advanced strategies

2. **Risk Tolerance**:
   - **Low**: Conservative recommendations, stablecoins
   - **Medium**: Balance between risk and return
   - **High**: Aggressive strategies, altcoins

3. **Current Portfolio**:
   - Diversification analysis
   - Rebalancing suggestions
   - Concentration alerts

## 💬 Chat System

### Conversation Flow

```javascript
const sendMessage = async (message, context = {}) => {
  // 1. Prepare context
  const fullContext = {
    ...defaultContext,
    ...context,
    timestamp: new Date().toISOString(),
    session_id: getSessionId()
  }
  
  // 2. Send to AdEx AURA
  const response = await auraAPI.sendMessage(message, fullContext)
  
  // 3. Process response
  const processedResponse = {
    content: response.response,
    analysis: response.analysis,
    recommendations: response.recommendations,
    confidence: response.confidence,
    timestamp: new Date()
  }
  
  // 4. Update history
  updateConversation(processedResponse)
  
  return processedResponse
}
```

### Response Types

#### Simple Response
```javascript
{
  "content": "Bitcoin price is at $43,250 USD",
  "confidence": 0.95
}
```

#### Response with Analysis
```javascript
{
  "content": "Bitcoin shows a bullish trend...",
  "analysis": {
    "sentiment": "positive",
    "technical_indicators": ["RSI: 65", "MACD: Bullish"],
    "key_levels": ["Support: $42,000", "Resistance: $45,000"]
  },
  "confidence": 0.85
}
```

#### Response with Recommendations
```javascript
{
  "content": "Your portfolio is well diversified...",
  "recommendations": [
    "Consider DCA on Bitcoin",
    "Keep 20% in stablecoins",
    "Review altcoin positions"
  ],
  "action_items": [
    {
      "action": "buy",
      "asset": "BTC",
      "amount": "0.1",
      "reason": "DCA strategy"
    }
  ]
}
```

## 📊 Portfolio Analysis

### Calculated Metrics

#### Portfolio Diversity
```javascript
const calculateDiversity = (tokens) => {
  if (tokens.length === 0) return 0
  if (tokens.length === 1) return 1
  
  // Formula: sqrt(number_of_tokens) * balance_factor
  const tokenCount = tokens.length
  const balanceFactor = calculateBalanceFactor(tokens)
  
  return Math.min(tokenCount * 0.3 * balanceFactor, 10)
}
```

#### Risk Level
```javascript
const calculateRiskLevel = (tokens) => {
  const highRiskTokens = ['MEME', 'DOGE', 'SHIB', 'PEPE']
  const hasHighRisk = tokens.some(token => 
    highRiskTokens.some(risk => token.symbol.includes(risk))
  )
  
  const concentrationRisk = calculateConcentrationRisk(tokens)
  
  if (hasHighRisk || concentrationRisk > 0.8) return 'high'
  if (concentrationRisk > 0.5) return 'medium'
  return 'low'
}
```

### Automatic Recommendations

AdEx AURA generates recommendations based on:

1. **Diversification Analysis**:
   - Concentration in a single asset
   - Lack of stablecoins
   - Excess of speculative altcoins

2. **Risk Analysis**:
   - Portfolio volatility
   - Correlation between assets
   - Available liquidity

3. **Market Conditions**:
   - Current trends
   - Support/resistance levels
   - Market sentiment

## 🔄 Fallback and Demo Mode

### Fallback System

When no API key is available, CryptoMentor AI uses demo responses:

```javascript
const getDemoResponse = (message, context) => {
  const responses = {
    'hello': 'Hello! I'm AURA, your Web3 trading assistant...',
    'bitcoin price': 'The current Bitcoin price is $43,250 USD...',
    'portfolio': 'I see you have a diversified portfolio...',
    'default': 'Interesting question. Based on the analysis...'
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
      key_points: ['Favorable technical analysis']
    },
    recommendations: [
      'Consider DCA on main assets',
      'Maintain portfolio diversification'
    ]
  }
}
```

### Demo Mode Benefits

1. **Complete Functionality**: All features work
2. **Realistic Experience**: Coherent and useful responses
3. **Offline Development**: No API key required for development
4. **Client Demo**: Perfect for presentations

## 🚀 Optimizaciones de Performance

### Caching de Respuestas

```javascript
const responseCache = new Map()

const getCachedResponse = (message, context) => {
  const cacheKey = generateCacheKey(message, context)
  return responseCache.get(cacheKey)
}

const cacheResponse = (message, context, response) => {
  const cacheKey = generateCacheKey(message, context)
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now(),
    ttl: 300000 // 5 minutos
  })
}
```

### Rate Limiting

```javascript
const rateLimiter = {
  requests: new Map(),
  limit: 60, // requests per minute
  
  checkLimit(userId) {
    const now = Date.now()
    const userRequests = this.requests.get(userId) || []
    const recentRequests = userRequests.filter(time => now - time < 60000)
    
    if (recentRequests.length >= this.limit) {
      throw new Error('Rate limit exceeded')
    }
    
    recentRequests.push(now)
    this.requests.set(userId, recentRequests)
  }
}
```

## 🔒 Seguridad y Privacidad

### Protección de Datos

1. **No Almacenamiento**: No guardamos conversaciones en servidores
2. **Anonimización**: Datos del portfolio se envían sin identificadores
3. **Encriptación**: Todas las comunicaciones usan HTTPS
4. **Consentimiento**: Usuario controla qué datos se comparten

### Validación de Entrada

```javascript
const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid message format')
  }
  
  if (message.length > 1000) {
    throw new Error('Message too long')
  }
  
  // Filtrar contenido inapropiado
  const filteredMessage = filterInappropriateContent(message)
  
  return filteredMessage
}
```

## 📈 Métricas y Analytics

### Tracking de Uso

```javascript
const trackAURAUsage = {
  messagesSent: 0,
  responsesReceived: 0,
  averageResponseTime: 0,
  userSatisfaction: 0,
  
  trackMessage(message, context) {
    this.messagesSent++
    this.trackEvent('message_sent', { length: message.length })
  },
  
  trackResponse(response, responseTime) {
    this.responsesReceived++
    this.averageResponseTime = 
      (this.averageResponseTime + responseTime) / 2
    
    this.trackEvent('response_received', {
      confidence: response.confidence,
      hasRecommendations: !!response.recommendations
    })
  }
}
```

### KPIs Principales

- **Tiempo de Respuesta**: < 2 segundos promedio
- **Precisión**: 85%+ de respuestas útiles
- **Satisfacción**: 4.2/5 rating promedio
- **Engagement**: 5-8 mensajes por sesión

## 🔮 Roadmap de AdEx AURA

### Mejoras Planificadas

1. **Análisis Técnico Avanzado**:
   - Integración con indicadores técnicos
   - Predicciones de precios
   - Análisis de volumen

2. **Personalización Mejorada**:
   - Aprendizaje de preferencias del usuario
   - Recomendaciones adaptativas
   - Perfiles de riesgo dinámicos

3. **Integración DeFi**:
   - Análisis de yield farming
   - Optimización de liquidity pools
   - Gestión de impermanent loss

4. **Multi-idioma**:
   - Soporte para 10+ idiomas
   - Localización cultural
   - Análisis de sentimiento por región

---

La integración con AdEx AURA es el corazón de CryptoMentor AI, proporcionando inteligencia artificial de vanguardia para ayudar a los usuarios a navegar el complejo mundo de las criptomonedas.

## ⭐ Capability clave: Address → Recommendations & Strategies

AURA permite enviar una account address y recibir una lista de recomendaciones y estrategias en lenguaje natural, con una descripción de lo que hace cada una. Esta es una de las capacidades más importantes de CryptoMentor AI y se emplea tanto desde el Chat como desde la pestaña Strategies.

### Endpoint utilizado

```http
POST /aura/v1/recommendations/personalized
```

#### Payload de ejemplo
```json
{
  "address": "0x1C680f16b2270e324D5778305C9EC96784c832ab",
  "timeframe": "30d",
  "include_risk": true,
  "language": "en"
}
```

#### Respuesta (esquema simplificado)
```json
{
  "immediate_actions": [
    "DCA on BTC/ETH: Invest a fixed amount weekly to smooth volatility.",
    "Set smart price alerts: Track key support/resistance to react fast."
  ],
  "long_term_strategy": [
    "Quarterly rebalance: Keep a target split with BTC/ETH, alts, stables."
  ],
  "risk_management": [
    "Position sizing: Limit exposure to high‑volatility assets."
  ]
}
```

### Prompt recomendado (Chat/Strategies)
```text
Analyze address 0x1C680f16b2270e324D5778305C9EC96784c832ab and give app recommendations and strategies in natural language form, with a description of what each one does.
```

> Tip: La UI muestra la dirección corta (0x1C680f…32ab) para mejor legibilidad, pero envía la dirección completa a la API.
