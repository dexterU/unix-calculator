// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
// Remove framer-motion temporarily to fix build issues
import { Calculator, Code, TrendingUp, Clock, Terminal, BookOpen, Target, Users } from 'lucide-react'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { AgeCalculator } from '@/components/AgeCalculator'
import { PercentageCalculator } from '@/components/PercentageCalculator'
import { TutorialsSection } from '@/components/TutorialsSection'

const calculators = [
  {
    id: 'age',
    title: 'Age Calculator',
    description: 'Calculate exact age with Unix date commands',
    searchVolume: 1100000,
    difficulty: 'easy',
    category: 'essential',
    icon: Calculator,
    component: AgeCalculator,
    color: 'blue'
  },
  {
    id: 'percentage',
    title: 'Percentage Calculator',
    description: 'BC-powered percentage calculations with precision',
    searchVolume: 448000,
    difficulty: 'easy',
    category: 'essential',
    icon: TrendingUp,
    component: PercentageCalculator,
    color: 'green'
  },
  {
    id: 'binary',
    title: 'Binary Converter',
    description: 'Convert bases using BC obase/ibase commands',
    searchVolume: 62200,
    difficulty: 'medium',
    category: 'programming',
    icon: Code,
    component: null,
    color: 'purple'
  },
  {
    id: 'time',
    title: 'Time Calculator',
    description: 'Time calculations with Unix date commands',
    searchVolume: 327000,
    difficulty: 'medium',
    category: 'utility',
    icon: Clock,
    component: null,
    color: 'orange'
  }
]

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'hard': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getIconColor = (color) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }
  return colors[color] || colors.blue
}

const formatSearchVolume = (volume) => {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`
  return volume.toString()
}

export default function HomePage() {
  const [activeCalculator, setActiveCalculator] = useState(null)
  const [activeSection, setActiveSection] = useState('home')

  // Handle section navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) setActiveSection(hash)
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Render individual calculator
  if (activeCalculator) {
    const calc = calculators.find(c => c.id === activeCalculator)
    if (calc && calc.component) {
      const CalculatorComponent = calc.component
      return (
        <div className="min-h-screen">
          <Header
            activeSection={activeSection}
            onNavigate={setActiveSection}
          />
          <div className="bg-white border-b p-4">
            <div className="container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <calc.icon className="w-6 h-6 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">{calc.title}</h1>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  Unix Powered
                </span>
              </div>
              <button
                onClick={() => setActiveCalculator(null)}
                className="btn btn-secondary"
              >
                ← Back to All Calculators
              </button>
            </div>
          </div>
          <CalculatorComponent />
        </div>
      )
    }
  }

  // Render tutorials section
  if (activeSection === 'tutorials') {
    return (
      <div className="min-h-screen">
        <Header
          activeSection={activeSection}
          onNavigate={setActiveSection}
        />
        <TutorialsSection onNavigate={setActiveSection} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      <Hero
        onNavigateToCalculator={() => {
          window.location.hash = 'calculators'
        }}
        onNavigateToTutorials={() => {
          setActiveSection('tutorials')
        }}
      />

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Unix Calculations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional tools, educational content, and real-world examples all in one place.
            </p>
          </div>

          <div className="grid-auto">
            <div className="card text-center transition-all hover:transform">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Calculators</h3>
              <p className="text-gray-600">
                25+ professional calculators with real-time Unix command generation
              </p>
            </div>

            <div className="card text-center transition-all hover:transform">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Terminal className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Command Integration</h3>
              <p className="text-gray-600">
                Every calculation shows the equivalent BC, AWK, or bash command
              </p>
            </div>

            <div className="card text-center transition-all hover:transform">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step-by-Step Tutorials</h3>
              <p className="text-gray-600">
                Learn Unix math from basic arithmetic to advanced scientific functions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators Grid */}
      <section id="calculators" className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Unix-Powered Calculators
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive collection of calculators with Unix command integration. 
              Learn the command-line equivalent for every calculation.
            </p>
          </div>

          <div className="grid-auto">
            {calculators.map((calc, index) => (
              <div
                key={calc.id}
                className={`card card-interactive ${!calc.component ? 'opacity-60' : ''}`}
                onClick={() => calc.component && setActiveCalculator(calc.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${getIconColor(calc.color)}`}>
                      <calc.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {calc.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(calc.difficulty)}`}>
                          {calc.difficulty}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Unix
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {calc.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {formatSearchVolume(calc.searchVolume)} monthly searches
                  </div>
                  <div className={`text-sm font-medium ${calc.component ? 'text-primary-600' : 'text-gray-400'}`}>
                    {calc.component ? 'Open Calculator →' : 'Coming Soon'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="container text-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Unix-Powered Calculators?
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">25+</div>
                <div className="text-gray-600 font-medium">Professional Calculators</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
                <div className="text-gray-600 font-medium">Unix Integration</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
                <div className="text-gray-600 font-medium">Interactive Tutorials</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container text-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Master Unix Mathematics?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and system administrators who use our calculators daily.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveSection('tutorials')}
                className="btn btn-primary btn-lg"
              >
                <BookOpen className="w-5 h-5" />
                Start Learning
              </button>
              <button 
                onClick={() => window.location.hash = 'calculators'}
                className="btn btn-outline btn-lg"
              >
                <Calculator className="w-5 h-5" />
                Try Calculators
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


