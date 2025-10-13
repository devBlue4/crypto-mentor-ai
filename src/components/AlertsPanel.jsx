import { useState, useEffect } from 'react'
import { Bell, Plus, Trash2, Edit, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useAura } from '../contexts/AuraContext'
import toast from 'react-hot-toast'

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAlert, setEditingAlert] = useState(null)
  const { setupSmartAlerts } = useAura()

  // Form for new alert
  const [newAlert, setNewAlert] = useState({
    type: 'price',
    symbol: 'BTC',
    condition: 'above',
    value: '',
    enabled: true
  })

  // Example alerts
  useEffect(() => {
    const exampleAlerts = [
      {
        id: 1,
        type: 'price',
        symbol: 'BTC',
        condition: 'above',
        value: '45000',
        currentValue: '43250',
        enabled: true,
        created: new Date('2024-01-15'),
        triggered: false
      },
      {
        id: 2,
        type: 'price',
        symbol: 'ETH',
        condition: 'below',
        value: '2400',
        currentValue: '2650',
        enabled: true,
        created: new Date('2024-01-14'),
        triggered: false
      },
      {
        id: 3,
        type: 'change',
        symbol: 'SOL',
        condition: 'above',
        value: '5',
        currentValue: '7.2',
        enabled: false,
        created: new Date('2024-01-13'),
        triggered: true,
        triggeredAt: new Date('2024-01-16')
      }
    ]
    setAlerts(exampleAlerts)
  }, [])

  const handleCreateAlert = async () => {
    if (!newAlert.value || !newAlert.symbol) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const alertConfig = {
        ...newAlert,
        value: parseFloat(newAlert.value)
      }

      await setupSmartAlerts(alertConfig)
      
      const alert = {
        id: Date.now(),
        ...newAlert,
        value: newAlert.value,
        currentValue: newAlert.symbol === 'BTC' ? '43250' : '2650',
        enabled: true,
        created: new Date(),
        triggered: false
      }

      setAlerts(prev => [...prev, alert])
      setShowCreateModal(false)
      setNewAlert({
        type: 'price',
        symbol: 'BTC',
        condition: 'above',
        value: '',
        enabled: true
      })
      toast.success('Alert created successfully')
    } catch (error) {
      toast.error('Error creating alert')
    }
  }

  const toggleAlert = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ))
  }

  const deleteAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
    toast.success('Alert deleted')
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'price': return DollarSign
      case 'change': return TrendingUp
      default: return Bell
    }
  }

  const getAlertColor = (alert) => {
    if (alert.triggered) return 'bg-red-50 border-red-200'
    if (!alert.enabled) return 'bg-gray-50 border-gray-200'
    return 'bg-white border-gray-200'
  }

  const getStatusColor = (alert) => {
    if (alert.triggered) return 'text-red-600 bg-red-100'
    if (!alert.enabled) return 'text-gray-600 bg-gray-100'
    return 'text-green-600 bg-green-100'
  }

  const getStatusText = (alert) => {
    if (alert.triggered) return 'Triggered'
    if (!alert.enabled) return 'Disabled'
    return 'Active'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Smart Alerts</h3>
            <p className="text-gray-600">Configure personalized AI alerts for your cryptocurrencies</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Alert</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.enabled && !a.triggered).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Triggered</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.triggered).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Disabled</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => !a.enabled).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">My Alerts</h3>
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">You have no alerts configured</h3>
            <p className="text-gray-600 mb-6">Create your first alert to receive notifications about market changes</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create First Alert
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const Icon = getAlertIcon(alert.type)
              return (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {alert.symbol} {alert.type === 'price' ? 'Price' : 'Change'} {alert.condition === 'above' ? 'above' : 'below'} ${alert.value}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Current value: ${alert.currentValue} • Created: {alert.created.toLocaleDateString('en-US')}
                        </p>
                        {alert.triggered && (
                          <p className="text-sm text-red-600">
                            Triggered on: {alert.triggeredAt?.toLocaleDateString('en-US')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert)}`}>
                        {getStatusText(alert)}
                      </span>
                      
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          alert.enabled ? 'text-yellow-600 hover:bg-yellow-100' : 'text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <Bell className={`w-4 h-4 ${alert.enabled ? '' : 'opacity-50'}`} />
                      </button>
                      
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Alert</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                  className="input-field"
                >
                  <option value="price">Price</option>
                  <option value="change">Change %</option>
                  <option value="volume">Volume</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cryptocurrency</label>
                <select
                  value={newAlert.symbol}
                  onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                  className="input-field"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="ADA">Cardano (ADA)</option>
                  <option value="MATIC">Polygon (MATIC)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                  className="input-field"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                <input
                  type="number"
                  value={newAlert.value}
                  onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                  placeholder="Enter the value..."
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateAlert}
                className="flex-1 btn-primary"
              >
                Create Alert
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlertsPanel
