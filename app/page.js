'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { AgeCalculator } from './components/AgeCalculator'

export default function HomePage() {
  const [activeCalculator, setActiveCalculator] = useState(null)

  if (activeCalculator === 'age') {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Header />
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Age Calculator</h1>
            <button
              onClick={() => setActiveCalculator(null)}
              className="btn btn-secondary"
            >
              ← Back to All Calculators
            </button>
          </div>
        </div>
        <AgeCalculator />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '5rem 0' 
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '4xl', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            Unix Calculator
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', 
            marginBottom: '2rem', 
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Professional command-line calculator with BC syntax, interactive tutorials, 
            and comprehensive examples for developers and system administrators.
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button 
              onClick={() => setActiveCalculator('age')}
              className="btn btn-accent" 
              style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
            >
              Start Calculating
            </button>
            <button 
              className="btn" 
              style={{ 
                border: '2px solid white', 
                color: 'white', 
                background: 'transparent',
                fontSize: '1.125rem', 
                padding: '1rem 2rem' 
              }}
            >
              View Tutorials
            </button>
          </div>
        </div>
      </section>

      {/* Calculators Grid */}
      <section id="calculators" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Professional Unix-Powered Calculators
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '3xl', margin: '0 auto' }}>
              Comprehensive collection of calculators with Unix command integration. 
              Learn the command-line equivalent for every calculation.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {/* Age Calculator Card */}
            <div 
              className="card" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => setActiveCalculator('age')}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  color: '#3b82f6', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem' 
                }}>
                  📅
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Age Calculator</h3>
                  <span style={{ 
                    background: '#dcfce7', 
                    color: '#166534', 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500' 
                  }}>
                    Easy
                  </span>
                </div>
              </div>
              
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Calculate exact age with Unix date commands
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  1.1M monthly searches
                </div>
                <div style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: '500' }}>
                  Open Calculator →
                </div>
              </div>
            </div>

            {/* Placeholder for more calculators */}
            <div className="card" style={{ opacity: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ 
                  background: 'rgba(34, 197, 94, 0.1)', 
                  color: '#22c55e', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem' 
                }}>
                  📊
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Percentage Calculator</h3>
                  <span style={{ 
                    background: '#dcfce7', 
                    color: '#166534', 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500' 
                  }}>
                    Easy
                  </span>
                </div>
              </div>
              
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                BC-powered percentage calculations with precision
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  448K monthly searches
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>
                  Coming Soon
                </div>
              </div>
            </div>

            <div className="card" style={{ opacity: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ 
                  background: 'rgba(168, 85, 247, 0.1)', 
                  color: '#a855f7', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem' 
                }}>
                  🔢
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Binary Converter</h3>
                  <span style={{ 
                    background: '#fef3c7', 
                    color: '#92400e', 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500' 
                  }}>
                    Medium
                  </span>
                </div>
              </div>
              
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Convert bases using BC obase/ibase
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  62K monthly searches
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Why Choose Unix-Powered Calculators?
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem', 
            marginTop: '2rem' 
          }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>25+</div>
              <div style={{ color: '#6b7280' }}>Professional Calculators</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>100%</div>
              <div style={{ color: '#6b7280' }}>Unix Integration</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>50+</div>
              <div style={{ color: '#6b7280' }}>Interactive Tutorials</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
