import type { Metadata } from 'next'
import EquationSolverClient from './EquationSolverClient'

export const metadata: Metadata = {
  title: 'Equation Solver — Solve Linear & Quadratic Equations',
  description:
    'Solve linear, quadratic, and systems of equations instantly. Shows step-by-step solutions. Free online equation solver.',
  alternates: { canonical: 'https://www.unixcalculator.com/equation-solver' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <EquationSolverClient />
}
