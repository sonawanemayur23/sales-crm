import { useQuery } from '@tanstack/react-query'
import { accountsApi } from '@/lib/services/api'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
