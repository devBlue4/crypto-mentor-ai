# Guía de Integración de AdEx AURA API

## Resumen Ejecutivo

AdEx AURA es un framework de agente de IA personal y motor de recomendaciones que analiza datos públicamente disponibles de Ethereum y blockchains de Layer 2. Procesa estos datos a través de un modelo de lenguaje grande (LLM) para generar recomendaciones personalizadas de acciones o aplicaciones basadas en el comportamiento del usuario.

**Funcionalidad Principal**: AURA toma una dirección de cuenta y genera una lista de recomendaciones de aplicaciones y estrategias en lenguaje natural, con descripciones de lo que hace cada una.

## Arquitectura del Sistema

### Componentes Principales

1. **Portfolio Analyzer** (`lib/utils/portfolio.ts`)
   - Obtiene datos del portfolio desde múltiples redes blockchain
   - Utiliza `ambire-common` para interactuar con RPCs
   - Soporta múltiples redes EVM

2. **LLM Processors** (`lib/utils/llm/`)
   - **Gemini**: Integración con Google Gemini AI
   - **Grok**: Integración con Grok AI
   - **Mocked AI**: Respuestas de demostración para desarrollo

3. **Strategy Engine** (`lib/utils/strategies.ts`)
   - Define estrategias predefinidas para portfolios vacíos
   - Estructura de datos para recomendaciones

4. **API Server** (`app/index.ts`)
   - Servidor Express en puerto 3420
   - Endpoint POST `/` para procesar direcciones

## Estructura de Datos

### Tipos Principales

```typescript
// Portfolio Token
type PortfolioToken = {
    address: string
    balance: number
    balanceUSD: number
    symbol: string
}

// Portfolio por Red
type PortfolioForNetwork = {
    network: PortfolioNetworkInfo
    tokens: PortfolioToken[]
}

// Estrategia
type Strategy = {
    name: string
    risk: StrategyRisk // 'low' | 'moderate' | 'high' | 'opportunistic'
    actions: StrategyAction[]
}

// Acción de Estrategia
type StrategyAction = {
    tokens: string // "USDC, ETH"
    description: string
    platforms?: Array<{ name: string; url: string }>
    networks?: string[]
    operations?: string[]
    apy?: string // "5%", "8-10%"
    flags?: string[]
}

// Respuesta de AURA
type AuraResponse_01 = {
    address: string
    portfolio: PortfolioForNetwork[]
    strategies: LlmProcessOutput[]
}
```

## Integración en tu Proyecto

### 1. API Pública de AdEx AURA

La API pública está disponible en: `https://aura.adex.network/api/`

**Endpoints principales:**
- **Portfolio Balances**: `GET /api/portfolio/balances?address={address}`
- **Portfolio Strategies**: `GET /api/portfolio/strategies?address={address}`

### 2. Llamada a la API

```javascript
// Ejemplo de llamada para obtener estrategias
const response = await fetch(`https://aura.adex.network/api/portfolio/strategies?address=${address}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
});

const data = await response.json();
```

### 3. Variables de Entorno Requeridas

```bash
# API Key de AdEx AURA (opcional, para límites más altos)
VITE_AURA_API_KEY=tu_api_key_aqui

# Base URL de la API
VITE_AURA_API_BASE=https://aura.adex.network/api
```

### 4. Integración en tu Servicio

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

## Flujo de Procesamiento

1. **Input**: Dirección de wallet Ethereum
2. **API Call**: Llamada GET a `/api/portfolio/strategies?address={address}`
3. **Portfolio Analysis**: AURA analiza el portfolio en múltiples redes blockchain
4. **Strategy Generation**: Genera estrategias personalizadas basadas en el portfolio
5. **Response**: Devuelve portfolio + estrategias estructuradas en formato JSON

## Casos de Uso

### Portfolio Vacío
Si la dirección no tiene tokens, AURA devuelve estrategias predefinidas:
- "Top up wallet with funds" (riesgo bajo)
- Recomendaciones para comprar stablecoins o ETH

### Portfolio con Tokens
AURA analiza los tokens y genera estrategias personalizadas:
- Staking de tokens específicos
- Liquidity provision en DEXs
- Yield farming en L2s
- Bridging entre redes

## Configuración de Redes

AURA soporta múltiples redes EVM a través de `ambire-common`:
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- BSC
- Y más...

## Manejo de Errores

```javascript
// Ejemplo de manejo robusto
try {
    const recommendations = await auraAPI.getPersonalizedRecommendations(address);
    
    if (recommendations.strategies && recommendations.strategies.length > 0) {
        // Procesar recomendaciones
        return recommendations.strategies[0].response;
    } else {
        // Fallback a estrategias predefinidas
        return getFallbackStrategies();
    }
} catch (error) {
    console.error('AURA API error:', error);
    // Fallback local
    return getLocalFallbackStrategies();
}
```

## Optimizaciones para Producción

1. **Caching**: Implementar cache para respuestas de AURA
2. **Rate Limiting**: Controlar frecuencia de llamadas
3. **Fallbacks**: Siempre tener respuestas de respaldo
4. **Monitoring**: Monitorear latencia y errores de la API
5. **Load Balancing**: Para múltiples instancias de AURA

## Ejemplo de Respuesta Completa

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

## Próximos Pasos

1. **Configurar las variables de entorno** con la URL correcta de la API
2. **Actualizar el código** para usar los endpoints correctos
3. **Probar con direcciones reales** para validar funcionamiento
4. **Implementar manejo de errores** apropiado
5. **Optimizar para producción** con caching y rate limiting

Esta integración te permitirá aprovechar el poder de AURA para generar recomendaciones personalizadas basadas en el análisis real del portfolio del usuario usando la API pública de AdEx.

## Referencias

- [Documentación oficial de AdEx AURA API](https://guide.adex.network/adex-aura-api/)
- [Endpoint Portfolio Strategies](https://guide.adex.network/adex-aura-api/api-endpoints/portfolio-strategies)
- [Endpoint Portfolio Balances](https://guide.adex.network/adex-aura-api/api-endpoints/portfolio-balances)
- [Quickstart Guide](https://guide.adex.network/adex-aura-api/quickstart)
