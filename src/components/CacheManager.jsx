import { useState, useEffect } from 'react'
import { Trash2, RefreshCw, BarChart3, Clock, Database } from 'lucide-react'
import { cacheManager } from '../services/cache'

const CacheManager = () => {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    const cacheStats = cacheManager.getAllStats()
    setStats(cacheStats)
  }

  const clearAllCaches = async () => {
    setIsLoading(true)
    try {
      cacheManager.clearAll()
      loadStats()
    } catch (error) {
      console.error('Error clearing caches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const cleanupExpired = async () => {
    setIsLoading(true)
    try {
      const cleanupStats = cacheManager.cleanupAll()
      console.log('Cleanup completed:', cleanupStats)
      loadStats()
    } catch (error) {
      console.error('Error cleaning up caches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!stats) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading cache statistics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cache Management</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={cleanupExpired}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Cleanup</span>
            </button>
            <button
              onClick={clearAllCaches}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CacheStatCard
            title="Market Data"
            stats={stats.marketData}
            icon={BarChart3}
            color="blue"
          />
          <CacheStatCard
            title="AURA Responses"
            stats={stats.auraResponse}
            icon={Database}
            color="green"
          />
          <CacheStatCard
            title="Portfolio Data"
            stats={stats.portfolio}
            icon={BarChart3}
            color="purple"
          />
          <CacheStatCard
            title="News Data"
            stats={stats.news}
            icon={Clock}
            color="orange"
          />
        </div>
      </div>

      <div className="card">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Cache Information</h4>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total cached items:</span>
            <span className="font-medium">
              {stats.marketData.total + stats.auraResponse.total + stats.portfolio.total + stats.news.total}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Valid items:</span>
            <span className="font-medium text-green-600">
              {stats.marketData.valid + stats.auraResponse.valid + stats.portfolio.valid + stats.news.valid}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Expired items:</span>
            <span className="font-medium text-red-600">
              {stats.marketData.expired + stats.auraResponse.expired + stats.portfolio.expired + stats.news.expired}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Cache efficiency:</span>
            <span className="font-medium">
              {((stats.marketData.valid + stats.auraResponse.valid + stats.portfolio.valid + stats.news.valid) / 
                (stats.marketData.total + stats.auraResponse.total + stats.portfolio.total + stats.news.total) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const CacheStatCard = ({ title, stats, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200'
  }

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center space-x-3 mb-3">
        <Icon className="w-5 h-5" />
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span className="font-medium">{stats.total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Valid:</span>
          <span className="font-medium text-green-600">{stats.valid}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Expired:</span>
          <span className="font-medium text-red-600">{stats.expired}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">TTL:</span>
          <span className="font-medium">{Math.round(stats.ttl / 1000)}s</span>
        </div>
      </div>
    </div>
  )
}

export default CacheManager








