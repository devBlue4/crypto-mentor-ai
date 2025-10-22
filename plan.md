# Proyecto: Asistente de Trading Web3 con IA (AdEx AURA)

## Descripción del Proyecto

Construir **CryptoMentor AI**, un asistente inteligente que utiliza la API de AdEx AURA para proporcionar análisis de mercado, recomendaciones personalizadas y educación sobre criptomonedas en tiempo real. El proyecto combina Web3, IA y una interfaz moderna.

## ¿Por qué este proyecto es ideal para ti?

- **Aprenderás progresivamente**: Empezaremos con lo básico (HTML/CSS/JS) y avanzaremos a Web3
- **Competitivo para el hackathon**: Usa directamente la API de AURA (requisito del hackathon)
- **Impresionante**: Combina IA + Web3 + UX moderna
- **Práctico**: Resuelve un problema real (ayudar a principiantes en crypto)

## Stack Tecnológico

**Frontend:**

- React + Vite (framework moderno y rápido)
- TailwindCSS (estilos modernos sin CSS complejo)
- Ethers.js (conexión con wallets)

**Backend/API:**

- AdEx AURA API (IA para análisis y recomendaciones)
- APIs públicas: CoinGecko/CoinMarketCap (datos de mercado)
- Alchemy/Infura (datos blockchain)

**Herramientas:**

- Node.js y npm
- Git para control de versiones
- MetaMask para testing

## Funcionalidades Principales

### 1. Chat con IA (AURA)

- Interfaz de chat donde usuarios hacen preguntas sobre crypto
- AURA responde con análisis, explicaciones y recomendaciones
- Contexto personalizado basado en el portfolio del usuario

### 2. Análisis de Wallet

- Conectar wallet (MetaMask)
- Mostrar balance y tokens
- IA analiza el portfolio y da sugerencias

### 3. Alertas Inteligentes

- Configurar alertas de precio
- IA sugiere momentos óptimos de compra/venta

### 4. Educación Interactiva

- Sección de aprendizaje con explicaciones de conceptos
- Quiz interactivos potenciados por IA

## Estructura del Proyecto

```
crypto-mentor-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── WalletConnect.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   ├── auraAPI.js
│   │   │   ├── walletService.js
│   │   │   └── marketData.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .env.example
```

## Fases de Desarrollo

### Fase 1: Setup Inicial (Día 1)

- Configurar proyecto React con Vite
- Instalar dependencias (Ethers.js, TailwindCSS)
- Crear estructura de carpetas
- Diseñar UI básica con componentes

### Fase 2: Integración Web3 (Día 2-3)

- Implementar conexión con MetaMask
- Mostrar balance de wallet
- Obtener lista de tokens del usuario
- Integrar API de precios (CoinGecko)

### Fase 3: Integración AURA API (Día 4-5)

- Configurar llamadas a AdEx AURA API
- Crear interfaz de chat
- Implementar análisis de portfolio con IA
- Generar recomendaciones personalizadas

### Fase 4: Funcionalidades Avanzadas (Día 6-7)

- Sistema de alertas
- Sección educativa
- Gráficos de precios
- Historial de conversaciones

### Fase 5: Pulido y Presentación (Día 8)

- Mejorar diseño y UX
- Testing completo
- Preparar demo y presentación
- Documentar el código

## Puntos Clave para Ganar

1. **Uso innovador de AURA**: No solo chat básico, sino análisis contextual del portfolio
2. **UX excepcional**: Diseño limpio, moderno y fácil de usar
3. **Utilidad real**: Resuelve un problema real para usuarios crypto
4. **Demostración clara**: Video demo mostrando todas las funcionalidades
5. **Código limpio**: Bien documentado y organizado

## Recursos de Aprendizaje

- **React**: https://react.dev/learn
- **Ethers.js**: https://docs.ethers.org/v6/
- **TailwindCSS**: https://tailwindcss.com/docs
- **AdEx AURA API**: Documentación del hackathon
- **Web3 concepts**: https://ethereum.org/en/developers/docs/

## Próximos Pasos

1. Registrarte en el hackathon de AdEx AURA
2. Obtener API key de AURA
3. Configurar entorno de desarrollo (Node.js, VS Code)
4. Comenzar con la Fase 1 del desarrollo