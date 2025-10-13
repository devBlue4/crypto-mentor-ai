import { useState, useEffect, lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'
import AccessibilityUtils from './components/AccessibilityUtils'
import { WalletProvider } from './contexts/WalletContext'
import { AuraProvider } from './contexts/AuraContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/Dashboard'))

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

        return (
          <ThemeProvider>
            <ErrorBoundary>
              <WalletProvider>
                <AuraProvider>
                  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <a href="#main-content" className="skip-link">
                      Skip to main content
                    </a>
                    <Header />
                    <main id="main-content" className="container mx-auto px-4 py-8">
                      <Suspense fallback={<LoadingScreen />}>
                        <Dashboard />
                      </Suspense>
                    </main>
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#363636',
                          color: '#fff',
                        },
                      }}
                    />
                    <AccessibilityUtils />
                  </div>
                </AuraProvider>
              </WalletProvider>
            </ErrorBoundary>
          </ThemeProvider>
        )
}

export default App
