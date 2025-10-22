import { useState } from 'react'
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react'
import { useAura } from '../contexts/AuraContext'
import toast from 'react-hot-toast'

const sampleStrategies = (address) => [
  {
    id: 'rec_dca',
    title: 'DCA on BTC/ETH',
    description: 'Invest a fixed amount weekly into BTC and ETH to reduce timing risk and smooth volatility.',
    why: 'Helps build a position steadily regardless of short‑term price swings.',
    action: 'Set a weekly buy on your preferred exchange and review monthly.'
  },
  {
    id: 'rec_alerts',
    title: 'Set Smart Price Alerts',
    description: 'Create alerts for key support/resistance levels on your main assets to react quickly.',
    why: 'Keeps you informed without constantly watching the market.',
    action: 'Add alerts at −5%/−10% drawdowns and near recent highs.'
  },
  {
    id: 'rec_risk',
    title: 'Rebalance and Risk Management',
    description: 'Maintain a target split (e.g., 50% BTC/ETH, 30% alt, 20% stables) and rebalance quarterly.',
    why: 'Preserves your intended risk profile as markets move.',
    action: 'Review allocations and rebalance when any bucket deviates >5%.'
  }
]

const Strategies = () => {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState([])
  const { getPersonalizedRecommendations } = useAura()

  const handleGenerate = async () => {
    if (!address || address.length < 6) return
    setLoading(true)
    try {
      // Usar la API real de AURA para obtener recomendaciones
      console.log('🔍 Strategies: Getting recommendations for address:', address)
      const ai = await getPersonalizedRecommendations(address)
      console.log('📊 Strategies: Raw AI response:', JSON.stringify(ai, null, 2))
      
      let normalized = []
      if (ai.strategies && ai.strategies[0]?.response && ai.strategies[0].response.length > 0) {
        // Usar las recomendaciones reales de AURA
        normalized = ai.strategies[0].response.map((strategy, i) => {
          const action = strategy.actions?.[0]
          return {
            id: `strategy_${i}`,
            title: strategy.name,
            description: action?.description || strategy.description || '',
            risk: strategy.risk,
            apy: action?.apy || 'N/A',
            platforms: action?.platforms || []
          }
        })
      } else {
        // No mostrar estrategias demo, mostrar lista vacía
        normalized = []
      }
      
      console.log('🔄 Strategies: Normalized strategies:', JSON.stringify(normalized, null, 2))
      console.log('📋 Strategies: Strategies count:', normalized.length)
      
      setIdeas(normalized)
    } catch (error) {
      console.error('❌ Strategies: AURA API not available:', error)
      setIdeas([])
      toast.error('AURA API not available. Please check your API configuration.', {
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Strategies & Recommendations</h3>
              <p className="text-gray-600">Enter an account address to get AI‑generated ideas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="text"
            placeholder="0x... account address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={handleGenerate} disabled={loading || address.length < 6} className="btn-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Generating...' : 'Generate strategies'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {ideas.length > 0 && (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="p-5 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                  <p className="text-gray-700 mt-1">{idea.description}</p>
                  {idea.why && <p className="text-sm text-gray-500 mt-1">Why: {idea.why}</p>}
                  {idea.action && <p className="text-sm text-gray-500">Action: {idea.action}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Strategies


