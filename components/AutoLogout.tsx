'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AutoLogout() {
  // Disable in development to avoid noisy unload handlers and network beacons
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  useEffect(() => {
    let hasLoggedOut = false
    let lastVisibilityLogout = 0

    const logout = async () => {
      if (hasLoggedOut) return
      hasLoggedOut = true
      try {
        // Attempt Supabase client signOut first
        await supabase.auth.signOut()
      } catch (_) {
        // Ignore client errors; attempt cookie cleanup as fallback
      }

      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([], { type: 'application/json' })
          navigator.sendBeacon('/api/auth/auto-logout', blob)
        } else {
          fetch('/api/auth/auto-logout', { method: 'POST', keepalive: true, credentials: 'include' })
        }
      } catch (_) {
        // Best-effort; unload contexts can be flaky
      }

      try {
        localStorage.removeItem('lastVisitedRoute')
        sessionStorage.removeItem('lastVisitedRoute')
      } catch (_) {}
    }

    const onBeforeUnload = () => logout()
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const now = Date.now()
        if (now - lastVisibilityLogout > 10000) { // throttle to once per 10s
          lastVisibilityLogout = now
          logout()
        }
      }
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return null
}


