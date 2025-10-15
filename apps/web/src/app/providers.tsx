/**
 * App Providers Component
 *
 * This is a simple passthrough component since we're now using
 * DynamicProviders in the root layout to handle SSR compatibility.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}