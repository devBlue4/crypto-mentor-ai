import { useState } from 'react'
import { Wallet, Menu, X, Brain, TrendingUp, AlertCircle } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import WalletConnect from './WalletConnect'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isConnected, account } = useWallet()

  const navigation = [
    { name: 'Dashboard', href: '#dashboard', icon: TrendingUp },
    { name: 'AI Chat', href: '#chat', icon: Brain },
    { name: 'Alerts', href: '#alerts', icon: AlertCircle },
  ]

  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CryptoMentor AI</h1>
              <p className="text-xs text-muted-foreground">Powered by AdEx AURA</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </a>
              )
            })}
          </nav>

          {/* Wallet Status & Connect Button */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-accent border border-accent rounded-lg">
                  <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                  <span className="text-sm font-medium text-accent-foreground">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
                  </span>
                </div>
                <Wallet className="w-5 h-5 text-chart-2" />
              </div>
            ) : (
              <WalletConnect />
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
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
