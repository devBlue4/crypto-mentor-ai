# System Architecture - CryptoMentor AI

This document describes the technical architecture of CryptoMentor AI, including code structure, design patterns and architectural decisions.

## 🏗️ General Architecture

### Architecture Pattern
CryptoMentor AI uses a **modern frontend architecture** based on React with the following characteristics:

- **Single Page Application (SPA)**: Navigation without page reload
- **Component-Based Architecture**: Reusable and modular components
- **Context API**: Global state management without Redux
- **Service Layer**: Business logic separation
- **Progressive Enhancement**: Works without JavaScript enabled

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Frontend)                       │
├─────────────────────────────────────────────────────────────┤
│  React Components                                           │
│  ├── Dashboard                                              │
│  ├── Portfolio                                              │
│  ├── ChatInterface                                          │
│  ├── MarketOverview                                         │
│  └── ...                                                    │
├─────────────────────────────────────────────────────────────┤
│  React Contexts                                             │
│  ├── WalletContext (Web3 State)                             │
│  └── AuraContext (AI State)                                 │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                             │
│  ├── auraAPI.js (AdEx AURA Integration)                     │
│  ├── walletService.js (Web3 Operations)                     │
│  └── marketData.js (Market Data)                            │
├─────────────────────────────────────────────────────────────┤
│  External APIs                                              │
│  ├── AdEx AURA API                                          │
│  ├── MetaMask (Web3 Provider)                               │
│  ├── CoinGecko API                                          │
│  └── Alchemy/Infura                                         │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Code Structure

### Folder Organization

```
src/
├── components/              # Reusable React components
│   ├── Dashboard.jsx       # Main dashboard
│   ├── Portfolio.jsx       # Portfolio management
│   ├── ChatInterface.jsx   # AI chat
│   ├── MarketOverview.jsx  # Market view
│   ├── AlertsPanel.jsx     # Alert system
│   ├── EducationSection.jsx # Education center
│   ├── Header.jsx          # Main navigation
│   ├── LoadingScreen.jsx   # Loading screen
│   ├── WalletConnect.jsx   # Wallet connection
│   └── ErrorBoundary.jsx   # Error handling
├── contexts/               # Global state management
│   ├── WalletContext.jsx   # Web3 wallet state
│   └── AuraContext.jsx     # AURA AI state
├── services/               # Business logic and APIs
│   ├── auraAPI.js         # AdEx AURA integration
│   ├── walletService.js    # Web3 operations
│   └── marketData.js       # Market data
├── App.jsx                # Root component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

### Organization Principles

1. **Separation of Responsibilities**: Each file has a specific responsibility
2. **High Cohesion**: Related components are close together
3. **Low Coupling**: Minimal dependencies between modules
4. **Reusability**: Reusable components and services

## 🧩 React Components

### Component Hierarchy

```
App
├── ErrorBoundary
│   └── WalletProvider
│       └── AuraProvider
│           ├── Header
│           │   └── WalletConnect
│           └── Dashboard
│               ├── MarketOverview
│               ├── Portfolio
│               ├── ChatInterface
│               ├── AlertsPanel
│               └── EducationSection
```

### Component Patterns

#### 1. Functional Components with Hooks
```javascript
const Component = () => {
  const [state, setState] = useState(initialState)
  const { contextValue } = useContext(Context)
  
  useEffect(() => {
    // Side effects
  }, [dependencies])
  
  return <div>JSX</div>
}
```

#### 2. Compound Components
```javascript
// Example: Dashboard with tabs
<Dashboard>
  <TabPanel id="overview">
    <MarketOverview />
  </TabPanel>
  <TabPanel id="portfolio">
    <Portfolio />
  </TabPanel>
</Dashboard>
```

#### 3. Render Props / Children as Function
```javascript
<DataProvider>
  {({ data, loading, error }) => (
    loading ? <Loading /> : <DataDisplay data={data} />
  )}
</DataProvider>
```

## 🔄 State Management

### Context API Pattern

#### WalletContext
```javascript
const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [isConnected, setIsConnected] = useState(false)
  
  const connectWallet = async () => { /* ... */ }
  
  return (
    <WalletContext.Provider value={{
      account, balance, isConnected, connectWallet
    }}>
      {children}
    </WalletContext.Provider>
  )
}
```

#### AuraContext
```javascript
const AuraContext = createContext()

export const AuraProvider = ({ children }) => {
  const [conversation, setConversation] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const sendMessage = async (message, context) => { /* ... */ }
  
  return (
    <AuraContext.Provider value={{
      conversation, isLoading, sendMessage
    }}>
      {children}
    </AuraContext.Provider>
  )
}
```

### Estado Local vs Global

| Tipo | Cuándo Usar | Ejemplos |
|------|-------------|----------|
| **Estado Local** | Solo el componente lo necesita | Formularios, UI temporal |
| **Estado Global** | Múltiples componentes lo necesitan | Wallet, conversación IA |

## 🌐 Integración de APIs

### Service Layer Pattern

#### auraAPI.js
```javascript
export const auraAPI = {
  async sendMessage(message, context) {
    const response = await auraClient.post('/chat', {
      message,
      context,
      options: { include_analysis: true }
    })
    return response.data
  }
}
```

#### walletService.js
```javascript
export const walletService = {
  async connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    return accounts[0]
  }
}
```

### Error Handling Strategy

```javascript
// Nivel de Servicio
try {
  const data = await api.call()
  return data
} catch (error) {
  console.error('API Error:', error)
  throw new Error('Error procesando solicitud')
}

// Nivel de Componente
const [error, setError] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await service.getData()
      setData(data)
    } catch (err) {
      setError(err.message)
      toast.error('Error cargando datos')
    }
  }
  fetchData()
}, [])
```

## 🎨 Sistema de Diseño

### Design System Architecture

```
TailwindCSS
├── Base Styles (index.css)
│   ├── Reset/Normalize
│   ├── Typography
│   └── Global Variables
├── Component Classes
│   ├── .btn-primary
│   ├── .card
│   └── .input-field
└── Utility Classes
    ├── Layout (flex, grid)
    ├── Spacing (p, m, gap)
    └── Colors (bg-, text-)
```

### Token System

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#0ea5e9',
        900: '#0c4a6e',
      },
      crypto: {
        bitcoin: '#f7931a',
        ethereum: '#627eea',
      }
    }
  }
}
```

## 🔒 Seguridad

### Principios de Seguridad

1. **Never Trust Client**: Validación en servidor
2. **Least Privilege**: Mínimos permisos necesarios
3. **Defense in Depth**: Múltiples capas de seguridad
4. **Secure by Default**: Configuración segura por defecto

### Web3 Security

```javascript
// Validación de red
const isValidNetwork = (chainId) => {
  const allowedNetworks = ['0x1', '0x5'] // Mainnet, Goerli
  return allowedNetworks.includes(chainId)
}

// Validación de dirección
const isValidAddress = (address) => {
  return ethers.isAddress(address)
}
```

### API Security

```javascript
// Rate limiting
const rateLimiter = {
  requests: new Map(),
  limit: 100, // requests per minute
  
  checkLimit(userId) {
    const now = Date.now()
    const userRequests = this.requests.get(userId) || []
    const recentRequests = userRequests.filter(time => now - time < 60000)
    
    if (recentRequests.length >= this.limit) {
      throw new Error('Rate limit exceeded')
    }
    
    recentRequests.push(now)
    this.requests.set(userId, recentRequests)
  }
}
```

## 📊 Performance

### Optimization de Rendering

```javascript
// React.memo para componentes puros
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})

// useMemo para cálculos costosos
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// useCallback para funciones estables
const handleClick = useCallback(() => {
  doSomething()
}, [dependency])
```

### Code Splitting

```javascript
// Lazy loading de componentes
const Portfolio = lazy(() => import('./components/Portfolio'))
const ChatInterface = lazy(() => import('./components/ChatInterface'))

// Uso con Suspense
<Suspense fallback={<Loading />}>
  <Portfolio />
</Suspense>
```

### Bundle Optimization

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['ethers'],
          charts: ['recharts']
        }
      }
    }
  }
})
```

## 🧪 Testing Strategy

### Testing Pyramid

```
    ┌─────────────────┐
    │   E2E Tests     │ ← Pocos, críticos
    ├─────────────────┤
    │ Integration     │ ← Algunos, componentes
    ├─────────────────┤
    │ Unit Tests      │ ← Muchos, funciones
    └─────────────────┘
```

### Testing Tools

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress
- **E2E Tests**: Playwright
- **Visual Regression**: Chromatic

## 🚀 Deployment

### Build Process

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

### Deployment Targets

1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **CDN**: CloudFlare, AWS CloudFront
3. **Container**: Docker + Kubernetes

### Environment Configuration

```javascript
// Configuración por ambiente
const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    debug: true
  },
  production: {
    apiUrl: 'https://api.cryptomentor.ai',
    debug: false
  }
}
```

## 📈 Monitoring y Analytics

### Error Tracking

```javascript
// Error boundary con logging
componentDidCatch(error, errorInfo) {
  // Log to external service
  logError(error, errorInfo)
}
```

### Performance Monitoring

```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## 🔮 Arquitectura Futura

### Roadmap Técnico

1. **Micro-frontends**: Separación en módulos independientes
2. **GraphQL**: API unificada para datos
3. **PWA**: Aplicación web progresiva
4. **Offline Support**: Funcionalidad sin conexión
5. **Real-time**: WebSockets para datos en tiempo real

### Scalability

- **Horizontal Scaling**: Múltiples instancias
- **Database Sharding**: Particionado de datos
- **CDN**: Distribución global de contenido
- **Caching**: Redis, Memcached

---

Esta arquitectura está diseñada para ser **escalable**, **mantenible** y **performante**, siguiendo las mejores prácticas de desarrollo moderno.
