'use client'

import { QueryClientProvider } from 'react-query'
import queryClient from '@/app/queryClient'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
} 