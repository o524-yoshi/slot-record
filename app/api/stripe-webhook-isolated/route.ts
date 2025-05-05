// app/api/stripe-webhook/route.ts

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // 確実にビルド時に静的化されないようにする

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || ''
  const rawBody = Buffer.from(await req.arrayBuffer())

  // ✅ Stripe SDK を動的 import（ビルド時に評価されない！）
  const { default: Stripe } = await import('stripe')
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2022-11-15',
  })

  let event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('❌ Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('✅ Webhook event received:', event.type)

  return NextResponse.json({ received: true }, { status: 200 })
}
