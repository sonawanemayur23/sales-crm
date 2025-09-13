import { NextRequest, NextResponse } from 'next/server'

export interface ApiError {
  message: string
  code?: string
  statusCode: number
  details?: any
  timestamp: string
  path?: string
}

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code?: string
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number = 500, code?: string, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export function createApiError(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): ApiError {
  return {
    message,
    code,
    statusCode,
    details,
    timestamp: new Date().toISOString(),
  }
}

export function handleApiError(error: unknown, request?: NextRequest): NextResponse {
  console.error('API Error:', error)

  let apiError: ApiError

  if (error instanceof AppError) {
    apiError = createApiError(error.message, error.statusCode, error.code)
  } else if (error instanceof Error) {
    // Handle specific error types
    if (error.name === 'ValidationError') {
      apiError = createApiError('Validation failed', 400, 'VALIDATION_ERROR', error.message)
    } else if (error.name === 'UnauthorizedError') {
      apiError = createApiError('Unauthorized access', 401, 'UNAUTHORIZED')
    } else if (error.name === 'ForbiddenError') {
      apiError = createApiError('Forbidden access', 403, 'FORBIDDEN')
    } else if (error.name === 'NotFoundError') {
      apiError = createApiError('Resource not found', 404, 'NOT_FOUND')
    } else if (error.name === 'ConflictError') {
      apiError = createApiError('Resource conflict', 409, 'CONFLICT')
    } else if (error.message.includes('ECONNREFUSED')) {
      apiError = createApiError('Database connection failed', 503, 'DATABASE_ERROR')
    } else if (error.message.includes('Cannot convert undefined or null to object')) {
      apiError = createApiError('Data processing error', 500, 'DATA_PROCESSING_ERROR')
    } else {
      apiError = createApiError(
        process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message,
        500,
        'INTERNAL_ERROR',
        process.env.NODE_ENV === 'development' ? error.stack : undefined
      )
    }
  } else {
    apiError = createApiError('Unknown error occurred', 500, 'UNKNOWN_ERROR')
  }

  // Add request path if available
  if (request) {
    apiError.path = request.url
  }

  // Log error details
  console.error('API Error Details:', {
    ...apiError,
    stack: error instanceof Error ? error.stack : undefined,
  })

  return NextResponse.json(
    {
      error: apiError.message,
      code: apiError.code,
      details: apiError.details,
      timestamp: apiError.timestamp,
      path: apiError.path,
    },
    { status: apiError.statusCode }
  )
}

export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      const request = args[0] as NextRequest
      return handleApiError(error, request)
    }
  }
}

// Database error handler
export function handleDatabaseError(error: unknown): never {
  console.error('Database Error:', error)

  if (error instanceof Error) {
    if (error.message.includes('ECONNREFUSED')) {
      throw new AppError('Database connection failed', 503, 'DATABASE_CONNECTION_ERROR')
    } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
      throw new AppError('Database table not found', 500, 'DATABASE_SCHEMA_ERROR')
    } else if (error.message.includes('duplicate key')) {
      throw new AppError('Duplicate entry', 409, 'DUPLICATE_ENTRY')
    } else if (error.message.includes('foreign key')) {
      throw new AppError('Referenced record not found', 400, 'FOREIGN_KEY_ERROR')
    } else if (error.message.includes('not null')) {
      throw new AppError('Required field missing', 400, 'NULL_CONSTRAINT_ERROR')
    }
  }

  throw new AppError('Database operation failed', 500, 'DATABASE_ERROR')
}

// Validation error handler
export function handleValidationError(error: unknown): never {
  console.error('Validation Error:', error)

  if (error instanceof Error) {
    throw new AppError(`Validation failed: ${error.message}`, 400, 'VALIDATION_ERROR')
  }

  throw new AppError('Validation failed', 400, 'VALIDATION_ERROR')
}

// Authentication error handler
export function handleAuthError(error: unknown): never {
  console.error('Authentication Error:', error)

  if (error instanceof Error) {
    if (error.message.includes('Invalid token')) {
      throw new AppError('Invalid authentication token', 401, 'INVALID_TOKEN')
    } else if (error.message.includes('Token expired')) {
      throw new AppError('Authentication token expired', 401, 'TOKEN_EXPIRED')
    } else if (error.message.includes('User not found')) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND')
    }
  }

  throw new AppError('Authentication failed', 401, 'AUTH_ERROR')
}
