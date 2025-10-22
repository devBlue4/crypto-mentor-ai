# Arquitectura del Sistema - CryptoMentor AI

Este documento describe la arquitectura técnica de CryptoMentor AI, incluyendo la estructura del código, patrones de diseño y decisiones arquitectónicas.

## 🏗️ Arquitectura General

### Patrón de Arquitectura
CryptoMentor AI utiliza una **arquitectura de frontend moderno** basada en React con las siguientes características:

- **Single Page Application (SPA)**: Navegación sin recarga de página
- **Component-Based Architecture**: Componentes reutilizables y modulares
- **Context API**: Gestión de estado global sin Redux
- **Service Layer**: Separación de lógica de negocio
- **Progressive Enhancement**: Funciona sin JavaScript habilitado

### Diagrama de Arquitectura

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

## 📁 Estructura del Código

### Organización de Carpetas

```
src/
├── components/              # Componentes React reutilizables
│   ├── Dashboard.jsx       # Dashboard principal
│   ├── Portfolio.jsx       # Gestión de portfolio
│   ├── ChatInterface.jsx   # Chat con IA
│   ├── MarketOverview.jsx  # Vista de mercado
│   ├── AlertsPanel.jsx     # Sistema de alertas
│   ├── EducationSection.jsx # Centro educativo
│   ├── Header.jsx          # Navegación principal
│   ├── LoadingScreen.jsx   # Pantalla de carga
│   ├── WalletConnect.jsx   # Conexión de wallet
│   └── ErrorBoundary.jsx   # Manejo de errores
├── contexts/               # Gestión de estado global
│   ├── WalletContext.jsx   # Estado del wallet Web3
│   └── AuraContext.jsx     # Estado de IA AURA
├── services/               # Lógica de negocio y APIs
│   ├── auraAPI.js         # Integración con AdEx AURA
│   ├── walletService.js    # Operaciones Web3
│   └── marketData.js       # Datos de mercado
├── App.jsx                # Componente raíz
├── main.jsx               # Punto de entrada
└── index.css              # Estilos globales
```

### Principios de Organización

1. **Separación de Responsabilidades**: Cada archivo tiene una responsabilidad específica
2. **Cohesión Alta**: Componentes relacionados están cerca
3. **Acoplamiento Bajo**: Dependencias mínimas entre módulos
4. **Reutilización**: Componentes y servicios reutilizables

## 🧩 Componentes React

### Jerarquía de Componentes

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

### Patrones de Componentes

#### 1. Functional Components con Hooks
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
// Ejemplo: Dashboard con pestañas
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

## 🔄 Gestión de Estado

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

### Configuración de APIs con Proxy

#### src/config/api.js (Nuevo)
```javascript
export const API_CONFIG = {
  development: {
    coingecko: '/api/coingecko',
    fearGreed: '/api/feargreed/fng/',
    rss2json: 'https://api.rss2json.com/v1/api.json',
    allorigins: 'https://api.allorigins.win/get'
  },
  production: {
    coingecko: 'https://api.coingecko.com/api/v3',
    fearGreed: 'https://api.alternative.me/fng/',
    rss2json: 'https://api.rss2json.com/v1/api.json',
    allorigins: 'https://api.allorigins.win/get'
  }
}

export const getApiConfig = () => {
  const isDev = import.meta.env.DEV
  return isDev ? API_CONFIG.development : API_CONFIG.production
}
```

#### Configuración de Proxy (vite.config.js)
```javascript
proxy: {
  '/api/coingecko': {
    target: 'https://api.coingecko.com/api/v3',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api\/coingecko/, '')
  },
  '/api/feargreed': {
    target: 'https://api.alternative.me',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api\/feargreed/, '')
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

### Optimización de Rendering

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

### Escalabilidad

- **Horizontal Scaling**: Múltiples instancias
- **Database Sharding**: Particionado de datos
- **CDN**: Distribución global de contenido
- **Caching**: Redis, Memcached

---

Esta arquitectura está diseñada para ser **escalable**, **mantenible** y **performante**, siguiendo las mejores prácticas de desarrollo moderno.
