import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Globe, Activity } from 'lucide-react'
import { marketDataService } from '../services/marketData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const MarketOverview = () => {
  const [marketData, setMarketData] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarketData()
  }, [])

  const loadMarketData = async () => {
    try {
      const [overview, history, marketNews] = await Promise.all([
        marketDataService.getMarketOverview(),
        marketDataService.getHistoricalData('bitcoin', 7),
        marketDataService.getMarketNews()
      ])

      setMarketData(overview)
      setHistoricalData(history)
      setNews(marketNews)
    } catch (error) {
      console.error('Error loading market data:', error)
    } finally {
      setLoading(false)
    }
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
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Market Cap</h3>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            ${marketDataService.formatNumber(marketData?.totalMarketCap || 0)}
          </p>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+3.2%</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">24h Volume</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            ${marketDataService.formatNumber(marketData?.totalVolume || 0)}
          </p>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+8.5%</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fear & Greed</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {marketData?.fearGreedIndex || 0}
          </p>
          <div className="flex items-center space-x-1 text-yellow-600">
            <span className="text-sm font-medium">Neutral</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bitcoin</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
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
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Bitcoin Price (7 days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US')}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#f7931a" 
                  strokeWidth={2}
                  dot={{ fill: '#f7931a', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Dominance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Dominance</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
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
