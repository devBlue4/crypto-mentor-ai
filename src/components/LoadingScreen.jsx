import { Brain, TrendingUp, DollarSign, Shield } from 'lucide-react'

const LoadingScreen = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI',
      description: 'Intelligent analysis with AdEx AURA'
    },
    {
      icon: TrendingUp,
      title: 'Web3 Trading',
      description: 'Real-time portfolio management'
    },
    {
      icon: DollarSign,
      title: 'Market Analysis',
      description: 'Insights and personalized recommendations'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Connect your wallet safely'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Logo and title */}
        <div className="mb-12">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl mx-auto mb-6 animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            CryptoMentor <span className="text-gradient">AI</span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Your intelligent Web3 trading assistant
          </p>
          <p className="text-sm text-gray-400">
            Powered by AdEx AURA
          </p>
        </div>

        {/* Loading animation */}
        <div className="mb-12">
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-gray-300 font-medium">Initializing CryptoMentor AI...</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-900/30 rounded-lg mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-300" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Loading components...</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
