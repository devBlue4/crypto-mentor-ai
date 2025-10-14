import { useState } from 'react'
import { Wallet, Menu, X, Brain, TrendingUp, AlertCircle } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import WalletConnect from './WalletConnect'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isConnected, account } = useWallet()

  const navigation = [
    { name: 'Dashboard', href: '#dashboard', icon: TrendingUp },
    { name: 'AI Chat', href: '#chat', icon: Brain },
    { name: 'Alerts', href: '#alerts', icon: AlertCircle },
  ]

  return (
    <header className="bg-black/40 backdrop-blur-xl shadow-2xl border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center space-x-5">
            <div className="flex items-center justify-center w-14 h-14 bg-purple-600/20 border border-purple-500/30 rounded-2xl shadow-lg backdrop-blur-sm">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                CryptoMentor AI
              </h1>
              <p className="text-sm text-gray-400 font-medium">Powered by AdEx AURA</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 px-6 py-3 rounded-xl hover:bg-white/5 font-medium"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              )
            })}
          </nav>

          {/* Wallet Status & Connect Button */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
                  </span>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
              </div>
            ) : (
              <WalletConnect />
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-sm"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4 bg-white/90 backdrop-blur-md">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 py-3 px-4 rounded-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
