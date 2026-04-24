'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CronGeneratorClient() {
  const [minute, setMinute] = useState('0')
  const [hour, setHour] = useState('9')
  const [dom, setDom] = useState('*')
  const [month, setMonth] = useState('*')
  const [dow, setDow] = useState('*')

  const expr = useMemo(
    () => `${minute} ${hour} ${dom} ${month} ${dow}`,
    [minute, hour, dom, month, dow]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cron expression builder
          </h1>
          <p className="text-gray-600">
            Standard five-field cron (minute hour day-of-month month day-of-week).
            Validate against your scheduler (systemd, k8s, cloud) before use.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="m">Minute</Label>
            <Input
              id="m"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="0-59 or *"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h">Hour</Label>
            <Input
              id="h"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="0-23 or *"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dom">Day of month</Label>
            <Input
              id="dom"
              value={dom}
              onChange={(e) => setDom(e.target.value)}
              placeholder="1-31 or *"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="1-12 or *"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="dow">Day of week</Label>
            <Input
              id="dow"
              value={dow}
              onChange={(e) => setDow(e.target.value)}
              placeholder="0-6 or * (0 = Sunday)"
            />
          </div>
        </div>
        <div className="calc-result">
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">
            Expression
          </p>
          <code className="text-lg font-mono">{expr}</code>
        </div>
      </main>
    </div>
  )
}
