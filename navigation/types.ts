import type { ComponentType } from 'react'

export interface HeaderSection {
  id: string
  title: string
  icon: ComponentType<{ className?: string }>
}
