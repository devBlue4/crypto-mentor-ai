import { walletService, POPULAR_TOKENS } from '../walletService'

// Mock ethers
jest.mock('ethers', () => ({
  BrowserProvider: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
    getBalance: jest.fn(),
    getNetwork: jest.fn()
  })),
  formatEther: jest.fn((balance) => balance.toString()),
  formatUnits: jest.fn((balance, decimals) => (balance / Math.pow(10, decimals)).toString()),
  Contract: jest.fn().mockImplementation(() => ({
    balanceOf: jest.fn(),
    decimals: jest.fn()
  }))
}))

describe('WalletService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('isMetaMaskInstalled', () => {
    it('should return true when window.ethereum exists', () => {
      expect(walletService.isMetaMaskInstalled()).toBe(true)
    })

    it('should return false when window.ethereum does not exist', () => {
      const originalEthereum = window.ethereum
      delete window.ethereum
      expect(walletService.isMetaMaskInstalled()).toBe(false)
      window.ethereum = originalEthereum
    })
  })

  describe('connectWallet', () => {
    it('should throw error when MetaMask is not installed', async () => {
      const originalEthereum = window.ethereum
      delete window.ethereum

      await expect(walletService.connectWallet()).rejects.toThrow('MetaMask is not installed')

      window.ethereum = originalEthereum
    })

    it('should connect successfully when MetaMask is available', async () => {
      const mockAccounts = ['0x1234567890123456789012345678901234567890']
      const mockProvider = {
        send: jest.fn().mockResolvedValue(mockAccounts)
      }

      require('ethers').BrowserProvider.mockImplementation(() => mockProvider)

      const result = await walletService.connectWallet()
      expect(result).toBe(mockAccounts[0])
      expect(mockProvider.send).toHaveBeenCalledWith('eth_requestAccounts', [])
    })

    it('should throw error when connection fails', async () => {
      const mockProvider = {
        send: jest.fn().mockRejectedValue(new Error('User rejected'))
      }

      require('ethers').BrowserProvider.mockImplementation(() => mockProvider)

      await expect(walletService.connectWallet()).rejects.toThrow('Error connecting wallet: User rejected')
    })
  })

  describe('getEthBalance', () => {
    it('should return formatted ETH balance', async () => {
      const mockBalance = '1000000000000000000' // 1 ETH in wei
      const mockProvider = {
        getBalance: jest.fn().mockResolvedValue(mockBalance)
      }

      require('ethers').BrowserProvider.mockImplementation(() => mockProvider)
      require('ethers').formatEther.mockReturnValue('1.0')

      const result = await walletService.getEthBalance('0x1234567890123456789012345678901234567890')
      expect(result).toBe('1.0')
      expect(mockProvider.getBalance).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890')
    })

    it('should throw error when getting balance fails', async () => {
      const mockProvider = {
        getBalance: jest.fn().mockRejectedValue(new Error('Network error'))
      }

      require('ethers').BrowserProvider.mockImplementation(() => mockProvider)

      await expect(walletService.getEthBalance('0x123')).rejects.toThrow('Error getting ETH balance: Network error')
    })
  })

  describe('getTokenBalance', () => {
    it('should return formatted token balance', async () => {
      const mockBalance = '1000000' // 1 token with 6 decimals
      const mockDecimals = 6
      const mockProvider = {
        // Mock provider
      }
      const mockContract = {
        balanceOf: jest.fn().mockResolvedValue(mockBalance),
        decimals: jest.fn().mockResolvedValue(mockDecimals)
      }

      require('ethers').BrowserProvider.mockImplementation(() => mockProvider)
      require('ethers').Contract.mockImplementation(() => mockContract)
      require('ethers').formatUnits.mockReturnValue('1.0')

      const result = await walletService.getTokenBalance('0xToken', '0xWallet')
      expect(result).toBe('1.0')
      expect(mockContract.balanceOf).toHaveBeenCalledWith('0xWallet')
      expect(mockContract.decimals).toHaveBeenCalled()
    })

    it('should return 0 when getting token balance fails', async () => {
      const mockProvider = {}
      const mockContract = {
        balanceOf: jest.fn().mockRejectedValue(new Error('Contract error'))
      }

      require('ethers').BrowserProvider.mockImplementation(() => mockProvider)
      require('ethers').Contract.mockImplementation(() => mockContract)

      const result = await walletService.getTokenBalance('0xToken', '0xWallet')
      expect(result).toBe('0')
    })
  })

  describe('formatAddress', () => {
    it('should format address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const formatted = walletService.formatAddress(address)
      expect(formatted).toBe('0x1234...7890')
    })

    it('should return empty string for null address', () => {
      expect(walletService.formatAddress(null)).toBe('')
      expect(walletService.formatAddress(undefined)).toBe('')
    })
  })

  describe('formatBalance', () => {
    it('should format balance with default decimals', () => {
      expect(walletService.formatBalance('1.23456789')).toBe('1.2346')
    })

    it('should format balance with custom decimals', () => {
      expect(walletService.formatBalance('1.23456789', 2)).toBe('1.23')
    })

    it('should return 0 for zero balance', () => {
      expect(walletService.formatBalance('0')).toBe('0')
    })

    it('should return < 0.0001 for very small balances', () => {
      expect(walletService.formatBalance('0.00001')).toBe('< 0.0001')
    })
  })

  describe('getTokenPrice', () => {
    it('should return correct price for known tokens', async () => {
      const btcPrice = await walletService.getTokenPrice('BTC')
      expect(btcPrice).toBe(43000)

      const ethPrice = await walletService.getTokenPrice('ETH')
      expect(ethPrice).toBe(2500)
    })

    it('should return 0 for unknown tokens', async () => {
      const unknownPrice = await walletService.getTokenPrice('UNKNOWN')
      expect(unknownPrice).toBe(0)
    })
  })

  describe('calculatePortfolioValue', () => {
    it('should calculate total portfolio value', async () => {
      const tokens = [
        { symbol: 'USDC', balance: '1000' },
        { symbol: 'WBTC', balance: '0.1' }
      ]
      const ethBalance = '2.5'

      const totalValue = await walletService.calculatePortfolioValue(tokens, ethBalance)
      expect(totalValue).toBe(2500 + 1000 + 4300) // ETH + USDC + WBTC
    })
  })

  describe('POPULAR_TOKENS', () => {
    it('should contain expected popular tokens', () => {
      expect(POPULAR_TOKENS).toHaveLength(6)
      expect(POPULAR_TOKENS[0]).toHaveProperty('symbol', 'USDC')
      expect(POPULAR_TOKENS[1]).toHaveProperty('symbol', 'USDT')
      expect(POPULAR_TOKENS[2]).toHaveProperty('symbol', 'WBTC')
    })

    it('should have required properties for each token', () => {
      POPULAR_TOKENS.forEach(token => {
        expect(token).toHaveProperty('address')
        expect(token).toHaveProperty('symbol')
        expect(token).toHaveProperty('name')
        expect(token).toHaveProperty('decimals')
        expect(token).toHaveProperty('logo')
      })
    })
  })
})

