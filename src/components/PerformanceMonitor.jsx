import { useState, useEffect, useRef } from 'react'
import { Activity, Clock, Database, Zap } from 'lucide-react'

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    apiResponseTime: 0
  })
  const [isMonitoring, setIsMonitoring] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isMonitoring) {
      startMonitoring()
    } else {
      stopMonitoring()
    }

    return () => stopMonitoring()
  }, [isMonitoring])

  const startMonitoring = () => {
    intervalRef.current = setInterval(() => {
      updateMetrics()
    }, 1000)
  }

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const updateMetrics = () => {
    // Simulate performance metrics
    setMetrics(prev => ({
      renderTime: Math.random() * 16 + 1, // 1-17ms
      memoryUsage: Math.random() * 50 + 10, // 10-60MB
      cacheHitRate: Math.random() * 30 + 70, // 70-100%
      apiResponseTime: Math.random() * 200 + 50 // 50-250ms
    }))
  }

  const getPerformanceStatus = (value, type) => {
    switch (type) {
      case 'renderTime':
        if (value < 8) return { status: 'excellent', color: 'green' }
        if (value < 16) return { status: 'good', color: 'yellow' }
        return { status: 'poor', color: 'red' }
      case 'memoryUsage':
        if (value < 30) return { status: 'low', color: 'green' }
        if (value < 50) return { status: 'medium', color: 'yellow' }
        return { status: 'high', color: 'red' }
      case 'cacheHitRate':
        if (value > 90) return { status: 'excellent', color: 'green' }
        if (value > 80) return { status: 'good', color: 'yellow' }
        return { status: 'poor', color: 'red' }
      case 'apiResponseTime':
        if (value < 100) return { status: 'fast', color: 'green' }
        if (value < 200) return { status: 'medium', color: 'yellow' }
        return { status: 'slow', color: 'red' }
      default:
        return { status: 'unknown', color: 'gray' }
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Monitor</h3>
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isMonitoring
                ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                : 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Render Time"
            value={metrics.renderTime}
            unit="ms"
            icon={Clock}
            type="renderTime"
            getStatus={getPerformanceStatus}
          />
          <MetricCard
            title="Memory Usage"
            value={metrics.memoryUsage}
            unit="MB"
            icon={Database}
            type="memoryUsage"
            getStatus={getPerformanceStatus}
          />
          <MetricCard
            title="Cache Hit Rate"
            value={metrics.cacheHitRate}
            unit="%"
            icon={Zap}
            type="cacheHitRate"
            getStatus={getPerformanceStatus}
          />
          <MetricCard
            title="API Response"
            value={metrics.apiResponseTime}
            unit="ms"
            icon={Activity}
            type="apiResponseTime"
            getStatus={getPerformanceStatus}
          />
        </div>
      </div>

      <div className="card">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Performance Tips</h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-blue-900">Code Splitting</p>
              <p className="text-sm text-blue-700">Components are lazy-loaded to reduce initial bundle size</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-green-900">Caching System</p>
              <p className="text-sm text-green-700">API responses are cached to improve performance</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-purple-900">Bundle Optimization</p>
              <p className="text-sm text-purple-700">Vendor chunks are separated for better caching</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ title, value, unit, icon: Icon, type, getStatus }) => {
  const { status, color } = getStatus(value, type)
  
  const colorClasses = {
    green: 'text-green-600 bg-green-50 border-green-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    gray: 'text-gray-600 bg-gray-50 border-gray-200'
  }

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center space-x-3 mb-3">
        <Icon className="w-5 h-5" />
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">
          {value.toFixed(1)}{unit}
        </div>
        <div className="text-sm text-gray-600">
          Status: <span className="font-medium capitalize">{status}</span>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMonitor










