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

  const loadMarketData = async (silent = false) => {
    if (!silent) {
      setRefreshing(true)
    }
    
    try {
      const [overview, history, marketNews] = await Promise.all([
        marketDataService.getMarketOverview(),
        marketDataService.getHistoricalData('bitcoin', 7),
        marketDataService.getMarketNews()
      ])

      setMarketData(overview)
      setHistoricalData(history)
      setNews(marketNews)
      setLastUpdated(new Date())
      
      // Show success message only if it's real data and not silent
      if (!silent && overview.isRealData) {
        toast.success('Market data updated successfully')
      } else if (!silent && !overview.isRealData) {
        toast.error('Using demo data - API unavailable')
      }
    } catch (error) {
      console.error('Error loading market data:', error)
      if (!silent) {
        toast.error('Failed to load market data')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
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
        <div className="card h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">Bitcoin Price (7 days)</h3>
          <div className="flex-1 px-2 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={historicalData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid 
                  strokeDasharray="1 3" 
                  stroke="rgba(255, 255, 255, 0.1)" 
                  strokeWidth={0.5}
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 0.5 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 0.5 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 0.5 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 0.5 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  domain={['dataMin - 5%', 'dataMax + 5%']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                  }}
                  labelStyle={{ color: '#f9fafb', fontWeight: '500' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  offset={10}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#f7931a" 
                  strokeWidth={2}
                  dot={{ fill: '#f7931a', strokeWidth: 2, r: 0 }}
                  activeDot={{ r: 4, fill: '#f7931a', stroke: '#fff', strokeWidth: 2 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Dominance */}
        <div className="card h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">Market Dominance</h3>
          <div className="flex-1 px-2 pb-2 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.95)',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      borderRadius: '8px',
                      color: '#f9fafb',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                    }}
                    labelStyle={{ color: '#f9fafb', fontWeight: '500' }}
                    formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
                    offset={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value.toFixed(1)}%</span>
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

      {/* Top Performers */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performers (24h)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketData?.top_performers?.map((token, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{token.symbol}</span>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>
              <div className={`flex items-center space-x-1 ${
                parseFloat(token.change) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(token.change) >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">{token.change}</span>
              </div>
            </div>
          )) || (
            <div className="col-span-full text-center py-8 text-gray-500">
              Loading market data...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketOverview
