'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeaderSection } from '@/components/navigation/types'

export function NavigationBar({
  activeSection = '',
  onNavigate,
  sections,
}: {
  activeSection?: string
  onNavigate: (sectionId: string) => void
  sections: HeaderSection[]
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const LogoIcon = sections[0]?.icon

  const go = (sectionId: string) => {
    onNavigate(sectionId)
    window.location.hash = sectionId
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
            {LogoIcon ? <LogoIcon className="w-6 h-6 text-primary-600" /> : null}
            Unix Calculator
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(s.id)}
                className={cn(
                  'nav-link',
                  activeSection === s.id && 'text-primary-500 bg-primary-50'
                )}
              >
                {s.title}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <nav className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(s.id)}
                  className={cn(
                    'nav-link block w-full text-left',
                    activeSection === s.id && 'text-primary-500 bg-primary-50'
                  )}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
