'use client'

import { useEffect } from 'react'

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }

        if (entry.entryType === 'first-input' && 'processingStart' in entry) {
          const firstInput = entry as PerformanceEventTiming
          console.log('FID:', firstInput.processingStart - firstInput.startTime)
        }

        if (entry.entryType === 'layout-shift') {
          const layoutShift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean }
          if (layoutShift.value && !layoutShift.hadRecentInput) {
            console.log('CLS:', layoutShift.value)
          }
        }
      }
    })

    observer.observe({
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'],
    })

    return () => observer.disconnect()
  }, [])

  return null
}
