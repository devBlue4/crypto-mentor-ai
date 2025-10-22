# Changes Summary (CryptoMentor AI Demo)

Date: 2025-10-22

## UI/UX
- Centered header with title and subtitle, restoring wallet connection button/state to the right.
- Dashboard tabs redesigned to take full width, with pill style and no border lines.
- Removal of tabs: `Cache Manager`, `Performance`, `Watchlist` and `History` from Dashboard.
- Loading screen (LoadingScreen) migrated to dark mode with better contrast.
- Education: conversion to AI Quiz in English (5 questions, 4 options, explanation, auto-advance, scoring and pass ≥70%). Selected button in dark.

## Market Overview
- Removal of charts (Price and Dominance) and "Top Performers" by request.
- Real news in English (maximum 5):
  - Public RSS sources: CoinDesk, Cointelegraph and CryptoNews.
  - Use of CORS proxy `api.allorigins.win`.
  - Thumbnail extraction (media:content/enclosure/img) and basic sentiment.
  - Each news opens in a new tab.

## Alerts
- Functional alert creation modal; if the real endpoint fails, it saves locally in the UI for the demo (with informative toast).

## AURA / AI
- Implemented `generateQuiz` in `auraAPI` with:
  - Priority AURA → GPT (fallback) → Demo.
  - Result normalization.
- Added "optional demo mode" (`VITE_DISABLE_DEMO=true` to force real errors or mandatory keys).
- Demo mechanism also applied to `sendMessage`, `analyzePortfolio`, `getMarketInsights` and `getPersonalizedRecommendations` (demo is only used if enabled).

## Main modified files
- `src/components/Header.jsx` (centered and wallet to the right)
- `src/components/Dashboard.jsx` (tabs and section removal)
- `src/components/LoadingScreen.jsx` (dark theme)
- `src/components/EducationSection.jsx` (AI quiz, scoring, dark UI)
- `src/contexts/AuraContext.jsx` (exposure of `generateQuiz`)
- `src/services/auraAPI.js` (quiz, optional demo, AI fallbacks)
- `src/components/AlertsPanel.jsx` (local fallback when creating alert)
- `src/services/marketData.js` (real news with RSS, 5 items + thumbnail)
- `src/components/MarketOverview.jsx` (news rendering with image and link)

## Environment variables
Example `.env` for real demo without mock data:
```
VITE_AURA_API_KEY=YOUR_AURA_KEY
VITE_AURA_API_BASE=https://api.adex.network/aura/v1
VITE_OPENAI_API_KEY=OPTIONAL_FOR_FALLBACK
VITE_DISABLE_DEMO=true
```

If you want to allow demo modes when keys are missing:
```
VITE_DISABLE_DEMO=false
```

## Considerations
- The RSS proxy depends on `api.allorigins.win`; for production a custom proxy or simple backend is recommended.
- The local alert fallback saves only in memory (not persistent); `localStorage` can be added if needed.
- The AI quiz uses 5 questions by default; it can be made configurable from the UI.

---

Do you want the alert list to persist in `localStorage` and news to be filtered by source/topic? I can implement it quickly.


