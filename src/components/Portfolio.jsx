import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, RefreshCw, Wallet, DollarSign, PieChart } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { useAura } from '../contexts/AuraContext'
import { walletService } from '../services/walletService'
import { marketDataService } from '../services/marketData'
import toast from 'react-hot-toast'

const Portfolio = () => {
  const { account, balance, tokens, isConnected, fetchTokens } = useWallet()
  const { analyzePortfolio, isLoading: auraLoading } = useAura()
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [portfolioChange, setPortfolioChange] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Analizar portfolio con AURA
  const handleAnalyzePortfolio = async () => {
    if (!isConnected || tokens.length === 0) return

    try {
      const analysis = await analyzePortfolio(tokens, balance)
      setAnalysis(analysis)
      toast.success('Portfolio analysis completed')
    } catch (error) {
      toast.error('Error analyzing portfolio')
    }
  }

  // Refrescar datos del portfolio
  const refreshPortfolio = async () => {
    setIsRefreshing(true)
    try {
      await fetchTokens()
      const totalValue = await walletService.calculatePortfolioValue(tokens, balance)
      setPortfolioValue(totalValue)
      toast.success('Portfolio updated')
    } catch (error) {
      toast.error('Error updating portfolio')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate portfolio metrics
  useEffect(() => {
    const calculateMetrics = async () => {
      if (!isConnected) return

      try {
        const totalValue = await walletService.calculatePortfolioValue(tokens, balance)
        setPortfolioValue(totalValue)
        
        // Simular cambio de 24h
        const change = (Math.random() - 0.5) * 10
        setPortfolioChange(change)
      } catch (error) {
        console.error('Error calculating metrics:', error)
      }
    }

    calculateMetrics()
  }, [isConnected, tokens, balance])

  // Auto-analizar cuando cambie el portfolio
  useEffect(() => {
    if (isConnected && tokens.length > 0) {
      handleAnalyzePortfolio()
    }
  }, [tokens, isConnected])

  if (!isConnected) {
    return (
      <div className="card text-center py-12">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
          <Wallet className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connect your Wallet
        </h3>
        <p className="text-gray-600 mb-6">
          Connect your wallet to see your portfolio analysis and receive personalized recommendations from AURA.
        </p>
        <div className="text-sm text-gray-500">
          Use the "Connect Wallet" button at the top
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Value</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            ${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
          <div className={`flex items-center space-x-1 ${
            portfolioChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {portfolioChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}%
            </span>
            <span className="text-sm text-gray-500">24h</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">ETH Balance</h3>
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {walletService.formatBalance(balance, 4)} ETH
          </p>
          <p className="text-sm text-gray-500">
            ≈ ${(parseFloat(balance) * 2500).toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tokens</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {tokens.length}
          </p>
            <p className="text-sm text-gray-500">
            Tokens in your portfolio
          </p>
        </div>
      </div>

      {/* Portfolio Actions */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Actions</h3>
            <p className="text-gray-600">Analyze and manage your portfolio with AI</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshPortfolio}
              disabled={isRefreshing}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Update</span>
            </button>
            <button
              onClick={handleAnalyzePortfolio}
              disabled={auraLoading || tokens.length === 0}
              className="btn-primary flex items-center space-x-2"
            >
              <span>{auraLoading ? 'Analyzing...' : 'Analyze with AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tokens List */}
      {tokens.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Tokens</h3>
          <div className="space-y-4">
            {tokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{token.symbol}</h4>
                    <p className="text-sm text-gray-600">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {walletService.formatBalance(token.balance, 6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {token.symbol}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AURA Analysis */}
      {analysis && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AURA Analysis</h3>
              <p className="text-sm text-gray-600">Personalized recommendations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Portfolio Diversity</h4>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(analysis.diversity_score || 7.5) * 10}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {analysis.diversity_score || 7.5}/10
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Risk Level</h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                analysis.risk_level === 'low' 
                  ? 'bg-green-100 text-green-800'
                  : analysis.risk_level === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {analysis.risk_level === 'low' ? 'Low' : 
                 analysis.risk_level === 'medium' ? 'Medium' : 'High'}
              </div>
            </div>
          </div>

          {analysis.recommendations && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Portfolio
