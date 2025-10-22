# Resumen de Cambios (Demo CryptoMentor AI)

Fecha: 2025-10-22

## UI/UX
- Header centrado con título y subtítulo, restaurando el botón/estado de conexión de wallet a la derecha.
- Tabs del Dashboard rediseñadas para ocupar todo el ancho, con estilo pill y sin líneas de borde.
- Eliminación de pestañas: `Cache Manager`, `Performance`, `Watchlist` y `History` del Dashboard.
- Pantalla de carga (LoadingScreen) migrada a modo oscuro con mejor contraste.
- Educación: conversión a Quiz en inglés con IA (5 preguntas, 4 opciones, explicación, auto‑avance, scoring y aprobado ≥70%). Botón seleccionado en oscuro.

## Market Overview
- Eliminación de gráficos (Price y Dominance) y “Top Performers” por solicitud.
- Noticias reales en inglés (máximo 5):
  - Fuentes RSS públicas: CoinDesk, Cointelegraph y CryptoNews.
  - Uso de proxy CORS `api.allorigins.win`.
  - Extracción de miniatura (media:content/enclosure/img) y sentimiento básico.
  - Cada noticia abre en una pestaña nueva.

## Alerts
- Modal de creación de alertas funcional; si el endpoint real falla, se guarda localmente en la UI para la demo (con toast informativo).

## AURA / IA
- Implementado `generateQuiz` en `auraAPI` con:
  - Prioridad AURA → GPT (fallback) → Demo.
  - Normalización de resultados.
- Añadido “modo demo opcional” (`VITE_DISABLE_DEMO=true` para forzar errores reales o claves obligatorias).
- Mecanismo de demo también aplicado a `sendMessage`, `analyzePortfolio`, `getMarketInsights` y `getPersonalizedRecommendations` (solo se usa demo si está habilitado).

## Archivos principales modificados
- `src/components/Header.jsx` (centrado y wallet a la derecha)
- `src/components/Dashboard.jsx` (tabs y eliminación de secciones)
- `src/components/LoadingScreen.jsx` (tema oscuro)
- `src/components/EducationSection.jsx` (quiz IA, scoring, UI oscuro)
- `src/contexts/AuraContext.jsx` (exposición de `generateQuiz`)
- `src/services/auraAPI.js` (quiz, demo opcional, fallbacks IA)
- `src/components/AlertsPanel.jsx` (fallback local al crear alerta)
- `src/services/marketData.js` (noticias reales con RSS, 5 items + miniatura)
- `src/components/MarketOverview.jsx` (render de noticias con imagen y link)

## Variables de entorno
Ejemplo `.env` para demo real sin datos mock:
```
VITE_AURA_API_KEY=TU_CLAVE_AURA
VITE_AURA_API_BASE=https://api.adex.network/aura/v1
VITE_OPENAI_API_KEY=OPCIONAL_PARA_FALLBACK
VITE_DISABLE_DEMO=true
```

Si deseas permitir modos de demostración cuando falten claves:
```
VITE_DISABLE_DEMO=false
```

## Consideraciones
- El proxy de RSS depende de `api.allorigins.win`; para producción se recomienda un proxy propio o backend simple.
- El fallback local de alertas guarda solo en memoria (no persistente); se puede añadir `localStorage` si lo necesitas.
- El quiz IA usa 5 preguntas por defecto; se puede hacer configurable desde la UI.

---

¿Quieres que persista la lista de alertas en `localStorage` y que las noticias se filtren por fuente/tema? Puedo implementarlo rápido.


