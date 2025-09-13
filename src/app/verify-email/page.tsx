"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading'
import { CheckCircle, XCircle, Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setStatus('success')
      setMessage(data.message)
    } catch (error: any) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <LoadingSpinner size="lg" />
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Freightnaut CRM</h1>
          <p className="text-gray-600">Email verification</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className={`text-2xl ${getStatusColor()}`}>
              {status === 'loading' && 'Verifying your email...'}
              {status === 'success' && 'Email verified!'}
              {status === 'error' && 'Verification failed'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Please wait while we verify your email address'}
              {status === 'success' && 'Your account has been successfully activated'}
              {status === 'error' && 'There was a problem verifying your email'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {message && (
              <Alert className={`mb-4 ${status === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                <AlertDescription className={getStatusColor()}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  You can now sign in to your account and start using Freightnaut CRM.
                </p>
                <Button asChild className="w-full">
                  <Link href="/onboarding">Complete Setup</Link>
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  The verification link may have expired or is invalid. Please try signing up again.
                </p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/signup">Sign up again</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  This may take a few moments...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
