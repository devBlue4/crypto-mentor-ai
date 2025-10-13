import { useState, lazy, Suspense } from 'react'
import { TrendingUp, MessageCircle, AlertTriangle, BookOpen, BarChart3, Settings, Activity, Star, History } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

// Lazy load components for better performance
const Portfolio = lazy(() => import('./Portfolio'))
const ChatInterface = lazy(() => import('./ChatInterface'))
const MarketOverview = lazy(() => import('./MarketOverview'))
const AlertsPanel = lazy(() => import('./AlertsPanel'))
const EducationSection = lazy(() => import('./EducationSection'))
const CacheManager = lazy(() => import('./CacheManager'))
const PerformanceMonitor = lazy(() => import('./PerformanceMonitor'))
const Watchlist = lazy(() => import('./Watchlist'))
const TransactionHistory = lazy(() => import('./TransactionHistory'))

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { isConnected } = useWallet()

        const tabs = [
          {
            id: 'overview',
            name: 'Overview',
            icon: BarChart3,
            component: MarketOverview
          },
          {
            id: 'portfolio',
            name: 'Portfolio',
            icon: TrendingUp,
            component: Portfolio,
            requiresWallet: true
          },
          {
            id: 'chat',
            name: 'AI Chat',
            icon: MessageCircle,
            component: ChatInterface
          },
          {
            id: 'alerts',
            name: 'Alerts',
            icon: AlertTriangle,
            component: AlertsPanel
          },
          {
            id: 'education',
            name: 'Education',
            icon: BookOpen,
            component: EducationSection
          },
          {
            id: 'cache',
            name: 'Cache Manager',
            icon: Settings,
            component: CacheManager
          },
          {
            id: 'performance',
            name: 'Performance',
            icon: Activity,
            component: PerformanceMonitor
          },
          {
            id: 'watchlist',
            name: 'Watchlist',
            icon: Star,
            component: Watchlist
          },
          {
            id: 'history',
            name: 'History',
            icon: History,
            component: TransactionHistory
          }
        ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to CryptoMentor AI! 🚀
            </h2>
            <p className="text-gray-600">
              Your intelligent assistant for cryptocurrency analysis and Web3 trading
            </p>
          </div>
          {isConnected && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Wallet Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              const isDisabled = tab.requiresWallet && !isConnected
              
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  disabled={isDisabled}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : isDisabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {isDisabled && (
                    <span className="text-xs text-gray-400">(Requires Wallet)</span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Active Component */}
      <div className="min-h-96">
        {ActiveComponent && (
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          }>
            <ActiveComponent />
          </Suspense>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Crypto Market</p>
              <p className="text-2xl font-bold text-gray-900">+2.5%</p>
              <p className="text-xs text-green-600">Last 24h</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">AI AURA</p>
              <p className="text-2xl font-bold text-gray-900">Active</p>
              <p className="text-xs text-green-600">Ready to help</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-blue-600">Configured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
