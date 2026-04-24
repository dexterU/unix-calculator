import { Calculator, TrendingUp, Code, DollarSign, Zap, RotateCcw } from 'lucide-react'

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
  // Essential Math (High Traffic)
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate exact age with Unix date commands',
    searchVolume: 1100000,
    difficulty: 'easy',
    category: 'essential',
    icon: Calculator,
    path: '/age-calculator',
    unixIntegration: true
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
    unixIntegration: true
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Body Mass Index with AWK data processing',
    searchVolume: 466000,
    difficulty: 'easy', 
    category: 'essential',
    icon: Calculator,
    path: '/bmi-calculator',
    unixIntegration: true
  },
  {
    id: 'grade-calculator',
    title: 'Grade Calculator',
    description: 'GPA calculations with AWK statistics',
    searchVolume: 140800,
    difficulty: 'medium',
    category: 'utility',
    icon: Calculator,
    path: '/grade-calculator',
    unixIntegration: true
  },
  {
    id: 'calorie-calculator',
    title: 'Calorie Calculator',
    description: 'Daily caloric needs with Unix precision',
    searchVolume: 89000,
    difficulty: 'medium',
    category: 'utility',
    icon: Calculator,
    path: '/calorie-calculator',
    unixIntegration: true
  },
  
  // Programming Tools
  {
    id: 'binary-converter',
    title: 'Binary Converter',
    description: 'Convert bases using BC obase/ibase',
    searchVolume: 62200,
    difficulty: 'medium',
    category: 'programming',
    icon: Code,
    path: '/binary-converter',
    unixIntegration: true
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
    unixIntegration: true
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
    unixIntegration: true
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
    unixIntegration: true
  },
  
  // Financial (High Value)
  {
    id: 'mortgage-calculator',
    title: 'Mortgage Calculator',
    description: 'Advanced mortgage math with BC precision',
    searchVolume: 2400000,
    difficulty: 'medium',
    category: 'financial',
    icon: DollarSign,
    path: '/mortgage-calculator',
    unixIntegration: true,
    premium: true
  },
  {
    id: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'Advanced interest calculations using BC math',
    searchVolume: 78000,
    difficulty: 'medium',
    category: 'financial',
    icon: DollarSign,
    path: '/compound-interest',
    unixIntegration: true,
    premium: true
  },
  {
    id: 'loan-calculator',
    title: 'Loan Calculator',
    description: 'Loan payments and amortization with Unix tools',
    searchVolume: 456000,
    difficulty: 'medium',
    category: 'financial',
    icon: DollarSign,
    path: '/loan-calculator',
    unixIntegration: true,
    premium: true
  },
  
  // Scientific 
  {
    id: 'derivative-calculator',
    title: 'Derivative Calculator',
    description: 'Numerical derivatives using BC calculus',
    searchVolume: 89000,
    difficulty: 'hard',
    category: 'scientific',
    icon: Zap,
    path: '/derivative-calculator',
    unixIntegration: true
  },
  {
    id: 'integral-calculator',
    title: 'Integral Calculator',
    description: 'Calculate integrals with BC numerical methods',
    searchVolume: 67000,
    difficulty: 'hard',
    category: 'scientific',
    icon: Zap,
    path: '/integral-calculator',
    unixIntegration: true
  },
  {
    id: 'matrix-calculator',
    title: 'Matrix Calculator',
    description: 'Matrix operations with awk and BC arithmetic',
    searchVolume: 45000,
    difficulty: 'hard',
    category: 'scientific',
    icon: Zap,
    path: '/matrix-calculator',
    unixIntegration: true
  },
  {
    id: 'equation-solver',
    title: 'Equation Solver',
    description: 'Solve equations using Newton-Raphson and BC',
    searchVolume: 34000,
    difficulty: 'hard',
    category: 'scientific',
    icon: Zap,
    path: '/equation-solver',
    unixIntegration: true
  },
  
  // Utilities
  {
    id: 'time-calculator', 
    title: 'Time Calculator',
    description: 'Time calculations with Unix date commands',
    searchVolume: 327000,
    difficulty: 'medium',
    category: 'utility',
    icon: RotateCcw,
    path: '/time-calculator',
    unixIntegration: true
  },
  {
    id: 'cm-to-inches-converter',
    title: 'CM to Inches Converter',
    description: 'Convert units with BC precision arithmetic',
    searchVolume: 234000,
    difficulty: 'easy',
    category: 'utility',
    icon: Calculator,
    path: '/cm-to-inches',
    unixIntegration: true
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
    unixIntegration: true
  }
]

export const categories = [
  { id: 'all', name: 'All Calculators', count: calculators.length },
  { id: 'essential', name: 'Essential Math', count: calculators.filter(c => c.category === 'essential').length },
  { id: 'programming', name: 'Programming', count: calculators.filter(c => c.category === 'programming').length },
  { id: 'financial', name: 'Financial', count: calculators.filter(c => c.category === 'financial').length },
  { id: 'scientific', name: 'Scientific', count: calculators.filter(c => c.category === 'scientific').length },
  { id: 'utility', name: 'Utilities', count: calculators.filter(c => c.category === 'utility').length }
]
