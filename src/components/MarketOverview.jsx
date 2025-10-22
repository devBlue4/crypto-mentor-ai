import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Globe, Activity, RefreshCw, AlertCircle } from 'lucide-react'
import { marketDataService } from '../services/marketData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import toast from 'react-hot-toast'

const MarketOverview = () => {
  const [marketData, setMarketData] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [dataError, setDataError] = useState(false)
  const refreshIntervalRef = useRef(null)

  useEffect(() => {
    loadMarketData()
    
    // Set up auto-refresh every 3 minutes
    refreshIntervalRef.current = setInterval(() => {
      loadMarketData(true) // Silent refresh
    }, 3 * 60 * 1000)

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [])

  const loadMarketData = async (silent = false, customTimeRange = null) => {
    if (!silent) {
      setRefreshing(true)
    }
    
    try {
      const currentTimeRange = customTimeRange || timeRange
      const days = getDaysFromTimeRange(currentTimeRange)
      
      const [overview, history, marketNews] = await Promise.all([
        marketDataService.getMarketOverview(),
        marketDataService.getHistoricalData('bitcoin', days),
        marketDataService.getMarketNews()
      ])

      // Validate historical data
      const isValidData = history && history.length > 0 && 
        history.every(item => item.price && item.price > 1000 && item.price < 200000)

      if (!isValidData) {
        console.error('Invalid historical data received')
        setDataError(true)
        if (!silent) {
          toast.error('Not available - Invalid data received')
        }
        return
      }

      setMarketData(overview)
      setHistoricalData(history)
      setNews(marketNews)
      setLastUpdated(new Date())
      setDataError(false)
      
      // Show success message only if it's real data and not silent
      if (!silent && overview.isRealData) {
        toast.success('Market data updated successfully')
      } else if (!silent && !overview.isRealData) {
        toast.error('Using demo data - API unavailable')
      }
    } catch (error) {
      console.error('Error loading market data:', error)
      setDataError(true)
      if (!silent) {
        toast.error('Not available - Failed to load market data')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getDaysFromTimeRange = (range) => {
    switch (range) {
      case '24h': return 1
      case '7d': return 7
      case '1m': return 30
      case '3m': return 90
      default: return 7
    }
  }

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange)
    loadMarketData(false, newTimeRange)
  }

  // Manual refresh function
  const handleManualRefresh = () => {
    loadMarketData(false)
  }

  const pieData = marketData?.dominance ? [
    { name: 'Bitcoin', value: marketData.dominance.bitcoin || 0, color: '#f7931a' },
    { name: 'Ethereum', value: marketData.dominance.ethereum || 0, color: '#627eea' },
    { name: 'Others', value: marketData.dominance.others || 0, color: '#8b5cf6' }
  ] : []

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button and status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Market Overview</h2>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
              {marketData?.isRealData ? ' (Live Data)' : ' (Demo Data)'}
            </p>
          )}
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Market Cap</h3>
            <div className="flex items-center space-x-2">
              {!marketData?.isRealData && <AlertCircle className="w-4 h-4 text-yellow-500" />}
              <Globe className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            ${marketDataService.formatNumber(marketData?.totalMarketCap || 0)}
          </p>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+3.2%</span>
          </div>
          {!marketData?.isRealData && (
            <p className="text-xs text-yellow-600 mt-1">Demo data</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">24h Volume</h3>
            <div className="flex items-center space-x-2">
              {!marketData?.isRealData && <AlertCircle className="w-4 h-4 text-yellow-500" />}
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            ${marketDataService.formatNumber(marketData?.totalVolume || 0)}
          </p>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+8.5%</span>
          </div>
          {!marketData?.isRealData && (
            <p className="text-xs text-yellow-600 mt-1">Demo data</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fear & Greed</h3>
            <div className="flex items-center space-x-2">
              {!marketData?.isRealData && <AlertCircle className="w-4 h-4 text-yellow-500" />}
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {marketData?.fearGreedIndex || 0}
          </p>
          <div className="flex items-center space-x-1 text-yellow-600">
            <span className="text-sm font-medium">{marketData?.fearGreedLabel || 'Neutral'}</span>
          </div>
          {!marketData?.isRealData && (
            <p className="text-xs text-yellow-600 mt-1">Demo data</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bitcoin</h3>
            <div className="flex items-center space-x-2">
              {!marketData?.isRealData && <AlertCircle className="w-4 h-4 text-yellow-500" />}
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            ${(marketData?.bitcoin?.price || 0).toLocaleString()}
          </p>
          <div className={`flex items-center space-x-1 ${
            (marketData?.bitcoin?.change24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {(marketData?.bitcoin?.change24h || 0) >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {marketDataService.formatPercentage(marketData?.bitcoin?.change24h || 0)}
            </span>
          </div>
          {!marketData?.isRealData && (
            <p className="text-xs text-yellow-600 mt-1">Demo data</p>
          )}
        </div>
      </div>

      {/* Charts removed by request */}

      {/* Market News */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Market News</h3>
        <div className="space-y-4">
          {news?.map((article, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                article.sentiment === 'positive' ? 'bg-green-500' :
                article.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{article.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.source}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers removed by request */}
    </div>
  )
}

export default MarketOverview
