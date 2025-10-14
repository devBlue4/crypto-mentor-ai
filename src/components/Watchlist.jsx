import { useState, useEffect } from 'react'
import { Plus, Star, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { marketDataService } from '../services/marketData'
import { exportService } from '../services/exportService'
import toast from 'react-hot-toast'

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [newSymbol, setNewSymbol] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = () => {
    const saved = localStorage.getItem('crypto-watchlist')
    if (saved) {
      setWatchlist(JSON.parse(saved))
    }
  }

  const saveWatchlist = (newWatchlist) => {
    localStorage.setItem('crypto-watchlist', JSON.stringify(newWatchlist))
    setWatchlist(newWatchlist)
  }

  const addToWatchlist = async () => {
    if (!newSymbol.trim()) {
      toast.error('Please enter a symbol')
      return
    }

    const symbol = newSymbol.trim().toUpperCase()
    
    // Check if already in watchlist
    if (watchlist.find(item => item.symbol === symbol)) {
      toast.error('Symbol already in watchlist')
      return
    }

    setIsLoading(true)
    try {
      // Get current price for the symbol
      const prices = await marketDataService.getTokenPrices([symbol.toLowerCase()])
      const priceData = prices[symbol.toLowerCase()]
      
      if (!priceData) {
        toast.error('Symbol not found')
        return
      }

      const newItem = {
        id: Date.now(),
        symbol,
        name: symbol, // In a real app, you'd get the full name
        price: priceData.usd,
        change24h: priceData.usd_24h_change,
        addedAt: new Date().toISOString()
      }

      const newWatchlist = [...watchlist, newItem]
      saveWatchlist(newWatchlist)
      setNewSymbol('')
      toast.success(`${symbol} added to watchlist`)
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      toast.error('Error adding symbol to watchlist')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWatchlist = (id) => {
    const newWatchlist = watchlist.filter(item => item.id !== id)
    saveWatchlist(newWatchlist)
    toast.success('Removed from watchlist')
  }

  const refreshPrices = async () => {
    if (watchlist.length === 0) return

    setIsLoading(true)
    try {
      const symbols = watchlist.map(item => item.symbol.toLowerCase())
      const prices = await marketDataService.getTokenPrices(symbols)
      
      const updatedWatchlist = watchlist.map(item => {
        const priceData = prices[item.symbol.toLowerCase()]
        if (priceData) {
          return {
            ...item,
            price: priceData.usd,
            change24h: priceData.usd_24h_change
          }
        }
        return item
      })
      
      saveWatchlist(updatedWatchlist)
      toast.success('Prices updated')
    } catch (error) {
      console.error('Error refreshing prices:', error)
      toast.error('Error refreshing prices')
    } finally {
      setIsLoading(false)
    }
  }

  const exportWatchlist = () => {
    const exportData = watchlist.map(item => ({
      symbol: item.symbol,
      name: item.name,
      price: item.price,
      change24h: item.change24h,
      addedAt: item.addedAt
    }))
    
    exportService.exportToJSON(exportData, 'watchlist')
    toast.success('Watchlist exported')
  }

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Star className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Watchlist</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={refreshPrices}
              disabled={isLoading || watchlist.length === 0}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportWatchlist}
              disabled={watchlist.length === 0}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
            >
              <Star className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Add to Watchlist */}
        <div className="flex space-x-3 mb-6">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Enter symbol (e.g., BTC, ETH, ADA)"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
          />
          <button
            onClick={addToWatchlist}
            disabled={isLoading || !newSymbol.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Watchlist Items */}
        {watchlist.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items in watchlist</h4>
            <p className="text-gray-600 dark:text-gray-400">Add cryptocurrency symbols to track their prices</p>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {item.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.symbol}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className={`flex items-center space-x-1 text-sm ${getChangeColor(item.change24h)}`}>
                      {getChangeIcon(item.change24h)}
                      <span>{item.change24h > 0 ? '+' : ''}{item.change24h.toFixed(2)}%</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label="Remove from watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Watchlist Stats */}
      {watchlist.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{watchlist.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gainers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {watchlist.filter(item => item.change24h > 0).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Losers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {watchlist.filter(item => item.change24h < 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Watchlist


