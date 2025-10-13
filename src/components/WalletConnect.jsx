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
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
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
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Install MetaMask</span>
              </button>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg font-medium transition-colors"
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
