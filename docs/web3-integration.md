# Integración Web3 - CryptoMentor AI

Este documento describe la implementación de funcionalidades Web3 en CryptoMentor AI, incluyendo la integración con MetaMask, operaciones de blockchain y gestión de wallets.

## 🔗 Visión General Web3

### ¿Qué es Web3?

Web3 representa la próxima generación de internet, donde:

- **Descentralización**: No hay entidades centrales que controlen los datos
- **Propiedad de Datos**: Los usuarios controlan su información y activos
- **Interoperabilidad**: Aplicaciones que funcionan entre diferentes blockchains
- **Transparencia**: Todas las transacciones son públicas y verificables

### Componentes Web3 en CryptoMentor AI

1. **Wallet Integration**: Conexión con MetaMask y otras wallets
2. **Blockchain Data**: Lectura de balances y transacciones
3. **Smart Contracts**: Interacción con contratos inteligentes
4. **Token Management**: Gestión de tokens ERC-20 y NFTs

## 🔧 Implementación Técnica

### Configuración de Ethers.js

```javascript
// src/services/walletService.js
import { ethers } from 'ethers'

// Verificar si MetaMask está instalado
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && window.ethereum
}

// Crear provider de MetaMask
export const getMetaMaskProvider = () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask no está instalado')
  }
  return new ethers.BrowserProvider(window.ethereum)
}
```

### Provider y Signer

```javascript
class WalletService {
  constructor() {
    this.provider = null
    this.signer = null
    this.account = null
  }
  
  async connect() {
    try {
      // Obtener provider
      this.provider = getMetaMaskProvider()
      
      // Solicitar conexión
      const accounts = await this.provider.send('eth_requestAccounts', [])
      this.account = accounts[0]
      
      // Obtener signer
      this.signer = await this.provider.getSigner()
      
      return this.account
    } catch (error) {
      throw new Error(`Error conectando wallet: ${error.message}`)
    }
  }
  
  async getBalance(address = null) {
    const targetAddress = address || this.account
    if (!targetAddress) throw new Error('No hay cuenta conectada')
    
    const balance = await this.provider.getBalance(targetAddress)
    return ethers.formatEther(balance)
  }
}
```

## 💼 Gestión de Wallets

### WalletContext Implementation

```javascript
// src/contexts/WalletContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [chainId, setChainId] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [tokens, setTokens] = useState([])
  
  // Conectar wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado')
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const account = accounts[0]
      
      // Obtener información de la cuenta
      const balance = await provider.getBalance(account)
      const network = await provider.getNetwork()
      
      setAccount(account)
      setBalance(ethers.formatEther(balance))
      setChainId(network.chainId.toString())
      setIsConnected(true)
      
      // Escuchar eventos de MetaMask
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      
    } catch (error) {
      console.error('Error conectando wallet:', error)
      throw error
    }
  }
  
  // Manejar cambio de cuentas
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
    }
  }
  
  // Manejar cambio de red
  const handleChainChanged = (chainId) => {
    setChainId(chainId)
    window.location.reload() // Recargar para actualizar UI
  }
  
  return (
    <WalletContext.Provider value={{
      account,
      balance,
      chainId,
      isConnected,
      tokens,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  )
}
```

### Estados de Conexión

```javascript
const CONNECTION_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
}

const useWalletConnection = () => {
  const [state, setState] = useState(CONNECTION_STATES.DISCONNECTED)
  const [error, setError] = useState(null)
  
  const connect = async () => {
    setState(CONNECTION_STATES.CONNECTING)
    setError(null)
    
    try {
      await walletService.connect()
      setState(CONNECTION_STATES.CONNECTED)
    } catch (err) {
      setState(CONNECTION_STATES.ERROR)
      setError(err.message)
    }
  }
  
  return { state, error, connect }
}
```

## 🪙 Gestión de Tokens

### Token Standards

#### ERC-20 (Fungible Tokens)
```javascript
// Interfaz estándar ERC-20
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
]

// Obtener balance de token ERC-20
export const getTokenBalance = async (tokenAddress, walletAddress) => {
  const provider = getMetaMaskProvider()
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
  
  try {
    const [balance, decimals] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.decimals()
    ])
    
    return ethers.formatUnits(balance, decimals)
  } catch (error) {
    console.error('Error obteniendo balance del token:', error)
    return '0'
  }
}
```

#### ERC-721 (Non-Fungible Tokens)
```javascript
// Interfaz estándar ERC-721
const ERC721_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function tokenOfOwnerByIndex(address, uint256) view returns (uint256)',
  'function tokenURI(uint256) view returns (string)',
  'function ownerOf(uint256) view returns (address)'
]

// Obtener NFTs del usuario
export const getUserNFTs = async (nftContract, walletAddress) => {
  const provider = getMetaMaskProvider()
  const contract = new ethers.Contract(nftContract, ERC721_ABI, provider)
  
  try {
    const balance = await contract.balanceOf(walletAddress)
    const tokenIds = []
    
    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i)
      tokenIds.push(tokenId.toString())
    }
    
    return tokenIds
  } catch (error) {
    console.error('Error obteniendo NFTs:', error)
    return []
  }
}
```

### Token Discovery

```javascript
// Tokens populares conocidos
export const POPULAR_TOKENS = [
  {
    address: '0xA0b86a33E6441c8C3C7d4A5e2E2B4C4F4F4F4F4F',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  },
  // ... más tokens
]

// Descubrir tokens automáticamente
export const discoverTokens = async (walletAddress) => {
  const tokensWithBalance = []
  
  for (const token of POPULAR_TOKENS) {
    try {
      const balance = await getTokenBalance(token.address, walletAddress)
      if (parseFloat(balance) > 0) {
        tokensWithBalance.push({
          ...token,
          balance,
          balanceFormatted: parseFloat(balance).toFixed(6)
        })
      }
    } catch (error) {
      console.error(`Error procesando ${token.symbol}:`, error)
    }
  }
  
  return tokensWithBalance
}
```

## 🌐 Gestión de Redes

### Networks Soportadas

```javascript
export const SUPPORTED_NETWORKS = {
  1: {
    name: 'Ethereum Mainnet',
    chainId: '0x1',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorer: 'https://etherscan.io',
    currency: 'ETH'
  },
  5: {
    name: 'Goerli Testnet',
    chainId: '0x5',
    rpcUrl: 'https://goerli.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorer: 'https://goerli.etherscan.io',
    currency: 'ETH'
  },
  137: {
    name: 'Polygon Mainnet',
    chainId: '0x89',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    currency: 'MATIC'
  }
}
```

### Cambio de Red

```javascript
export const switchNetwork = async (chainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    })
  } catch (error) {
    if (error.code === 4902) {
      // Red no está agregada, intentar agregarla
      const network = SUPPORTED_NETWORKS[parseInt(chainId, 16)]
      if (network) {
        await addNetwork(network)
      }
    } else {
      throw error
    }
  }
}

export const addNetwork = async (network) => {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [network],
    })
  } catch (error) {
    console.error('Error agregando red:', error)
    throw error
  }
}
```

## 💸 Transacciones

### Envío de ETH

```javascript
export const sendETH = async (to, amount, gasLimit = '21000') => {
  const provider = getMetaMaskProvider()
  const signer = await provider.getSigner()
  
  try {
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amount.toString()),
      gasLimit: gasLimit
    })
    
    console.log('Transacción enviada:', tx.hash)
    
    // Esperar confirmación
    const receipt = await tx.wait()
    console.log('Transacción confirmada:', receipt)
    
    return receipt
  } catch (error) {
    console.error('Error enviando ETH:', error)
    throw error
  }
}
```

### Envío de Tokens ERC-20

```javascript
export const sendToken = async (tokenAddress, to, amount) => {
  const provider = getMetaMaskProvider()
  const signer = await provider.getSigner()
  
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)
  
  try {
    // Obtener decimales del token
    const decimals = await contract.decimals()
    const formattedAmount = ethers.parseUnits(amount.toString(), decimals)
    
    const tx = await contract.transfer(to, formattedAmount)
    console.log('Transacción de token enviada:', tx.hash)
    
    const receipt = await tx.wait()
    return receipt
  } catch (error) {
    console.error('Error enviando token:', error)
    throw error
  }
}
```

### Estimación de Gas

```javascript
export const estimateGas = async (transaction) => {
  const provider = getMetaMaskProvider()
  
  try {
    const gasEstimate = await provider.estimateGas(transaction)
    // Agregar 20% de buffer
    return gasEstimate * 120n / 100n
  } catch (error) {
    console.error('Error estimando gas:', error)
    throw error
  }
}

export const getGasPrice = async () => {
  const provider = getMetaMaskProvider()
  
  try {
    const feeData = await provider.getFeeData()
    return {
      gasPrice: feeData.gasPrice,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    }
  } catch (error) {
    console.error('Error obteniendo precio de gas:', error)
    throw error
  }
}
```

## 🔒 Seguridad

### Validaciones de Seguridad

```javascript
export const validateAddress = (address) => {
  return ethers.isAddress(address)
}

export const validateAmount = (amount) => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

export const sanitizeInput = (input) => {
  // Remover caracteres peligrosos
  return input.replace(/[<>\"'%;()&+]/g, '')
}
```

### Protección contra Phishing

```javascript
export const verifyContract = async (contractAddress) => {
  // Verificar que el contrato existe
  const provider = getMetaMaskProvider()
  const code = await provider.getCode(contractAddress)
  
  if (code === '0x') {
    throw new Error('Dirección no es un contrato válido')
  }
  
  return true
}

export const checkKnownContracts = (address) => {
  const KNOWN_CONTRACTS = {
    '0xA0b86a33E6441c8C3C7d4A5e2E2B4C4F4F4F4F4F': 'USDC',
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': 'USDT',
    // ... más contratos conocidos
  }
  
  return KNOWN_CONTRACTS[address] || 'Unknown Contract'
}
```

## 📊 Monitoreo y Analytics

### Tracking de Transacciones

```javascript
export const trackTransaction = {
  async send(txHash, type, amount, token) {
    // Enviar datos de analytics
    analytics.track('transaction_sent', {
      txHash,
      type,
      amount,
      token,
      timestamp: Date.now()
    })
  },
  
  async confirm(txHash, blockNumber, gasUsed) {
    analytics.track('transaction_confirmed', {
      txHash,
      blockNumber,
      gasUsed,
      timestamp: Date.now()
    })
  },
  
  async error(txHash, error) {
    analytics.track('transaction_error', {
      txHash,
      error: error.message,
      timestamp: Date.now()
    })
  }
}
```

### Métricas de Wallet

```javascript
export const getWalletMetrics = async (address) => {
  const provider = getMetaMaskProvider()
  
  try {
    const [balance, transactionCount, network] = await Promise.all([
      provider.getBalance(address),
      provider.getTransactionCount(address),
      provider.getNetwork()
    ])
    
    return {
      balance: ethers.formatEther(balance),
      transactionCount,
      network: network.name,
      chainId: network.chainId.toString()
    }
  } catch (error) {
    console.error('Error obteniendo métricas:', error)
    throw error
  }
}
```

## 🚀 Optimizaciones

### Caching de Datos

```javascript
class Web3Cache {
  constructor(ttl = 30000) { // 30 segundos por defecto
    this.cache = new Map()
    this.ttl = ttl
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }
  
  get(key) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }
}

const cache = new Web3Cache()
```

### Batch Requests

```javascript
export const batchGetBalances = async (addresses, tokenAddresses) => {
  const provider = getMetaMaskProvider()
  const batchSize = 10
  
  const results = []
  
  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize)
    
    const promises = batch.map(address => 
      Promise.all(tokenAddresses.map(token => 
        getTokenBalance(token, address)
      ))
    )
    
    const batchResults = await Promise.all(promises)
    results.push(...batchResults)
  }
  
  return results
}
```

## 🔮 Futuras Mejoras

### Multi-Chain Support

```javascript
// Soporte para múltiples blockchains
export const SUPPORTED_CHAINS = {
  ethereum: {
    chainId: 1,
    rpc: 'https://mainnet.infura.io/v3/',
    explorer: 'https://etherscan.io'
  },
  polygon: {
    chainId: 137,
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com'
  },
  bsc: {
    chainId: 56,
    rpc: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com'
  }
}
```

### Wallet Connect Integration

```javascript
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const walletConnectConnector = new WalletConnectConnector({
  rpc: {
    1: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    137: 'https://polygon-rpc.com'
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000
})
```

---

La integración Web3 de CryptoMentor AI proporciona una base sólida y segura para interactuar con el ecosistema blockchain, permitiendo a los usuarios gestionar sus activos digitales de manera intuitiva y segura.
