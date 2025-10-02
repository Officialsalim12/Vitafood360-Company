import { NextResponse } from 'next/server'

export async function POST() {
  // Best-effort: clear common Supabase auth cookies so a new visit is unauthenticated
  const res = NextResponse.json({ ok: true })

  // Supabase cookie names can vary by version/domain settings; clear broadly-used names
  const cookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    'sb:token',
    'sb:refreshToken',
  ]

  for (const name of cookieNames) {
    res.cookies.set(name, '', { path: '/', httpOnly: true, maxAge: 0 })
  }

  return res
}


