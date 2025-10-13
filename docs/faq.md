# FAQ - CryptoMentor AI

Preguntas frecuentes sobre CryptoMentor AI, su uso, configuración y funcionalidades.

## 🚀 Instalación y Configuración

### ¿Cómo instalo CryptoMentor AI?

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/crypto-mentor-ai.git
   cd crypto-mentor-ai
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   ```bash
   cp env.example .env
   # Edita .env y agrega tu API key de AURA
   ```

4. **Ejecuta la aplicación:**
   ```bash
   npm run dev
   ```

### ¿Qué necesito para usar CryptoMentor AI?

**Requisitos mínimos:**
- Node.js 18+
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- MetaMask instalado
- API key de AdEx AURA

**Opcional:**
- API keys de CoinGecko, Alchemy, Infura para funcionalidad extendida

### ¿Dónde obtengo la API key de AdEx AURA?

1. Ve a [adex.network](https://adex.network)
2. Regístrate para una cuenta
3. Accede al dashboard de desarrollador
4. Crea una nueva aplicación
5. Copia la API key generada

### ¿La aplicación funciona sin API key de AURA?

Sí, CryptoMentor AI incluye un **modo demo** que funciona sin API key. Sin embargo, las respuestas serán limitadas y no incluirán análisis personalizados reales.

## 💼 Wallet y Web3

### ¿Qué wallets son compatibles?

Actualmente CryptoMentor AI soporta:
- **MetaMask** (recomendado)
- **WalletConnect** (próximamente)
- **Coinbase Wallet** (próximamente)

### ¿Es seguro conectar mi wallet?

Sí, CryptoMentor AI:
- **Solo lee** datos públicos de tu wallet
- **No solicita** permisos de transacción
- **No almacena** claves privadas
- **No puede** acceder a tus fondos

### ¿Qué redes blockchain soporta?

**Redes principales:**
- Ethereum Mainnet
- Polygon Mainnet
- Binance Smart Chain (próximamente)

**Redes de prueba:**
- Goerli Testnet
- Mumbai Testnet

### ¿Puedo usar la aplicación sin conectar wallet?

Sí, puedes usar:
- Chat con AURA
- Análisis de mercado
- Centro de educación
- Sistema de alertas

Sin embargo, para análisis de portfolio necesitas conectar tu wallet.

## 🤖 IA AURA

### ¿Qué es AURA?

AURA es la IA de AdEx Network especializada en:
- Análisis de criptomonedas
- Recomendaciones de trading
- Insights de mercado
- Educación crypto

### ¿Cómo funciona el chat con AURA?

1. **Escribe tu pregunta** en el campo de texto
2. **AURA analiza** tu mensaje y contexto
3. **Genera una respuesta** personalizada
4. **Incluye recomendaciones** si es relevante

### ¿AURA puede hacer trading por mí?

No, AURA solo proporciona:
- **Análisis** del mercado y tu portfolio
- **Recomendaciones** educativas
- **Insights** sobre tendencias
- **Información** para ayudarte a decidir

### ¿Las recomendaciones de AURA son garantizadas?

No, AURA proporciona análisis y recomendaciones basadas en:
- Datos históricos
- Tendencias del mercado
- Tu perfil de riesgo

**Importante:** Siempre haz tu propia investigación antes de invertir.

### ¿Cómo mejora AURA sus recomendaciones?

AURA aprende de:
- Interacciones con usuarios
- Datos de mercado en tiempo real
- Feedback de la comunidad
- Actualizaciones de la IA

## 📊 Portfolio y Análisis

### ¿Cómo analiza AURA mi portfolio?

AURA evalúa:
- **Diversificación**: Distribución de activos
- **Riesgo**: Volatilidad y concentración
- **Rendimiento**: Cambios en valor
- **Liquidez**: Disponibilidad de fondos

### ¿Qué tokens detecta automáticamente?

CryptoMentor AI detecta tokens ERC-20 populares:
- USDC, USDT, WBTC
- LINK, UNI, MATIC
- Y muchos más

### ¿Puedo agregar tokens personalizados?

Actualmente no, pero puedes sugerir tokens para agregar en futuras versiones.

### ¿Cómo calcula el valor de mi portfolio?

El valor se calcula usando:
- Precios actuales de CoinGecko
- Balances de tokens en tu wallet
- Conversión a USD

### ¿Con qué frecuencia se actualiza mi portfolio?

- **Automaticamente**: Cada 30 segundos
- **Manual**: Usando el botón "Actualizar"
- **Al conectar**: Cuando conectas tu wallet

## 🔔 Alertas

### ¿Qué tipos de alertas puedo crear?

**Alertas de precio:**
- Por encima de un valor
- Por debajo de un valor

**Alertas de cambio:**
- Cambio positivo %
- Cambio negativo %

**Alertas de volumen:**
- Volumen alto
- Volumen bajo

### ¿Cómo recibo las alertas?

Las alertas se muestran:
- **En la aplicación** (notificaciones)
- **Por email** (si configuras)
- **Push notifications** (próximamente)

### ¿Cuántas alertas puedo tener?

No hay límite técnico, pero recomendamos:
- **Máximo 10 alertas activas**
- **Alertas relevantes** para tu estrategia
- **Revisar regularmente** y eliminar las innecesarias

### ¿Las alertas funcionan sin conexión?

No, las alertas requieren:
- Conexión a internet
- Aplicación abierta o servicio activo
- APIs funcionando correctamente

## 📚 Educación

### ¿Qué puedo aprender en el centro de educación?

**Conceptos básicos:**
- ¿Qué son las criptomonedas?
- Cómo funciona blockchain
- Tipos de wallets

**Trading:**
- Fundamentos del trading
- Análisis técnico
- Gestión de riesgo

**DeFi:**
- Protocolos descentralizados
- Yield farming
- Liquidity pools

**Seguridad:**
- Protección de wallets
- Prevención de estafas
- Mejores prácticas

### ¿Hay certificaciones o diplomas?

Actualmente no, pero estamos considerando:
- **Badges de progreso**
- **Certificados de competencia**
- **Sistema de puntos**

### ¿El contenido se actualiza?

Sí, el contenido educativo se actualiza:
- **Mensualmente** con nuevas lecciones
- **Según tendencias** del mercado
- **Basado en feedback** de usuarios

## 🔧 Problemas Técnicos

### ¿Por qué no se conecta mi wallet?

**Posibles causas:**
- MetaMask no está instalado
- MetaMask no está desbloqueado
- Estás en la red incorrecta
- Permisos denegados

**Soluciones:**
1. Instala/actualiza MetaMask
2. Desbloquea tu wallet
3. Cambia a la red correcta
4. Recarga la página

### ¿Por qué AURA no responde?

**Posibles causas:**
- Sin conexión a internet
- API key inválida o expirada
- Límite de rate excedido
- Error en el servidor

**Soluciones:**
1. Verifica tu conexión
2. Revisa tu API key
3. Espera unos minutos
4. Contacta soporte

### ¿Por qué no se actualizan los precios?

**Posibles causas:**
- APIs de precios caídas
- Límite de requests excedido
- Cache desactualizado

**Soluciones:**
1. Recarga la página
2. Espera unos minutos
3. Verifica tus API keys

### ¿La aplicación es lenta?

**Optimizaciones:**
- Cierra pestañas innecesarias
- Usa un navegador moderno
- Verifica tu conexión a internet
- Limpia cache del navegador

## 💰 Costos y Precios

### ¿CryptoMentor AI es gratuito?

**Versión básica:**
- ✅ Completamente gratuita
- ✅ Todas las funcionalidades principales
- ✅ Chat con AURA
- ✅ Análisis de portfolio

**Versión premium (futura):**
- 🔄 Funcionalidades avanzadas
- 🔄 APIs premium
- 🔄 Soporte prioritario

### ¿Hay costos ocultos?

No, CryptoMentor AI es completamente gratuito. Los únicos costos pueden ser:
- **Gas fees** para transacciones blockchain
- **API keys premium** (opcionales)

### ¿Cómo se mantiene el proyecto?

El proyecto se mantiene con:
- **Patrocinios** de la comunidad
- **Donaciones** voluntarias
- **Colaboraciones** con partners
- **Programas** de desarrollo

## 🔒 Privacidad y Seguridad

### ¿Qué datos recolecta CryptoMentor AI?

**Datos recolectados:**
- Dirección de wallet (pública)
- Balances de tokens (públicos)
- Interacciones con AURA
- Preferencias de usuario

**Datos NO recolectados:**
- Claves privadas
- Datos personales
- Información financiera privada
- Historial de transacciones

### ¿Dónde se almacenan mis datos?

**Localmente:**
- Configuraciones de usuario
- Historial de chat
- Preferencias de alertas

**En servidores:**
- Análisis anónimos
- Métricas de uso
- Datos de mercado

### ¿Puedo eliminar mis datos?

Sí, puedes:
- **Limpiar historial** de chat
- **Eliminar alertas**
- **Desconectar wallet**
- **Contactar soporte** para eliminación completa

### ¿Es seguro para principiantes?

Sí, CryptoMentor AI es seguro porque:
- **Solo lectura** de datos públicos
- **No puede** acceder a tus fondos
- **Educación** antes que trading
- **Advertencias** de riesgo incluidas

## 🌐 Idiomas y Regiones

### ¿En qué idiomas está disponible?

Actualmente:
- **Español** (completo)
- **Inglés** (próximamente)

Próximamente:
- Portugués, Francés, Alemán, Chino

### ¿Funciona en mi país?

CryptoMentor AI funciona globalmente, pero:
- **Verifica regulaciones** locales sobre crypto
- **Consulta asesoría** legal si es necesario
- **Usa redes** apropiadas para tu región

### ¿Hay restricciones geográficas?

No hay restricciones técnicas, pero:
- Algunas APIs pueden tener limitaciones
- Regulaciones locales pueden aplicar
- Recomendamos verificar compliance local

## 🚀 Futuro y Desarrollo

### ¿Qué nuevas funcionalidades vienen?

**Próximas características:**
- Trading directo desde la app
- Integración con más exchanges
- Análisis técnico avanzado
- Modo oscuro
- App móvil nativa

### ¿Cómo puedo contribuir al proyecto?

**Formas de contribuir:**
- **Código**: Pull requests en GitHub
- **Documentación**: Mejorar docs
- **Testing**: Reportar bugs
- **Feedback**: Sugerencias de funcionalidades
- **Comunidad**: Ayudar a otros usuarios

### ¿Hay roadmap público?

Sí, puedes ver el roadmap en:
- [GitHub Issues](https://github.com/tu-usuario/crypto-mentor-ai/issues)
- [Discord](https://discord.gg/cryptomentor)
- Documentación del proyecto

### ¿Cómo reporto bugs o sugerencias?

**Opciones:**
1. **GitHub Issues**: Para bugs técnicos
2. **Discord**: Para discusión
3. **Email**: support@cryptomentor.ai
4. **Formulario**: En la aplicación

## 📞 Soporte y Comunidad

### ¿Dónde obtengo ayuda?

**Canales de soporte:**
- **FAQ**: Este documento
- **Documentación**: docs/ folder
- **Discord**: Comunidad activa
- **Email**: Soporte técnico
- **GitHub**: Issues y discusiones

### ¿Hay comunidad de usuarios?

Sí, únete a:
- **Discord**: Chat en tiempo real
- **GitHub**: Discusiones técnicas
- **Twitter**: Actualizaciones
- **Reddit**: Discusiones generales

### ¿Ofrecen soporte técnico?

**Soporte disponible:**
- **Comunidad**: Discord y GitHub
- **Documentación**: Guías detalladas
- **Email**: Para casos complejos
- **Video calls**: Para partners (futuro)

### ¿Hay programa de beta testing?

Sí, puedes unirte al programa beta:
1. Únete al Discord
2. Solicita acceso beta
3. Prueba nuevas funcionalidades
4. Proporciona feedback

---

¿No encontraste tu pregunta? ¡Únete a nuestra comunidad en Discord o contacta soporte! 🚀
