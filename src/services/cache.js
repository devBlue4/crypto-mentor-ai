/**
 * Simple in-memory cache implementation for API responses
 * Supports TTL (Time To Live) for automatic expiration
 */
class Cache {
  constructor(ttl = 30000) { // Default 30 seconds
    this.cache = new Map()
    this.ttl = ttl
  }
  
  /**
   * Set a value in the cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} customTtl - Custom TTL in milliseconds (optional)
   */
  set(key, value, customTtl = null) {
    const ttl = customTtl || this.ttl
    const expiry = Date.now() + ttl
    
    this.cache.set(key, {
      value,
      expiry
    })
  }
  
  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found/expired
   */
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }
  
  /**
   * Check if a key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} - True if key exists and is valid
   */
  has(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return false
    }
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }
  
  /**
   * Delete a specific key from cache
   * @param {string} key - Cache key to delete
   */
  delete(key) {
    this.cache.delete(key)
  }
  
  /**
   * Clear all cached items
   */
  clear() {
    this.cache.clear()
  }
  
  /**
   * Get cache size
   * @returns {number} - Number of cached items
   */
  size() {
    return this.cache.size
  }
  
  /**
   * Clean up expired items
   * @returns {number} - Number of items removed
   */
  cleanup() {
    let removed = 0
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
        removed++
      }
    }
    
    return removed
  }
  
  /**
   * Get cache statistics
   * @returns {object} - Cache statistics
   */
  getStats() {
    const now = Date.now()
    let expired = 0
    let valid = 0
    
    for (const item of this.cache.values()) {
      if (now > item.expiry) {
        expired++
      } else {
        valid++
      }
    }
    
    return {
      total: this.cache.size,
      valid,
      expired,
      ttl: this.ttl
    }
  }
}

// Create cache instances for different data types
export const marketDataCache = new Cache(60000) // 1 minute for market data
export const auraResponseCache = new Cache(30000) // 30 seconds for AURA responses
export const portfolioCache = new Cache(30000) // 30 seconds for portfolio data
export const newsCache = new Cache(300000) // 5 minutes for news

// Utility function to generate cache keys
export const generateCacheKey = (prefix, ...params) => {
  return `${prefix}:${params.join(':')}`
}

// Cache decorator for API functions
export const withCache = (cacheInstance, keyGenerator) => {
  return async (fn, ...args) => {
    const key = keyGenerator(...args)
    
    // Try to get from cache first
    const cached = cacheInstance.get(key)
    if (cached !== null) {
      return cached
    }
    
    // If not in cache, execute function and cache result
    try {
      const result = await fn(...args)
      cacheInstance.set(key, result)
      return result
    } catch (error) {
      // Don't cache errors
      throw error
    }
  }
}

// Cache management utilities
export const cacheManager = {
  /**
   * Clear all caches
   */
  clearAll() {
    marketDataCache.clear()
    auraResponseCache.clear()
    portfolioCache.clear()
    newsCache.clear()
  },
  
  /**
   * Clean up all expired items
   */
  cleanupAll() {
    const stats = {
      marketData: marketDataCache.cleanup(),
      auraResponse: auraResponseCache.cleanup(),
      portfolio: portfolioCache.cleanup(),
      news: newsCache.cleanup()
    }
    
    return stats
  },
  
  /**
   * Get statistics for all caches
   */
  getAllStats() {
    return {
      marketData: marketDataCache.getStats(),
      auraResponse: auraResponseCache.getStats(),
      portfolio: portfolioCache.getStats(),
      news: newsCache.getStats()
    }
  },
  
  /**
   * Set custom TTL for specific cache
   */
  setTTL(cacheInstance, ttl) {
    cacheInstance.ttl = ttl
  }
}

export default Cache
