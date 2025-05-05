export const runtime = 'nodejs'

import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new NextResponse('Invalid signature', { status: 400 })
  }

  // ここに Supabase 連携処理を完全に排除する（動作確認のため）

  return new NextResponse('OK', { status: 200 })
}
