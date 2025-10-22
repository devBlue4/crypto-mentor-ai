import { useState, lazy, Suspense } from 'react'
import { TrendingUp, MessageCircle, AlertTriangle, BookOpen, BarChart3 } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

// Lazy load components for better performance
const Portfolio = lazy(() => import('./Portfolio'))
const ChatInterface = lazy(() => import('./ChatInterface'))
const MarketOverview = lazy(() => import('./MarketOverview'))
const AlertsPanel = lazy(() => import('./AlertsPanel'))
const EducationSection = lazy(() => import('./EducationSection'))
// Removed tabs: CacheManager, PerformanceMonitor, Watchlist, TransactionHistory

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
          }
        ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-card text-card-foreground border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome to CryptoMentor AI! 🚀
            </h2>
            <p className="text-muted-foreground">
              Your intelligent assistant for cryptocurrency analysis and Web3 trading
            </p>
          </div>
          {isConnected && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-accent border border-accent rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-accent-foreground">Wallet Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-transparent text-card-foreground rounded-xl">
        <div className="p-0">
          <nav className="flex w-full gap-3 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              const isDisabled = tab.requiresWallet && !isConnected

              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  disabled={isDisabled}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/15 text-primary shadow-sm'
                      : isDisabled
                      ? 'bg-transparent text-muted-foreground cursor-not-allowed opacity-60'
                      : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span>{tab.name}</span>
                  {isDisabled && (
                    <span className="text-xs text-muted-foreground">(Requires Wallet)</span>
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
        <div className="bg-card text-card-foreground border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Crypto Market</p>
              <p className="text-2xl font-bold text-foreground">+2.5%</p>
              <p className="text-xs text-chart-1">Last 24h</p>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-chart-2/10 rounded-lg">
              <MessageCircle className="w-6 h-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">AI AURA</p>
              <p className="text-2xl font-bold text-foreground">Active</p>
              <p className="text-xs text-chart-2">Ready to help</p>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-chart-3/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-chart-3" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Alerts</p>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-chart-3">Configured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
