import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [chainId, setChainId] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [tokens, setTokens] = useState([])

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum
  }

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install it first.')
      return
    }

    setIsConnecting(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const account = accounts[0]
      
      const balance = await provider.getBalance(account)
      const network = await provider.getNetwork()
      
      setAccount(account)
      setBalance(ethers.formatEther(balance))
      setChainId(network.chainId.toString())
      setIsConnected(true)
      
      toast.success('Wallet connected successfully')
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Error connecting wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null)
    setBalance('0')
    setChainId(null)
    setIsConnected(false)
    setTokens([])
    
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
    
    toast.success('Wallet disconnected')
  }

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
    }
  }

  // Handle network changes
  const handleChainChanged = (chainId) => {
    setChainId(chainId)
    window.location.reload()
  }

  // Get portfolio tokens
  const fetchTokens = async () => {
    if (!account) return

    try {
      // List of popular ERC-20 tokens
      const popularTokens = [
        { address: '0xA0b86a33E6441c8C3C7d4A5e2E2B4C4F4F4F4F4F', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
        { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether USD', decimals: 6 },
        { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8 },
        { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK', name: 'Chainlink', decimals: 18 },
      ]

      const provider = new ethers.BrowserProvider(window.ethereum)
      const tokensWithBalance = []

      for (const token of popularTokens) {
        try {
          const contract = new ethers.Contract(
            token.address,
            ['function balanceOf(address) view returns (uint256)'],
            provider
          )
          
          const balance = await contract.balanceOf(account)
          if (balance > 0) {
            tokensWithBalance.push({
              ...token,
              balance: ethers.formatUnits(balance, token.decimals)
            })
          }
        } catch (error) {
          console.error(`Error fetching ${token.symbol}:`, error)
        }
      }

      setTokens(tokensWithBalance)
    } catch (error) {
      console.error('Error fetching tokens:', error)
    }
  }

  // Check connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await provider.send('eth_accounts', [])
          
          if (accounts.length > 0) {
            const balance = await provider.getBalance(accounts[0])
            const network = await provider.getNetwork()
            
            setAccount(accounts[0])
            setBalance(ethers.formatEther(balance))
            setChainId(network.chainId.toString())
            setIsConnected(true)
          }
        } catch (error) {
          console.error('Error checking connection:', error)
        }
      }
    }

    checkConnection()
  }, [])

  // Update tokens when account is connected
  useEffect(() => {
    if (isConnected && account) {
      fetchTokens()
    }
  }, [isConnected, account])

  const value = {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    tokens,
    connectWallet,
    disconnectWallet,
    fetchTokens,
    isMetaMaskInstalled
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
