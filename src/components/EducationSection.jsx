import { useState } from 'react'
import { BookOpen, Play, CheckCircle, ArrowRight, Lightbulb, TrendingUp, Shield, DollarSign } from 'lucide-react'

const EducationSection = () => {
  const [activeCategory, setActiveCategory] = useState('basics')
  const [completedLessons, setCompletedLessons] = useState(new Set())

  const categories = [
    {
      id: 'basics',
      name: 'Basic Concepts',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'trading',
      name: 'Trading',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'defi',
      name: 'DeFi',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      color: 'bg-red-100 text-red-600'
    }
  ]

  const lessons = {
    basics: [
      {
        id: 'what-is-crypto',
        title: 'What are Cryptocurrencies?',
        description: 'Learn the fundamentals of cryptocurrencies and blockchain',
        duration: '5 min',
        difficulty: 'Beginner',
        completed: completedLessons.has('what-is-crypto')
      },
      {
        id: 'blockchain-101',
        title: 'Blockchain Explained',
        description: 'Understand how blockchain technology works',
        duration: '8 min',
        difficulty: 'Beginner',
        completed: completedLessons.has('blockchain-101')
      },
      {
        id: 'wallets-guide',
        title: 'Wallet Guide',
        description: 'Types of wallets and how to choose the right one',
        duration: '6 min',
        difficulty: 'Beginner',
        completed: completedLessons.has('wallets-guide')
      }
    ],
    trading: [
      {
        id: 'trading-basics',
        title: 'Trading Fundamentals',
        description: 'Basic concepts to start trading',
        duration: '10 min',
        difficulty: 'Intermediate',
        completed: completedLessons.has('trading-basics')
      },
      {
        id: 'technical-analysis',
        title: 'Technical Analysis',
        description: 'How to read charts and use indicators',
        duration: '15 min',
        difficulty: 'Intermediate',
        completed: completedLessons.has('technical-analysis')
      },
      {
        id: 'risk-management',
        title: 'Risk Management',
        description: 'Protect your capital with risk strategies',
        duration: '12 min',
        difficulty: 'Intermediate',
        completed: completedLessons.has('risk-management')
      }
    ],
    defi: [
      {
        id: 'defi-overview',
        title: 'Introduction to DeFi',
        description: 'What DeFi is and how it works',
        duration: '7 min',
        difficulty: 'Intermediate',
        completed: completedLessons.has('defi-overview')
      },
      {
        id: 'yield-farming',
        title: 'Yield Farming',
        description: 'How to generate returns with your crypto',
        duration: '12 min',
        difficulty: 'Advanced',
        completed: completedLessons.has('yield-farming')
      },
      {
        id: 'liquidity-pools',
        title: 'Liquidity Pools',
        description: 'Understand liquidity pools and AMMs',
        duration: '10 min',
        difficulty: 'Advanced',
        completed: completedLessons.has('liquidity-pools')
      }
    ],
    security: [
      {
        id: 'wallet-security',
        title: 'Wallet Security',
        description: 'How to protect your wallet and funds',
        duration: '8 min',
        difficulty: 'Beginner',
        completed: completedLessons.has('wallet-security')
      },
      {
        id: 'scam-prevention',
        title: 'Scam Prevention',
        description: 'Identify and avoid common scams',
        duration: '10 min',
        difficulty: 'Beginner',
        completed: completedLessons.has('scam-prevention')
      },
      {
        id: 'private-keys',
        title: 'Private Keys',
        description: 'Importance and secure handling of private keys',
        duration: '6 min',
        difficulty: 'Intermediate',
        completed: completedLessons.has('private-keys')
      }
    ]
  }

  const handleStartLesson = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]))
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const currentLessons = lessons[activeCategory] || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Education Center</h3>
            <p className="text-gray-600">Learn about cryptocurrencies with interactive lessons</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          const categoryLessons = lessons[category.id] || []
          const completed = categoryLessons.filter(lesson => completedLessons.has(lesson.id)).length
          const total = categoryLessons.length
          const progress = total > 0 ? (completed / total) * 100 : 0

          return (
            <div key={category.id} className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{category.name}</p>
                  <p className="text-xs text-gray-500">{completed}/{total} completed</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Categories */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeCategory === category.id
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>

        {/* Lessons */}
        <div className="space-y-4">
          {currentLessons.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">More lessons are in development</p>
            </div>
          ) : (
            currentLessons.map((lesson) => (
              <div key={lesson.id} className={`p-6 rounded-lg border transition-all duration-200 ${
                lesson.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{lesson.title}</h4>
                      {lesson.completed && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{lesson.description}</p>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center space-x-1">
                        <Play className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    {lesson.completed ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Completed</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartLesson(lesson.id)}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Never Invest More Than You Can Afford to Lose</h4>
                <p className="text-sm text-blue-700">
                  Cryptocurrencies are volatile. Only invest money you can afford to lose.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Use Two-Factor Authentication</h4>
                <p className="text-sm text-green-700">
                  Protect your accounts with 2FA and keep your private keys secure.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Diversify Your Portfolio</h4>
                <p className="text-sm text-yellow-700">
                  Don't put all your eggs in one basket. Diversify your investments.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-2">Continuous Education</h4>
                <p className="text-sm text-purple-700">
                  The crypto market evolves quickly. Stay informed and educated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationSection
