import { useEffect, useState } from 'react'

const SkeletonLoader = ({ 
  type = 'text', 
  width = '100%', 
  height = '20px', 
  lines = 1, 
  className = '',
  animation = true 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Add a small delay to prevent flash of skeleton
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  const baseClasses = `bg-gray-200 rounded ${animation ? 'animate-pulse' : ''} ${className}`
  
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={baseClasses}
                style={{
                  width: index === lines - 1 ? '75%' : width,
                  height
                }}
              />
            ))}
          </div>
        )
      
      case 'card':
        return (
          <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
            <div className={`${baseClasses} h-4 w-1/3 mb-3`} />
            <div className={`${baseClasses} h-3 w-full mb-2`} />
            <div className={`${baseClasses} h-3 w-2/3 mb-2`} />
            <div className={`${baseClasses} h-3 w-1/2`} />
          </div>
        )
      
      case 'table':
        return (
          <div className="space-y-3">
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className={`${baseClasses} h-4 w-1/4`} />
                <div className={`${baseClasses} h-4 w-1/6`} />
                <div className={`${baseClasses} h-4 w-1/6`} />
                <div className={`${baseClasses} h-4 w-1/6`} />
                <div className={`${baseClasses} h-4 w-1/6`} />
              </div>
            ))}
          </div>
        )
      
      case 'chart':
        return (
          <div className={`${className}`}>
            <div className={`${baseClasses} h-4 w-1/3 mb-4`} />
            <div className="flex items-end space-x-2 h-48">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={`${baseClasses} w-8`}
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
          </div>
        )
      
      case 'avatar':
        return (
          <div className={`${baseClasses} rounded-full`} style={{ width, height }} />
        )
      
      case 'button':
        return (
          <div className={`${baseClasses} h-10 w-24`} />
        )
      
      case 'image':
        return (
          <div className={`${baseClasses} w-full`} style={{ height }} />
        )
      
      default:
        return (
          <div className={baseClasses} style={{ width, height }} />
        )
    }
  }

  return renderSkeleton()
}

// Predefined skeleton components for common use cases
export const SkeletonCard = (props) => (
  <SkeletonLoader type="card" {...props} />
)

export const SkeletonText = (props) => (
  <SkeletonLoader type="text" {...props} />
)

export const SkeletonTable = (props) => (
  <SkeletonLoader type="table" {...props} />
)

export const SkeletonChart = (props) => (
  <SkeletonLoader type="chart" {...props} />
)

export const SkeletonAvatar = (props) => (
  <SkeletonLoader type="avatar" {...props} />
)

export const SkeletonButton = (props) => (
  <SkeletonLoader type="button" {...props} />
)

export const SkeletonImage = (props) => (
  <SkeletonLoader type="image" {...props} />
)

// Loading state wrapper component
export const LoadingState = ({ 
  isLoading, 
  children, 
  skeleton, 
  message = 'Loading...',
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
        {skeleton || (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    )
  }

  return children
}

export default SkeletonLoader









