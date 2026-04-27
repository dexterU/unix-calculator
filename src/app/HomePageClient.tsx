'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, Terminal, Book, Target, Users, FileText, Clock, Code, TrendingUp } from 'lucide-react'
import { Hero } from '@/components/Hero'
import { Header } from '@/components/Header'
import { UnixTimestampConverter } from '@/components/UnixTimestampConverter'
import { EnhancedCalculatorSection } from '@/components/EnhancedCalculatorSection'
import { TutorialsSection } from '@/components/TutorialsSection'
import { ExamplesSection } from '@/components/ExamplesSection'
import { ReferenceSection } from '@/components/ReferenceSection'
import { ChallengesSection } from '@/components/ChallengesSection'
import { CommunitySection } from '@/components/CommunitySection'
import { CalculatorsGrid, type CalculatorsGridItem } from '@/components/CalculatorsGrid'
import { ProgressTracker } from '@/components/ProgressTracker'
import { AgeCalculator } from '@/components/AgeCalculator'
import { PercentageCalculator } from '@/components/PercentageCalculator'
import { useUnixCalculator } from '@/hooks/useUnixCalculator'
import { useScrollTracking } from '@/hooks/useScrollTracking'
import { Toaster } from 'react-hot-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

/** Marker component so grid cells can be “enabled” without embedding the full calculator. */
function CalculatorGridEnabled() {
  return null
}

const CALCULATOR_ROUTES: Record<string, string> = {
  age: '/age-calculator',
  percentage: '/percentage-calculator',
  binary: '/binary-converter',
  time: '/time-calculator',
}

const gridCalculators: CalculatorsGridItem[] = [
  {
    id: 'age',
    title: 'Age Calculator',
    description: 'Calculate exact age with Unix date commands',
    searchVolume: 1100000,
    difficulty: 'easy',
    icon: Calculator,
    component: AgeCalculator,
    color: 'blue',
  },
  {
    id: 'percentage',
    title: 'Percentage Calculator',
    description: 'BC-powered percentage calculations with precision',
    searchVolume: 448000,
    difficulty: 'easy',
    icon: TrendingUp,
    component: PercentageCalculator,
    color: 'green',
  },
  {
    id: 'binary',
    title: 'Binary Converter',
    description: 'Convert bases using BC obase/ibase commands',
    searchVolume: 62200,
    difficulty: 'medium',
    icon: Code,
    component: CalculatorGridEnabled,
    color: 'purple',
  },
  {
    id: 'time',
    title: 'Time Calculator',
    description: 'Time calculations with Unix date commands',
    searchVolume: 327000,
    difficulty: 'medium',
    icon: Clock,
    component: CalculatorGridEnabled,
    color: 'orange',
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-emerald-500/20 text-emerald-200'
    case 'medium':
      return 'bg-amber-500/20 text-amber-100'
    case 'hard':
      return 'bg-red-500/20 text-red-100'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getIconColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-sky-500/20 text-sky-200',
    green: 'bg-emerald-500/20 text-emerald-200',
    purple: 'bg-violet-500/20 text-violet-200',
    orange: 'bg-orange-500/20 text-orange-200',
  }
  return colors[color] || colors.blue
}

const formatSearchVolume = (volume: number) => {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`
  return volume.toString()
}

const HomePageClient = () => {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('calculator')
  const [calcTab, setCalcTab] = useState('timestamp')
  const {
    expression,
    setExpression,
    result,
    error,
    isCalculating,
    calculate,
    history,
    clearHistory,
  } = useUnixCalculator()

  const { scrollProgress } = useScrollTracking()

  const navigateToSection = (section: string) => {
    setActiveSection(section)
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const sections = [
    { id: 'calculator', title: 'Calculator', icon: Calculator },
    { id: 'tutorials', title: 'Tutorials', icon: Book },
    { id: 'examples', title: 'Examples', icon: FileText },
    { id: 'reference', title: 'Reference', icon: Terminal },
    { id: 'challenges', title: 'Challenges', icon: Target },
    { id: 'community', title: 'Community', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gradient-terminal">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--terminal-surface))',
            color: 'hsl(var(--terminal-text))',
            border: '1px solid hsl(var(--terminal-border))',
          },
        }}
      />

      <Header
        activeSection={activeSection}
        onNavigate={navigateToSection}
        sections={sections}
      />

      <main className="relative pt-16">
        <Hero
          onNavigateToCalculator={() => navigateToSection('calculator')}
          onNavigateToTutorials={() => navigateToSection('tutorials')}
        />

        <ProgressTracker progress={scrollProgress} />

        <div className="container mx-auto px-4 space-y-24 py-16">
          <section id="calculator">
            <Tabs value={calcTab} onValueChange={setCalcTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="timestamp" className="gap-2">
                    <Clock className="w-4 h-4" />
                    Timestamp Converter
                  </TabsTrigger>
                  <TabsTrigger value="bc" className="gap-2">
                    <Terminal className="w-4 h-4" />
                    BC Calculator
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="timestamp">
                <UnixTimestampConverter />
              </TabsContent>
              <TabsContent value="bc">
                <EnhancedCalculatorSection
                  expression={expression}
                  setExpression={setExpression}
                  result={result}
                  error={error}
                  isCalculating={isCalculating}
                  onCalculate={calculate}
                  history={history}
                  onClearHistory={clearHistory}
                  onNavigate={navigateToSection}
                />
              </TabsContent>
            </Tabs>
          </section>

          <section id="tutorials">
            <TutorialsSection onNavigate={navigateToSection} />
          </section>

          <section id="examples">
            <ExamplesSection
              onUseExample={(expr) => {
                setExpression(expr)
                setCalcTab('bc')
                navigateToSection('calculator')
              }}
            />
          </section>

          <section id="reference">
            <ReferenceSection />
          </section>

          <section id="challenges">
            <ChallengesSection onNavigate={navigateToSection} />
          </section>

          <section id="community">
            <CommunitySection />
          </section>
        </div>

        <section className="container mx-auto px-4 pb-24" id="more-calculators">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            More calculators
          </h2>
          <CalculatorsGrid
            calculators={gridCalculators}
            getDifficultyColor={getDifficultyColor}
            getIconColor={getIconColor}
            formatSearchVolume={formatSearchVolume}
            onOpenCalculator={(id) => {
              const path = CALCULATOR_ROUTES[id]
              if (path) router.push(path)
            }}
          />
        </section>

        <footer className="py-8 px-4 border-t border-terminal-border mt-16">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 Unix Calculator. All rights reserved.
              </div>
              <div className="flex gap-6 flex-wrap justify-center">
                <Link href="/all-calculators" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">All Calculators</Link>
                <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Site Map</Link>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Privacy Policy</Link>
                <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Terms of Service</Link>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">About Us</Link>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Blog</Link>
                <Link href="/knowledge" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Knowledge Base</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default HomePageClient
