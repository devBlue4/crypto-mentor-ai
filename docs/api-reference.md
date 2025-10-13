# API Reference - CryptoMentor AI

Este documento describe todas las APIs, servicios y endpoints utilizados en CryptoMentor AI.

## 📋 Índice de APIs

### APIs Externas
- [AdEx AURA API](#adex-aura-api) - Inteligencia artificial para análisis crypto
- [CoinGecko API](#coingecko-api) - Datos de precios y mercado
- [Alchemy API](#alchemy-api) - Datos de blockchain
- [Infura API](#infura-api) - Nodos de Ethereum

### Servicios Internos
- [auraAPI.js](#auraapijs) - Servicio de integración con AURA
- [walletService.js](#walletservicejs) - Servicio de wallet y Web3
- [marketData.js](#marketdatajs) - Servicio de datos de mercado

## 🤖 AdEx AURA API

### Base URL
```
https://api.adex.network/aura/v1
```

### Autenticación
```javascript
Authorization: Bearer YOUR_AURA_API_KEY
```

### Endpoints

#### 1. Chat con IA
```http
POST /chat
```

**Request Body:**
```json
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

**Response:**
```json
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
```http
POST /analyze/portfolio
```

**Request Body:**
```json
{
  "tokens": [
    {
      "symbol": "BTC",
      "balance": "0.5",
      "value_usd": 21500
    }
  ],
  "total_balance_eth": "12.5",
  "portfolio_diversity": 7.5,
  "risk_level": "medium"
}
```

**Response:**
```json
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
    "Considera agregar stablecoins para liquidez"
  ],
  "performance_metrics": {
    "daily_change": "+2.5%",
    "weekly_change": "+8.3%",
    "monthly_change": "+15.7%"
  }
}
```

#### 3. Insights de Mercado
```http
GET /market/insights?timeframe=24h&include_sentiment=true
```

**Response:**
```json
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

#### 4. Recomendaciones Personalizadas
```http
POST /recommendations/personalized
```

**Request Body:**
```json
{
  "user_profile": {
    "experience_level": "intermediate",
    "risk_tolerance": "medium",
    "investment_goals": ["growth", "income"],
    "time_horizon": "long_term"
  }
}
```

**Response:**
```json
{
  "immediate_actions": [
    "Revisar y rebalancear portfolio",
    "Configurar alertas de precio"
  ],
  "long_term_strategy": [
    "Diversificar hacia DeFi protocols",
    "Explorar tokens de infraestructura"
  ],
  "risk_management": [
    "Establecer stop-loss en posiciones principales",
    "No invertir más del 5% en altcoins especulativas"
  ]
}
```

#### 5. Alertas Inteligentes
```http
POST /alerts/smart
```

**Request Body:**
```json
{
  "type": "price",
  "symbol": "BTC",
  "condition": "above",
  "value": 45000,
  "user_id": "user123",
  "notification_preferences": {
    "email": true,
    "push": true,
    "webhook": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "alert_id": "alert_abc123",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Códigos de Error
```json
{
  "400": "Bad Request - Parámetros inválidos",
  "401": "Unauthorized - API key inválida",
  "429": "Too Many Requests - Rate limit excedido",
  "500": "Internal Server Error - Error del servidor"
}
```

## 📊 CoinGecko API

### Base URL
```
https://api.coingecko.com/api/v3
```

### Endpoints Utilizados

#### 1. Precios Globales
```http
GET /global
```

**Response:**
```json
{
  "data": {
    "total_market_cap": {
      "usd": 1750000000000
    },
    "total_volume": {
      "usd": 85000000000
    },
    "market_cap_percentage": {
      "btc": 42.5,
      "eth": 18.3
    },
    "active_cryptocurrencies": 12000,
    "markets": 800
  }
}
```

#### 2. Precios de Tokens Específicos
```http
GET /simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true
```

**Response:**
```json
{
  "bitcoin": {
    "usd": 43250.50,
    "usd_24h_change": 2.5
  },
  "ethereum": {
    "usd": 2650.75,
    "usd_24h_change": 3.2
  }
}
```

#### 3. Datos Históricos
```http
GET /coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily
```

**Response:**
```json
{
  "prices": [
    [1640995200000, 42000],
    [1641081600000, 43000],
    [1641168000000, 42500]
  ],
  "market_caps": [
    [1640995200000, 800000000000],
    [1641081600000, 820000000000]
  ],
  "total_volumes": [
    [1640995200000, 25000000000],
    [1641081600000, 28000000000]
  ]
}
```

## 🔗 Alchemy API

### Base URL
```
https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

### Endpoints Utilizados

#### 1. Balance de Wallet
```http
POST /
```

**Request Body:**
```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", "latest"],
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1bc16d674ec80000"
}
```

#### 2. Información de Token
```http
POST /
```

**Request Body:**
```json
{
  "jsonrpc": "2.0",
  "method": "alchemy_getTokenBalances",
  "params": ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", ["0xA0b86a33E6441c8C3C7d4A5e2E2B4C4F4F4F4F4F"]],
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "tokenBalances": [
      {
        "contractAddress": "0xA0b86a33E6441c8C3C7d4A5e2E2B4C4F4F4F4F4F",
        "tokenBalance": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "error": null
      }
    ]
  }
}
```

## 🌐 Infura API

### Base URL
```
https://mainnet.infura.io/v3/YOUR_PROJECT_ID
```

### Endpoints Utilizados

#### 1. Información de Red
```http
POST /
```

**Request Body:**
```json
{
  "jsonrpc": "2.0",
  "method": "eth_chainId",
  "params": [],
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1"
}
```

#### 2. Conteo de Transacciones
```http
POST /
```

**Request Body:**
```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionCount",
  "params": ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", "latest"],
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1a2b3c"
}
```

## 🔧 auraAPI.js

### Descripción
Servicio interno para integrar con la API de AdEx AURA.

### Métodos

#### `sendMessage(message, context)`
Envía un mensaje al chat de AURA.

**Parámetros:**
- `message` (string): Mensaje del usuario
- `context` (object): Contexto del usuario y portfolio

**Retorna:** Promise con respuesta de AURA

**Ejemplo:**
```javascript
const response = await auraAPI.sendMessage(
  "¿Cómo está mi portfolio?",
  {
    hasWallet: true,
    tokens: ['BTC', 'ETH'],
    balance: '2.5'
  }
)
```

#### `analyzePortfolio(tokens, balance)`
Analiza el portfolio del usuario.

**Parámetros:**
- `tokens` (array): Lista de tokens del usuario
- `balance` (string): Balance de ETH

**Retorna:** Promise con análisis del portfolio

#### `getMarketInsights()`
Obtiene insights del mercado.

**Retorna:** Promise con datos de mercado

#### `getPersonalizedRecommendations(userProfile)`
Obtiene recomendaciones personalizadas.

**Parámetros:**
- `userProfile` (object): Perfil del usuario

**Retorna:** Promise con recomendaciones

#### `setupSmartAlerts(alertConfig)`
Configura alertas inteligentes.

**Parámetros:**
- `alertConfig` (object): Configuración de la alerta

**Retorna:** Promise con confirmación

### Fallback Demo
Si no hay API key disponible, el servicio utiliza respuestas demo:

```javascript
const getDemoResponse = (message, context) => {
  const responses = {
    'hola': '¡Hola! Soy AURA, tu asistente de trading Web3...',
    'precio bitcoin': 'El precio actual de Bitcoin está en $43,250 USD...',
    'portfolio': 'Veo que tienes un portfolio diversificado...'
  }
  
  // Lógica de selección de respuesta demo
  return selectedResponse
}
```

## 💼 walletService.js

### Descripción
Servicio para operaciones de wallet y Web3.

### Métodos

#### `connectWallet()`
Conecta a MetaMask.

**Retorna:** Promise con dirección de la cuenta

#### `getEthBalance(address)`
Obtiene balance de ETH.

**Parámetros:**
- `address` (string): Dirección del wallet

**Retorna:** Promise con balance en ETH

#### `getTokenBalance(tokenAddress, walletAddress)`
Obtiene balance de token ERC-20.

**Parámetros:**
- `tokenAddress` (string): Dirección del contrato del token
- `walletAddress` (string): Dirección del wallet

**Retorna:** Promise con balance del token

#### `getTokensWithBalance(walletAddress, tokens)`
Obtiene tokens con balance > 0.

**Parámetros:**
- `walletAddress` (string): Dirección del wallet
- `tokens` (array): Lista de tokens a verificar

**Retorna:** Promise con array de tokens con balance

#### `getCurrentNetwork()`
Obtiene información de la red actual.

**Retorna:** Promise con información de la red

#### `switchNetwork(chainId)`
Cambia a una red específica.

**Parámetros:**
- `chainId` (string): ID de la cadena

**Retorna:** Promise

#### `calculatePortfolioValue(tokens, ethBalance)`
Calcula valor total del portfolio.

**Parámetros:**
- `tokens` (array): Lista de tokens
- `ethBalance` (string): Balance de ETH

**Retorna:** Promise con valor total en USD

### Utilidades

#### `formatAddress(address)`
Formatea dirección para mostrar.

#### `formatBalance(balance, decimals)`
Formatea balance para mostrar.

#### `getTokenPrice(symbol)`
Obtiene precio del token (simulado).

## 📈 marketData.js

### Descripción
Servicio para datos de mercado y análisis.

### Métodos

#### `getMarketOverview()`
Obtiene datos generales del mercado.

**Retorna:** Promise con datos del mercado

#### `getTokenPrices(symbols)`
Obtiene precios de tokens específicos.

**Parámetros:**
- `symbols` (array): Símbolos de tokens

**Retorna:** Promise con precios

#### `getHistoricalData(symbol, days)`
Obtiene datos históricos de precios.

**Parámetros:**
- `symbol` (string): Símbolo del token
- `days` (number): Número de días

**Retorna:** Promise con datos históricos

#### `getMarketNews()`
Obtiene noticias del mercado.

**Retorna:** Promise con array de noticias

#### `getTechnicalAnalysis(symbol)`
Obtiene análisis técnico.

**Parámetros:**
- `symbol` (string): Símbolo del token

**Retorna:** Promise con análisis técnico

#### `calculatePortfolioMetrics(tokens, totalValue)`
Calcula métricas del portfolio.

**Parámetros:**
- `tokens` (array): Lista de tokens
- `totalValue` (number): Valor total

**Retorna:** Objeto con métricas

### Utilidades

#### `formatNumber(number, decimals)`
Formatea números para mostrar.

#### `formatPercentage(number, decimals)`
Formatea porcentajes.

## 🔒 Configuración de Seguridad

### Variables de Entorno
```env
# APIs Principales
VITE_AURA_API_KEY=your_aura_api_key_here
VITE_COINGECKO_API_KEY=your_coingecko_api_key_here
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
VITE_INFURA_API_KEY=your_infura_api_key_here

# Configuración de App
VITE_APP_NAME=CryptoMentor AI
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

### Rate Limiting
```javascript
const rateLimiter = {
  requests: new Map(),
  limit: 100, // requests per minute
  
  checkLimit(userId) {
    // Lógica de rate limiting
  }
}
```

### Validación de Entrada
```javascript
const validateInput = (input) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input format')
  }
  
  if (input.length > 1000) {
    throw new Error('Input too long')
  }
  
  return sanitizeInput(input)
}
```

## 📊 Monitoreo y Analytics

### Métricas de API
```javascript
const apiMetrics = {
  responseTime: [],
  errorRate: 0,
  successRate: 0,
  totalRequests: 0,
  
  trackRequest(responseTime, success) {
    this.responseTime.push(responseTime)
    this.totalRequests++
    
    if (success) {
      this.successRate = (this.successRate + 1) / this.totalRequests
    } else {
      this.errorRate = (this.errorRate + 1) / this.totalRequests
    }
  }
}
```

### Logging
```javascript
const logger = {
  info(message, data) {
    console.log(`[INFO] ${message}`, data)
  },
  
  error(message, error) {
    console.error(`[ERROR] ${message}`, error)
  },
  
  warn(message, data) {
    console.warn(`[WARN] ${message}`, data)
  }
}
```

## 🚀 Optimizaciones

### Caching
```javascript
const cache = new Map()

const getCachedData = (key) => {
  const item = cache.get(key)
  if (item && Date.now() - item.timestamp < item.ttl) {
    return item.data
  }
  return null
}

const setCachedData = (key, data, ttl = 300000) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}
```

### Batch Requests
```javascript
const batchRequests = async (requests) => {
  const batchSize = 10
  const results = []
  
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch)
    results.push(...batchResults)
  }
  
  return results
}
```

## 🔮 Roadmap de APIs

### Próximas Integraciones
- **DeFi Pulse API**: Datos de protocolos DeFi
- **Glassnode API**: Análisis on-chain
- **Messari API**: Datos institucionales
- **Twitter API**: Análisis de sentimiento social

### Mejoras Planificadas
- **GraphQL**: API unificada
- **WebSocket**: Datos en tiempo real
- **Caching Redis**: Caché distribuido
- **CDN**: Distribución global de datos

---

Esta documentación proporciona una referencia completa de todas las APIs utilizadas en CryptoMentor AI, facilitando la integración, mantenimiento y desarrollo del proyecto.
