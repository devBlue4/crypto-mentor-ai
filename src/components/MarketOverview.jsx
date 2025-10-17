import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Globe, Activity, RefreshCw, AlertCircle } from 'lucide-react'
import { marketDataService } from '../services/marketData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import toast from 'react-hot-toast'

const MarketOverview = () => {
  const [marketData, setMarketData] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [news, setNews] = useState([])
  const [newsIndex, setNewsIndex] = useState(0)
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
      // Rotate the news window by 5 items on every refresh
      if (marketNews && marketNews.length > 0) {
        setNewsIndex(prev => {
          const step = 5
          const len = marketNews.length
          if (len <= step) return 0
          return (prev + step) % len
        })
      } else {
        setNewsIndex(0)
      }
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Chart */}
        <div className="card h-96 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Bitcoin Price ({timeRange === '24h' ? '24 hours' : timeRange === '7d' ? '7 days' : timeRange === '1m' ? '1 month' : timeRange === '3m' ? '3 months' : timeRange})
            </h3>
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 border border-gray-700">
              {['24h', '7d', '1m', '3m'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    timeRange === range
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 ring-1 ring-purple-500/50'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 px-4 pb-4">
            {dataError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500 font-medium">Not available</p>
                  <p className="text-gray-500 text-sm mt-2">Unable to load Bitcoin price data</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={historicalData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                  aria-label={`Bitcoin price chart showing ${timeRange} price movement`}
                >
                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="rgba(255, 255, 255, 0.08)" 
                  strokeWidth={0.5}
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    if (timeRange === '24h') {
                      // Show hours for 24H range
                      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false })
                    } else if (timeRange === '3m') {
                      // Show monthly/weekly dates for 3M range
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    } else {
                      // Default format for other ranges
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    }
                  }}
                  interval="preserveStartEnd"
                  minTickGap={timeRange === '24h' ? 40 : 25}
                  tickCount={timeRange === '24h' ? 6 : timeRange === '3m' ? 8 : 6}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    // Format prices in compact USD format
                    if (value >= 1000000) {
                      return `$${(value / 1000000).toFixed(1)}M`
                    } else if (value >= 1000) {
                      return `$${(value / 1000).toFixed(0)}K`
                    }
                    return `$${value.toFixed(0)}`
                  }}
                  domain={['dataMin * 0.98', 'dataMax * 1.02']}
                  width={60}
                  tickCount={5}
                  allowDecimals={false}
                  type="number"
                  scale="linear"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(75, 85, 99, 0.4)',
                    borderRadius: '12px',
                    color: '#f9fafb',
                    fontSize: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                    padding: '12px'
                  }}
                  labelStyle={{ color: '#f9fafb', fontWeight: '600', fontSize: '13px' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    if (timeRange === '24h') {
                      return date.toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })
                    } else {
                      return date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric'
                      })
                    }
                  }}
                  offset={12}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#f7931a" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 4, 
                    fill: '#f7931a', 
                    stroke: '#fff', 
                    strokeWidth: 2,
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                  }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Market Dominance */}
        <div className="card h-96 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 px-4 pt-4">Market Dominance</h3>
          <div className="flex-1 px-6 pb-4 flex flex-col">
            <div className="flex-1 flex items-center justify-center min-h-0 relative" style={{ minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart aria-label="Market dominance pie chart showing Bitcoin, Ethereum, and other cryptocurrencies">
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={1}
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))'
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      border: '1px solid rgba(75, 85, 99, 0.4)',
                      borderRadius: '12px',
                      color: '#f9fafb',
                      fontSize: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                      padding: '12px'
                    }}
                    labelStyle={{ color: '#f9fafb', fontWeight: '600', fontSize: '13px' }}
                    formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
                    offset={12}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-700 font-medium">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market News */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Market News</h3>
        <div className="space-y-4">
          {(() => {
            const step = 5
            const len = news?.length || 0
            const windowed = len <= step
              ? news
              : [...news.slice(newsIndex), ...news.slice(0, newsIndex)].slice(0, step)
            return windowed
          })().map((article, index) => (
            <a
              key={index}
              href={article.url || '#'}
              target={article.url ? "_blank" : undefined}
              rel={article.url ? "noopener noreferrer" : undefined}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
            >
              {article.image ? (
                <img src={article.image} alt="" className="w-14 h-14 rounded object-cover flex-shrink-0" />
              ) : (
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  article.sentiment === 'positive' ? 'bg-green-500' :
                  article.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:underline">
                  {article.title}
                </h4>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="truncate mr-2">{article.source}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US')}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Top Performers removed by request */}
    </div>
  )
}

export default MarketOverview
