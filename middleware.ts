import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Skip all middleware logic in development to speed up local server
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next()
  }

  try {
    const url = req.nextUrl
    const referer = req.headers.get('referer')
    const isExternalEntry = !referer || !referer.startsWith(`${url.origin}/`)

    const hasSupabaseCookie = Boolean(
      req.cookies.get('sb-access-token') ||
      req.cookies.get('sb-refresh-token') ||
      req.cookies.get('sb:token') ||
      req.cookies.get('sb:refreshToken')
    )

    if (!hasSupabaseCookie && isExternalEntry && url.pathname !== '/') {
      return NextResponse.redirect(new URL('/', url))
    }

    return NextResponse.next()
  } catch (error) {
    // If there's any error in middleware, just continue
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|images|public).*)'],
}


