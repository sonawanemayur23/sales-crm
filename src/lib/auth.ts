// Simple authentication utilities
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export const mockUser: User = {
  id: "1",
  email: "admin@freightnaut.com",
  firstName: "John",
  lastName: "Doe",
  role: "admin"
}

export function getCurrentUser(): User | null {
  // In a real app, this would check localStorage, cookies, or make an API call
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : mockUser
  }
  return mockUser
}

export function setCurrentUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
  }
}
