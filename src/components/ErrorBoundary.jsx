import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug, Send } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
      isReporting: false
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId
    })
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // In production, you would send this to an error reporting service
    this.reportError(error, errorInfo, errorId)
  }

  reportError = async (error, errorInfo, errorId) => {
    if (import.meta.env.PROD) {
      try {
        // Here you would send to your error reporting service
        // Example: Sentry, LogRocket, etc.
        console.log('Reporting error:', {
          errorId,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError)
      }
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-2">
              We're sorry, but something unexpected happened.
            </p>
            
            {this.state.errorId && (
              <p className="text-sm text-gray-500 mb-6">
                Error ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{this.state.errorId}</code>
              </p>
            )}
            
            <div className="space-y-3 mb-6">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </button>
            </div>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-2 mb-3">
                  <Bug className="w-4 h-4" />
                  <span>Error Details (Development)</span>
                </summary>
                <div className="p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-800 overflow-auto max-h-64">
                  <div className="mb-3">
                    <strong className="text-red-600">Error:</strong>
                    <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded">
                      {this.state.error.toString()}
                    </div>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong className="text-blue-600">Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1 p-2 bg-blue-50 border border-blue-200 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact support with the Error ID above.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
