// Client-side utility functions for authentication

export function getTokenFromCookies(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
  
  if (tokenCookie) {
    return tokenCookie.split('=')[1]
  }
  
  return null
}

// Server-side function to get token from request cookies
export function getTokenFromRequestCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';')
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
  
  if (tokenCookie) {
    return tokenCookie.split('=')[1]
  }
  
  return null
}

export function setTokenInCookies(token: string) {
  if (typeof document === 'undefined') return
  
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`
}

export function removeTokenFromCookies() {
  if (typeof document === 'undefined') return
  
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}
