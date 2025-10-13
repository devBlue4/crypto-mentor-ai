import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WalletConnect from '../WalletConnect'
import { WalletProvider } from '../../contexts/WalletContext'

// Mock the WalletContext
const mockConnectWallet = jest.fn()
const mockIsConnecting = false
const mockIsMetaMaskInstalled = jest.fn(() => true)

jest.mock('../../contexts/WalletContext', () => ({
  useWallet: () => ({
    connectWallet: mockConnectWallet,
    isConnecting: mockIsConnecting,
    isMetaMaskInstalled: mockIsMetaMaskInstalled
  })
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn()
}))

const renderWithProvider = (component) => {
  return render(
    <WalletProvider>
      {component}
    </WalletProvider>
  )
}

describe('WalletConnect', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render connect button', () => {
    renderWithProvider(<WalletConnect />)
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  it('should show connecting state when connecting', () => {
    const mockIsConnecting = true
    jest.doMock('../../contexts/WalletContext', () => ({
      useWallet: () => ({
        connectWallet: mockConnectWallet,
        isConnecting: mockIsConnecting,
        isMetaMaskInstalled: mockIsMetaMaskInstalled
      })
    }))

    renderWithProvider(<WalletConnect />)
    
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })

  it('should call connectWallet when button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider(<WalletConnect />)
    
    const connectButton = screen.getByText('Connect Wallet')
    await user.click(connectButton)
    
    expect(mockConnectWallet).toHaveBeenCalledTimes(1)
  })

  it('should show MetaMask installation modal when MetaMask is not installed', async () => {
    mockIsMetaMaskInstalled.mockReturnValue(false)
    const user = userEvent.setup()
    
    renderWithProvider(<WalletConnect />)
    
    const connectButton = screen.getByText('Connect Wallet')
    await user.click(connectButton)
    
    await waitFor(() => {
      expect(screen.getByText('MetaMask is not installed')).toBeInTheDocument()
      expect(screen.getByText('Install MetaMask')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
  })

  it('should close modal when cancel is clicked', async () => {
    mockIsMetaMaskInstalled.mockReturnValue(false)
    const user = userEvent.setup()
    
    renderWithProvider(<WalletConnect />)
    
    const connectButton = screen.getByText('Connect Wallet')
    await user.click(connectButton)
    
    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
    
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    await waitFor(() => {
      expect(screen.queryByText('MetaMask is not installed')).not.toBeInTheDocument()
    })
  })

  it('should open MetaMask installation page when install button is clicked', async () => {
    mockIsMetaMaskInstalled.mockReturnValue(false)
    const user = userEvent.setup()
    
    // Mock window.open
    const mockOpen = jest.fn()
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true
    })
    
    renderWithProvider(<WalletConnect />)
    
    const connectButton = screen.getByText('Connect Wallet')
    await user.click(connectButton)
    
    await waitFor(() => {
      expect(screen.getByText('Install MetaMask')).toBeInTheDocument()
    })
    
    const installButton = screen.getByText('Install MetaMask')
    await user.click(installButton)
    
    expect(mockOpen).toHaveBeenCalledWith('https://metamask.io/download/', '_blank')
  })

  it('should display MetaMask information in modal', async () => {
    mockIsMetaMaskInstalled.mockReturnValue(false)
    const user = userEvent.setup()
    
    renderWithProvider(<WalletConnect />)
    
    const connectButton = screen.getByText('Connect Wallet')
    await user.click(connectButton)
    
    await waitFor(() => {
      expect(screen.getByText('What is MetaMask?')).toBeInTheDocument()
      expect(screen.getByText(/MetaMask is a digital wallet/)).toBeInTheDocument()
    })
  })

  it('should disable button when connecting', () => {
    const mockIsConnecting = true
    jest.doMock('../../contexts/WalletContext', () => ({
      useWallet: () => ({
        connectWallet: mockConnectWallet,
        isConnecting: mockIsConnecting,
        isMetaMaskInstalled: mockIsMetaMaskInstalled
      })
    }))

    renderWithProvider(<WalletConnect />)
    
    const connectButton = screen.getByText('Connecting...')
    expect(connectButton.closest('button')).toBeDisabled()
  })

  it('should show wallet icon', () => {
    renderWithProvider(<WalletConnect />)
    
    // Check for wallet icon (Lucide React Wallet component)
    const button = screen.getByText('Connect Wallet').closest('button')
    expect(button).toHaveClass('btn-primary')
  })
})
