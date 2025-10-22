# Documentación de CryptoMentor AI 📚

Esta carpeta contiene toda la documentación técnica y de usuario para el proyecto CryptoMentor AI.

## 📖 Índice de Documentación

### 🚀 Para Desarrolladores
- [Guía de Instalación](./installation.md) - Configuración del entorno de desarrollo
- [Arquitectura del Sistema](./architecture.md) - Estructura y diseño del proyecto
- [Guía de Contribución](./contributing.md) - Cómo contribuir al proyecto
- [API Reference](./api-reference.md) - Documentación de APIs y servicios
- [Guía de Deployment](./deployment.md) - Cómo desplegar la aplicación

### 👥 Para Usuarios
- [Guía de Usuario](./user-guide.md) - Manual completo de usuario
- [FAQ](./faq.md) - Preguntas frecuentes
- [Troubleshooting](./troubleshooting.md) - Solución de problemas comunes

### 🛠️ Técnico
- [Componentes](./components.md) - Documentación de componentes React
- [Servicios](./services.md) - Documentación de servicios y APIs
- [Contextos](./contexts.md) - Gestión de estado con React Context
- [Estilos](./styling.md) - Guía de TailwindCSS y diseño
- [Testing](./testing.md) - Estrategias de testing

### 📊 Específico del Proyecto
- [Integración Web3](./web3-integration.md) - Detalles de integración con MetaMask
- [Integración AdEx AURA](./aura-integration.md) - Cómo funciona la IA de AdEx
- [Datos de Mercado](./market-data.md) - Fuentes de datos y APIs
- [Seguridad](./security.md) - Consideraciones de seguridad

### 🎯 Para el Hackathon
- [Presentación del Proyecto](./hackathon-presentation.md) - Resumen para judges
- [Demo Guide](./demo-guide.md) - Cómo hacer una demo efectiva
- [Roadmap](./roadmap.md) - Planes futuros del proyecto

## 🔧 Configuración Rápida

Para empezar rápidamente:

1. **Desarrollo**: Ver [Guía de Instalación](./installation.md)
2. **Uso**: Ver [Guía de Usuario](./user-guide.md)
3. **Contribuir**: Ver [Guía de Contribución](./contributing.md)

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/crypto-mentor-ai/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/crypto-mentor-ai/discussions)
- **Email**: support@cryptomentor.ai

---

*Documentación mantenida por el equipo de CryptoMentor AI*

## ⭐ AdEx AURA API y recomendaciones por dirección

La app está potenciada por la AdEx AURA API. Además del chat y el análisis de portfolio, el agente puede tomar una account address y producir una lista de recomendaciones y estrategias en lenguaje natural, con una descripción de lo que hace cada una.

Ejemplo de prompt (para el Chat o la pestaña Strategies):

```text
Analyze address 0x1C680f16b2270e324D5778305C9EC96784c832ab and give app recommendations and strategies in natural language form, with a description of what each one does.
```

Resultado esperado:
- Lista de estrategias y apps recomendadas
- Descripción en lenguaje simple de lo que hace cada una
- (Opcional) Agrupar por horizonte temporal/riesgo con pasos accionables
