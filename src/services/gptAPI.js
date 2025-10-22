import axios from 'axios'

const OPENAI_API_BASE = (import.meta.env.VITE_OPENAI_API_BASE || 'https://api.openai.com').replace(/\/$/, '')
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

if (import.meta.env.DEV) {
  console.log('🧠 OpenAI Configuration:')
  console.log('  Base URL:', OPENAI_API_BASE)
  console.log('  Model:', OPENAI_MODEL)
  console.log('  API Key:', OPENAI_API_KEY ? `${OPENAI_API_KEY.substring(0, 8)}...` : 'Not configured')
}

const openaiClient = axios.create({
  baseURL: `${OPENAI_API_BASE}/v1`,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000
})

export const gptAPI = {
  async sendMessage(message, context = {}) {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('OpenAI API key not configured')
    }

    const systemPrompt = [
      'You are AURA, a trading and crypto expert assistant. ALWAYS reply in English,',
      'brief, clear, and actionable. If the user asks for definitions, be concise.',
      'If the user asks for analysis, explain assumptions and risks without guarantees.',
      'When relevant, suggest concrete next steps. Do not fabricate data.'
    ].join(' ')

    const contextNote = Object.keys(context || {}).length > 0
      ? `Contexto del usuario: ${JSON.stringify(context).slice(0, 800)}`
      : 'Sin contexto adicional.'

    const body = {
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${contextNote}\n\nPregunta: ${message}` }
      ],
      temperature: 0.2,
      max_tokens: 500
    }

    const response = await openaiClient.post('/chat/completions', body)
    const content = response.data?.choices?.[0]?.message?.content?.trim()
    if (!content) {
      throw new Error('Respuesta vacía de OpenAI')
    }

    return {
      content,
      analysis: undefined,
      recommendations: undefined,
      confidence: undefined
    }
  }
}


