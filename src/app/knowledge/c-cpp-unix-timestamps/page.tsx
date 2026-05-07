import type { Metadata } from 'next'
import CCppUnixTimestampsClient from './CCppUnixTimestampsClient'

export const metadata: Metadata = {
  title: 'C/C++ Unix Timestamps — time_t, clock_gettime Reference',
  description:
    'POSIX time in C/C++: time_t, timespec, clock_gettime vs gettimeofday, and Y2038 considerations for native code.',
  alternates: { canonical: 'https://unixcalculator.com/knowledge/c-cpp-unix-timestamps' },
}

export default function Page() {
  return <CCppUnixTimestampsClient />
}
