# API Reference - CryptoMentor AI

This document describes all APIs, services and endpoints used in CryptoMentor AI.

## 📋 API Index

### External APIs
- [AdEx AURA API](#adex-aura-api) - Artificial intelligence for crypto analysis
- [CoinGecko API](#coingecko-api) - Price and market data
- [Alchemy API](#alchemy-api) - Blockchain data
- [Infura API](#infura-api) - Ethereum nodes

### Internal Services
- [auraAPI.js](#auraapijs) - AURA integration service
- [walletService.js](#walletservicejs) - Wallet and Web3 service
- [marketData.js](#marketdatajs) - Market data service

## 🤖 AdEx AURA API

### Base URL
```
https://api.adex.network/aura/v1
```

### Authentication
```javascript
Authorization: Bearer YOUR_AURA_API_KEY
```

### Endpoints

#### 1. AI Chat
```http
POST /chat
```

**Request Body:**
```json
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
```json
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
    "Consider adding stablecoins for liquidity"
  ],
  "performance_metrics": {
    "daily_change": "+2.5%",
    "weekly_change": "+8.3%",
    "monthly_change": "+15.7%"
  }
}
```

#### 3. Market Insights
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

#### 4. Personalized Recommendations (includes address → strategies)
```http
POST /recommendations/personalized
```

**Request Body (by profile or address):**
```json
{
  "address": "0x1C680f16b2270e324D5778305C9EC96784c832ab",
  "timeframe": "30d",
  "include_risk": true,
  "language": "en"
}
```

Alternatively by user profile:
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

> Prompt sugerido (Chat/Strategies):
> `Analyze address 0x1C680f16b2270e324D5778305C9EC96784c832ab and give app recommendations and strategies in natural language form, with a description of what each one does.`

#### 5. Smart Alerts
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

### Error Codes
```json
{
  "400": "Bad Request - Invalid parameters",
  "401": "Unauthorized - Invalid API key",
  "429": "Too Many Requests - Rate limit exceeded",
  "500": "Internal Server Error - Server error"
}
```

## 📊 CoinGecko API

### Base URL
```
https://api.coingecko.com/api/v3
```

### Used Endpoints

#### 1. Global Prices
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

#### 2. Specific Token Prices
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

#### 3. Historical Data
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

### Used Endpoints

#### 1. Wallet Balance
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

#### 2. Token Information
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

### Used Endpoints

#### 1. Network Information
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

#### 2. Transaction Count
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

### Description
Internal service to integrate with the AdEx AURA API.

### Methods

#### `sendMessage(message, context)`
Sends a message to AURA chat.

**Parameters:**
- `message` (string): User message
- `context` (object): User and portfolio context

**Returns:** Promise with AURA response

**Example:**
```javascript
const response = await auraAPI.sendMessage(
  "How is my portfolio?",
  {
    hasWallet: true,
    tokens: ['BTC', 'ETH'],
    balance: '2.5'
  }
)
```

#### `analyzePortfolio(tokens, balance)`
Analyzes the user's portfolio.

**Parameters:**
- `tokens` (array): User's token list
- `balance` (string): ETH balance

**Returns:** Promise with portfolio analysis

#### `getMarketInsights()`
Gets market insights.

**Returns:** Promise with market data

#### `getPersonalizedRecommendations(userProfile)`
Gets personalized recommendations.

**Parameters:**
- `userProfile` (object): User profile

**Returns:** Promise with recommendations

#### `setupSmartAlerts(alertConfig)`
Sets up smart alerts.

**Parameters:**
- `alertConfig` (object): Alert configuration

**Returns:** Promise with confirmation

### Fallback Demo
If no API key is available, the service uses demo responses:

```javascript
const getDemoResponse = (message, context) => {
  const responses = {
    'hello': 'Hello! I'm AURA, your Web3 trading assistant...',
    'bitcoin price': 'The current Bitcoin price is $43,250 USD...',
    'portfolio': 'I see you have a diversified portfolio...'
  }
  
  // Demo response selection logic
  return selectedResponse
}
```

## 💼 walletService.js

### Description
Service for wallet and Web3 operations.

### Methods

#### `connectWallet()`
Connects to MetaMask.

**Returns:** Promise with account address

#### `getEthBalance(address)`
Gets ETH balance.

**Parameters:**
- `address` (string): Wallet address

**Returns:** Promise with ETH balance

#### `getTokenBalance(tokenAddress, walletAddress)`
Gets ERC-20 token balance.

**Parameters:**
- `tokenAddress` (string): Token contract address
- `walletAddress` (string): Wallet address

**Returns:** Promise with token balance

#### `getTokensWithBalance(walletAddress, tokens)`
Gets tokens with balance > 0.

**Parameters:**
- `walletAddress` (string): Wallet address
- `tokens` (array): List of tokens to check

**Returns:** Promise with array of tokens with balance

#### `getCurrentNetwork()`
Gets current network information.

**Returns:** Promise with network information

#### `switchNetwork(chainId)`
Switches to a specific network.

**Parameters:**
- `chainId` (string): Chain ID

**Returns:** Promise

#### `calculatePortfolioValue(tokens, ethBalance)`
Calculates total portfolio value.

**Parameters:**
- `tokens` (array): List of tokens
- `ethBalance` (string): ETH balance

**Returns:** Promise with total value in USD

### Utilities

#### `formatAddress(address)`
Formats address for display.

#### `formatBalance(balance, decimals)`
Formats balance for display.

#### `getTokenPrice(symbol)`
Gets token price (simulated).

## 📈 marketData.js

### Description
Service for market data and analysis.

### Methods

#### `getMarketOverview()`
Gets general market data.

**Returns:** Promise with market data

#### `getTokenPrices(symbols)`
Gets specific token prices.

**Parameters:**
- `symbols` (array): Token symbols

**Returns:** Promise with prices

#### `getHistoricalData(symbol, days)`
Gets historical price data.

**Parameters:**
- `symbol` (string): Token symbol
- `days` (number): Number of days

**Returns:** Promise with historical data

#### `getMarketNews()`
Gets market news.

**Returns:** Promise with news array

#### `getTechnicalAnalysis(symbol)`
Gets technical analysis.

**Parameters:**
- `symbol` (string): Token symbol

**Returns:** Promise with technical analysis

#### `calculatePortfolioMetrics(tokens, totalValue)`
Calculates portfolio metrics.

**Parameters:**
- `tokens` (array): Token list
- `totalValue` (number): Total value

**Returns:** Object with metrics

### Utilities

#### `formatNumber(number, decimals)`
Formats numbers for display.

#### `formatPercentage(number, decimals)`
Formats percentages.

## 🔒 Security Configuration

### Environment Variables
```env
# Main APIs
VITE_AURA_API_KEY=your_aura_api_key_here
VITE_COINGECKO_API_KEY=your_coingecko_api_key_here
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
VITE_INFURA_API_KEY=your_infura_api_key_here

# App Configuration
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
    // Rate limiting logic
  }
}
```

### Input Validation
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

## 📊 Monitoring and Analytics

### API Metrics
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

## 🚀 Optimizations

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

## 🔮 API Roadmap

### Upcoming Integrations
- **DeFi Pulse API**: DeFi protocol data
- **Glassnode API**: On-chain analysis
- **Messari API**: Institutional data
- **Twitter API**: Social sentiment analysis

### Planned Improvements
- **GraphQL**: Unified API
- **WebSocket**: Real-time data
- **Redis Caching**: Distributed cache
- **CDN**: Global data distribution

---

This documentation provides a complete reference of all APIs used in CryptoMentor AI, facilitating integration, maintenance and project development.
