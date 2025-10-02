import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Ensure this route runs on Node.js runtime (SendGrid requires Node APIs)
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Save message to Supabase
    const { error: dbError } = await supabase
      .from('messages')
      .insert([{ name, email, message }])
    if (dbError) {
      console.error('Error saving message to database:', dbError)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    // Send email notification via Resend
    try {
      const { Resend } = await import('resend')
      const apiKey = process.env.RESEND_API_KEY
      const from = process.env.RESEND_FROM_EMAIL
      const to = process.env.CONTACT_TO_EMAIL || from

      if (!apiKey || !from || !to) {
        console.warn('Resend env vars missing; skipping email send')
      } else {
        const resend = new Resend(apiKey)
        const subject = `New Contact Form Submission from ${name}`
        const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        const html = `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
        await resend.emails.send({ from, to, subject, text, html })
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails, just log it
    }
  } catch (error) {
    console.error('Error in contact API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
