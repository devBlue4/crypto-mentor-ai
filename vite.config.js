import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/aura': {
        target: 'https://api.adex.network',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/aura/, ''),
        configure: (proxy) => {
          // Opcional: logs de debug del proxy
          proxy.on('proxyReq', (proxyReq) => {
            // console.log('[proxy] →', proxyReq.getHeader('host'), proxyReq.path)
          })
        }
      },
      '/api/coingecko': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            console.log('[CoinGecko Proxy] →', proxyReq.path)
          })
        }
      },
      '/api/feargreed': {
        target: 'https://api.alternative.me',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/feargreed/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            console.log('[Fear&Greed Proxy] →', proxyReq.path)
          })
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'web3': ['ethers'],
          'charts': ['recharts'],
          'ui': ['lucide-react', 'react-hot-toast']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
        'src/main.jsx',
        '**/*.config.js',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.spec.js',
        '**/*.spec.jsx'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
