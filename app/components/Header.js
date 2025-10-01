'use client'

import { useState } from 'react'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      background: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(8px)', 
      borderBottom: '1px solid #e5e7eb' 
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: '4rem' 
        }}>
          {/* Logo */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937' 
          }}>
            <span style={{ color: '#3182ce' }}>⚡</span>
            Unix Calculator
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: 'none' }} className="desktop-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <a href="#calculators" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                Calculators
              </a>
              <a href="#tutorials" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                Tutorials
              </a>
              <a href="#examples" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                Examples
              </a>
              <a href="#reference" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                Reference
              </a>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '0.375rem', 
              border: 'none', 
              background: 'transparent', 
              cursor: 'pointer' 
            }}
            className="mobile-menu-btn"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div style={{ 
            borderTop: '1px solid #e5e7eb', 
            paddingTop: '0.5rem', 
            paddingBottom: '0.5rem' 
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <a href="#calculators" style={{ 
                display: 'block', 
                padding: '0.5rem 0.75rem', 
                color: '#6b7280', 
                textDecoration: 'none', 
                borderRadius: '0.375rem' 
              }}>
                Calculators
              </a>
              <a href="#tutorials" style={{ 
                display: 'block', 
                padding: '0.5rem 0.75rem', 
                color: '#6b7280', 
                textDecoration: 'none', 
                borderRadius: '0.375rem' 
              }}>
                Tutorials
              </a>
              <a href="#examples" style={{ 
                display: 'block', 
                padding: '0.5rem 0.75rem', 
                color: '#6b7280', 
                textDecoration: 'none', 
                borderRadius: '0.375rem' 
              }}>
                Examples
              </a>
              <a href="#reference" style={{ 
                display: 'block', 
                padding: '0.5rem 0.75rem', 
                color: '#6b7280', 
                textDecoration: 'none', 
                borderRadius: '0.375rem' 
              }}>
                Reference
              </a>
            </nav>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: block !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  )
}
