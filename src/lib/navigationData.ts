import { Calculator, TrendingUp, Code, RotateCcw } from 'lucide-react'

export interface Calculator {
  id: string
  title: string
  description: string
  searchVolume: number
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'essential' | 'programming' | 'financial' | 'scientific' | 'utility'
  icon: any
  path: string
  unixIntegration: boolean
  premium?: boolean
}

export const calculators: Calculator[] = [
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate exact age with Unix date commands',
    searchVolume: 1100000,
    difficulty: 'easy',
    category: 'essential',
    icon: Calculator,
    path: '/age-calculator',
    unixIntegration: true,
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'BC-powered percentage calculations with precision',
    searchVolume: 448000,
    difficulty: 'easy',
    category: 'essential',
    icon: TrendingUp,
    path: '/percentage-calculator',
    unixIntegration: true,
  },
  {
    id: 'binary-converter',
    title: 'Binary Converter',
    description: 'Convert bases using BC obase/ibase',
    searchVolume: 62200,
    difficulty: 'medium',
    category: 'programming',
    icon: Code,
    path: '/binary-converter',
    unixIntegration: true,
  },
  {
    id: 'hash-calculator',
    title: 'Hash Calculator',
    description: 'Generate hashes with Unix command-line tools',
    searchVolume: 45000,
    difficulty: 'medium',
    category: 'programming',
    icon: Code,
    path: '/hash-calculator',
    unixIntegration: true,
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test patterns with grep, sed, and awk',
    searchVolume: 78000,
    difficulty: 'hard',
    category: 'programming',
    icon: Code,
    path: '/regex-tester',
    unixIntegration: true,
  },
  {
    id: 'file-size-calculator',
    title: 'File Size Calculator',
    description: 'Calculate storage with du, df commands',
    searchVolume: 34000,
    difficulty: 'easy',
    category: 'programming',
    icon: Code,
    path: '/file-size-calculator',
    unixIntegration: true,
  },
  {
    id: 'time-calculator',
    title: 'Time Calculator',
    description: 'Time calculations with Unix date commands',
    searchVolume: 327000,
    difficulty: 'medium',
    category: 'utility',
    icon: RotateCcw,
    path: '/time-calculator',
    unixIntegration: true,
  },
  {
    id: 'temperature-converter',
    title: 'Temperature Converter',
    description: 'Convert between temperature scales with BC',
    searchVolume: 156000,
    difficulty: 'easy',
    category: 'utility',
    icon: Calculator,
    path: '/temperature-converter',
    unixIntegration: true,
  },
]

export const categories = [
  { id: 'all', name: 'All Calculators', count: calculators.length },
  { id: 'essential', name: 'Essential Math', count: calculators.filter((c) => c.category === 'essential').length },
  { id: 'programming', name: 'Programming', count: calculators.filter((c) => c.category === 'programming').length },
  { id: 'financial', name: 'Financial', count: calculators.filter((c) => c.category === 'financial').length },
  { id: 'scientific', name: 'Scientific', count: calculators.filter((c) => c.category === 'scientific').length },
  { id: 'utility', name: 'Utilities', count: calculators.filter((c) => c.category === 'utility').length },
]
