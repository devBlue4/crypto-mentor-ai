import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { WalletProvider } from '../../contexts/WalletContext'
import { AuraProvider } from '../../contexts/AuraContext'
import Portfolio from '../../components/Portfolio'
import WalletConnect from '../../components/WalletConnect'

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

// Mock AURA API
jest.mock('../../services/auraAPI', () => ({
  analyzePortfolio: jest.fn().mockResolvedValue({
    total_value_usd: 50000,
    diversity_score: 8.5,
    risk_level: 'medium',
    recommendations: ['Consider adding Bitcoin', 'Diversify more']
  })
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <WalletProvider>
        <AuraProvider>
          {component}
        </AuraProvider>
      </WalletProvider>
    </BrowserRouter>
  )
}

describe('Wallet-Portfolio Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock successful wallet connection
    const mockProvider = {
      send: jest.fn()
        .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']) // connectWallet
        .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']), // checkConnection
      getBalance: jest.fn().mockResolvedValue('2500000000000000000'), // 2.5 ETH in wei
      getNetwork: jest.fn().mockResolvedValue({ chainId: '0x1', name: 'homestead' })
    }

    require('ethers').BrowserProvider.mockImplementation(() => mockProvider)
    require('ethers').formatEther.mockReturnValue('2.5')

    // Mock token contract
    const mockTokenContract = {
      balanceOf: jest.fn()
        .mockResolvedValueOnce('1000000') // USDC balance
        .mockResolvedValueOnce('6'), // USDC decimals
        .mockResolvedValueOnce('100000000') // USDT balance
        .mockResolvedValueOnce('6'), // USDT decimals
      decimals: jest.fn().mockResolvedValue(6)
    }

    require('ethers').Contract.mockImplementation(() => mockTokenContract)
    require('ethers').formatUnits.mockReturnValue('1.0')
  })

  it('should complete wallet connection to portfolio analysis flow', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <div>
        <WalletConnect />
        <Portfolio />
      </div>
    )

    // Initially should show empty portfolio state
    expect(screen.getByText('Connect your Wallet')).toBeInTheDocument()
    expect(screen.getByText('Connect your wallet to see your portfolio analysis and receive personalized recommendations from AURA.')).toBeInTheDocument()

    // Click connect wallet button
    const connectButton = screen.getByText('Connect Wallet')
    await user.click(connectButton)

    // Wait for wallet connection
    await waitFor(() => {
      expect(screen.getByText('Wallet Connected')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Should now show portfolio with connected wallet
    await waitFor(() => {
      expect(screen.getByText('Total Value')).toBeInTheDocument()
      expect(screen.getByText('ETH Balance')).toBeInTheDocument()
      expect(screen.getByText('Tokens')).toBeInTheDocument()
    })

    // Should show ETH balance
    expect(screen.getByText('2.5 ETH')).toBeInTheDocument()

    // Should show portfolio actions
    expect(screen.getByText('Portfolio Actions')).toBeInTheDocument()
    expect(screen.getByText('Analyze and manage your portfolio with AI')).toBeInTheDocument()

    // Should have analyze button
    const analyzeButton = screen.getByText('Analyze with AI')
    expect(analyzeButton).toBeInTheDocument()

    // Click analyze button
    await user.click(analyzeButton)

    // Should show AURA analysis
    await waitFor(() => {
      expect(screen.getByText('AURA Analysis')).toBeInTheDocument()
      expect(screen.getByText('Personalized recommendations')).toBeInTheDocument()
    })

    // Should show portfolio metrics
    expect(screen.getByText('Portfolio Diversity')).toBeInTheDocument()
    expect(screen.getByText('Risk Level')).toBeInTheDocument()
    expect(screen.getByText('Recommendations')).toBeInTheDocument()

    // Should show recommendations
    expect(screen.getByText('Consider adding Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('Diversify more')).toBeInTheDocument()
  })

  it('should handle wallet connection errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock wallet connection error
    const mockProvider = {
      send: jest.fn().mockRejectedValue(new Error('User rejected'))
    }
    require('ethers').BrowserProvider.mockImplementation(() => mockProvider)

    renderWithProviders(
      <div>
        <WalletConnect />
        <Portfolio />
      </div>
    )

    // Click connect wallet button
    const connectButton = screen.getByText('Connect Wallet')
    await user.click(connectButton)

    // Should still show empty portfolio state after error
    await waitFor(() => {
      expect(screen.getByText('Connect your Wallet')).toBeInTheDocument()
    })
  })

  it('should update portfolio data when tokens change', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<Portfolio />)

    // Mock wallet as already connected
    const mockProvider = {
      send: jest.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']),
      getBalance: jest.fn().mockResolvedValue('2500000000000000000'),
      getNetwork: jest.fn().mockResolvedValue({ chainId: '0x1', name: 'homestead' })
    }
    require('ethers').BrowserProvider.mockImplementation(() => mockProvider)

    // Should show portfolio with tokens
    await waitFor(() => {
      expect(screen.getByText('Your Tokens')).toBeInTheDocument()
    })

    // Should show token list
    await waitFor(() => {
      expect(screen.getByText('USDC')).toBeInTheDocument()
      expect(screen.getByText('USDT')).toBeInTheDocument()
    })
  })

  it('should handle portfolio analysis errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock AURA API error
    const { analyzePortfolio } = require('../../services/auraAPI')
    analyzePortfolio.mockRejectedValue(new Error('Analysis failed'))

    renderWithProviders(<Portfolio />)

    // Mock wallet as connected
    const mockProvider = {
      send: jest.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']),
      getBalance: jest.fn().mockResolvedValue('2500000000000000000'),
      getNetwork: jest.fn().mockResolvedValue({ chainId: '0x1', name: 'homestead' })
    }
    require('ethers').BrowserProvider.mockImplementation(() => mockProvider)

    await waitFor(() => {
      expect(screen.getByText('Analyze with AI')).toBeInTheDocument()
    })

    // Click analyze button
    const analyzeButton = screen.getByText('Analyze with AI')
    await user.click(analyzeButton)

    // Should not show AURA analysis due to error
    await waitFor(() => {
      expect(screen.queryByText('AURA Analysis')).not.toBeInTheDocument()
    })
  })

  it('should refresh portfolio data when refresh button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<Portfolio />)

    // Mock wallet as connected
    const mockProvider = {
      send: jest.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']),
      getBalance: jest.fn().mockResolvedValue('2500000000000000000'),
      getNetwork: jest.fn().mockResolvedValue({ chainId: '0x1', name: 'homestead' })
    }
    require('ethers').BrowserProvider.mockImplementation(() => mockProvider)

    await waitFor(() => {
      expect(screen.getByText('Update')).toBeInTheDocument()
    })

    // Click refresh button
    const refreshButton = screen.getByText('Update')
    await user.click(refreshButton)

    // Should call fetchTokens (verified by no errors)
    expect(mockProvider.getBalance).toHaveBeenCalled()
  })
})

