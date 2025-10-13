import { marketDataService } from '../marketData'

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn()
}))

describe('MarketDataService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getMarketOverview', () => {
    it('should return market overview data', async () => {
      const result = await marketDataService.getMarketOverview()

      expect(result).toHaveProperty('bitcoin')
      expect(result).toHaveProperty('ethereum')
      expect(result).toHaveProperty('totalMarketCap')
      expect(result).toHaveProperty('totalVolume')
      expect(result).toHaveProperty('fearGreedIndex')
      expect(result).toHaveProperty('dominance')

      expect(result.bitcoin).toHaveProperty('price')
      expect(result.bitcoin).toHaveProperty('change24h')
      expect(result.dominance).toHaveProperty('bitcoin')
      expect(result.dominance).toHaveProperty('ethereum')
      expect(result.dominance).toHaveProperty('others')
    })
  })

  describe('getTokenPrices', () => {
    it('should return token prices for given symbols', async () => {
      const symbols = ['bitcoin', 'ethereum', 'cardano']
      const result = await marketDataService.getTokenPrices(symbols)

      expect(result).toHaveProperty('bitcoin')
      expect(result).toHaveProperty('ethereum')
      expect(result).toHaveProperty('cardano')

      expect(result.bitcoin).toHaveProperty('usd')
      expect(result.bitcoin).toHaveProperty('usd_24h_change')
      expect(result.ethereum).toHaveProperty('usd')
      expect(result.ethereum).toHaveProperty('usd_24h_change')
    })

    it('should return empty object when API fails', async () => {
      require('axios').get.mockRejectedValue(new Error('API Error'))

      const result = await marketDataService.getTokenPrices(['bitcoin'])
      expect(result).toEqual({})
    })
  })

  describe('getHistoricalData', () => {
    it('should return historical data for Bitcoin with 7 days', async () => {
      const result = await marketDataService.getHistoricalData('bitcoin', 7)

      expect(result).toHaveLength(8) // 7 days + today
      expect(result[0]).toHaveProperty('date')
      expect(result[0]).toHaveProperty('price')
      expect(result[0]).toHaveProperty('volume')

      // Check that dates are in correct format
      expect(result[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should return historical data for Ethereum with 30 days', async () => {
      const result = await marketDataService.getHistoricalData('ethereum', 30)

      expect(result).toHaveLength(31) // 30 days + today
      expect(result[0]).toHaveProperty('date')
      expect(result[0]).toHaveProperty('price')
      expect(result[0]).toHaveProperty('volume')
    })

    it('should return empty array when API fails', async () => {
      require('axios').get.mockRejectedValue(new Error('API Error'))

      const result = await marketDataService.getHistoricalData('bitcoin', 7)
      expect(result).toEqual([])
    })
  })

  describe('getMarketNews', () => {
    it('should return market news', async () => {
      const result = await marketDataService.getMarketNews()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)

      result.forEach(article => {
        expect(article).toHaveProperty('id')
        expect(article).toHaveProperty('title')
        expect(article).toHaveProperty('summary')
        expect(article).toHaveProperty('source')
        expect(article).toHaveProperty('publishedAt')
        expect(article).toHaveProperty('sentiment')

        expect(['positive', 'negative', 'neutral']).toContain(article.sentiment)
      })
    })

    it('should return empty array when API fails', async () => {
      require('axios').get.mockRejectedValue(new Error('API Error'))

      const result = await marketDataService.getMarketNews()
      expect(result).toEqual([])
    })
  })

  describe('getTechnicalAnalysis', () => {
    it('should return technical analysis for Bitcoin', async () => {
      const result = await marketDataService.getTechnicalAnalysis('bitcoin')

      expect(result).toHaveProperty('symbol', 'bitcoin')
      expect(result).toHaveProperty('indicators')
      expect(result).toHaveProperty('signals')
      expect(result).toHaveProperty('support')
      expect(result).toHaveProperty('resistance')

      expect(result.indicators).toHaveProperty('rsi')
      expect(result.indicators).toHaveProperty('macd')
      expect(result.indicators).toHaveProperty('bollinger')
      expect(result.indicators).toHaveProperty('movingAverages')

      expect(result.signals).toHaveProperty('trend')
      expect(result.signals).toHaveProperty('strength')
      expect(result.signals).toHaveProperty('recommendation')
    })

    it('should return null when API fails', async () => {
      require('axios').get.mockRejectedValue(new Error('API Error'))

      const result = await marketDataService.getTechnicalAnalysis('bitcoin')
      expect(result).toBeNull()
    })
  })

  describe('calculatePortfolioMetrics', () => {
    it('should calculate metrics for empty portfolio', () => {
      const result = marketDataService.calculatePortfolioMetrics([], 1000)

      expect(result).toHaveProperty('diversity', 0)
      expect(result).toHaveProperty('riskScore', 0)
      expect(result).toHaveProperty('volatility', 0)
    })

    it('should calculate metrics for portfolio with tokens', () => {
      const tokens = [
        { symbol: 'BTC' },
        { symbol: 'ETH' },
        { symbol: 'USDC' }
      ]

      const result = marketDataService.calculatePortfolioMetrics(tokens, 50000)

      expect(result).toHaveProperty('diversity')
      expect(result).toHaveProperty('riskScore')
      expect(result).toHaveProperty('volatility')
      expect(result).toHaveProperty('recommendation')

      expect(result.diversity).toBeGreaterThan(0)
      expect(result.riskScore).toBeGreaterThan(0)
      expect(result.volatility).toBeGreaterThan(0)
      expect(['low_risk', 'medium_risk', 'high_risk']).toContain(result.recommendation)
    })

    it('should identify high-risk tokens correctly', () => {
      const highRiskTokens = [
        { symbol: 'MEME' },
        { symbol: 'DOGE' },
        { symbol: 'SHIB' }
      ]

      const result = marketDataService.calculatePortfolioMetrics(highRiskTokens, 1000)
      expect(result.riskScore).toBeGreaterThan(0.6)
      expect(result.recommendation).toBe('high_risk')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with default decimals', () => {
      expect(marketDataService.formatNumber(1000)).toBe('1.00K')
      expect(marketDataService.formatNumber(1000000)).toBe('1.00M')
      expect(marketDataService.formatNumber(1000000000)).toBe('1.00B')
      expect(marketDataService.formatNumber(1000000000000)).toBe('1.00T')
      expect(marketDataService.formatNumber(500)).toBe('500.00')
    })

    it('should format numbers with custom decimals', () => {
      expect(marketDataService.formatNumber(1000, 0)).toBe('1K')
      expect(marketDataService.formatNumber(1000000, 1)).toBe('1.0M')
      expect(marketDataService.formatNumber(500, 3)).toBe('500.000')
    })
  })

  describe('formatPercentage', () => {
    it('should format positive percentages', () => {
      expect(marketDataService.formatPercentage(5.25)).toBe('+5.25%')
      expect(marketDataService.formatPercentage(0)).toBe('+0.00%')
    })

    it('should format negative percentages', () => {
      expect(marketDataService.formatPercentage(-3.75)).toBe('-3.75%')
    })

    it('should format percentages with custom decimals', () => {
      expect(marketDataService.formatPercentage(5.12345, 1)).toBe('+5.1%')
      expect(marketDataService.formatPercentage(-2.98765, 3)).toBe('-2.988%')
    })
  })
})

