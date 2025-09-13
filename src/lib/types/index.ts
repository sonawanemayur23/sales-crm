// TypeScript types for all entities

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'sales_manager' | 'sdr' | 'ae' | 'finance' | 'exec'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  name: string
  industry?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  description?: string
  type: 'customer' | 'prospect' | 'partner' | 'competitor'
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  annualRevenue?: number
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  title?: string
  department?: string
  accountId?: string
  isPrimary: boolean
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  title?: string
  industry?: string
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost'
  source: 'website' | 'referral' | 'cold_call' | 'email' | 'social' | 'event' | 'manual'
  score: number
  notes?: string
  assignedTo?: string
  accountId?: string
  contactId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Opportunity {
  id: string
  title: string
  description?: string
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  value: number
  probability: number
  expectedCloseDate?: Date
  actualCloseDate?: Date
  source: 'inbound' | 'outbound' | 'referral' | 'website' | 'event' | 'manual'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  accountId?: string
  contactId?: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'whatsapp'
  subject: string
  description?: string
  relatedTo: 'lead' | 'opportunity' | 'account' | 'contact'
  relatedId: string
  assignedTo: string
  dueDate?: Date
  completedAt?: Date
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface Demo {
  id: string
  title: string
  description?: string
  type: 'online' | 'in_person' | 'phone'
  scheduledAt: Date
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  opportunityId?: string
  leadId?: string
  assignedTo: string
  meetingLink?: string
  location?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Quote {
  id: string
  title: string
  description?: string
  opportunityId?: string
  accountId?: string
  contactId?: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  total: number
  validUntil?: Date
  sentAt?: Date
  viewedAt?: Date
  acceptedAt?: Date
  rejectedAt?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface QuoteItem {
  id: string
  quoteId: string
  name: string
  description?: string
  quantity: number
  unitPrice: number
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface Plan {
  id: string
  name: string
  description?: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  isActive: boolean
  features: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Feature {
  id: string
  name: string
  description?: string
  category: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface CreateOpportunityForm {
  title: string
  description?: string
  stage: string
  value: number
  probability: number
  expectedCloseDate?: string
  accountId?: string
  contactId?: string
  assignedTo?: string
  source: string
  priority: string
}

export interface CreateLeadForm {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  title?: string
  industry?: string
  source: string
  assignedTo?: string
  notes?: string
}

export interface CreateAccountForm {
  name: string
  industry?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  description?: string
  type: string
  size?: string
  annualRevenue?: number
  assignedTo?: string
}

// Dashboard types
export interface DashboardStats {
  totalOpportunities: number
  totalValue: number
  wonOpportunities: number
  wonValue: number
  activeLeads: number
  scheduledDemos: number
  pendingQuotes: number
  thisMonthRevenue: number
  lastMonthRevenue: number
  revenueGrowth: number
}

export interface PipelineStage {
  name: string
  count: number
  value: number
  color: string
}

// Integration types
export interface IntegrationConfig {
  telephony: {
    provider: 'exotel' | 'knowlarity' | 'twilio'
    apiKey: string
    apiToken: string
    sid: string
  }
  whatsapp: {
    apiKey: string
    phoneNumberId: string
  }
  email: {
    provider: 'ses' | 'sendgrid'
    apiKey: string
    fromEmail: string
  }
  calendar: {
    provider: 'google'
    clientId: string
    clientSecret: string
  }
}
