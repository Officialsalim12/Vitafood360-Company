import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Monime sends a POST to success URL, we need to redirect to the success page
  const url = new URL('/payment/success', request.url)
  
  // Preserve any query parameters that Monime might send (like session_id)
  const searchParams = new URL(request.url).searchParams
  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })
  
  return NextResponse.redirect(url, 303)
}

export async function GET(request: Request) {
  // Also handle GET requests (in case Monime changes behavior)
  const url = new URL('/payment/success', request.url)
  
  const searchParams = new URL(request.url).searchParams
  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })
  
  return NextResponse.redirect(url, 303)
}
