# Solución de Problemas - CryptoMentor AI

Esta guía te ayudará a resolver problemas comunes que pueden surgir al usar CryptoMentor AI.

## 🚨 Problemas Críticos

### La aplicación no carga / Pantalla blanca

**Síntomas:**
- Pantalla completamente blanca
- Consola muestra errores
- Aplicación no responde

**Diagnóstico:**
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo

**Soluciones:**

#### Error: "Cannot read properties of undefined"
```javascript
// Problema: Acceso a propiedades de objetos undefined
// Solución: Agregar verificaciones
const data = marketData?.property || defaultValue
```

#### Error: "Module not found"
```bash
# Solución: Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Port 3000 is already in use"
```bash
# Solución: Usar puerto diferente
npm run dev -- --port 3001
```

### MetaMask no se conecta

**Síntomas:**
- Botón "Conectar Wallet" no funciona
- Error "MetaMask not found"
- Conexión falla repetidamente

**Diagnóstico:**
```javascript
// Verificar en consola del navegador
console.log(typeof window.ethereum) // Debe mostrar "object"
```

**Soluciones:**

#### MetaMask no está instalado
1. Ve a [metamask.io](https://metamask.io/download/)
2. Descarga la extensión para tu navegador
3. Crea una nueva wallet o importa una existente
4. Recarga la página

#### MetaMask no está desbloqueado
1. Haz clic en el icono de MetaMask
2. Ingresa tu contraseña
3. Asegúrate de que esté desbloqueado
4. Intenta conectar de nuevo

#### Red incorrecta
1. Abre MetaMask
2. Verifica que estés en la red correcta
3. Cambia a Ethereum Mainnet o Goerli Testnet
4. Recarga la aplicación

#### Permisos denegados
1. Ve a la configuración de MetaMask
2. Revoca permisos para el sitio
3. Recarga la página
4. Conecta de nuevo y acepta permisos

### AURA no responde

**Síntomas:**
- Chat no envía mensajes
- Indicador de "escribiendo" infinito
- Error "Failed to send message"

**Diagnóstico:**
```javascript
// Verificar API key en consola
console.log(import.meta.env.VITE_AURA_API_KEY) // Debe mostrar tu key
```

**Soluciones:**

#### Sin API key
1. Verifica que tengas un archivo `.env`
2. Agrega tu API key de AURA:
   ```env
   VITE_AURA_API_KEY=tu_api_key_aqui
   ```
3. Reinicia el servidor de desarrollo

#### API key inválida
1. Verifica que la API key sea correcta
2. Confirma que no tenga espacios extra
3. Regenera la API key si es necesario
4. Actualiza el archivo `.env`

#### Rate limit excedido
1. Espera unos minutos
2. Reduce la frecuencia de mensajes
3. Contacta soporte si persiste

#### Sin conexión a internet
1. Verifica tu conexión
2. Prueba otros sitios web
3. Reinicia tu router si es necesario

## 💻 Problemas de Desarrollo

### Errores de compilación

**Error: "Cannot resolve dependency"**
```bash
# Solución
npm install
# O específicamente
npm install nombre-del-paquete
```

**Error: "ESLint errors"**
```bash
# Ver errores
npm run lint

# Corregir automáticamente
npm run lint:fix
```

**Error: "TypeScript errors"**
```bash
# Verificar tipos
npx tsc --noEmit

# Instalar tipos faltantes
npm install --save-dev @types/nombre-del-paquete
```

### Problemas de build

**Error: "Build failed"**
```bash
# Limpiar build anterior
rm -rf dist

# Reinstalar dependencias
rm -rf node_modules
npm install

# Build de nuevo
npm run build
```

**Error: "Out of memory"**
```bash
# Aumentar memoria de Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Problemas de hot reload

**Cambios no se reflejan:**
1. Verifica que el servidor esté corriendo
2. Recarga la página manualmente
3. Reinicia el servidor de desarrollo
4. Limpia cache del navegador

## 🌐 Problemas de Red y APIs

### APIs no responden

**CoinGecko API:**
```javascript
// Verificar en consola
fetch('https://api.coingecko.com/api/v3/ping')
  .then(response => response.json())
  .then(data => console.log(data))
```

**Soluciones:**
1. Verifica tu conexión a internet
2. Espera unos minutos (rate limiting)
3. Verifica que las APIs estén funcionando
4. Usa API keys si tienes límites

### Datos no se actualizan

**Portfolio no actualiza:**
1. Haz clic en "Actualizar" en el portfolio
2. Desconecta y vuelve a conectar el wallet
3. Verifica que estés en la red correcta
4. Recarga la página

**Precios desactualizados:**
1. Los precios se actualizan cada 30 segundos
2. Usa el botón "Actualizar" para forzar actualización
3. Verifica que las APIs de precios funcionen

## 📱 Problemas de Navegador

### Chrome

**Extensiones conflictivas:**
1. Deshabilita extensiones temporalmente
2. Usa modo incógnito para probar
3. Identifica la extensión problemática
4. Configura excepciones si es necesario

**Cache corrupto:**
1. Presiona Ctrl+Shift+R (hard refresh)
2. Ve a Configuración > Privacidad > Limpiar datos
3. Selecciona "Imágenes y archivos en caché"
4. Haz clic en "Borrar datos"

### Firefox

**Problemas de rendimiento:**
1. Deshabilita extensiones innecesarias
2. Reinicia Firefox
3. Usa modo seguro para probar
4. Actualiza Firefox a la última versión

### Safari

**Problemas de compatibilidad:**
1. Actualiza Safari a la última versión
2. Habilita JavaScript
3. Deshabilita bloqueadores de contenido
4. Limpia cache y cookies

### Edge

**Problemas de Web3:**
1. Actualiza Edge a la última versión
2. Verifica que MetaMask esté instalado
3. Habilita extensiones en modo privado
4. Reinicia el navegador

## 🔧 Problemas de Wallet

### Transacciones fallan

**Error: "Insufficient funds"**
1. Verifica que tengas suficiente ETH para gas
2. Reduce el gas limit si es posible
3. Aumenta el gas price si la red está congestionada

**Error: "Transaction rejected"**
1. Asegúrate de confirmar en MetaMask
2. Verifica que los parámetros sean correctos
3. No canceles la transacción

**Error: "Nonce too low"**
1. Espera a que la transacción anterior se confirme
2. Reinicia MetaMask
3. Usa una nueva cuenta si persiste

### Balance incorrecto

**Balance no actualiza:**
1. Espera unos minutos para confirmación
2. Verifica la transacción en el explorador
3. Recarga la página
4. Actualiza MetaMask

**Tokens no aparecen:**
1. Agrega el token manualmente en MetaMask
2. Verifica que uses la dirección correcta del contrato
3. Confirma que el token sea ERC-20

## 🎨 Problemas de UI/UX

### Diseño roto

**Estilos no cargan:**
1. Verifica que TailwindCSS esté instalado
2. Revisa la configuración de PostCSS
3. Limpia cache del navegador
4. Reinicia el servidor de desarrollo

**Componentes no renderizan:**
1. Verifica errores en la consola
2. Revisa imports de componentes
3. Confirma que los props sean correctos
4. Usa React DevTools para debugging

### Responsividad

**Diseño no se adapta:**
1. Verifica breakpoints de TailwindCSS
2. Usa herramientas de desarrollador para probar
3. Revisa CSS personalizado
4. Confirma viewport meta tag

## 📊 Problemas de Datos

### Gráficos no cargan

**Recharts no renderiza:**
1. Verifica que los datos estén en formato correcto
2. Confirma que ResponsiveContainer tenga dimensiones
3. Revisa errores en la consola
4. Actualiza Recharts si es necesario

**Datos faltantes:**
1. Verifica que las APIs respondan
2. Confirma que los datos tengan la estructura esperada
3. Agrega datos de fallback
4. Revisa el manejo de estados de carga

### Cálculos incorrectos

**Valores de portfolio:**
1. Verifica precios de tokens
2. Confirma conversiones de unidades
3. Revisa fórmulas de cálculo
4. Actualiza datos manualmente

## 🔒 Problemas de Seguridad

### Advertencias de seguridad

**"Not secure" en navegador:**
1. Usa HTTPS en producción
2. Verifica certificados SSL
3. No uses HTTP para datos sensibles

**Advertencias de MetaMask:**
1. Lee cuidadosamente las advertencias
2. Verifica direcciones de contratos
3. No compartas claves privadas
4. Usa solo sitios confiables

### Validaciones fallan

**Direcciones inválidas:**
```javascript
// Verificar formato
ethers.isAddress(address) // Debe retornar true
```

**Montos inválidos:**
```javascript
// Verificar formato numérico
const amount = parseFloat(input)
if (isNaN(amount) || amount <= 0) {
  throw new Error('Amount inválido')
}
```

## 🚀 Problemas de Performance

### Aplicación lenta

**Diagnóstico:**
1. Abre herramientas de desarrollador
2. Ve a pestaña "Performance"
3. Graba una sesión de uso
4. Identifica cuellos de botella

**Soluciones:**
1. Optimiza imágenes y assets
2. Implementa lazy loading
3. Usa React.memo para componentes
4. Optimiza re-renders

### Memoria alta

**Identificar memory leaks:**
1. Usa herramientas de profiling
2. Verifica event listeners no removidos
3. Confirma que useEffect se limpie
4. Revisa referencias circulares

## 📝 Logging y Debugging

### Habilitar logs detallados

```javascript
// En desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### Usar React DevTools

1. Instala React DevTools extension
2. Inspecciona componentes
3. Revisa props y state
4. Identifica re-renders innecesarios

### Network debugging

1. Abre herramientas de desarrollador
2. Ve a pestaña "Network"
3. Revisa requests fallidos
4. Verifica headers y respuestas

## 🆘 Cuándo Contactar Soporte

### Contacta soporte si:

- **Errores críticos** que impiden el uso
- **Pérdida de datos** o transacciones
- **Problemas de seguridad** sospechosos
- **Bugs reproducibles** con pasos claros

### Información para incluir:

1. **Descripción del problema**
2. **Pasos para reproducir**
3. **Capturas de pantalla**
4. **Logs de consola**
5. **Navegador y versión**
6. **Sistema operativo**

### Canales de soporte:

- **Email**: support@cryptomentor.ai
- **Discord**: [Comunidad](https://discord.gg/cryptomentor)
- **GitHub**: [Issues](https://github.com/tu-usuario/crypto-mentor-ai/issues)

## 🔧 Herramientas de Debugging

### Extensiones útiles:

- **React Developer Tools**
- **Redux DevTools** (si usas Redux)
- **MetaMask**
- **Web3 Developer Tools**

### Comandos útiles:

```bash
# Verificar dependencias
npm audit

# Limpiar cache
npm cache clean --force

# Verificar versiones
npm outdated

# Debug mode
DEBUG=* npm run dev
```

### Scripts de utilidad:

```bash
# Verificar configuración
npm run setup

# Limpiar build
npm run clean

# Verificar linting
npm run lint

# Tests
npm test
```

---

Si sigues teniendo problemas después de revisar esta guía, no dudes en contactar soporte con toda la información relevante. 🚀
