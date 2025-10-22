# Components Documentation - CryptoMentor AI

This document provides a detailed description of all React components used in CryptoMentor AI.

## 📋 Components Index

### Main Components
- [App.jsx](#appjsx) - Root component of the application
- [Dashboard.jsx](#dashboardjsx) - Main dashboard with navigation
- [Header.jsx](#headerjsx) - Top navigation
- [LoadingScreen.jsx](#loadingscreenjsx) - Initial loading screen

### Functionality Components
- [Portfolio.jsx](#portfoliojsx) - Portfolio management
- [ChatInterface.jsx](#chatinterfacejsx) - Chat with AURA AI
- [MarketOverview.jsx](#marketoverviewjsx) - Market view
- [AlertsPanel.jsx](#alertspaneljsx) - Alert system
- [EducationSection.jsx](#educationsectionjsx) - Education center

### Utility Components
- [WalletConnect.jsx](#walletconnectjsx) - Wallet connection
- [ErrorBoundary.jsx](#errorboundaryjsx) - Error handling

## 🏗️ App.jsx

### Purpose
Root component that configures the application, manages global state and provides the base structure.

### Features
- **Error Boundary**: Captures errors from child components
- **Context Providers**: Provides Wallet and AURA contexts
- **Loading State**: Handles initial loading screen
- **Toast Notifications**: Configures global notifications

### Props
Receives no props (root component)

### Internal State
```javascript
const [isLoading, setIsLoading] = useState(true)
```

### Structure
```jsx
<ErrorBoundary>
  <WalletProvider>
    <AuraProvider>
      <div className="min-h-screen">
        <Header />
        <main>
          <Dashboard />
        </main>
        <Toaster />
      </div>
    </AuraProvider>
  </WalletProvider>
</ErrorBoundary>
```

### Hooks Used
- `useState`: To handle loading state
- `useEffect`: To simulate initial loading

## 📊 Dashboard.jsx

### Purpose
Main component that acts as container and navigator between different application sections.

### Features
- **Tab Navigation**: Tab-based navigation
- **Conditional Rendering**: Renders components based on active tab
- **Welcome Section**: Personalized welcome message
- **Quick Stats**: Quick dashboard statistics

### Props
Receives no direct props, uses contexts to get data

### Internal State
```javascript
const [activeTab, setActiveTab] = useState('overview')
```

### Configurable Tabs
```javascript
const tabs = [
  {
    id: 'overview',
    name: 'Overview',
    icon: BarChart3,
    component: MarketOverview
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    icon: TrendingUp,
    component: Portfolio,
    requiresWallet: true
  },
  {
    id: 'chat',
    name: 'AI Chat',
    icon: MessageCircle,
    component: ChatInterface
  },
  {
    id: 'alerts',
    name: 'Alerts',
    icon: AlertTriangle,
    component: AlertsPanel
  },
  {
    id: 'education',
    name: 'Education',
    icon: BookOpen,
    component: EducationSection
  }
]
```

### Contexts Used
- `useWallet`: To verify wallet connection state

## 🎯 Header.jsx

### Purpose
Top navigation that includes logo, navigation menu and wallet status.

### Features
- **Responsive Design**: Collapsible menu on mobile
- **Wallet Status**: Shows wallet connection state
- **Navigation Links**: Links to different sections
- **Mobile Menu**: Hamburger menu for mobile devices

### Props
Receives no props

### Internal State
```javascript
const [isMenuOpen, setIsMenuOpen] = useState(false)
```

### Navigation
```javascript
const navigation = [
  { name: 'Dashboard', href: '#dashboard', icon: TrendingUp },
  { name: 'AI Chat', href: '#chat', icon: Brain },
  { name: 'Alerts', href: '#alerts', icon: AlertCircle }
]
```

### Contexts Used
- `useWallet`: To get connected wallet information

## ⏳ LoadingScreen.jsx

### Purpose
Initial loading screen shown while the application initializes.

### Features
- **Branding**: Logo and application name
- **Feature Cards**: Shows main features
- **Loading Animation**: Loading animation with progress bar
- **Responsive**: Adapted for different screen sizes

### Props
Receives no props

### Highlighted Features
```javascript
const features = [
  {
    icon: Brain,
    title: 'Advanced AI',
    description: 'Intelligent analysis with AdEx AURA'
  },
  {
    icon: TrendingUp,
    title: 'Web3 Trading',
    description: 'Real-time portfolio management'
  },
  {
    icon: DollarSign,
    title: 'Market Analysis',
    description: 'Personalized insights and recommendations'
  },
  {
    icon: Shield,
    title: 'Secure and Reliable',
    description: 'Connect your wallet securely'
  }
]
```

## 💼 Portfolio.jsx

### Purpose
Component for managing and analyzing the user's cryptocurrency portfolio.

### Features
- **Portfolio Summary**: Summary of total value, ETH balance and number of tokens
- **Token List**: List of tokens with balances
- **AURA Analysis**: Portfolio analysis with AI
- **Portfolio Actions**: Buttons to update and analyze
- **Empty State**: Message when no wallet is connected

### Props
Receives no props, uses contexts

### Internal State
```javascript
const [portfolioValue, setPortfolioValue] = useState(0)
const [portfolioChange, setPortfolioChange] = useState(0)
const [analysis, setAnalysis] = useState(null)
const [isRefreshing, setIsRefreshing] = useState(false)
```

### Main Functions
```javascript
const handleAnalyzePortfolio = async () => {
  const analysis = await analyzePortfolio(tokens, balance)
  setAnalysis(analysis)
}

const refreshPortfolio = async () => {
  await fetchTokens()
  const totalValue = await walletService.calculatePortfolioValue(tokens, balance)
  setPortfolioValue(totalValue)
}
```

### Contexts Used
- `useWallet`: To get wallet data
- `useAura`: For portfolio analysis

### Metrics Shown
- Total portfolio value
- ETH balance
- Number of tokens
- Diversity score
- Risk level
- Personalized recommendations

## 💬 ChatInterface.jsx

### Purpose
Chat interface to interact with AURA AI.

### Features
- **Message History**: Conversation history
- **Typing Indicator**: Indicator that AURA is typing
- **Example Messages**: Example messages to get started
- **Context Awareness**: AURA knows the user's portfolio
- **Message Types**: Different message types (user, AURA, error)
- **Auto-scroll**: Automatic scroll to new messages

### Props
Receives no props

### Internal State
```javascript
const [inputMessage, setInputMessage] = useState('')
const [isTyping, setIsTyping] = useState(false)
```

### Main Functions
```javascript
const handleSendMessage = async () => {
  const context = {
    hasWallet: isConnected,
    tokenCount: tokens?.length || 0,
    hasBalance: parseFloat(balance || '0') > 0,
    tokens: tokens?.map(t => t.symbol) || []
  }
  
  await sendMessage(message, context)
}
```

### Example Messages
```javascript
const exampleMessages = [
  "How is the market today?",
  "Analyze my portfolio",
  "What cryptocurrencies do you recommend?",
  "Explain what DeFi is",
  "When is a good time to buy Bitcoin?"
]
```

### Contexts Used
- `useAura`: To send messages and get responses
- `useWallet`: For portfolio context

## 📈 MarketOverview.jsx

### Purpose
Overview of the cryptocurrency market with charts and statistics.

### Features
- **Market Stats**: Main market statistics
- **Interactive Charts**: Price and dominance charts
- **Market News**: Crypto market news
- **Top Performers**: Best 24h performers
- **Loading States**: Loading states for data

### Props
Receives no props

### Internal State
```javascript
const [marketData, setMarketData] = useState(null)
const [historicalData, setHistoricalData] = useState([])
const [news, setNews] = useState([])
const [loading, setLoading] = useState(true)
```

### Main Functions
```javascript
const loadMarketData = async () => {
  const [overview, history, marketNews] = await Promise.all([
    marketDataService.getMarketOverview(),
    marketDataService.getHistoricalData('bitcoin', 7),
    marketDataService.getMarketNews()
  ])
  
  setMarketData(overview)
  setHistoricalData(history)
  setNews(marketNews)
}
```

### Charts Used
- **LineChart**: Bitcoin price over 7 days
- **PieChart**: Market dominance
- **ResponsiveContainer**: Responsive Recharts containers

### Data Shown
- Total Market Cap
- 24h Volume
- Fear & Greed Index
- Bitcoin Price
- Historical price chart
- Dominance distribution
- Market news
- Top performers

## 🔔 AlertsPanel.jsx

### Purpose
System for creating, managing and monitoring cryptocurrency price alerts.

### Features
- **Alert Creation**: Form to create new alerts
- **Alert Management**: Alert list with edit/delete options
- **Alert Statistics**: Alert statistics (total, active, triggered)
- **Alert Types**: Different alert types (price, change, volume)
- **Modal Interface**: Modal for creating alerts

### Props
Receives no props

### Internal State
```javascript
const [alerts, setAlerts] = useState([])
const [showCreateModal, setShowCreateModal] = useState(false)
const [editingAlert, setEditingAlert] = useState(null)
```

### Main Functions
```javascript
const handleCreateAlert = async () => {
  const alertConfig = {
    ...newAlert,
    value: parseFloat(newAlert.value)
  }
  
  await setupSmartAlerts(alertConfig)
  // Add alert to list
}

const toggleAlert = (id) => {
  setAlerts(prev => prev.map(alert => 
    alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
  ))
}
```

### Alert Types
```javascript
const alertTypes = [
  { value: 'price', label: 'Price' },
  { value: 'change', label: 'Change %' },
  { value: 'volume', label: 'Volume' }
]

const conditions = [
  { value: 'above', label: 'Above' },
  { value: 'below', label: 'Below' }
]
```

### Contexts Used
- `useAura`: To configure smart alerts

## 📚 EducationSection.jsx

### Purpose
Interactive learning center with cryptocurrency lessons.

### Features
- **Categorized Lessons**: Lessons organized by categories
- **Progress Tracking**: Learning progress tracking
- **Difficulty Levels**: Different difficulty levels
- **Interactive Learning**: Interactive lessons
- **Quick Tips**: Quick tips and best practices

### Props
Receives no props

### Internal State
```javascript
const [activeCategory, setActiveCategory] = useState('basics')
const [completedLessons, setCompletedLessons] = useState(new Set())
```

### Learning Categories
```javascript
const categories = [
  {
    id: 'basics',
    name: 'Basic Concepts',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'trading',
    name: 'Trading',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'defi',
    name: 'DeFi',
    icon: DollarSign,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    color: 'bg-red-100 text-red-600'
  }
]
```

### Main Functions
```javascript
const handleStartLesson = (lessonId) => {
  setCompletedLessons(prev => new Set([...prev, lessonId]))
}
```

### Lessons by Category
- **Basics**: Fundamental crypto concepts
- **Trading**: Strategies and technical analysis
- **DeFi**: Decentralized protocols
- **Security**: Security best practices

## 🔗 WalletConnect.jsx

### Purpose
Component for connecting and managing MetaMask connection.

### Features
- **MetaMask Detection**: Detects if MetaMask is installed
- **Connection Flow**: Wallet connection flow
- **Error Handling**: Connection error handling
- **Installation Guide**: Modal to install MetaMask
- **Loading States**: Loading states during connection

### Props
Receives no props

### Internal State
```javascript
const [showModal, setShowModal] = useState(false)
```

### Main Functions
```javascript
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
```

### Contexts Used
- `useWallet`: For connection functions

### Installation Modal
- MetaMask information
- Download button
- Explanation of what MetaMask is
- Cancel options

## 🛡️ ErrorBoundary.jsx

### Purpose
Component to catch and handle JavaScript errors in child components.

### Features
- **Error Catching**: Catches errors in child components
- **Error Display**: Shows friendly error interface
- **Retry Mechanism**: Allows retrying the operation
- **Development Info**: Detailed information in development
- **Graceful Degradation**: Graceful degradation in case of error

### Props
```javascript
{
  children: React.ReactNode  // Child components to monitor
}
```

### Internal State
```javascript
const [hasError, setHasError] = useState(false)
const [error, setError] = useState(null)
const [errorInfo, setErrorInfo] = useState(null)
```

### Lifecycle Methods
```javascript
static getDerivedStateFromError(error) {
  return { hasError: true }
}

componentDidCatch(error, errorInfo) {
  this.setState({
    error: error,
    errorInfo: errorInfo
  })
  
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }
}
```

### Main Functions
```javascript
const handleRetry = () => {
  this.setState({ hasError: false, error: null, errorInfo: null })
}
```

### Error UI Features
- Error icon
- Friendly message
- Retry button
- Reload page button
- Error details (development only)

## 🎨 Design Patterns Used

### 1. Compound Components
```jsx
<Dashboard>
  <TabPanel id="overview">
    <MarketOverview />
  </TabPanel>
  <TabPanel id="portfolio">
    <Portfolio />
  </TabPanel>
</Dashboard>
```

### 2. Render Props
```jsx
<DataProvider>
  {({ data, loading, error }) => (
    loading ? <Loading /> : <DataDisplay data={data} />
  )}
</DataProvider>
```

### 3. Higher-Order Components
```jsx
const withErrorBoundary = (Component) => {
  return class extends React.Component {
    // Error boundary logic
  }
}
```

### 4. Custom Hooks
```jsx
const useWalletConnection = () => {
  const [state, setState] = useState(CONNECTION_STATES.DISCONNECTED)
  const [error, setError] = useState(null)
  
  const connect = async () => {
    // Connection logic
  }
  
  return { state, error, connect }
}
```

## 🔧 Performance Optimizations

### 1. React.memo
```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})
```

### 2. useMemo
```jsx
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])
```

### 3. useCallback
```jsx
const handleClick = useCallback(() => {
  doSomething()
}, [dependency])
```

### 4. Lazy Loading
```jsx
const Portfolio = lazy(() => import('./components/Portfolio'))

<Suspense fallback={<Loading />}>
  <Portfolio />
</Suspense>
```

## 📱 Responsive Design

### Breakpoints Used
```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Responsive Patterns
- **Mobile First**: Design from mobile to desktop
- **Flexible Grids**: Use of CSS Grid and Flexbox
- **Responsive Images**: Images that adapt to size
- **Touch Friendly**: Appropriate touch buttons and elements

## 🧪 Component Testing

### Testing Strategy
```javascript
// Unit Tests
import { render, screen } from '@testing-library/react'
import Portfolio from './Portfolio'

test('renders portfolio when wallet is connected', () => {
  render(<Portfolio />)
  expect(screen.getByText('Total Value')).toBeInTheDocument()
})

// Integration Tests
test('connects wallet successfully', async () => {
  const { user } = render(<WalletConnect />)
  await user.click(screen.getByText('Connect Wallet'))
  expect(screen.getByText('Wallet Connected')).toBeInTheDocument()
})
```

### Testing Tools
- **Jest**: Testing framework
- **React Testing Library**: React component testing
- **Cypress**: End-to-end testing
- **Storybook**: Component development and documentation

---

This documentation provides a complete guide to all CryptoMentor AI components, facilitating maintenance, development and collaboration on the project.
