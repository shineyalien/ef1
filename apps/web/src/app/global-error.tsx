'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <head>
        <title>Critical Error | Easy Filer</title>
      </head>
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
          <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', color: '#dc2626', marginTop: 0, marginBottom: 0 }}>⚠️</h1>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem', marginTop: 0 }}>Critical Error</h2>
              <p style={{ color: '#4b5563' }}>A critical error occurred in the application.</p>
              {error?.digest && (
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', fontFamily: 'monospace' }}>Error ID: {error.digest}</p>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => reset()}
                style={{ width: '100%', backgroundColor: '#dc2626', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                Go to Dashboard
              </button>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  If the problem persists, please contact support
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}