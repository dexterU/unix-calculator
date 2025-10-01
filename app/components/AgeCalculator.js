'use client'

import { useState } from 'react'
import { Copy, Terminal, BookOpen } from 'lucide-react'

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState(null)

  const calculateAge = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const now = new Date()
    
    const ageInMs = now.getTime() - birth.getTime()
    const years = Math.floor(ageInMs / (365.25 * 24 * 60 * 60 * 1000))
    const months = Math.floor((ageInMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000))
    const days = Math.floor((ageInMs % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000))
    const totalDays = Math.floor(ageInMs / (24 * 60 * 60 * 1000))
    const totalHours = Math.floor(ageInMs / (60 * 60 * 1000))

    setResult({
      years,
      months, 
      days,
      totalDays,
      totalHours,
      birthDate: birth.toDateString(),
      nextBirthday: getNextBirthday(birth)
    })
  }

  const getNextBirthday = (birthDate) => {
    const now = new Date()
    const currentYear = now.getFullYear()
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate())
    
    if (nextBirthday < now) {
      nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate())
    }
    
    const daysUntil = Math.ceil((nextBirthday.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    return { date: nextBirthday.toDateString(), days: daysUntil }
  }

  const copyCommand = () => {
    const command = `birth="${birthDate}"; echo $(((\`date +%s\` - \`date -d "$birth" +%s\`) / 31536000))`
    navigator.clipboard.writeText(command)
    alert('Unix command copied to clipboard!')
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Calculator Interface */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Age Calculator</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="calc-input"
              />
              <button
                onClick={calculateAge}
                disabled={!birthDate}
                className="btn btn-primary w-full mt-4"
                style={{ opacity: !birthDate ? 0.5 : 1 }}
              >
                Calculate Age
              </button>
            </div>

            {result && (
              <div className="bg-gray-50 rounded-lg p-6 fade-in">
                <h3 className="font-semibold text-gray-900 mb-4">Your Age</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Exact Age:</span>
                    <span className="font-semibold">{result.years} years, {result.months} months, {result.days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Days:</span>
                    <span className="font-semibold">{result.totalDays.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Hours:</span>
                    <span className="font-semibold">{result.totalHours.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Next Birthday:</span>
                    <span className="font-semibold">in {result.nextBirthday.days} days</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unix Commands Section */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-900">Unix Command Equivalent</h3>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Calculate Age with Unix Date</h4>
              <button
                onClick={copyCommand}
                className="btn btn-secondary btn-sm flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Use Unix date command to calculate precise age</p>
            <div className="terminal">
              <code>{`birth="${birthDate || 'YYYY-MM-DD'}"
today=$(date +%s)
birth_epoch=$(date -d "$birth" +%s)
age_years=$(((today - birth_epoch) / 31536000))
echo "Age: $age_years years"`}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
