'use client'

import { useState } from 'react'

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState(null)

  const calculateAge = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const now = new Date()
    
    const ageInMs = now.getTime() - birth.getTime()
    const years = Math.floor(ageInMs / (365.25 * 24 * 60 * 60 * 1000))
    const totalDays = Math.floor(ageInMs / (24 * 60 * 60 * 1000))
    const totalHours = Math.floor(ageInMs / (60 * 60 * 1000))

    setResult({ years, totalDays, totalHours })
  }

  const copyCommand = () => {
    const command = `birth="${birthDate}"; echo $(((\`date +%s\` - \`date -d "$birth" +%s\`) / 31536000))`
    navigator.clipboard.writeText(command)
    alert('Unix command copied to clipboard!')
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '4xl', margin: '0 auto' }}>
        {/* Calculator Interface */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
            Age Calculator
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="calc-input"
              />
              <button
                onClick={calculateAge}
                disabled={!birthDate}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', opacity: !birthDate ? 0.5 : 1 }}
              >
                Calculate Age
              </button>
            </div>

            {result && (
              <div style={{ 
                background: '#f3f4f6', 
                borderRadius: '0.5rem', 
                padding: '1.5rem',
                animation: 'fadeIn 0.3s ease-in'
              }}>
                <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Your Age</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Age:</span>
                    <span style={{ fontWeight: '600' }}>{result.years} years</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Days:</span>
                    <span style={{ fontWeight: '600' }}>{result.totalDays.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Hours:</span>
                    <span style={{ fontWeight: '600' }}>{result.totalHours.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unix Commands Section */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Unix Command Equivalent</h3>
          </div>
          
          <div style={{ border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ fontWeight: '600', color: '#1f2937' }}>Calculate Age with Unix Date</h4>
              <button
                onClick={copyCommand}
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
              >
                📋 Copy
              </button>
            </div>
            <pre style={{ 
              background: '#1f2937', 
              color: '#10b981', 
              padding: '1rem', 
              borderRadius: '0.375rem', 
              fontSize: '0.875rem', 
              overflowX: 'auto',
              fontFamily: 'Monaco, Menlo, monospace'
            }}>
              <code>{`birth="${birthDate || 'YYYY-MM-DD'}"
today=$(date +%s)
birth_epoch=$(date -d "$birth" +%s)
age_years=$(((today - birth_epoch) / 31536000))
echo "Age: $age_years years"`}</code>
            </pre>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
