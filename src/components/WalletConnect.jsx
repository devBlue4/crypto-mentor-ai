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
        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>

      {/* Modal to install MetaMask */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
              MetaMask is not installed
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              To use CryptoMentor AI, you need to have MetaMask installed in your browser. 
              It's the safest way to connect your wallet and manage your cryptocurrencies.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={installMetaMask}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Install MetaMask</span>
              </button>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full btn-secondary"
              >
                Cancel
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">What is MetaMask?</p>
                  <p className="text-sm text-blue-700 mt-1">
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
