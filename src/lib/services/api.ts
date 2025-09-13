// API service layer for all data operations
import { 
  Opportunity, 
  Lead, 
  Account
} from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}/api${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || 'API request failed')
    }

    return await response.json()
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(500, 'Network error')
    }
}

// Opportunities API
export const opportunitiesApi = {
  async getAll(params?: { stage?: string; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.stage) searchParams.set('stage', params.stage)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())
    
    const query = searchParams.toString()
    return apiRequest<Opportunity[]>(`/opportunities${query ? `?${query}` : ''}`)
  },

  async getById(id: string) {
    return apiRequest<Opportunity>(`/opportunities/${id}`)
  },

  async create(data: Partial<Opportunity>) {
    return apiRequest<Opportunity>('/opportunities', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<Opportunity>) {
    return apiRequest<Opportunity>(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string) {
    return apiRequest<{ message: string }>(`/opportunities/${id}`, {
      method: 'DELETE',
    })
  },
}

// Leads API
export const leadsApi = {
  async getAll(params?: { status?: string; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())
    
    const query = searchParams.toString()
    return apiRequest<Lead[]>(`/leads${query ? `?${query}` : ''}`)
  },

  async getById(id: string) {
    return apiRequest<Lead>(`/leads/${id}`)
  },

  async create(data: Partial<Lead>) {
    return apiRequest<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<Lead>) {
    return apiRequest<Lead>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string) {
    return apiRequest<{ message: string }>(`/leads/${id}`, {
      method: 'DELETE',
    })
  },
}

// Accounts API
export const accountsApi = {
  async getAll(params?: { limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())
    
    const query = searchParams.toString()
    return apiRequest<Account[]>(`/accounts${query ? `?${query}` : ''}`)
  },

  async getById(id: string) {
    return apiRequest<Account>(`/accounts/${id}`)
  },

  async create(data: Partial<Account>) {
    return apiRequest<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<Account>) {
    return apiRequest<Account>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string) {
    return apiRequest<{ message: string }>(`/accounts/${id}`, {
      method: 'DELETE',
    })
  },
}

// Auth API
export const authApi = {
  async login(email: string, password: string) {
    return apiRequest<{ user: { userId: string; email: string; firstName: string; lastName: string; isActive: boolean; createdAt: string; updatedAt: string }; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async logout() {
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
}

// Integration API
export const integrationsApi = {
  async makeCall(phoneNumber: string) {
    return apiRequest<{ success: boolean; callId?: string }>('/integrations/call', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    })
  },

  async sendWhatsApp(phoneNumber: string, message: string) {
    return apiRequest<{ success: boolean; messageId?: string }>('/integrations/whatsapp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, message }),
    })
  },

  async sendEmail(to: string, subject: string, body: string) {
    return apiRequest<{ success: boolean; messageId?: string }>('/integrations/email', {
      method: 'POST',
      body: JSON.stringify({ to, subject, body }),
    })
  },

  async createCalendarEvent(title: string, startTime: string, endTime: string) {
    return apiRequest<{ success: boolean; eventId?: string }>('/integrations/calendar', {
      method: 'POST',
      body: JSON.stringify({ title, startTime, endTime }),
    })
  },
}

export { ApiError }
