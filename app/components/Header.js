'use client'

import { useState } from 'react'
import { Calculator as CalcIcon, Menu, X } from 'lucide-react'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <CalcIcon className="w-6 h-6 text-primary-600" />
            Unix Calculator
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <a href="#calculators" className="nav-link">Calculators</a>
            <a href="#tutorials" className="nav-link">Tutorials</a>
            <a href="#examples" className="nav-link">Examples</a>
            <a href="#reference" className="nav-link">Reference</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <nav className="space-y-1">
              <a href="#calculators" className="nav-link block">Calculators</a>
              <a href="#tutorials" className="nav-link block">Tutorials</a>
              <a href="#examples" className="nav-link block">Examples</a>
              <a href="#reference" className="nav-link block">Reference</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

