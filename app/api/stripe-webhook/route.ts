// ✅ VercelのEdge RuntimeではなくNode.jsを使うために必須！
export const runtime = 'nodejs'

import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil', // Stripeダッシュボードと一致させてOK
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

  // ✅ supabase-js を動的 import（これで build 時に process.env を読まない！）
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ✅ 決済成功時
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const customerId = session.customer as string

    if (userId && customerId) {
      await supabase.from('paid_users').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        is_active: true,
        subscribed_at: new Date().toISOString(),
      })
      console.log(`✅ ユーザー ${userId} を有効にしました`)
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

    console.log(`⚠️ 顧客 ${customerId} のサブスクを無効化しました`)
  }

  return new NextResponse('OK', { status: 200 })
}
