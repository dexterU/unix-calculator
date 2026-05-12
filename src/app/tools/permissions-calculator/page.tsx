import type { Metadata } from 'next'
import { PermissionsCalculatorClient } from './PermissionsCalculatorClient'

export const metadata: Metadata = {
  title: 'Unix Permissions Calculator — chmod Calculator & Reference',
  description:
    'Calculate Unix file permissions visually. Convert between chmod numeric (755), symbolic (rwxr-xr-x), and octal formats. Includes permission reference table and real command output.',
  alternates: { canonical: 'https://www.unixcalculator.com/tools/permissions-calculator' },
}

export default function Page() {
  return <PermissionsCalculatorClient />
}
