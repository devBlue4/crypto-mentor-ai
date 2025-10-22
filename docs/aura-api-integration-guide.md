# AdEx AURA API Integration Guide

## Executive Summary

AdEx AURA is a personal AI agent framework and recommendation engine that analyzes publicly available data from Ethereum and Layer 2 blockchains. It processes this data through a large language model (LLM) to generate personalized recommendations for actions or applications based on user behavior.

**Main Functionality**: AURA takes an account address and generates a list of application and strategy recommendations in natural language, with descriptions of what each one does.

## System Architecture

### Main Components

1. **Portfolio Analyzer** (`lib/utils/portfolio.ts`)
   - Gets portfolio data from multiple blockchain networks
   - Uses `ambire-common` to interact with RPCs
   - Supports multiple EVM networks

2. **LLM Processors** (`lib/utils/llm/`)
   - **Gemini**: Integration with Google Gemini AI
   - **Grok**: Integration with Grok AI
   - **Mocked AI**: Demo responses for development

3. **Strategy Engine** (`lib/utils/strategies.ts`)
   - Defines predefined strategies for empty portfolios
   - Data structure for recommendations

4. **API Server** (`app/index.ts`)
   - Express server on port 3420
   - POST `/` endpoint to process addresses

## Data Structure

### Main Types

```typescript
// Portfolio Token
type PortfolioToken = {
    address: string
    balance: number
    balanceUSD: number
    symbol: string
}

// Portfolio by Network
type PortfolioForNetwork = {
    network: PortfolioNetworkInfo
    tokens: PortfolioToken[]
}

// Strategy
type Strategy = {
    name: string
    risk: StrategyRisk // 'low' | 'moderate' | 'high' | 'opportunistic'
    actions: StrategyAction[]
}

// Strategy Action
type StrategyAction = {
    tokens: string // "USDC, ETH"
    description: string
    platforms?: Array<{ name: string; url: string }>
    networks?: string[]
    operations?: string[]
    apy?: string // "5%", "8-10%"
    flags?: string[]
}

// AURA Response
type AuraResponse_01 = {
    address: string
    portfolio: PortfolioForNetwork[]
    strategies: LlmProcessOutput[]
}
```

## Integration in Your Project

### 1. AdEx AURA Public API

The public API is available at: `https://aura.adex.network/api/`

**Main endpoints:**
- **Portfolio Balances**: `GET /api/portfolio/balances?address={address}`
- **Portfolio Strategies**: `GET /api/portfolio/strategies?address={address}`

### 2. API Call

```javascript
// Example call to get strategies
const response = await fetch(`https://aura.adex.network/api/portfolio/strategies?address=${address}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
});

const data = await response.json();
```

### 3. Required Environment Variables

```bash
# AdEx AURA API Key (optional, for higher limits)
VITE_AURA_API_KEY=your_api_key_here

# API Base URL
VITE_AURA_API_BASE=https://aura.adex.network/api
```

### 4. Integration in Your Service

```javascript
// src/services/auraAPI.js
export const auraAPI = {
    async getPersonalizedRecommendations(address) {
        try {
            const response = await fetch(`https://aura.adex.network/api/portfolio/strategies?address=${address}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error calling AURA API:', error);
            throw error;
        }
    }
};
```

## Processing Flow

1. **Input**: Ethereum wallet address
2. **API Call**: GET call to `/api/portfolio/strategies?address={address}`
3. **Portfolio Analysis**: AURA analyzes the portfolio across multiple blockchain networks
4. **Strategy Generation**: Generates personalized strategies based on the portfolio
5. **Response**: Returns portfolio + structured strategies in JSON format

## Use Cases

### Empty Portfolio
If the address has no tokens, AURA returns predefined strategies:
- "Top up wallet with funds" (low risk)
- Recommendations to buy stablecoins or ETH

### Portfolio with Tokens
AURA analyzes tokens and generates personalized strategies:
- Staking specific tokens
- Liquidity provision on DEXs
- Yield farming on L2s
- Bridging between networks

## Network Configuration

AURA supports multiple EVM networks through `ambire-common`:
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- BSC
- And more...

## Error Handling

```javascript
// Example of robust handling
try {
    const recommendations = await auraAPI.getPersonalizedRecommendations(address);
    
    if (recommendations.strategies && recommendations.strategies.length > 0) {
        // Process recommendations
        return recommendations.strategies[0].response;
    } else {
        // Fallback to predefined strategies
        return getFallbackStrategies();
    }
} catch (error) {
    console.error('AURA API error:', error);
    // Local fallback
    return getLocalFallbackStrategies();
}
```

## Production Optimizations

1. **Caching**: Implement cache for AURA responses
2. **Rate Limiting**: Control call frequency
3. **Fallbacks**: Always have backup responses
4. **Monitoring**: Monitor API latency and errors
5. **Load Balancing**: For multiple AURA instances

## Complete Response Example

```json
{
    "address": "0x48Bdaa967c99f5f81430E94064B27a4917055f35",
    "portfolio": [
        {
            "network": {
                "name": "Ethereum",
                "chainId": "1",
                "platformId": "ethereum",
                "explorerUrl": "https://etherscan.io",
                "iconUrls": []
            },
            "tokens": [
                {
                    "symbol": "stkWALLET",
                    "balance": 418743.015,
                    "balanceUSD": 6324.65,
                    "network": "Ethereum",
                    "address": "0xE575cC6EC0B5d176127ac61aD2D3d9d19d1aa4a0"
                },
                {
                    "symbol": "ETH",
                    "balance": 0.033414660038225026,
                    "balanceUSD": 92.84530608901129,
                    "network": "Ethereum",
                    "address": "0x0000000000000000000000000000000000000000"
                }
            ]
        }
    ],
    "strategies": [
        {
            "llm": {
                "provider": "AdEx Aura",
                "model": "adex-aura-0.2"
            },
            "response": [
                {
                    "name": "Low Risk Stablecoin Yield",
                    "risk": "low",
                    "actions": [
                        {
                            "apy": "2-5%",
                            "description": "Deposit USDC on Aave on the Base network...",
                            "networks": ["base"],
                            "operations": ["lending"],
                            "platforms": [
                                {
                                    "name": "Aave",
                                    "url": "https://app.aave.com/"
                                }
                            ],
                            "tokens": "USDC"
                        }
                    ]
                }
            ],
            "responseTime": 1,
            "error": null
        }
    ],
    "cached": false,
    "version": "0.2.6"
}
```

## Next Steps

1. **Configure environment variables** with the correct API URL
2. **Update code** to use the correct endpoints
3. **Test with real addresses** to validate functionality
4. **Implement appropriate error handling**
5. **Optimize for production** with caching and rate limiting

This integration will allow you to leverage the power of AURA to generate personalized recommendations based on real user portfolio analysis using the public AdEx API.

## References

- [Official AdEx AURA API Documentation](https://guide.adex.network/adex-aura-api/)
- [Portfolio Strategies Endpoint](https://guide.adex.network/adex-aura-api/api-endpoints/portfolio-strategies)
- [Portfolio Balances Endpoint](https://guide.adex.network/adex-aura-api/api-endpoints/portfolio-balances)
- [Quickstart Guide](https://guide.adex.network/adex-aura-api/quickstart)
