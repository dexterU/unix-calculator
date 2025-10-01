export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      background: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e293b', marginBottom: 24 }}>
          Unix Calculator
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b' }}>
          Professional command-line calculator toolkit.
        </p>
      </div>
    </main>
  )
}
