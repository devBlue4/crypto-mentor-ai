import { useState } from 'react'
import { Wallet, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import toast from 'react-hot-toast'

const WalletConnect = () => {
  const { connectWallet, isConnecting, isMetaMaskInstalled } = useWallet()
  const [showModal, setShowModal] = useState(false)

  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      setShowModal(true)
      return
    }

    try {
      await connectWallet()
    } catch (error) {
      toast.error('Error connecting wallet')
    }
  }

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank')
  }

  return (
    <>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="relative bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500 px-8 py-4 rounded-2xl font-semibold flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 active:scale-95 border border-purple-400/30 hover:border-purple-300/50 overflow-hidden"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-purple-400/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative flex items-center space-x-3">
          <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-lg">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold tracking-wide">
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </span>
        </div>
      </button>

      {/* Modal to install MetaMask */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card text-card-foreground rounded-xl max-w-md w-full p-6 border border-border shadow-xl">
            <div className="flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground text-center mb-4">
              MetaMask is not installed
            </h3>
            
            <p className="text-muted-foreground text-center mb-6">
              To use CryptoMentor AI, you need to have MetaMask installed in your browser. 
              It's the safest way to connect your wallet and manage your cryptocurrencies.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={installMetaMask}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500 px-4 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-purple-400/30"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Install MetaMask</span>
              </button>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 px-4 py-3 rounded-xl font-semibold border border-gray-600/50 transition-all duration-300 hover:border-gray-500/70"
              >
                Cancel
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-accent-foreground">What is MetaMask?</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    MetaMask is a digital wallet that allows you to interact with Web3 applications 
                    safely and easily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default WalletConnect
