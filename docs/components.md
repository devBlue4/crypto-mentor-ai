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
- **Market Stats**: Estadísticas principales del mercado
- **Interactive Charts**: Gráficos de precios y dominancia
- **Market News**: Noticias del mercado crypto
- **Top Performers**: Mejores rendimientos de 24h
- **Loading States**: Estados de carga para datos

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

### Gráficos Utilizados
- **LineChart**: Precio de Bitcoin en 7 días
- **PieChart**: Dominancia de mercado
- **ResponsiveContainer**: Contenedores responsivos de Recharts

### Datos Mostrados
- Market Cap total
- Volumen 24h
- Fear & Greed Index
- Precio de Bitcoin
- Gráfico histórico de precios
- Distribución de dominancia
- Noticias del mercado
- Top performers

## 🔔 AlertsPanel.jsx

### Purpose
Sistema para crear, gestionar y monitorear alertas de precios de criptomonedas.

### Features
- **Alert Creation**: Formulario para crear nuevas alertas
- **Alert Management**: Lista de alertas con opciones de editar/eliminar
- **Alert Statistics**: Estadísticas de alertas (total, activas, activadas)
- **Alert Types**: Diferentes tipos de alertas (precio, cambio, volumen)
- **Modal Interface**: Modal para crear alertas

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
  // Agregar alerta a la lista
}

const toggleAlert = (id) => {
  setAlerts(prev => prev.map(alert => 
    alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
  ))
}
```

### Tipos de Alertas
```javascript
const alertTypes = [
  { value: 'price', label: 'Precio' },
  { value: 'change', label: 'Cambio %' },
  { value: 'volume', label: 'Volumen' }
]

const conditions = [
  { value: 'above', label: 'Por encima de' },
  { value: 'below', label: 'Por debajo de' }
]
```

### Contexts Used
- `useAura`: Para configurar alertas inteligentes

## 📚 EducationSection.jsx

### Purpose
Centro de aprendizaje interactivo con lecciones sobre criptomonedas.

### Features
- **Categorized Lessons**: Lecciones organizadas por categorías
- **Progress Tracking**: Seguimiento del progreso de aprendizaje
- **Difficulty Levels**: Diferentes niveles de dificultad
- **Interactive Learning**: Lecciones interactivas
- **Quick Tips**: Consejos rápidos y mejores prácticas

### Props
Receives no props

### Internal State
```javascript
const [activeCategory, setActiveCategory] = useState('basics')
const [completedLessons, setCompletedLessons] = useState(new Set())
```

### Categorías de Aprendizaje
```javascript
const categories = [
  {
    id: 'basics',
    name: 'Conceptos Básicos',
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
    name: 'Seguridad',
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

### Lecciones por Categoría
- **Básicos**: Conceptos fundamentales de crypto
- **Trading**: Estrategias y análisis técnico
- **DeFi**: Protocolos descentralizados
- **Seguridad**: Mejores prácticas de seguridad

## 🔗 WalletConnect.jsx

### Purpose
Componente para conectar y manejar la conexión con MetaMask.

### Features
- **MetaMask Detection**: Detecta si MetaMask está instalado
- **Connection Flow**: Flujo de conexión con wallet
- **Error Handling**: Manejo de errores de conexión
- **Installation Guide**: Modal para instalar MetaMask
- **Loading States**: Estados de carga durante conexión

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
    toast.error('Error al conectar wallet')
  }
}

const installMetaMask = () => {
  window.open('https://metamask.io/download/', '_blank')
}
```

### Contexts Used
- `useWallet`: Para funciones de conexión

### Modal de Instalación
- Información sobre MetaMask
- Botón para descargar
- Explicación de qué es MetaMask
- Opciones de cancelar

## 🛡️ ErrorBoundary.jsx

### Purpose
Componente para capturar y manejar errores de JavaScript en componentes hijos.

### Features
- **Error Catching**: Captura errores en componentes hijos
- **Error Display**: Muestra interfaz amigable de error
- **Retry Mechanism**: Permite reintentar la operación
- **Development Info**: Información detallada en desarrollo
- **Graceful Degradation**: Degradación elegante en caso de error

### Props
```javascript
{
  children: React.ReactNode  // Componentes hijos a monitorear
}
```

### Internal State
```javascript
const [hasError, setHasError] = useState(false)
const [error, setError] = useState(null)
const [errorInfo, setErrorInfo] = useState(null)
```

### Métodos del Ciclo de Vida
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

### Features del Error UI
- Icono de error
- Mensaje amigable
- Botón de reintentar
- Botón de recargar página
- Detalles del error (solo en desarrollo)

## 🎨 Patrones de Diseño Utilizados

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

## 🔧 Optimizaciones de Performance

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

### Breakpoints Utilizados
```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Patrones Responsive
- **Mobile First**: Diseño desde móvil hacia desktop
- **Flexible Grids**: Uso de CSS Grid y Flexbox
- **Responsive Images**: Imágenes que se adaptan al tamaño
- **Touch Friendly**: Botones y elementos táctiles apropiados

## 🧪 Testing de Componentes

### Estrategia de Testing
```javascript
// Unit Tests
import { render, screen } from '@testing-library/react'
import Portfolio from './Portfolio'

test('renders portfolio when wallet is connected', () => {
  render(<Portfolio />)
  expect(screen.getByText('Valor Total')).toBeInTheDocument()
})

// Integration Tests
test('connects wallet successfully', async () => {
  const { user } = render(<WalletConnect />)
  await user.click(screen.getByText('Conectar Wallet'))
  expect(screen.getByText('Wallet Conectado')).toBeInTheDocument()
})
```

### Herramientas de Testing
- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes React
- **Cypress**: Testing end-to-end
- **Storybook**: Desarrollo y documentación de componentes

---

Esta documentación proporciona una guía completa de todos los componentes de CryptoMentor AI, facilitando el mantenimiento, desarrollo y colaboración en el proyecto.
