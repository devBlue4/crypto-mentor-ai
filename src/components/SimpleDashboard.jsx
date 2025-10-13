import { useState } from 'react'
import { TrendingUp, MessageCircle, AlertTriangle, BookOpen, BarChart3 } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { useAura } from '../contexts/AuraContext'

const SimpleDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { isConnected, account, balance } = useWallet()
  const { sendMessage, conversation } = useAura()
  const [message, setMessage] = useState('')

  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: BarChart3,
      requiresWallet: false
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      icon: TrendingUp,
      requiresWallet: true
    },
    {
      id: 'chat',
      name: 'AI Chat',
      icon: MessageCircle,
      requiresWallet: false
    },
    {
      id: 'alerts',
      name: 'Alerts',
      icon: AlertTriangle,
      requiresWallet: false
    },
    {
      id: 'education',
      name: 'Education',
      icon: BookOpen,
      requiresWallet: false
    }
  ]

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message)
      setMessage('')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Bitcoin</h3>
                  <p className="text-2xl font-bold text-green-600">$43,250</p>
                  <p className="text-sm text-green-600">+2.5%</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Ethereum</h3>
                  <p className="text-2xl font-bold text-blue-600">$2,580</p>
                  <p className="text-sm text-blue-600">+1.8%</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">Market Cap</h3>
                  <p className="text-2xl font-bold text-purple-600">$1.65T</p>
                  <p className="text-sm text-purple-600">+3.2%</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'portfolio':
        if (!isConnected) {
          return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
              <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect your wallet to view your portfolio
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Connect Wallet
              </button>
            </div>
          )
        }
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Your Portfolio</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium">ETH Balance</span>
                <span className="font-bold">{balance} ETH</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
              </div>
            </div>
          </div>
        )
      
      case 'chat':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">AI Chat with AURA</h2>
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                {conversation.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    Start a conversation with AURA...
                  </p>
                ) : (
                  conversation.map((msg) => (
                    <div key={msg.id} className={`mb-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded-lg max-w-xs ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask AURA anything..."
                  className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )
      
      case 'alerts':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Price Alerts</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Set up personalized price alerts for your favorite cryptocurrencies.
            </p>
          </div>
        )
      
      case 'education':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Crypto Education</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">What is Bitcoin?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Bitcoin is the first and most well-known cryptocurrency...
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">Understanding DeFi</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Decentralized Finance (DeFi) is a financial system...
                </p>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <nav className="flex space-x-1 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isDisabled = tab.requiresWallet && !isConnected
            
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isDisabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}

export default SimpleDashboard
