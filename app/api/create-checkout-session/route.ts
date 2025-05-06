// app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // 仮のレスポンス（本番では Stripe Checkout セッション作成処理などに置き換え）
  return NextResponse.json({ message: 'Checkout session created (dummy)' })
}
