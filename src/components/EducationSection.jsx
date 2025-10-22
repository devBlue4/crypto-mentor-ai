import { useState, useEffect } from 'react'
import { BookOpen, Play, CheckCircle, ArrowRight, Lightbulb, TrendingUp, Shield, DollarSign } from 'lucide-react'
import { useAura } from '../contexts/AuraContext'
import { auraAPI } from '../services/auraAPI'
import toast from 'react-hot-toast'

const EducationSection = () => {
  const [activeCategory, setActiveCategory] = useState('basics')
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const { generateQuiz } = useAura()

  // Quiz state
  const [isGenerating, setIsGenerating] = useState(false)
  const [quiz, setQuiz] = useState(null) // { topic, difficulty, questions }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // id -> selectedIndex
  const [showResults, setShowResults] = useState(false)
  const PASS_THRESHOLD = 0.7

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

  // Remove focus highlight when navigating between questions (run at top-level)
  useEffect(() => {
    if (!quiz) return
    try {
      const el = document.activeElement
      if (el && typeof el.blur === 'function') el.blur()
    } catch (_) {}
  }, [currentQuestionIndex, quiz])

  const startQuiz = async (topic, difficulty = 'beginner') => {
    try {
      setIsGenerating(true)
      setShowResults(false)
      setAnswers({})
      setCurrentQuestionIndex(0)
      toast.loading('Generating quiz...', { id: 'quiz-gen' })
      const data = await generateQuiz(topic, { questionCount: 5, difficulty })
      // Normalize questions to ensure stable IDs and exactly 4 options
      const normalized = {
        topic: data.topic || topic,
        difficulty: (data.difficulty || difficulty),
        questions: (data.questions || []).map((q, i) => ({
          id: q.id ?? `q_${i + 1}`,
          question: q.question || q.text || `Question ${i + 1}`,
          options: Array.isArray(q.options) && q.options.length === 4
            ? q.options
            : (q.options || q.choices || []).slice(0, 4),
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex
            : typeof q.correct === 'number' ? q.correct
            : 0,
          explanation: q.explanation || ''
        }))
      }
      setQuiz(normalized)
      toast.success('Quiz ready!', { id: 'quiz-gen' })
    } catch (error) {
      console.error('Error generating quiz:', error)
      toast.error('Could not generate quiz. Using demo mode if available.', { id: 'quiz-gen' })
      try {
        const demo = auraAPI.getDemoQuiz(topic, 5)
        const normalized = {
          ...demo,
          questions: demo.questions.map((q, i) => ({
            id: q.id ?? `q_${i + 1}`,
            question: q.question,
            options: q.options.slice(0, 4),
            correctIndex: q.correctIndex ?? 0,
            explanation: q.explanation || ''
          }))
        }
        setQuiz(normalized)
      } catch (_) {
        // Si incluso el demo falla (no debería), mantenemos el estado anterior
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const selectAnswer = (questionId, optionIndex) => {
    // No sobreescribir respuestas ya dadas para que el score sea estable
    setAnswers(prev => (prev.hasOwnProperty(questionId) ? prev : { ...prev, [questionId]: optionIndex }))
    if (!quiz || showResults) return
    const isLast = currentQuestionIndex >= (quiz.questions.length - 1)
    window.setTimeout(() => {
      if (isLast) {
        setShowResults(true)
      } else {
        setCurrentQuestionIndex(i => Math.min(quiz.questions.length - 1, i + 1))
      }
    }, 150)
  }

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0 }
    let correct = 0
    for (const q of quiz.questions) {
      if (answers[q.id] === q.correctIndex) correct++
    }
    return { correct, total: quiz.questions.length }
  }

  const submitQuiz = () => {
    setShowResults(true)
  }

  const resetQuiz = () => {
    setQuiz(null)
    setAnswers({})
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }

  if (quiz) {
    const question = quiz.questions[currentQuestionIndex]
    const score = calculateScore()
    const percent = quiz ? Math.round((score.correct / (quiz.questions.length || 1)) * 100) : 0

    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Quiz: {quiz.topic}</h3>
              <p className="text-gray-600">Answer the questions in English. Difficulty: {quiz.difficulty}</p>
            </div>
            <button onClick={resetQuiz} className="btn-secondary">Back to Education</button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
            {!showResults && (
              <div className="space-x-2">
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                  disabled={currentQuestionIndex === 0}
                >Prev</button>
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentQuestionIndex(i => Math.min(quiz.questions.length - 1, i + 1))}
                  >Next</button>
                ) : (
                  <button className="btn-primary" onClick={submitQuiz}>Submit</button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">{question.question}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((opt, idx) => {
                const selected = answers[question.id] === idx
                const isCorrect = idx === question.correctIndex
                const isWrong = showResults && selected && !isCorrect
                const isRight = showResults && selected && isCorrect
                return (
                  <button
                    key={idx}
                    onClick={() => !showResults && selectAnswer(question.id, idx)}
                    className={`text-left p-4 rounded-lg border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${
                      showResults
                        ? isRight
                          ? 'bg-green-900/20 border-green-700 text-green-200'
                          : isWrong
                          ? 'bg-red-900/20 border-red-700 text-red-200'
                          : 'bg-gray-900 border-gray-700 text-gray-200'
                        : selected
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600 text-gray-200'
                    }`}
                  >
                    <span className={`${selected ? 'text-white' : 'text-gray-300'} font-medium`}>{String.fromCharCode(65 + idx)}.</span>{' '}
                    <span className={`${showResults ? (isRight ? 'text-green-200' : isWrong ? 'text-red-200' : 'text-gray-300') : selected ? 'text-white' : 'text-gray-300'}`}>{opt}</span>
                  </button>
                )
              })}
            </div>

            {showResults && (
              <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded-lg">
                <p className="text-sm text-gray-300"><span className="font-semibold text-gray-200">Explanation:</span> {question.explanation || '—'}</p>
              </div>
            )}
          </div>
        </div>

        {showResults && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Score</h3>
            <p className="text-gray-700">{score.correct} / {quiz.questions.length} correct</p>
            <p className="text-gray-700 mb-4">{percent}%</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${percent >= Math.round(PASS_THRESHOLD*100) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {percent >= Math.round(PASS_THRESHOLD*100) ? 'Approved' : 'Not approved'}
            </div>
            <div className="flex space-x-2">
              <button className="btn-secondary" onClick={resetQuiz}>Try another topic</button>
              <button className="btn-primary" onClick={() => startQuiz(quiz.topic, quiz.difficulty)}>Retake Quiz</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">Education Center</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">AI Quiz</span>
            </div>
            <p className="text-gray-600">Learn about cryptocurrencies with interactive lessons and AI-generated quizzes</p>
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

        {/* Lessons with AI Quiz */}
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
                  
                  <div className="ml-6 flex space-x-3">
                    <button
                      onClick={() => startQuiz(lesson.title, lesson.difficulty?.toLowerCase?.() || 'beginner')}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                      disabled={isGenerating}
                    >
                      <Play className="w-4 h-4" />
                      <span>{isGenerating ? 'Generating...' : 'Start AI Quiz'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartLesson(lesson.id)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <span>Mark as read</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-200 mb-6">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-900 border border-blue-900/40 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">Never Invest More Than You Can Afford to Lose</h4>
                <p className="text-sm text-blue-200">
                  Cryptocurrencies are volatile. Only invest money you can afford to lose.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-900 border border-green-900/40 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Use Two-Factor Authentication</h4>
                <p className="text-sm text-green-200">
                  Protect your accounts with 2FA and keep your private keys secure.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-900 border border-yellow-900/40 rounded-lg">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-300 mb-2">Diversify Your Portfolio</h4>
                <p className="text-sm text-yellow-200">
                  Don't put all your eggs in one basket. Diversify your investments.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-900 border border-purple-900/40 rounded-lg">
            <div className="flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Continuous Education</h4>
                <p className="text-sm text-purple-200">
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
