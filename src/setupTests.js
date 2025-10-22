import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Alias Jest API to Vitest for legacy tests
globalThis.jest = vi

// Mock window.ethereum for MetaMask testing
Object.defineProperty(window, 'ethereum', {
  value: {
    isMetaMask: true,
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
    selectedAddress: '0x1234567890123456789012345678901234567890',
    chainId: '0x1'
  },
  writable: true
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Mock environment variables
process.env.VITE_AURA_API_KEY = 'test-api-key'

