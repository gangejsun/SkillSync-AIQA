import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

/**
 * Custom render function that wraps components with necessary providers
 * Add more providers here as needed (QueryClient, Theme, etc.)
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  // Add providers here when needed:
  // - QueryClientProvider (React Query)
  // - ThemeProvider
  // - AuthProvider
  // - etc.

  return <>{children}</>
}

/**
 * Custom render with providers
 * Use this instead of Testing Library's render
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Re-export everything from Testing Library
export * from '@testing-library/react'
export { renderWithProviders as render }
