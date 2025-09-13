import { useCallback } from 'react'
import { toast } from 'sonner'

export interface ClientError {
  message: string
  code?: string
  details?: any
  timestamp?: string
}

export function useErrorHandler() {
  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error)

    let errorMessage = 'An unexpected error occurred'
    let errorCode = 'UNKNOWN_ERROR'

    if (error instanceof Error) {
      errorMessage = error.message
      
      // Handle specific error types
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error - please check your connection'
        errorCode = 'NETWORK_ERROR'
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication required - please log in again'
        errorCode = 'AUTH_ERROR'
      } else if (error.message.includes('403')) {
        errorMessage = 'Access denied - insufficient permissions'
        errorCode = 'FORBIDDEN_ERROR'
      } else if (error.message.includes('404')) {
        errorMessage = 'Resource not found'
        errorCode = 'NOT_FOUND_ERROR'
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error - please try again later'
        errorCode = 'SERVER_ERROR'
      }
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      const errorObj = error as { message: string; code?: string }
      errorMessage = errorObj.message
      errorCode = errorObj.code || 'API_ERROR'
    }

    // Show user-friendly error message
    toast.error(errorMessage, {
      description: context ? `Error in ${context}` : undefined,
      duration: 5000,
    })

    // Log detailed error for debugging
    console.error('Detailed error:', {
      message: errorMessage,
      code: errorCode,
      context,
      originalError: error,
      timestamp: new Date().toISOString(),
    })

    return {
      message: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString(),
    }
  }, [])

  const handleApiError = useCallback((response: Response, context?: string) => {
    return response.json().then((errorData: ClientError) => {
      const error = new Error(errorData.message || 'API request failed')
      ;(error as any).code = errorData.code
      ;(error as any).details = errorData.details
      
      return handleError(error, context)
    }).catch(() => {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
      return handleError(error, context)
    })
  }, [handleError])

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn()
    } catch (error) {
      handleError(error, context)
      return null
    }
  }, [handleError])

  return {
    handleError,
    handleApiError,
    handleAsyncError,
  }
}

// Hook for handling form errors
export function useFormErrorHandler() {
  const { handleError } = useErrorHandler()

  const handleFormError = useCallback((error: unknown, field?: string) => {
    const context = field ? `form field: ${field}` : 'form submission'
    return handleError(error, context)
  }, [handleError])

  return { handleFormError }
}

// Hook for handling API call errors
export function useApiErrorHandler() {
  const { handleError, handleApiError, handleAsyncError } = useErrorHandler()

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<Response>,
    context?: string
  ): Promise<T | null> => {
    try {
      const response = await apiCall()
      
      if (!response.ok) {
        return await handleApiError(response, context)
      }
      
      return await response.json()
    } catch (error) {
      handleError(error, context)
      return null
    }
  }, [handleError, handleApiError])

  return {
    handleApiCall,
    handleApiError,
    handleAsyncError,
  }
}
