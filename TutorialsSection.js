'use client'

import { useState } from 'react'
import { Book, Play, Clock, CheckCircle } from 'lucide-react'

const tutorials = [
  {
    id: 'bc-fundamentals',
    title: 'BC Command Fundamentals',
    description: 'Master basic calculator operations with interactive examples',
    duration: '15 min',
    difficulty: 'Beginner',
    lessons: 8,
    completed: false
  },
  {
    id: 'advanced-functions',
    title: 'Advanced Mathematical Functions',
    description: 'Scientific calculations and complex expressions',
    duration: '20 min',
    difficulty: 'Intermediate',
    lessons: 12,
    completed: false
  },
  {
    id: 'shell-integration',
    title: 'Shell Script Integration',
    description: 'Using Unix calculators in bash scripts and automation',
    duration: '25 min',
    difficulty: 'Advanced',
    lessons: 15,
    completed: false
  },
  {
    id: 'awk-math',
    title: 'AWK Mathematical Operations',
    description: 'Data processing and calculations with AWK',
    duration: '18 min',
    difficulty: 'Intermediate',
    lessons: 10,
    completed: false
  },
  {
    id: 'bash-arithmetic',
    title: 'Bash Arithmetic Expansion',
    description: 'Built-in arithmetic operations in bash shell',
    duration: '12 min',
    difficulty: 'Beginner',
    lessons: 6,
    completed: false
  },
  {
    id: 'precision-control',
    title: 'Precision and Scale Control',
    description: 'Managing decimal precision in financial calculations',
    duration: '22 min',
    difficulty: 'Advanced',
    lessons: 11,
    completed: false
  }
]

export function TutorialsSection({ onNavigate }) {
  const [selectedTutorial, setSelectedTutorial] = useState(null)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (selectedTutorial) {
    const tutorial = tutorials.find(t => t.id === selectedTutorial)
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b p-4">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="w-6 h-6 text-primary-600" />
              <h1 className="text-2xl font-bold">{tutorial.title}</h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                {tutorial.difficulty}
              </span>
            </div>
            <button
              onClick={() => setSelectedTutorial(null)}
              className="btn btn-secondary"
            >
              ← Back to All Tutorials
            </button>
          </div>
        </div>

        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="card mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {tutorial.title}
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {tutorial.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Book className="w-4 h-4" />
                    {tutorial.lessons} lessons
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🚧 Tutorial Content Coming Soon!
                </h3>
                <p className="text-gray-600 mb-6">
                  We're working hard to bring you comprehensive, interactive tutorials. 
                  Each tutorial will include step-by-step examples, hands-on exercises, 
                  and real-world applications.
                </p>
                <button 
                  onClick={() => setSelectedTutorial(null)}
                  className="btn btn-primary"
                >
                  Browse Other Tutorials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Interactive BC Command Tutorials
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master Unix calculations with step-by-step interactive tutorials designed for all skill levels.
        </p>
      </div>

      <div className="grid-auto">
        {tutorials.map((tutorial, index) => (
          <div
            key={tutorial.id}
            className="card card-interactive"
            onClick={() => setSelectedTutorial(tutorial.id)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
                <Book className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {tutorial.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  {tutorial.duration}
                  <span className="mx-1">•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
              </div>
              {tutorial.completed && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>

            <p className="text-gray-600 mb-4">
              {tutorial.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {tutorial.lessons} lessons
              </div>
              <button className="btn btn-primary btn-sm">
                <Play className="w-4 h-4" />
                Start Tutorial
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tutorial Features */}
      <div className="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            What You'll Learn
          </h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              📚
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Interactive Lessons</h4>
            <p className="text-gray-600 text-sm">
              Step-by-step tutorials with hands-on exercises and real examples
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              ⚡
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Command Mastery</h4>
            <p className="text-gray-600 text-sm">
              Master BC, AWK, and bash arithmetic from basics to advanced
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              🎯
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Real Applications</h4>
            <p className="text-gray-600 text-sm">
              Learn through practical examples and real-world scenarios
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
