import { useEffect, useState } from 'react'
import { Eye, EyeOff, Volume2, VolumeX, Type, TypeOff } from 'lucide-react'

const AccessibilityUtils = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [preferences, setPreferences] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  })

  useEffect(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('accessibility-preferences')
    if (saved) {
      setPreferences(JSON.parse(saved))
      applyPreferences(JSON.parse(saved))
    }

    // Apply reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setPreferences(prev => ({ ...prev, reducedMotion: true }))
    }
  }, [])

  const applyPreferences = (prefs) => {
    const root = document.documentElement
    
    // High contrast
    if (prefs.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Large text
    if (prefs.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Reduced motion
    if (prefs.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Screen reader announcements
    if (prefs.screenReader) {
      root.setAttribute('aria-live', 'polite')
    } else {
      root.removeAttribute('aria-live')
    }
  }

  const updatePreference = (key, value) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    applyPreferences(newPreferences)
    localStorage.setItem('accessibility-preferences', JSON.stringify(newPreferences))
  }

  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  const togglePreference = (key) => {
    const newValue = !preferences[key]
    updatePreference(key, newValue)
    
    if (preferences.screenReader) {
      const message = `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newValue ? 'enabled' : 'disabled'}`
      announceToScreenReader(message)
    }
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Open accessibility settings"
      >
        <Eye className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Accessibility Settings</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
          aria-label="Close accessibility settings"
        >
          <EyeOff className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700">
            High Contrast
          </label>
          <button
            id="high-contrast"
            onClick={() => togglePreference('highContrast')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              preferences.highContrast ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            aria-pressed={preferences.highContrast}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.highContrast ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="large-text" className="text-sm font-medium text-gray-700">
            Large Text
          </label>
          <button
            id="large-text"
            onClick={() => togglePreference('largeText')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              preferences.largeText ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            aria-pressed={preferences.largeText}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.largeText ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700">
            Reduced Motion
          </label>
          <button
            id="reduced-motion"
            onClick={() => togglePreference('reducedMotion')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              preferences.reducedMotion ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            aria-pressed={preferences.reducedMotion}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.reducedMotion ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="screen-reader" className="text-sm font-medium text-gray-700">
            Screen Reader Support
          </label>
          <button
            id="screen-reader"
            onClick={() => togglePreference('screenReader')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              preferences.screenReader ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            aria-pressed={preferences.screenReader}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.screenReader ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            setPreferences({
              highContrast: false,
              largeText: false,
              reducedMotion: false,
              screenReader: false
            })
            applyPreferences({
              highContrast: false,
              largeText: false,
              reducedMotion: false,
              screenReader: false
            })
            localStorage.removeItem('accessibility-preferences')
          }}
          className="w-full text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded py-1"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  )
}

// Hook for accessibility utilities
export const useAccessibility = () => {
  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  const focusElement = (selector) => {
    const element = document.querySelector(selector)
    if (element) {
      element.focus()
    }
  }

  const getAriaLabel = (element, fallback) => {
    return element.getAttribute('aria-label') || 
           element.getAttribute('aria-labelledby') || 
           element.textContent?.trim() || 
           fallback
  }

  return {
    announceToScreenReader,
    focusElement,
    getAriaLabel
  }
}

export default AccessibilityUtils
