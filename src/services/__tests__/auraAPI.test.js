import { auraAPI } from '../auraAPI'

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn()
  }))
}))

// Mock environment variables
process.env.VITE_AURA_API_KEY = 'test-api-key'

describe('AuraAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sendMessage', () => {
    it('should send message successfully with API key', async () => {
      const mockResponse = {
        data: {
          response: 'Hello! How can I help you?',
          analysis: { sentiment: 'positive', confidence: 0.9 },
          recommendations: ['Consider diversifying your portfolio'],
          confidence: 0.9
        }
      }

      const mockAxiosClient = {
        post: jest.fn().mockResolvedValue(mockResponse)
      }

      require('axios').create.mockReturnValue(mockAxiosClient)

      const result = await auraAPI.sendMessage('Hello', { hasWallet: true })

      expect(result).toEqual({
        content: 'Hello! How can I help you?',
        analysis: { sentiment: 'positive', confidence: 0.9 },
        recommendations: ['Consider diversifying your portfolio'],
        confidence: 0.9
      })

      expect(mockAxiosClient.post).toHaveBeenCalledWith('/chat', {
        message: 'Hello',
        context: {
          user_type: 'crypto_enthusiast',
          experience_level: 'intermediate',
          interests: ['trading', 'portfolio_management', 'market_analysis'],
          hasWallet: true
        },
        options: {
          include_analysis: true,
          include_recommendations: true,
          language: 'en'
        }
      })
    })

    it('should use demo response when no API key', async () => {
      // Temporarily remove API key
      const originalApiKey = process.env.VITE_AURA_API_KEY
      delete process.env.VITE_AURA_API_KEY

      const result = await auraAPI.sendMessage('hello')

      expect(result.content).toContain("Hello! I'm AURA")
      expect(result.analysis).toBeDefined()
      expect(result.recommendations).toBeDefined()

      // Restore API key
      process.env.VITE_AURA_API_KEY = originalApiKey
    })

    it('should handle API errors gracefully', async () => {
      const mockAxiosClient = {
        post: jest.fn().mockRejectedValue(new Error('API Error'))
      }

      require('axios').create.mockReturnValue(mockAxiosClient)

      await expect(auraAPI.sendMessage('Hello')).rejects.toThrow('API Error')
    })
  })

  describe('analyzePortfolio', () => {
    it('should analyze portfolio successfully', async () => {
      const mockResponse = {
        data: {
          total_value_usd: 50000,
          diversity_score: 8.5,
          risk_level: 'medium',
          recommendations: ['Consider adding Bitcoin']
        }
      }

      const mockAxiosClient = {
        post: jest.fn().mockResolvedValue(mockResponse)
      }

      require('axios').create.mockReturnValue(mockAxiosClient)

      const tokens = [{ symbol: 'ETH', balance: '10', value_usd: 25000 }]
      const balance = '5.0'

      const result = await auraAPI.analyzePortfolio(tokens, balance)

      expect(result).toEqual(mockResponse.data)
      expect(mockAxiosClient.post).toHaveBeenCalledWith('/analyze/portfolio', {
        tokens: [{ symbol: 'ETH', balance: '10', value_usd: 25000 }],
        total_balance_eth: 5,
        portfolio_diversity: expect.any(Number),
        risk_level: expect.any(String)
      })
    })

    it('should use demo analysis when no API key', async () => {
      const originalApiKey = process.env.VITE_AURA_API_KEY
      delete process.env.VITE_AURA_API_KEY

      const tokens = [{ symbol: 'ETH', balance: '2.5' }]
      const balance = '2.5'

      const result = await auraAPI.analyzePortfolio(tokens, balance)

      expect(result).toHaveProperty('total_value_usd')
      expect(result).toHaveProperty('diversity_score')
      expect(result).toHaveProperty('risk_level')
      expect(result).toHaveProperty('recommendations')

      process.env.VITE_AURA_API_KEY = originalApiKey
    })
  })

  describe('getMarketInsights', () => {
    it('should get market insights successfully', async () => {
      const mockResponse = {
        data: {
          overall_sentiment: 'bullish',
          market_cap_change: '+5.2%',
          fear_greed_index: 70
        }
      }

      const mockAxiosClient = {
        get: jest.fn().mockResolvedValue(mockResponse)
      }

      require('axios').create.mockReturnValue(mockAxiosClient)

      const result = await auraAPI.getMarketInsights()

      expect(result).toEqual(mockResponse.data)
      expect(mockAxiosClient.get).toHaveBeenCalledWith('/market/insights', {
        params: {
          timeframe: '24h',
          include_sentiment: true,
          include_technical: true
        }
      })
    })

    it('should use demo insights when no API key', async () => {
      const originalApiKey = process.env.VITE_AURA_API_KEY
      delete process.env.VITE_AURA_API_KEY

      const result = await auraAPI.getMarketInsights()

      expect(result).toHaveProperty('overall_sentiment')
      expect(result).toHaveProperty('market_cap_change')
      expect(result).toHaveProperty('fear_greed_index')

      process.env.VITE_AURA_API_KEY = originalApiKey
    })
  })

  describe('getPersonalizedRecommendations', () => {
    it('should get personalized recommendations successfully', async () => {
      const mockResponse = {
        data: {
          immediate_actions: ['Review your portfolio'],
          long_term_strategy: ['Consider DeFi exposure']
        }
      }

      const mockAxiosClient = {
        post: jest.fn().mockResolvedValue(mockResponse)
      }

      require('axios').create.mockReturnValue(mockAxiosClient)

      const userProfile = { risk_tolerance: 'medium', experience: 'intermediate' }
      const result = await auraAPI.getPersonalizedRecommendations(userProfile)

      expect(result).toEqual(mockResponse.data)
      expect(mockAxiosClient.post).toHaveBeenCalledWith('/recommendations/personalized', userProfile)
    })

    it('should use demo recommendations when no API key', async () => {
      const originalApiKey = process.env.VITE_AURA_API_KEY
      delete process.env.VITE_AURA_API_KEY

      const userProfile = { risk_tolerance: 'medium' }
      const result = await auraAPI.getPersonalizedRecommendations(userProfile)

      expect(result).toHaveProperty('immediate_actions')
      expect(result).toHaveProperty('long_term_strategy')
      expect(result).toHaveProperty('risk_management')

      process.env.VITE_AURA_API_KEY = originalApiKey
    })
  })

  describe('setupSmartAlerts', () => {
    it('should setup smart alerts successfully', async () => {
      const mockResponse = {
        data: { success: true, alert_id: 'alert_123' }
      }

      const mockAxiosClient = {
        post: jest.fn().mockResolvedValue(mockResponse)
      }

      require('axios').create.mockReturnValue(mockAxiosClient)

      const alertConfig = { type: 'price', symbol: 'BTC', condition: 'above', value: 50000 }
      const result = await auraAPI.setupSmartAlerts(alertConfig)

      expect(result).toEqual(mockResponse.data)
      expect(mockAxiosClient.post).toHaveBeenCalledWith('/alerts/smart', alertConfig)
    })

    it('should return demo response when no API key', async () => {
      const originalApiKey = process.env.VITE_AURA_API_KEY
      delete process.env.VITE_AURA_API_KEY

      const alertConfig = { type: 'price', symbol: 'BTC' }
      const result = await auraAPI.setupSmartAlerts(alertConfig)

      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('alert_id')

      process.env.VITE_AURA_API_KEY = originalApiKey
    })
  })

  describe('Demo Response Methods', () => {
    it('getDemoResponse should return appropriate response for different messages', () => {
      const helloResponse = auraAPI.getDemoResponse('hello')
      expect(helloResponse.content).toContain("Hello! I'm AURA")

      const btcResponse = auraAPI.getDemoResponse('bitcoin price')
      expect(btcResponse.content).toContain('Bitcoin price')

      const portfolioResponse = auraAPI.getDemoResponse('portfolio')
      expect(portfolioResponse.content).toContain('diversified portfolio')

      const defaultResponse = auraAPI.getDemoResponse('random message')
      expect(defaultResponse.content).toContain('Interesting question')
    })

    it('calculateDiversity should return correct diversity score', () => {
      expect(auraAPI.calculateDiversity([])).toBe(0)
      expect(auraAPI.calculateDiversity([{ symbol: 'BTC' }])).toBe(1)
      expect(auraAPI.calculateDiversity([{ symbol: 'BTC' }, { symbol: 'ETH' }])).toBe(0.6)
      expect(auraAPI.calculateDiversity(new Array(10).fill({ symbol: 'TOKEN' }))).toBe(10)
    })

    it('calculateRiskLevel should return correct risk level', () => {
      const lowRiskTokens = [{ symbol: 'BTC' }, { symbol: 'ETH' }]
      expect(auraAPI.calculateRiskLevel(lowRiskTokens)).toBe('medium')

      const highRiskTokens = [{ symbol: 'MEME' }, { symbol: 'DOGE' }]
      expect(auraAPI.calculateRiskLevel(highRiskTokens)).toBe('high')
    })
  })
})

