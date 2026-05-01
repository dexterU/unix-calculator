'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h2>Something went wrong</h2>
        <p style={{ marginTop: 12, color: '#444' }}>Please try again.</p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
