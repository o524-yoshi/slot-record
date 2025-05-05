// app/api/stripe-webhook/route.ts

// ✅ Edge Runtime ではなく Node.js を明示（これが超重要！）
export const runtime = 'nodejs'

import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ✅ Stripe 初期化（APIバージョンは Stripe ダッシュボードと一致させてください）
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
    console.error('❌ Webhook signature verification failed:', err)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ✅ 決済成功時（初回購入・再加入）
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const customerId = session.customer as string
    const userId = session.metadata?.userId

    if (userId) {
      await supabase.from('paid_users').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        is_active: true,
        subscribed_at: new Date().toISOString(),
      })
      console.log(`✅ User ${userId} marked as active`)
    }
  }

  // ✅ 解約時
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    await supabase
      .from('paid_users')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customerId)

    console.log(`⚠️ User with customer_id ${customerId} marked as inactive`)
  }

  return new NextResponse('OK', { status: 200 })
}
