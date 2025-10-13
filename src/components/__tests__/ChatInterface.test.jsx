import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInterface from '../ChatInterface'
import { AuraProvider } from '../../contexts/AuraContext'
import { WalletProvider } from '../../contexts/WalletContext'

// Mock the contexts
const mockSendMessage = jest.fn()
const mockClearConversation = jest.fn()
const mockConversation = []
const mockIsLoading = false

jest.mock('../../contexts/AuraContext', () => ({
  useAura: () => ({
    conversation: mockConversation,
    isLoading: mockIsLoading,
    sendMessage: mockSendMessage,
    clearConversation: mockClearConversation
  })
}))

jest.mock('../../contexts/WalletContext', () => ({
  useWallet: () => ({
    isConnected: false,
    tokens: [],
    balance: '0'
  })
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn()
}))

const renderWithProviders = (component) => {
  return render(
    <WalletProvider>
      <AuraProvider>
        {component}
      </AuraProvider>
    </WalletProvider>
  )
}

describe('ChatInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render chat interface', () => {
    renderWithProviders(<ChatInterface />)
    
    expect(screen.getByText('Chat with AURA')).toBeInTheDocument()
    expect(screen.getByText('Your Web3 trading AI assistant')).toBeInTheDocument()
  })

  it('should display welcome messages when no conversation', () => {
    renderWithProviders(<ChatInterface />)
    
    expect(screen.getByText("Hello! I'm AURA, your Web3 trading assistant. How can I help you today?")).toBeInTheDocument()
    expect(screen.getByText('I can help you with market analysis, portfolio recommendations, and cryptocurrency education.')).toBeInTheDocument()
  })

  it('should display example questions', () => {
    renderWithProviders(<ChatInterface />)
    
    expect(screen.getByText('Example questions:')).toBeInTheDocument()
    expect(screen.getByText('How is the market today?')).toBeInTheDocument()
    expect(screen.getByText('Analyze my portfolio')).toBeInTheDocument()
    expect(screen.getByText('What cryptocurrencies do you recommend?')).toBeInTheDocument()
  })

  it('should allow typing in input field', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInterface />)
    
    const input = screen.getByPlaceholderText('Write your crypto question...')
    await user.type(input, 'What is Bitcoin?')
    
    expect(input.value).toBe('What is Bitcoin?')
  })

  it('should send message when send button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInterface />)
    
    const input = screen.getByPlaceholderText('Write your crypto question...')
    const sendButton = screen.getByText('Send')
    
    await user.type(input, 'What is Bitcoin?')
    await user.click(sendButton)
    
    expect(mockSendMessage).toHaveBeenCalledWith('What is Bitcoin?', {
      hasWallet: false,
      tokenCount: 0,
      hasBalance: false,
      tokens: []
    })
  })

  it('should send message when Enter key is pressed', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInterface />)
    
    const input = screen.getByPlaceholderText('Write your crypto question...')
    await user.type(input, 'What is Bitcoin?')
    await user.keyboard('{Enter}')
    
    expect(mockSendMessage).toHaveBeenCalledWith('What is Bitcoin?', {
      hasWallet: false,
      tokenCount: 0,
      hasBalance: false,
      tokens: []
    })
  })

  it('should not send empty messages', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInterface />)
    
    const sendButton = screen.getByText('Send')
    await user.click(sendButton)
    
    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('should clear input after sending message', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInterface />)
    
    const input = screen.getByPlaceholderText('Write your crypto question...')
    const sendButton = screen.getByText('Send')
    
    await user.type(input, 'What is Bitcoin?')
    await user.click(sendButton)
    
    expect(input.value).toBe('')
  })

  it('should show loading state when sending message', () => {
    const mockIsLoading = true
    jest.doMock('../../contexts/AuraContext', () => ({
      useAura: () => ({
        conversation: mockConversation,
        isLoading: mockIsLoading,
        sendMessage: mockSendMessage,
        clearConversation: mockClearConversation
      })
    }))

    renderWithProviders(<ChatInterface />)
    
    expect(screen.getByText('Sending...')).toBeInTheDocument()
  })

  it('should disable input when loading', () => {
    const mockIsLoading = true
    jest.doMock('../../contexts/AuraContext', () => ({
      useAura: () => ({
        conversation: mockConversation,
        isLoading: mockIsLoading,
        sendMessage: mockSendMessage,
        clearConversation: mockClearConversation
      })
    }))

    renderWithProviders(<ChatInterface />)
    
    const input = screen.getByPlaceholderText('Write your crypto question...')
    expect(input).toBeDisabled()
  })

  it('should call clearConversation when clear button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInterface />)
    
    const clearButton = screen.getByText('Clear')
    await user.click(clearButton)
    
    expect(mockClearConversation).toHaveBeenCalledTimes(1)
  })

  it('should set input value when example question is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInterface />)
    
    const exampleButton = screen.getByText('How is the market today?')
    await user.click(exampleButton)
    
    const input = screen.getByPlaceholderText('Write your crypto question...')
    expect(input.value).toBe('How is the market today?')
  })

  it('should display conversation history', () => {
    const mockConversation = [
      {
        id: 1,
        type: 'user',
        content: 'What is Bitcoin?',
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'aura',
        content: 'Bitcoin is a decentralized digital currency...',
        timestamp: new Date(),
        analysis: { sentiment: 'positive' },
        recommendations: ['Consider learning more about blockchain']
      }
    ]

    jest.doMock('../../contexts/AuraContext', () => ({
      useAura: () => ({
        conversation: mockConversation,
        isLoading: mockIsLoading,
        sendMessage: mockSendMessage,
        clearConversation: mockClearConversation
      })
    }))

    renderWithProviders(<ChatInterface />)
    
    expect(screen.getByText('What is Bitcoin?')).toBeInTheDocument()
    expect(screen.getByText('Bitcoin is a decentralized digital currency...')).toBeInTheDocument()
    expect(screen.getByText('Analysis:')).toBeInTheDocument()
    expect(screen.getByText('Recommendations:')).toBeInTheDocument()
  })

  it('should show wallet status when connected', () => {
    jest.doMock('../../contexts/WalletContext', () => ({
      useWallet: () => ({
        isConnected: true,
        tokens: [{ symbol: 'BTC' }, { symbol: 'ETH' }],
        balance: '2.5'
      })
    }))

    renderWithProviders(<ChatInterface />)
    
    expect(screen.getByText('Wallet connected - AURA can analyze your portfolio')).toBeInTheDocument()
  })

  it('should not show wallet status when not connected', () => {
    renderWithProviders(<ChatInterface />)
    
    expect(screen.queryByText('Wallet connected - AURA can analyze your portfolio')).not.toBeInTheDocument()
  })

  it('should pass correct context when wallet is connected', async () => {
    const user = userEvent.setup()
    
    jest.doMock('../../contexts/WalletContext', () => ({
      useWallet: () => ({
        isConnected: true,
        tokens: [{ symbol: 'BTC' }, { symbol: 'ETH' }],
        balance: '2.5'
      })
    }))

    renderWithProviders(<ChatInterface />)
    
    const input = screen.getByPlaceholderText('Write your crypto question...')
    const sendButton = screen.getByText('Send')
    
    await user.type(input, 'Analyze my portfolio')
    await user.click(sendButton)
    
    expect(mockSendMessage).toHaveBeenCalledWith('Analyze my portfolio', {
      hasWallet: true,
      tokenCount: 2,
      hasBalance: true,
      tokens: ['BTC', 'ETH']
    })
  })
})

