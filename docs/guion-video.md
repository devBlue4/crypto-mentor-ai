# Video Script (stable features only)

Approximate duration: 2:30

General notes:
- Record at `http://localhost:3000`.
- If "Demo data" appears in Overview, continue; the UX is prepared for demo mode.
- The `Portfolio` flow is optional (requires MetaMask). Everything else works in demo.

### Hackathon Highlight (always emphasize)
- Show the "Powered by AdEx AURA API" badge in Chat.
- Emphasize in voice and on screen the key capability: the agent takes an `account address` and returns a list of recommendations and strategies in natural language, with a description of what each one does.
- Main prompt to use in the video:
  - `For address 0x1C680f16b2270e324D5778305C9EC96784c832ab, share 3–5 app recommendations and strategies, each with a one‑sentence description of what it does.`
- Visual suggestion: show the short address `0x1C680f…32ab` on screen and keep the complete one in clipboard.

## 1) Intro (0:00–0:05)
- Shot: Loading screen and then `Header` with "CryptoMentor AI" logo.
- Voice over: "Welcome to CryptoMentor AI, your intelligent assistant for crypto analysis and Web3 education."

## 2) Dashboard and navigation (0:05–0:20)
- Shot: `Dashboard` with "Welcome to CryptoMentor AI!" message and tabs: `Overview`, `Portfolio`, `AI Chat`, `Alerts`, `Education`.
- Action: Move cursor over tabs without clicking yet.
- Voice over: "The app is fast, clear and organized by tabs so you can find everything in one click."

## 3) Overview – Market summary and news (0:20–0:50)
- Shot: `Overview` (active by default).
- Action: Scroll through "Market Cap", "24h Volume", "Fear & Greed", "Bitcoin" cards and the "Market News" section.
- Voice over: "In Overview you see the market state, sentiment and a Bitcoin overview. Below, recent news with their estimated sentiment."
- On-screen text: "Live or demo data depending on availability."
 - Action: Click on a "Market News" headline to open the original news in a new tab.
 - Action (optional): Click "Refresh" to update the summary data.

## 4) AI Chat – CryptoMentor AI Agent (0:50–1:20)
- Shot: Click on the `AI Chat` tab.
- Action:
  - Show welcome messages.
  - Click on an "Example" or type: "How is the market today?"
  - Press "Send".
- Voice over: "Chat with the CryptoMentor AI Agent (AdEx AURA). In addition to answering questions, it can analyze an account address and return recommendations and strategies in natural language, each with its description."
- Action: Click "Clear" to restart the conversation.
- Voice over: "You can restart the conversation whenever you want."
 - Technical note (small on screen): "Powered by AdEx AURA API".
 - Directed demonstration: Paste `0x1C680f16b2270e324D5778305C9EC96784c832ab` and send the prompt:
   - `Analyze address 0x1C680f16b2270e324D5778305C9EC96784c832ab and give app recommendations and strategies in natural language form, with a description of what each one does.`
   - Show how the agent returns a list of recommendations and strategies with their description.
 - On-screen text (callout): "AdEx AURA → Address → App recommendations & strategies (natural language + description)".

## 5) Alerts – Create and manage (1:20–1:45)
- Shot: Click on the `Alerts` tab.
- Action:
  - Click "New Alert".
  - Complete: Type=Price, Crypto=Bitcoin, Condition=Above, Value=45000.
  - Click "Create Alert".
  - Show the created alert in the list, toggle "Active/Disabled".
- Voice over: "Create personalized alerts by price or percentage change. Activate or deactivate them instantly."
- Action (optional): Delete an example alert.
- Voice over: "Manage your alerts from one place."

## 6) Education – Lessons and AI quiz (1:45–2:15)
- Shot: Click on the `Education` tab.
- Action:
  - Select "Basic Concepts" category.
  - In the "What are Cryptocurrencies?" lesson, click "Start AI Quiz".
  - Answer a question and then "Submit" to see the score.
- Voice over: "Learn with AI-generated quizzes. You'll see the 'AI‑powered' and 'Powered by AdEx AURA/OpenAI)' indication. The quiz is answered in English. Receive grading and explanations, and mark lessons as completed."

## 7) Optional: Connect Wallet and view Portfolio (2:15–2:30)
- Requires MetaMask installed.
- Shot: In the `Header`, click "Connect Wallet" and approve in MetaMask.
- Action: Go to `Portfolio`. Show "Total Value", "ETH Balance" and "Tokens" (if any). Click "Update".
- Voice over: "Connect your wallet to see your balance and a summary of your portfolio. Everything secure without exposing your keys."
- Note: If no tokens are detected, ETH is still shown and the module works well.

## 8) Strategies – Address-based recommendations (2:30–2:55)
- Shot: Click on the `Strategies` tab.
- Action: Paste an `account address` in the field (for example, `0x...`) and press "Generate strategies".
- Voice over: "The app takes an account address and shows a list of recommendations and strategies in natural language, with a brief description of what each one does."
- Action: Show 2–3 cards with title, description, "Why" and "Action".
 - On-screen text (callout): "Powered by AdEx AURA API".

### Suggested prompts for the demo (copy and paste)
- Main (natural):
  - `For address 0x1C680f16b2270e324D5778305C9EC96784c832ab, share a short list of app recommendations and strategies. Add one sentence saying what each one does.`
  - `Analyze 0x1C680f16b2270e324D5778305C9EC96784c832ab and suggest 3–5 strategies and apps, with a brief explanation of what each does.`
- Refine results:
  - `Could you group them by time horizon (short / medium / long) and keep one line per item?`
  - `Add a risk level (low / medium / high) and a short why for each strategy.`
  - `Mention example apps or protocols for each recommendation and what they do.`
- Actionability:
  - `Turn these into a simple action plan (steps) with one‑line explanations.`
  - `Add price alerts (levels) tied to each strategy and what the alert would do.`
- Final summary:
  - `Give me the top 3 for 0x1C680f16b2270e324D5778305C9EC96784c832ab with one‑line descriptions.`

## Closing (2:30)
- Shot: Return to `Dashboard`.
- Voice over: "This was CryptoMentor AI: market, AI chat, alerts and education, all in one place. Try it now."

## Recording recommendations
- Keep clicks paused to appreciate transitions and toasts.
- If "Demo data" appears, continue; the demonstration is still representative.
- Avoid unnecessary refreshes or forcing errors.


