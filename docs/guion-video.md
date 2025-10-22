# Guion de video (solo funcionalidades estables)

Duración aproximada: 2:30

Notas generales:
- Grabar en `http://localhost:3000`.
- Si aparece “Demo data” en Overview, continuar; la UX está preparada para modo demo.
- El flujo de `Portfolio` es opcional (requiere MetaMask). Todo lo demás funciona en demo.

### Highlight de Hackathon (enfatizar siempre)
- Mostrar en el Chat el badge “Powered by AdEx AURA API”.
- Enfatizar en voz y en pantalla la capacidad clave: el agente toma una `account address` y devuelve una lista de recomendaciones y estrategias en lenguaje natural, con una descripción de lo que hace cada una.
- Prompt principal a usar en el video:
  - `For address 0x1C680f16b2270e324D5778305C9EC96784c832ab, share 3–5 app recommendations and strategies, each with a one‑sentence description of what it does.`
- Sugerencia visual: mostrar la dirección corta `0x1C680f…32ab` en pantalla y mantener la completa en el portapapeles.

## 1) Intro (0:00–0:05)
- Toma: Pantalla de carga y luego `Header` con logo “CryptoMentor AI”.
- Voz en off: “Bienvenido a CryptoMentor AI, tu asistente inteligente para análisis cripto y educación Web3.”

## 2) Dashboard y navegación (0:05–0:20)
- Toma: `Dashboard` con mensaje “Welcome to CryptoMentor AI!” y pestañas: `Overview`, `Portfolio`, `AI Chat`, `Alerts`, `Education`.
- Acción: Mover el cursor por las pestañas sin hacer clic aún.
- Voz en off: “La app es rápida, clara y organizada por pestañas para que encuentres todo en un clic.”

## 3) Overview – Resumen de mercado y noticias (0:20–0:50)
- Toma: `Overview` (activo por defecto).
- Acción: Hacer scroll por tarjetas “Market Cap”, “24h Volume”, “Fear & Greed”, “Bitcoin” y la sección “Market News”.
- Voz en off: “En Overview ves el estado del mercado, sentimiento y un vistazo a Bitcoin. Abajo, noticias recientes con su sentimiento estimado.”
- Texto en pantalla: “Datos en vivo o demo según disponibilidad.”
 - Acción: Clic en un titular de “Market News” para abrir la noticia original en una nueva pestaña.
 - Acción (opcional): Clic en “Refresh” para actualizar los datos del resumen.

## 4) AI Chat – CryptoMentor AI Agent (0:50–1:20)
- Toma: Clic en la pestaña `AI Chat`.
- Acción:
  - Mostrar mensajes de bienvenida.
  - Hacer clic en un “Example” o escribir: “¿Cómo está el mercado hoy?”
  - Presionar “Send”.
- Voz en off: “Chatea con el CryptoMentor AI Agent (AdEx AURA). Además de responder preguntas, puede analizar una account address y devolver recomendaciones y estrategias en lenguaje natural, cada una con su descripción.”
- Acción: Clic en “Clear” para reiniciar la conversación.
- Voz en off: “Puedes reiniciar la conversación cuando quieras.”
 - Nota técnica (en pantalla pequeña): “Powered by AdEx AURA API”.
 - Demostración dirigida: Pegar `0x1C680f16b2270e324D5778305C9EC96784c832ab` y enviar el prompt:
   - `Analyze address 0x1C680f16b2270e324D5778305C9EC96784c832ab and give app recommendations and strategies in natural language form, with a description of what each one does.`
   - Mostrar cómo el agente devuelve una lista de recomendaciones y estrategias con su descripción.
 - Texto en pantalla (callout): “AdEx AURA → Address → App recommendations & strategies (natural language + description)”.

## 5) Alertas – Crear y gestionar (1:20–1:45)
- Toma: Clic en la pestaña `Alerts`.
- Acción:
  - Clic en “New Alert”.
  - Completar: Type=Price, Crypto=Bitcoin, Condition=Above, Value=45000.
  - Clic en “Create Alert”.
  - Mostrar la alerta creada en la lista, alternar “Active/Disabled”.
- Voz en off: “Crea alertas personalizadas por precio o cambio porcentual. Actívalas o desactívalas al instante.”
- Acción (opcional): Borrar una alerta de ejemplo.
- Voz en off: “Gestiona tus alertas desde un solo lugar.”

## 6) Education – Lecciones y quiz con IA (1:45–2:15)
- Toma: Clic en la pestaña `Education`.
- Acción:
  - Seleccionar categoría “Basic Concepts”.
  - En la lección “What are Cryptocurrencies?”, clic en “Start AI Quiz”.
  - Responder una pregunta y luego “Submit” para ver el puntaje.
- Voz en off: “Aprende con quizzes generados por IA. Verás la indicación ‘AI‑powered’ y ‘Powered by AdEx AURA/OpenAI)’. El quiz se responde en inglés. Recibe calificación y explicaciones, y marca lecciones como completadas.”

## 7) Opcional: Conectar Wallet y ver Portfolio (2:15–2:30)
- Requiere MetaMask instalado.
- Toma: En el `Header`, clic en “Connect Wallet” y aprobar en MetaMask.
- Acción: Ir a `Portfolio`. Mostrar “Total Value”, “ETH Balance” y “Tokens” (si hay). Clic en “Update”.
- Voz en off: “Conecta tu wallet para ver tu balance y un resumen de tu portafolio. Todo seguro y sin exponer tus claves.”
- Nota: Si no hay tokens detectados, igualmente se muestra ETH y el módulo funciona bien.

## 8) Strategies – Recomendaciones con dirección (2:30–2:55)
- Toma: Clic en la pestaña `Strategies`.
- Acción: Pegar una `account address` en el campo (por ejemplo, `0x...`) y presionar “Generate strategies”.
- Voz en off: “La app toma una dirección de cuenta y muestra una lista de recomendaciones y estrategias en lenguaje natural, con una breve descripción de lo que hace cada una.”
- Acción: Mostrar 2–3 tarjetas con título, descripción, “Why” y “Action”.
 - Texto en pantalla (callout): “Powered by AdEx AURA API”.

### Prompts sugeridos para la demo (copiar y pegar)
- Principal (naturales):
  - `For address 0x1C680f16b2270e324D5778305C9EC96784c832ab, share a short list of app recommendations and strategies. Add one sentence saying what each one does.`
  - `Analyze 0x1C680f16b2270e324D5778305C9EC96784c832ab and suggest 3–5 strategies and apps, with a brief explanation of what each does.`
- Refinar resultados:
  - `Could you group them by time horizon (short / medium / long) and keep one line per item?`
  - `Add a risk level (low / medium / high) and a short why for each strategy.`
  - `Mention example apps or protocols for each recommendation and what they do.`
- Accionabilidad:
  - `Turn these into a simple action plan (steps) with one‑line explanations.`
  - `Add price alerts (levels) tied to each strategy and what the alert would do.`
- Resumen final:
  - `Give me the top 3 for 0x1C680f16b2270e324D5778305C9EC96784c832ab with one‑line descriptions.`

## Cierre (2:30)
- Toma: Regresar al `Dashboard`.
- Voz en off: “Esto fue CryptoMentor AI: mercado, chat con IA, alertas y educación, todo en un solo lugar. Pruébalo ahora.”

## Recomendaciones de grabación
- Mantener clics pausados para apreciar transiciones y toasts.
- Si aparece “Demo data”, continuar; la demostración sigue siendo representativa.
- Evitar refrescos innecesarios o forzar errores.


