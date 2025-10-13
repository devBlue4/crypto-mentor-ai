import { createContext, useContext, useState } from 'react'
import { auraAPI } from '../services/auraAPI'

const AuraContext = createContext()

export const useAura = () => {
  const context = useContext(AuraContext)
  if (!context) {
    throw new Error('useAura must be used within AuraProvider')
  }
  return context
}

export const AuraProvider = ({ children }) => {
  const [conversation, setConversation] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [portfolioAnalysis, setPortfolioAnalysis] = useState(null)
  const [marketInsights, setMarketInsights] = useState(null)

  // Send message to AURA
  const sendMessage = async (message, context = {}) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setConversation(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await auraAPI.sendMessage(message, context)
      
      const auraMessage = {
        id: Date.now() + 1,
        type: 'aura',
        content: response.content,
        timestamp: new Date(),
        analysis: response.analysis,
        recommendations: response.recommendations
      }

      setConversation(prev => [...prev, auraMessage])
      return auraMessage
    } catch (error) {
      console.error('Error sending message to AURA:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'aura',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date(),
        isError: true
      }

      setConversation(prev => [...prev, errorMessage])
      return errorMessage
    } finally {
      setIsLoading(false)
    }
  }

  // Analyze portfolio
  const analyzePortfolio = async (tokens, balance) => {
    setIsLoading(true)
    try {
      const analysis = await auraAPI.analyzePortfolio(tokens, balance)
      setPortfolioAnalysis(analysis)
      return analysis
    } catch (error) {
      console.error('Error analyzing portfolio:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get market insights
  const getMarketInsights = async () => {
    setIsLoading(true)
    try {
      const insights = await auraAPI.getMarketInsights()
      setMarketInsights(insights)
      return insights
    } catch (error) {
      console.error('Error getting insights:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Clear conversation
  const clearConversation = () => {
    setConversation([])
  }

  // Get personalized recommendations
  const getPersonalizedRecommendations = async (userProfile) => {
    setIsLoading(true)
    try {
      const recommendations = await auraAPI.getPersonalizedRecommendations(userProfile)
      return recommendations
    } catch (error) {
      console.error('Error getting recommendations:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    conversation,
    isLoading,
    portfolioAnalysis,
    marketInsights,
    sendMessage,
    analyzePortfolio,
    getMarketInsights,
    clearConversation,
    getPersonalizedRecommendations
  }

  return (
    <AuraContext.Provider value={value}>
      {children}
    </AuraContext.Provider>
  )
}
