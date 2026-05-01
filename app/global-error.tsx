'use client'

/**
 * Root-level fallback when the root layout fails. Must define html/body.
 * Keeps styles inline so it works even if the main layout/CSS never loads.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#1a1a1a',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: '28rem' }}>
          {error.message}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            borderRadius: '0.375rem',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
