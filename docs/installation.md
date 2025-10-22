# Guía de Instalación - CryptoMentor AI

Esta guía te ayudará a configurar el entorno de desarrollo para CryptoMentor AI.

## 📋 Prerrequisitos

### Software Requerido

- **Node.js**: Versión 18.0 o superior
- **npm**: Versión 8.0 o superior (viene con Node.js)
- **Git**: Para clonar el repositorio
- **MetaMask**: Extensión del navegador para Web3

### Verificar Instalaciones

```bash
# Verificar Node.js
node --version
# Debería mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debería mostrar: 8.x.x o superior

# Verificar Git
git --version
```

### Navegadores Soportados

- **Chrome**: Versión 90+
- **Firefox**: Versión 88+
- **Safari**: Versión 14+
- **Edge**: Versión 90+

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/crypto-mentor-ai.git

# Navegar al directorio
cd crypto-mentor-ai
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias
npm install

# O usar yarn si lo prefieres
yarn install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar el archivo .env
nano .env  # o usar tu editor preferido
```

**Variables requeridas:**

```env
# AdEx AURA API (Requerida)
VITE_AURA_API_KEY=tu_api_key_de_aura_aqui

# APIs opcionales para funcionalidad extendida
VITE_COINGECKO_API_KEY=tu_api_key_de_coingecko
VITE_ALCHEMY_API_KEY=tu_api_key_de_alchemy
VITE_INFURA_API_KEY=tu_api_key_de_infura

# Configuración de la app
VITE_APP_NAME=CryptoMentor AI
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

### 4. Obtener API Keys

#### AdEx AURA API Key (Requerida)
1. Registrarse en [AdEx Network](https://adex.network)
2. Acceder al dashboard de desarrollador
3. Crear una nueva aplicación
4. Copiar la API key

#### CoinGecko API Key (Opcional)
1. Ir a [CoinGecko API](https://www.coingecko.com/en/api)
2. Registrarse para una cuenta gratuita
3. Obtener la API key del dashboard

#### Alchemy/Infura (Opcionales)
1. **Alchemy**: [alchemy.com](https://alchemy.com)
2. **Infura**: [infura.io](https://infura.io)

### 5. Instalar MetaMask

1. Ir a [metamask.io](https://metamask.io/download/)
2. Descargar la extensión para tu navegador
3. Crear una nueva wallet o importar una existente
4. **Importante**: Usar una red de prueba para desarrollo

### 6. Configurar Red de Prueba

Para desarrollo, configura una red de prueba:

1. Abrir MetaMask
2. Ir a Settings > Networks
3. Agregar red personalizada:
   - **Network Name**: Ethereum Testnet
   - **RPC URL**: `https://goerli.infura.io/v3/TU_PROJECT_ID`
   - **Chain ID**: 5
   - **Currency Symbol**: ETH
   - **Block Explorer**: `https://goerli.etherscan.io`

### 6.1. Configuración de Proxy (Nuevo)

La aplicación ahora incluye configuración automática de proxy para resolver problemas CORS:

**En desarrollo:**
- Las peticiones a CoinGecko van a través del proxy de Vite
- No se requieren configuraciones adicionales
- Los errores CORS se resuelven automáticamente

**En producción:**
- Fallback automático a datos de demostración si hay problemas CORS
- La aplicación funciona sin interrupciones

### 7. Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev

# La aplicación estará disponible en:
# http://localhost:3000
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con hot reload
npm run build        # Build de producción
npm run preview      # Preview del build de producción
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de linting automáticamente

# Utilidades
npm run setup        # Script de configuración automática
npm run clean        # Limpiar archivos de build
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 is already in use"
```bash
# Usar un puerto diferente
npm run dev -- --port 3001
```

### Error: "MetaMask not found"
- Verificar que MetaMask esté instalado
- Asegurarse de que esté habilitado en el navegador
- Recargar la página

### Error: "Invalid API key"
- Verificar que la API key esté en el archivo `.env`
- Confirmar que la API key sea válida
- Verificar que no haya espacios extra en el archivo `.env`

## 🏗️ Estructura del Proyecto

```
crypto-mentor-ai/
├── public/                 # Archivos estáticos
├── src/                   # Código fuente
│   ├── components/        # Componentes React
│   ├── contexts/         # React Contexts
│   ├── services/         # Servicios y APIs
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── docs/                # Documentación
├── scripts/             # Scripts de utilidad
├── package.json         # Dependencias y scripts
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de TailwindCSS
└── .env                 # Variables de entorno
```

## 🔄 Actualizaciones

Para mantener el proyecto actualizado:

```bash
# Verificar actualizaciones de dependencias
npm outdated

# Actualizar dependencias
npm update

# Actualizar a las últimas versiones (cuidado)
npm install package@latest
```

## 📝 Notas de Desarrollo

### Variables de Entorno
- Todas las variables deben empezar con `VITE_` para ser accesibles en el frontend
- Nunca commitear el archivo `.env` al repositorio
- Usar `.env.example` como plantilla

### MetaMask para Desarrollo
- Usar siempre redes de prueba para desarrollo
- Nunca usar claves privadas reales en desarrollo
- Configurar fondos de prueba desde faucets

### Hot Reload
- Vite proporciona hot reload automático
- Los cambios en componentes se reflejan inmediatamente
- Los cambios en configuración requieren reiniciar el servidor

## 🆘 Obtener Ayuda

Si tienes problemas:

1. **Revisar logs**: Verificar la consola del navegador y terminal
2. **Documentación**: Consultar los archivos en `/docs`
3. **Issues**: Buscar en [GitHub Issues](https://github.com/tu-usuario/crypto-mentor-ai/issues)
4. **Comunidad**: Unirse al [Discord](https://discord.gg/cryptomentor)

---

¡Feliz desarrollo! 🚀
