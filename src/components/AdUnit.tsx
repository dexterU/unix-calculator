'use client'

import { useEffect, useRef } from 'react'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

export function AdUnit({
  slot,
  format = 'auto',
  className = '',
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    if (!adRef.current) return

    try {
      const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle
      if (adsbygoogle) {
        adsbygoogle.push({})
        initialized.current = true
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`relative ${className}`} style={{ minHeight: '90px' }}>
      <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        Advertisement
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5643430532021522"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
