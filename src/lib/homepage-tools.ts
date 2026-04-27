import type { LucideIcon } from 'lucide-react'
import { Clock, Database, FileJson, Globe, Layers, Terminal, Timer, Wrench } from 'lucide-react'
import { calculators } from '@/lib/navigationData'
import { TOOLS_ROUTE_LIST } from '@/lib/toolsRouteList'

export type HomeBrowseTab = 'all' | 'time' | 'math' | 'dev' | 'finance'

export type HomeToolCard = {
  id: string
  name: string
  description: string
  searchVolume: number
  path: string
  icon: LucideIcon
  tab: HomeBrowseTab
}

function toolIconForPath(path: string): LucideIcon {
  if (path.includes('timestamp')) return Clock
  if (path.includes('timezone')) return Globe
  if (path.includes('duration')) return Timer
  if (path.includes('cron')) return Terminal
  if (path.includes('log')) return Layers
  if (path.includes('api')) return FileJson
  if (path.includes('db-migration')) return Database
  if (path.includes('batch')) return Layers
  return Wrench
}

function calcTab(
  category: (typeof calculators)[number]['category'],
  id: string
): HomeBrowseTab {
  if (category === 'financial') return 'finance'
  if (category === 'programming') return 'dev'
  if (category === 'scientific') return 'math'
  if (id === 'time-calculator') return 'time'
  if (category === 'utility') {
    if (id === 'temperature-converter' || id === 'cm-to-inches-converter') return 'math'
    return 'math'
  }
  return 'math'
}

/** Calculators from navigation data + /tools/* routes for 25+ items. */
export function getHomeToolCards(): HomeToolCard[] {
  const fromCalcs: HomeToolCard[] = calculators.map((c) => ({
    id: c.id,
    name: c.title,
    description: c.description,
    searchVolume: c.searchVolume,
    path: c.path,
    icon: c.icon as LucideIcon,
    tab: calcTab(c.category, c.id),
  }))

  const fromTools: HomeToolCard[] = TOOLS_ROUTE_LIST.filter((t) => t.path !== '/tools').map(
    (t) => {
      const path = t.path
      let tab: HomeBrowseTab = 'dev'
      if (
        path.includes('timestamp') ||
        path.includes('timezone') ||
        path.includes('duration')
      ) {
        tab = 'time'
      }
      return {
        id: path.replace(/\//g, '-'),
        name: t.title,
        description: t.description,
        searchVolume: 120000,
        path,
        icon: toolIconForPath(path),
        tab,
      }
    }
  )

  return [...fromTools, ...fromCalcs]
}
