'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Terminal, Calculator } from 'lucide-react'

interface HeroProps {
  onNavigateToCalculator: () => void
  onNavigateToTutorials: () => void
}

export function Hero({
  onNavigateToCalculator,
  onNavigateToTutorials,
}: HeroProps) {
  return (
    <section className="relative bg-gradient-terminal text-terminal-text py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--terminal-green)/0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--terminal-cyan)/0.1),transparent_70%)]" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Terminal className="h-12 w-12 text-terminal-green" />
            <Calculator className="h-10 w-10 text-terminal-cyan" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Unix Calculator
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-terminal-text/90 leading-relaxed">
            Professional command-line calculator with BC syntax, interactive
            tutorials, and comprehensive examples for developers and system
            administrators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onNavigateToCalculator}
              className="bg-terminal-green hover:bg-terminal-green/80 text-terminal-bg font-medium text-lg px-8 py-3 shadow-glow"
            >
              Start Calculating
            </Button>
            <Button
              onClick={onNavigateToTutorials}
              variant="outline"
              className="border-2 border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-terminal-bg text-lg px-8 py-3"
            >
              View Tutorials
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-terminal-green" />
              <span>BC Command Syntax</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-terminal-amber" />
              <span>Interactive Examples</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-terminal-cyan" />
              <span>Real-world Scenarios</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
