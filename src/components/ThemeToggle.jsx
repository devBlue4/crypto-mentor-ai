import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = ({ variant = 'button', size = 'md' }) => {
  const { theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme, isLoading } = useTheme()

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded ${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'}`} />
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Theme options"
        >
          {theme === 'light' && <Sun className="w-5 h-5" />}
          {theme === 'dark' && <Moon className="w-5 h-5" />}
          <span className="text-sm font-medium capitalize">{theme}</span>
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-1">
            <button
              onClick={setLightTheme}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
              {theme === 'light' && <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full" />}
            </button>
            
            <button
              onClick={setDarkTheme}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
              {theme === 'dark' && <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full" />}
            </button>
            
            <button
              onClick={setSystemTheme}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Monitor className="w-4 h-4" />
              <span>System</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
        size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
      }`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className={`text-gray-600 dark:text-gray-400 ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />
      ) : (
        <Sun className={`text-gray-600 dark:text-gray-400 ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />
      )}
    </button>
  )
}

export default ThemeToggle










