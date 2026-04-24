'use client'

import { Calculator, BookOpen, Code, Terminal } from 'lucide-react'
import { NavigationBar } from '@/components/navigation'
import type { HeaderSection } from '@/components/navigation/types'

export type { HeaderSection }

export interface HeaderProps {
  activeSection?: string
  onNavigate?: (sectionId: string) => void
  sections?: HeaderSection[]
}

const DEFAULT_SECTIONS: HeaderSection[] = [
  { id: 'calculators', title: 'Calculators', icon: Calculator },
  { id: 'tutorials', title: 'Tutorials', icon: BookOpen },
  { id: 'examples', title: 'Examples', icon: Code },
  { id: 'reference', title: 'Reference', icon: Terminal },
]

export function Header({
  activeSection = '',
  onNavigate,
  sections = DEFAULT_SECTIONS,
}: HeaderProps) {
  const handleNavigate =
    onNavigate ??
    ((sectionId: string) => {
      window.location.hash = sectionId
    })

  return (
    <NavigationBar
      activeSection={activeSection}
      onNavigate={handleNavigate}
      sections={sections}
    />
  )
}
