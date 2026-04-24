import type { Metadata } from 'next'
import EquationSolverClient from './EquationSolverClient'

export const metadata: Metadata = {
  title: 'Equation Solver | Unix Calculator',
  description: 'Equation Solver — Unix Calculator',
}

export default function Page() {
  return <EquationSolverClient />
}
