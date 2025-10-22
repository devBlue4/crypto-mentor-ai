# Integración con AdEx AURA - Documentación Técnica

Este documento describe en detalle cómo CryptoMentor AI se integra con la API de AdEx AURA para proporcionar funcionalidades de inteligencia artificial.

## 🤖 Visión General de AdEx AURA

### ¿Qué es AdEx AURA?

AdEx AURA es una API de inteligencia artificial especializada en análisis de criptomonedas y mercados financieros. Proporciona:

- **Análisis contextual** de portfolios
- **Recomendaciones personalizadas** de trading
- **Insights de mercado** en tiempo real
- **Chat inteligente** con conocimiento especializado

### Capacidades de AdEx AURA

1. **Análisis de Portfolio**: Evaluación de diversificación, riesgo y rendimiento
2. **Recomendaciones de Trading**: Sugerencias basadas en condiciones de mercado
3. **Análisis de Sentimiento**: Interpretación de noticias y tendencias
4. **Educación Contextual**: Explicaciones adaptadas al nivel del usuario

## 🔌 Implementación Técnica

### Configuración de la API

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

### Endpoints Principales

#### 1. Chat con IA
```javascript
POST /chat
{
  "message": "¿Cómo está mi portfolio?",
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

**Respuesta:**
```javascript
{
  "response": "Tu portfolio muestra una buena diversificación...",
  "analysis": {
    "sentiment": "positive",
    "confidence": 0.85,
    "key_points": ["Diversificación adecuada", "Riesgo medio"]
  },
  "recommendations": [
    "Considera aumentar exposición a Bitcoin",
    "Mantén diversificación actual"
  ],
  "confidence": 0.85
}
```

#### 2. Análisis de Portfolio
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

**Respuesta:**
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
    "Considera agregar stablecoins para liquidez",
    "Balance entre BTC y ETH es adecuado"
  ],
  "performance_metrics": {
    "daily_change": "+2.5%",
    "weekly_change": "+8.3%",
    "monthly_change": "+15.7%"
  }
}
```

#### 3. Insights de Mercado
```javascript
GET /market/insights?timeframe=24h&include_sentiment=true
```

**Respuesta:**
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
    "Mercado en tendencia alcista",
    "Instituciones aumentando exposición"
  ],
  "technical_analysis": {
    "btc_support": "$42,000",
    "btc_resistance": "$45,000",
    "trend": "ascending"
  }
}
```

## 🧠 Contexto y Personalización

### Contexto del Usuario

AdEx AURA utiliza un contexto rico para personalizar las respuestas:

```javascript
const userContext = {
  // Información del usuario
  user_type: "crypto_enthusiast", // beginner, intermediate, advanced
  experience_level: "intermediate",
  risk_tolerance: "medium", // low, medium, high
  
  // Estado del wallet
  hasWallet: isConnected,
  wallet_address: account,
  balance_eth: parseFloat(balance),
  
  // Portfolio
  tokens: tokens.map(t => ({
    symbol: t.symbol,
    balance: t.balance,
    value_usd: parseFloat(t.balance) * getTokenPrice(t.symbol)
  })),
  
  // Preferencias
  interests: ["trading", "portfolio_management", "market_analysis"],
  language: "es",
  
  // Historial
  conversation_history: conversation.slice(-5), // Últimas 5 interacciones
  previous_recommendations: recommendations
}
```

### Personalización de Respuestas

AdEx AURA adapta sus respuestas basándose en:

1. **Nivel de Experiencia**:
   - **Principiante**: Explicaciones simples, conceptos básicos
   - **Intermedio**: Análisis técnico moderado, estrategias
   - **Avanzado**: Análisis complejo, estrategias avanzadas

2. **Tolerancia al Riesgo**:
   - **Bajo**: Recomendaciones conservadoras, stablecoins
   - **Medio**: Balance entre riesgo y rendimiento
   - **Alto**: Estrategias agresivas, altcoins

3. **Portfolio Actual**:
   - Análisis de diversificación
   - Sugerencias de rebalanceo
   - Alertas sobre concentración

## 💬 Sistema de Chat

### Flujo de Conversación

```javascript
const sendMessage = async (message, context = {}) => {
  // 1. Preparar contexto
  const fullContext = {
    ...defaultContext,
    ...context,
    timestamp: new Date().toISOString(),
    session_id: getSessionId()
  }
  
  // 2. Enviar a AdEx AURA
  const response = await auraAPI.sendMessage(message, fullContext)
  
  // 3. Procesar respuesta
  const processedResponse = {
    content: response.response,
    analysis: response.analysis,
    recommendations: response.recommendations,
    confidence: response.confidence,
    timestamp: new Date()
  }
  
  // 4. Actualizar historial
  updateConversation(processedResponse)
  
  return processedResponse
}
```

### Tipos de Respuesta

#### Respuesta Simple
```javascript
{
  "content": "El precio de Bitcoin está en $43,250 USD",
  "confidence": 0.95
}
```

#### Respuesta con Análisis
```javascript
{
  "content": "Bitcoin muestra una tendencia alcista...",
  "analysis": {
    "sentiment": "positive",
    "technical_indicators": ["RSI: 65", "MACD: Bullish"],
    "key_levels": ["Support: $42,000", "Resistance: $45,000"]
  },
  "confidence": 0.85
}
```

#### Respuesta con Recomendaciones
```javascript
{
  "content": "Tu portfolio está bien diversificado...",
  "recommendations": [
    "Considera DCA en Bitcoin",
    "Mantén 20% en stablecoins",
    "Revisa posición en altcoins"
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

## 📊 Análisis de Portfolio

### Métricas Calculadas

#### Diversidad del Portfolio
```javascript
const calculateDiversity = (tokens) => {
  if (tokens.length === 0) return 0
  if (tokens.length === 1) return 1
  
  // Fórmula: sqrt(número_de_tokens) * factor_de_balance
  const tokenCount = tokens.length
  const balanceFactor = calculateBalanceFactor(tokens)
  
  return Math.min(tokenCount * 0.3 * balanceFactor, 10)
}
```

#### Nivel de Riesgo
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

### Recomendaciones Automáticas

AdEx AURA genera recomendaciones basadas en:

1. **Análisis de Diversificación**:
   - Concentración en un solo activo
   - Falta de stablecoins
   - Exceso de altcoins especulativas

2. **Análisis de Riesgo**:
   - Volatilidad del portfolio
   - Correlación entre activos
   - Liquidez disponible

3. **Condiciones de Mercado**:
   - Tendencias actuales
   - Niveles de soporte/resistencia
   - Sentimiento del mercado

## 🔄 Fallback y Demo Mode

### Sistema de Fallback

Cuando no hay API key disponible, CryptoMentor AI utiliza respuestas demo:

```javascript
const getDemoResponse = (message, context) => {
  const responses = {
    'hola': '¡Hola! Soy AURA, tu asistente de trading Web3...',
    'precio bitcoin': 'El precio actual de Bitcoin está en $43,250 USD...',
    'portfolio': 'Veo que tienes un portfolio diversificado...',
    'default': 'Interesante pregunta. Basándome en el análisis...'
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
      key_points: ['Análisis técnico favorable']
    },
    recommendations: [
      'Considera DCA en activos principales',
      'Mantén diversificación del portfolio'
    ]
  }
}
```

### Beneficios del Demo Mode

1. **Funcionalidad Completa**: Todas las características funcionan
2. **Experiencia Realista**: Respuestas coherentes y útiles
3. **Desarrollo Offline**: No requiere API key para desarrollo
4. **Demo para Clientes**: Perfecto para presentaciones

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
