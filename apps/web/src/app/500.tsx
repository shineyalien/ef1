import Link from 'next/link'

export default function ServerError() {
  return (
    <html lang="en">
      <body>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', margin: 0 }}>500</h1>
            <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Server Error</p>
            <p style={{ marginTop: '1rem', color: '#666' }}>Something went wrong on our end.</p>
            <Link href="/dashboard" style={{ 
              marginTop: '2rem', 
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem'
            }}>
              Go to Dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}