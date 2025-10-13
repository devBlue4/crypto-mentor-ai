# Documentación de Componentes - CryptoMentor AI

Este documento proporciona una descripción detallada de todos los componentes React utilizados en CryptoMentor AI.

## 📋 Índice de Componentes

### Componentes Principales
- [App.jsx](#appjsx) - Componente raíz de la aplicación
- [Dashboard.jsx](#dashboardjsx) - Dashboard principal con navegación
- [Header.jsx](#headerjsx) - Navegación superior
- [LoadingScreen.jsx](#loadingscreenjsx) - Pantalla de carga inicial

### Componentes de Funcionalidad
- [Portfolio.jsx](#portfoliojsx) - Gestión de portfolio
- [ChatInterface.jsx](#chatinterfacejsx) - Chat con IA AURA
- [MarketOverview.jsx](#marketoverviewjsx) - Vista de mercado
- [AlertsPanel.jsx](#alertspaneljsx) - Sistema de alertas
- [EducationSection.jsx](#educationsectionjsx) - Centro educativo

### Componentes de Utilidad
- [WalletConnect.jsx](#walletconnectjsx) - Conexión de wallet
- [ErrorBoundary.jsx](#errorboundaryjsx) - Manejo de errores

## 🏗️ App.jsx

### Propósito
Componente raíz que configura la aplicación, maneja el estado global y proporciona la estructura base.

### Características
- **Error Boundary**: Captura errores de componentes hijos
- **Context Providers**: Proporciona contextos de Wallet y AURA
- **Loading State**: Maneja la pantalla de carga inicial
- **Toast Notifications**: Configura notificaciones globales

### Props
No recibe props (componente raíz)

### Estado Interno
```javascript
const [isLoading, setIsLoading] = useState(true)
```

### Estructura
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

### Hooks Utilizados
- `useState`: Para manejar el estado de carga
- `useEffect`: Para simular la carga inicial

## 📊 Dashboard.jsx

### Propósito
Componente principal que actúa como contenedor y navegador entre diferentes secciones de la aplicación.

### Características
- **Tab Navigation**: Navegación por pestañas
- **Conditional Rendering**: Renderiza componentes basado en la pestaña activa
- **Welcome Section**: Mensaje de bienvenida personalizado
- **Quick Stats**: Estadísticas rápidas del dashboard

### Props
No recibe props directos, usa contextos para obtener datos

### Estado Interno
```javascript
const [activeTab, setActiveTab] = useState('overview')
```

### Tabs Configurables
```javascript
const tabs = [
  {
    id: 'overview',
    name: 'Resumen',
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
    name: 'Chat IA',
    icon: MessageCircle,
    component: ChatInterface
  },
  {
    id: 'alerts',
    name: 'Alertas',
    icon: AlertTriangle,
    component: AlertsPanel
  },
  {
    id: 'education',
    name: 'Educación',
    icon: BookOpen,
    component: EducationSection
  }
]
```

### Contextos Utilizados
- `useWallet`: Para verificar estado de conexión del wallet

## 🎯 Header.jsx

### Propósito
Navegación superior que incluye logo, menú de navegación y estado del wallet.

### Características
- **Responsive Design**: Menú colapsable en móvil
- **Wallet Status**: Muestra estado de conexión del wallet
- **Navigation Links**: Enlaces a diferentes secciones
- **Mobile Menu**: Menú hamburguesa para dispositivos móviles

### Props
No recibe props

### Estado Interno
```javascript
const [isMenuOpen, setIsMenuOpen] = useState(false)
```

### Navegación
```javascript
const navigation = [
  { name: 'Dashboard', href: '#dashboard', icon: TrendingUp },
  { name: 'Chat IA', href: '#chat', icon: Brain },
  { name: 'Alertas', href: '#alerts', icon: AlertCircle }
]
```

### Contextos Utilizados
- `useWallet`: Para obtener información del wallet conectado

## ⏳ LoadingScreen.jsx

### Propósito
Pantalla de carga inicial que se muestra mientras la aplicación se inicializa.

### Características
- **Branding**: Logo y nombre de la aplicación
- **Feature Cards**: Muestra características principales
- **Loading Animation**: Animación de carga con progress bar
- **Responsive**: Adaptado para diferentes tamaños de pantalla

### Props
No recibe props

### Características Destacadas
```javascript
const features = [
  {
    icon: Brain,
    title: 'IA Avanzada',
    description: 'Análisis inteligente con AdEx AURA'
  },
  {
    icon: TrendingUp,
    title: 'Trading Web3',
    description: 'Gestión de portfolio en tiempo real'
  },
  {
    icon: DollarSign,
    title: 'Análisis de Mercado',
    description: 'Insights y recomendaciones personalizadas'
  },
  {
    icon: Shield,
    title: 'Seguro y Confiable',
    description: 'Conecta tu wallet de forma segura'
  }
]
```

## 💼 Portfolio.jsx

### Propósito
Componente para gestionar y analizar el portfolio de criptomonedas del usuario.

### Características
- **Portfolio Summary**: Resumen de valor total, balance ETH y número de tokens
- **Token List**: Lista de tokens con balances
- **AURA Analysis**: Análisis del portfolio con IA
- **Portfolio Actions**: Botones para actualizar y analizar
- **Empty State**: Mensaje cuando no hay wallet conectado

### Props
No recibe props, usa contextos

### Estado Interno
```javascript
const [portfolioValue, setPortfolioValue] = useState(0)
const [portfolioChange, setPortfolioChange] = useState(0)
const [analysis, setAnalysis] = useState(null)
const [isRefreshing, setIsRefreshing] = useState(false)
```

### Funciones Principales
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

### Contextos Utilizados
- `useWallet`: Para obtener datos del wallet
- `useAura`: Para análisis del portfolio

### Métricas Mostradas
- Valor total del portfolio
- Balance de ETH
- Número de tokens
- Score de diversidad
- Nivel de riesgo
- Recomendaciones personalizadas

## 💬 ChatInterface.jsx

### Propósito
Interfaz de chat para interactuar con la IA AURA.

### Características
- **Message History**: Historial de conversación
- **Typing Indicator**: Indicador de que AURA está escribiendo
- **Example Messages**: Mensajes de ejemplo para empezar
- **Context Awareness**: AURA conoce el portfolio del usuario
- **Message Types**: Diferentes tipos de mensajes (usuario, AURA, error)
- **Auto-scroll**: Scroll automático a nuevos mensajes

### Props
No recibe props

### Estado Interno
```javascript
const [inputMessage, setInputMessage] = useState('')
const [isTyping, setIsTyping] = useState(false)
```

### Funciones Principales
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

### Mensajes de Ejemplo
```javascript
const exampleMessages = [
  "¿Cómo está el mercado hoy?",
  "Analiza mi portfolio",
  "¿Qué criptomonedas recomiendas?",
  "Explica qué es DeFi",
  "¿Cuándo es buen momento para comprar Bitcoin?"
]
```

### Contextos Utilizados
- `useAura`: Para enviar mensajes y obtener respuestas
- `useWallet`: Para contexto del portfolio

## 📈 MarketOverview.jsx

### Propósito
Vista general del mercado de criptomonedas con gráficos y estadísticas.

### Características
- **Market Stats**: Estadísticas principales del mercado
- **Interactive Charts**: Gráficos de precios y dominancia
- **Market News**: Noticias del mercado crypto
- **Top Performers**: Mejores rendimientos de 24h
- **Loading States**: Estados de carga para datos

### Props
No recibe props

### Estado Interno
```javascript
const [marketData, setMarketData] = useState(null)
const [historicalData, setHistoricalData] = useState([])
const [news, setNews] = useState([])
const [loading, setLoading] = useState(true)
```

### Funciones Principales
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

### Propósito
Sistema para crear, gestionar y monitorear alertas de precios de criptomonedas.

### Características
- **Alert Creation**: Formulario para crear nuevas alertas
- **Alert Management**: Lista de alertas con opciones de editar/eliminar
- **Alert Statistics**: Estadísticas de alertas (total, activas, activadas)
- **Alert Types**: Diferentes tipos de alertas (precio, cambio, volumen)
- **Modal Interface**: Modal para crear alertas

### Props
No recibe props

### Estado Interno
```javascript
const [alerts, setAlerts] = useState([])
const [showCreateModal, setShowCreateModal] = useState(false)
const [editingAlert, setEditingAlert] = useState(null)
```

### Funciones Principales
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

### Contextos Utilizados
- `useAura`: Para configurar alertas inteligentes

## 📚 EducationSection.jsx

### Propósito
Centro de aprendizaje interactivo con lecciones sobre criptomonedas.

### Características
- **Categorized Lessons**: Lecciones organizadas por categorías
- **Progress Tracking**: Seguimiento del progreso de aprendizaje
- **Difficulty Levels**: Diferentes niveles de dificultad
- **Interactive Learning**: Lecciones interactivas
- **Quick Tips**: Consejos rápidos y mejores prácticas

### Props
No recibe props

### Estado Interno
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

### Funciones Principales
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

### Propósito
Componente para conectar y manejar la conexión con MetaMask.

### Características
- **MetaMask Detection**: Detecta si MetaMask está instalado
- **Connection Flow**: Flujo de conexión con wallet
- **Error Handling**: Manejo de errores de conexión
- **Installation Guide**: Modal para instalar MetaMask
- **Loading States**: Estados de carga durante conexión

### Props
No recibe props

### Estado Interno
```javascript
const [showModal, setShowModal] = useState(false)
```

### Funciones Principales
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

### Contextos Utilizados
- `useWallet`: Para funciones de conexión

### Modal de Instalación
- Información sobre MetaMask
- Botón para descargar
- Explicación de qué es MetaMask
- Opciones de cancelar

## 🛡️ ErrorBoundary.jsx

### Propósito
Componente para capturar y manejar errores de JavaScript en componentes hijos.

### Características
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

### Estado Interno
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

### Funciones Principales
```javascript
const handleRetry = () => {
  this.setState({ hasError: false, error: null, errorInfo: null })
}
```

### Características del Error UI
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
