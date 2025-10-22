// API Configuration for different environments
export const API_CONFIG = {
  // Development: Use proxy to avoid CORS issues
  development: {
    coingecko: '/api/coingecko',
    fearGreed: '/api/feargreed/fng/',
    rss2json: 'https://api.rss2json.com/v1/api.json',
    allorigins: 'https://api.allorigins.win/get'
  },
  
  // Production: Use direct APIs (requires CORS-enabled APIs or server-side proxy)
  production: {
    coingecko: 'https://api.coingecko.com/api/v3',
    fearGreed: 'https://api.alternative.me/fng/',
    rss2json: 'https://api.rss2json.com/v1/api.json',
    allorigins: 'https://api.allorigins.win/get'
  }
}

// Get current environment configuration
export const getApiConfig = () => {
  const isDev = import.meta.env.DEV
  return isDev ? API_CONFIG.development : API_CONFIG.production
}

// Helper function to build API URLs
export const buildApiUrl = (service, endpoint = '') => {
  const config = getApiConfig()
  const baseUrl = config[service]
  
  if (!baseUrl) {
    throw new Error(`Unknown API service: ${service}`)
  }
  
  return endpoint ? `${baseUrl}${endpoint}` : baseUrl
}
