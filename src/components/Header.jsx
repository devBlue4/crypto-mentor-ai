import { Brain, Wallet } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import WalletConnect from './WalletConnect'

const Header = () => {
  const { isConnected, account } = useWallet()
  return (
    <header className="bg-black/40 backdrop-blur-xl shadow-2xl border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-3 items-center h-24">
          {/* Left spacer */}
          <div />

          {/* Centered Title */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-5">
              <div className="flex items-center justify-center w-14 h-14 bg-purple-600/20 border border-purple-500/30 rounded-2xl shadow-lg backdrop-blur-sm">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">CryptoMentor AI</h1>
                <p className="text-sm text-gray-400 font-medium">Powered by AdEx AURA</p>
              </div>
            </div>
          </div>

          {/* Wallet on the right */}
          <div className="flex justify-end">
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
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
