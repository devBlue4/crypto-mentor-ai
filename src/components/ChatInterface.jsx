import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, RefreshCw, MessageCircle, Sparkles } from 'lucide-react'
import { useAura } from '../contexts/AuraContext'
import { useWallet } from '../contexts/WalletContext'
import toast from 'react-hot-toast'

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const { conversation, isLoading, sendMessage, clearConversation, getPersonalizedRecommendations } = useAura()
  const { isConnected, tokens, balance } = useWallet()

  // Auto-scroll to end of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  // Welcome messages (aligned with strategies/recommendations by account address)
  const welcomeMessages = [
    "Hello! I'm the CryptoMentor AI Agent. How can I help you today?",
    "I can assist with market analysis, portfolio insights, and education — and I can take an account address and output a list of app recommendations and strategies in natural language, with a short description of what each one does.",
    "Paste an address (0x...) or ask anything about trading."
  ]

  // Send message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const message = inputMessage.trim()
    setInputMessage('')
    setIsTyping(true)

    try {
      // If the message contains an Ethereum address, return recommendations/strategies
      const addressMatch = message.match(/0x[a-fA-F0-9]{40}/)
      if (addressMatch) {
        const address = addressMatch[0]
        const short = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
        let items = []
        try {
          const ai = await getPersonalizedRecommendations({ address, timeframe: '30d' })
          if (Array.isArray(ai?.immediate_actions)) items = items.concat(ai.immediate_actions)
          if (Array.isArray(ai?.long_term_strategy)) items = items.concat(ai.long_term_strategy)
          if (Array.isArray(ai?.risk_management)) items = items.concat(ai.risk_management)
        } catch (_) {
          // ignore and fall back
        }

        if (items.length === 0) {
          items = [
            'DCA on BTC/ETH: Invest a fixed amount weekly to smooth volatility and avoid bad timing.',
            'Set smart price alerts: Track key support/resistance so you can react quickly when levels break.',
            'Quarterly rebalance: Keep a target split (e.g., 50% BTC/ETH, 30% alts, 20% stables) to control risk.'
          ]
        }

        const content = `Here are app recommendations and strategies for address ${short(address)}:\n\n` +
          items.map((it, i) => `${i + 1}. ${it}`).join('\n')

        const auraMessage = {
          id: Date.now() + 1,
          type: 'aura',
          content,
          timestamp: new Date()
        }
        setConversation(prev => [...prev, auraMessage])
        return
      }

      // Create context based on user's portfolio
      const context = {
        hasWallet: isConnected,
        tokenCount: tokens?.length || 0,
        hasBalance: parseFloat(balance || '0') > 0,
        tokens: tokens?.map(t => t.symbol) || []
      }

      await sendMessage(message, context)
    } catch (error) {
      toast.error('Error sending message')
    } finally {
      setIsTyping(false)
    }
  }

  // Handle Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Example messages
  const exampleMessages = [
    { label: "How is the market today?", value: "How is the market today?" },
    { label: "Analyze my portfolio", value: "Analyze my portfolio" },
    { label: "What cryptocurrencies do you recommend?", value: "What cryptocurrencies do you recommend?" },
    { label: "Explain what DeFi is", value: "Explain what DeFi is" },
    {
      label: "Analyze address 0x1C680f...32ab and give app recommendations and strategies with descriptions",
      value: "Analyze address 0x1C680f16b2270e324D5778305C9EC96784c832ab and give app recommendations and strategies with descriptions"
    }
  ]

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">CryptoMentor AI Agent</h3>
            <p className="text-sm text-gray-600">Powered by AdEx AURA — analyzes your account address and suggests personalized app strategies with natural-language explanations.</p>
          </div>
        </div>
        
        <button
          onClick={clearConversation}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
        {conversation.length === 0 ? (
          <div className="space-y-4">
            {/* Welcome message */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 max-w-3xl">
                <div className="space-y-2">
                  {welcomeMessages.map((msg, index) => (
                    <p key={index} className="text-gray-700">{msg}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Example messages */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Example questions:</p>
              <div className="flex flex-wrap gap-2">
                {exampleMessages.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(example.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {conversation.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary-600' 
                    : 'bg-gradient-to-r from-purple-500 to-purple-700'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`rounded-lg p-4 shadow-sm border max-w-3xl ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : message.isError
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-white text-gray-900 border-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* AURA Analysis */}
                  {message.analysis && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Analysis:</span>
                      </div>
                      <p className="text-sm text-gray-600">{message.analysis}</p>
                    </div>
                  )}
                  
                  {/* Recommendations */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {message.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                            <span className="text-primary-600 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or paste an account address (0x...) for recommendations..."
            className="input-field pr-12"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>{isLoading ? 'Sending...' : 'Send'}</span>
        </button>
      </div>

      {/* Wallet Status */}
      {isConnected && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700 font-medium">
              Wallet connected - CryptoMentor AI can analyze your portfolio
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatInterface
