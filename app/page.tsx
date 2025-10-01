export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f8fafc',
      padding: '1rem'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold',
          color: '#1e293b', 
          marginBottom: '1rem' 
        }}>
          Unix Calculator
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#64748b',
          lineHeight: '1.6'
        }}>
          Professional command-line calculator with BC syntax, interactive tutorials, 
          and comprehensive examples for developers and system administrators.
        </p>
        <div style={{ 
          marginTop: '2rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Start Calculating
          </button>
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: '#3182ce',
            border: '2px solid #3182ce',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            View Tutorials
          </button>
        </div>
      </div>
    </main>
  )
}

