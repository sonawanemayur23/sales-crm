import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { opportunitiesApi } from '@/lib/services/api'
import { Opportunity, CreateOpportunityForm } from '@/lib/types'
import { useErrorHandler } from './use-error-handler'

// Query keys
export const opportunityKeys = {
  all: ['opportunities'] as const,
  lists: () => [...opportunityKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...opportunityKeys.lists(), { filters }] as const,
  details: () => [...opportunityKeys.all, 'detail'] as const,
  detail: (id: string) => [...opportunityKeys.details(), id] as const,
}

// Hooks
export function useOpportunities(params?: { stage?: string; limit?: number; offset?: number }) {
  const { handleError } = useErrorHandler()

  return useQuery({
    queryKey: opportunityKeys.list(params || {}),
    queryFn: async () => {
      try {
        return await opportunitiesApi.getAll(params)
      } catch (error) {
        handleError(error, 'fetching opportunities')
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && error.message.includes('4')) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: opportunityKeys.detail(id),
    queryFn: () => opportunitiesApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOpportunityForm) => opportunitiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() })
    },
  })
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) =>
      opportunitiesApi.update(id, data),
    onSuccess: (updatedOpportunity) => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() })
      queryClient.setQueryData(
        opportunityKeys.detail(updatedOpportunity.id),
        updatedOpportunity
      )
    },
  })
}

export function useDeleteOpportunity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => opportunitiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() })
    },
  })
}
