import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      return NextResponse.json({ message: 'Email already subscribed' }, { status: 200 })
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])

    if (error) {
      console.error('Error subscribing to newsletter:', error)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Successfully subscribed to newsletter' })
  } catch (error) {
    console.error('Error in newsletter API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
