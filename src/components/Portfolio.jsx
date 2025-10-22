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

  // Analizar portfolio con AdEx AURA
  const handleAnalyzePortfolio = async () => {
    if (!isConnected) {
      toast.error('Connect your wallet to analyze with AI')
      return
    }

    try {
      // Pasar la dirección de wallet para usar la API real de AURA
      console.log('🔍 Portfolio: Starting analysis with account:', account)
      console.log('🔍 Portfolio: Current tokens:', tokens)
      console.log('🔍 Portfolio: Current balance:', balance)
      
      const analysis = await analyzePortfolio(tokens, balance, account)
      
      console.log('📊 Portfolio: Analysis result received:', JSON.stringify(analysis, null, 2))
      console.log('📋 Portfolio: Analysis recommendations count:', analysis?.recommendations?.length || 0)
      console.log('📋 Portfolio: Analysis portfolio count:', analysis?.portfolio?.length || 0)
      
      setAnalysis(analysis)
      toast.success('Portfolio analysis completed')
    } catch (error) {
      console.error('❌ Portfolio: AURA API not available:', error)
      
      // Mostrar mensaje de error en lugar de datos demo
      setAnalysis(null)
      toast.error('AURA API not available. Please check your API configuration.', {
        duration: 5000
      })
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
  }, [tokens, isConnected, account])

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
          Connect your wallet to see your portfolio analysis and receive personalized recommendations from AdEx AURA.
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
              disabled={auraLoading || !isConnected}
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

      {/* AdEx AURA Analysis */}
      {analysis ? (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AdEx AURA Analysis</h3>
              <p className="text-sm text-gray-600">Personalized recommendations</p>
              {analysis.strategies && analysis.strategies.length > 0 && analysis.strategies[0]?.llm?.provider === 'AdEx Aura' && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Live Analysis
                  </span>
                </div>
              )}
              {(!analysis.strategies || analysis.strategies.length === 0 || analysis.strategies[0]?.llm?.provider !== 'AdEx Aura') && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    📊 Demo Analysis
                  </span>
                </div>
              )}
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

          {/* Información adicional del portfolio de AURA */}
          {analysis.portfolio && analysis.portfolio.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Portfolio Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.portfolio.map((network, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{network.network?.name || 'Network'}</h5>
                      <span className="text-sm text-gray-600">{network.tokens?.length || 0} tokens</span>
                    </div>
                    {network.tokens && network.tokens.length > 0 ? (
                      <div className="space-y-1">
                        {network.tokens.slice(0, 3).map((token, tokenIndex) => (
                          <div key={tokenIndex} className="flex justify-between text-sm">
                            <span className="text-gray-700">{token.symbol}</span>
                            <span className="text-gray-600">
                              {token.balanceUSD ? `$${token.balanceUSD.toFixed(2)}` : 'N/A'}
                            </span>
                          </div>
                        ))}
                        {network.tokens.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{network.tokens.length - 3} more tokens
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        No tokens found in this network
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => {
                  // Manejar tanto el formato de AURA como el formato de fallback
                  if (typeof rec === 'string') {
                    // Formato de fallback (string simple)
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{rec}</span>
                      </div>
                    )
                  } else {
                    // Formato de AURA (objeto con name, description, etc.)
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">{rec.name || `Strategy ${index + 1}`}</h5>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.risk === 'low' 
                              ? 'bg-green-100 text-green-800'
                              : rec.risk === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : rec.risk === 'high'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {rec.risk || 'medium'} risk
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{rec.description}</p>
                        {rec.apy && rec.apy !== 'N/A' && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-600">Expected APY:</span>
                            <span className="font-medium text-green-600">{rec.apy}</span>
                          </div>
                        )}
                        {rec.platforms && rec.platforms.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Platforms: </span>
                            {rec.platforms.map((platform, pIndex) => (
                              <span key={pIndex} className="text-sm text-blue-600">
                                {platform.name}
                                {pIndex < rec.platforms.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AdEx AURA Analysis</h3>
              <p className="text-sm text-gray-600">API Configuration Required</p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔧</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">AURA API Not Available</h4>
            <p className="text-gray-600 mb-4">
              The AdEx AURA API is not responding. Please check your API configuration.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <h5 className="font-medium text-yellow-800 mb-2">Configuration Steps:</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Verify your API key in the .env file</li>
                <li>• Check if the API endpoint is correct</li>
                <li>• Ensure the AURA API service is running</li>
                <li>• Contact AdEx support for API access</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio
