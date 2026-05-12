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

    const initAd = () => {
      try {
        const w = window as any
        w.adsbygoogle = w.adsbygoogle || []
        w.adsbygoogle.push({})
        initialized.current = true
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }

    // If script already loaded, init immediately
    if ((window as any).adsbygoogle !== undefined) {
      initAd()
    } else {
      // Wait for adsbygoogle.js to load then init
      const interval = setInterval(() => {
        if ((window as any).adsbygoogle !== undefined) {
          clearInterval(interval)
          initAd()
        }
      }, 200)

      // Stop trying after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval)
      }, 10000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
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
