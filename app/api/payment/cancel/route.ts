import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Monime sends a POST to cancel URL, we need to redirect to the cancel page
  const url = new URL('/payment/cancel', request.url)
  
  // Preserve any query parameters that Monime might send
  const searchParams = new URL(request.url).searchParams
  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })
  
  return NextResponse.redirect(url, 303)
}

export async function GET(request: Request) {
  // Also handle GET requests (in case Monime changes behavior)
  const url = new URL('/payment/cancel', request.url)
  return NextResponse.redirect(url, 303)
}
