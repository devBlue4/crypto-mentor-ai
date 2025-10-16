import { useState, useEffect } from 'react'
import { History, Download, Filter, Search, ExternalLink } from 'lucide-react'
import { exportService } from '../services/exportService'
import toast from 'react-hot-toast'

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm, filterType, filterStatus])

  const loadTransactions = () => {
    const saved = localStorage.getItem('crypto-transactions')
    if (saved) {
      setTransactions(JSON.parse(saved))
    } else {
      // Load sample data for demo
      const sampleTransactions = [
        {
          id: 1,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'buy',
          token: 'ETH',
          amount: '0.5',
          price_usd: 2500,
          total_usd: 1250,
          hash: '0x1234567890abcdef...',
          status: 'confirmed'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'sell',
          token: 'BTC',
          amount: '0.1',
          price_usd: 43000,
          total_usd: 4300,
          hash: '0xabcdef1234567890...',
          status: 'confirmed'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'buy',
          token: 'USDC',
          amount: '1000',
          price_usd: 1,
          total_usd: 1000,
          hash: '0x9876543210fedcba...',
          status: 'confirmed'
        }
      ]
      setTransactions(sampleTransactions)
      localStorage.setItem('crypto-transactions', JSON.stringify(sampleTransactions))
    }
  }

  const filterTransactions = () => {
    let filtered = [...transactions]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterStatus)
    }

    setFilteredTransactions(filtered)
  }

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...transaction
    }
    const newTransactions = [newTransaction, ...transactions]
    setTransactions(newTransactions)
    localStorage.setItem('crypto-transactions', JSON.stringify(newTransactions))
  }

  const exportTransactions = () => {
    exportService.exportTransactionsToCSV(filteredTransactions, 'transactions')
    toast.success('Transactions exported')
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'transfer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h3>
          </div>
          <button
            onClick={exportTransactions}
            disabled={filteredTransactions.length === 0}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by token or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="transfer">Transfer</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Transaction List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h4>
            <p className="text-gray-600 dark:text-gray-400">
              {transactions.length === 0 
                ? 'No transactions recorded yet' 
                : 'No transactions match your filters'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Token</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Price</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Hash</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(tx.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {tx.token}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                      {tx.amount}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                      ${tx.price_usd.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white text-right">
                      ${tx.total_usd.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <span>{formatHash(tx.hash)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Stats */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">+</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Buys</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transactions.filter(tx => tx.type === 'buy').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <span className="text-lg font-bold text-red-600 dark:text-red-400">-</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sells</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transactions.filter(tx => tx.type === 'sell').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">$</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${transactions.reduce((sum, tx) => sum + tx.total_usd, 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory





