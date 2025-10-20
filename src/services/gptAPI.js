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
      throw new Error('Empty response from OpenAI')
    }

    return {
      content,
      analysis: undefined,
      recommendations: undefined,
      confidence: undefined
    }
  },

  // Generate a multiple-choice quiz in English for a given topic
  async generateQuiz(topic, opts = {}) {
    const { numQuestions = 5, difficulty = 'Beginner' } = opts || {}
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
      // Fallback to a static quiz if no API key
      return this.getFallbackQuiz(topic, numQuestions)
    }

    const systemPrompt = [
      'You are AURA, an expert crypto tutor. ALWAYS respond in English.',
      'Generate a multiple-choice quiz related to the indicated topic.',
      'Return ONLY valid JSON, no extra text or code fences.'
    ].join(' ')

    const userPrompt = [
      `Topic: ${topic}`,
      `Difficulty: ${difficulty}.`,
      `Create ${numQuestions} questions.`,
      'Exact JSON format:',
      '{ "questions": [ { "question": "text", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "brief explanation" } ] }'
    ].join('\n')

    const body = {
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 800
    }

    try {
      const response = await openaiClient.post('/chat/completions', body)
      const raw = response.data?.choices?.[0]?.message?.content || ''
      const parsed = this.safeParseJSON(raw)
      const questions = Array.isArray(parsed?.questions) ? parsed.questions : []
      if (questions.length === 0) throw new Error('No questions parsed')
      return { questions: questions.slice(0, numQuestions) }
    } catch (err) {
      console.warn('Quiz generation failed, using fallback:', err?.message || err)
      return this.getFallbackQuiz(topic, numQuestions)
    }
  },

  safeParseJSON(text) {
    try {
      return JSON.parse(text)
    } catch (_) {
      try {
        const start = text.indexOf('{')
        const end = text.lastIndexOf('}')
        if (start >= 0 && end > start) {
          return JSON.parse(text.slice(start, end + 1))
        }
      } catch (_) {}
      return null
    }
  },

  getFallbackQuiz(topic, numQuestions = 5) {
    const bank = [
      {
        question: 'What is a cryptocurrency?',
        options: [
          'Digital money that uses cryptography and decentralized networks',
          'A PDF file with your balance',
          'A stock of a tech company',
          'An online video game'
        ],
        correctIndex: 0,
        explanation: 'Cryptocurrencies are digital assets based on cryptography and usually blockchain.'
      },
      {
        question: 'What is the main function of a blockchain?',
        options: [ 'Store immutable and verifiable data', 'Back up photos', 'Send emails faster', 'Build websites' ],
        correctIndex: 0,
        explanation: 'Blockchain is a distributed ledger, resistant to tampering.'
      },
      {
        question: 'What is a crypto wallet?',
        options: [ 'A key manager that signs transactions', 'A traditional bank account', 'An antivirus', 'A rental contract' ],
        correctIndex: 0,
        explanation: 'A wallet manages private/public keys to authorize transactions on the network.'
      },
      {
        question: 'What does 2FA stand for?',
        options: [ 'Two-Factor Authentication', 'Fixed Assets Fund', 'Advanced Finance Archive', 'Flow Analysis' ],
        correctIndex: 0,
        explanation: '2FA adds a second verification step for more security.'
      },
      {
        question: 'What does the “Fear & Greed Index” measure?',
        options: [ 'Market sentiment', 'Bitcoin hashrate', 'Annual inflation', 'Network latency' ],
        correctIndex: 0,
        explanation: 'It is an aggregated sentiment indicator (fear vs greed) in the crypto market.'
      }
    ]
    return { questions: bank.slice(0, numQuestions) }
  }
}


