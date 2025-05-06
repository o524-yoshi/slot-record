import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

console.log('✅ check-user API 起動')
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 存在' : '❌ 未設定')

const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user = searchParams.get('user')

  if (!user) {
    return NextResponse.json({ error: 'user パラメータが必要です' }, { status: 400 })
  }

  try {
    console.log('🔍 user チェック開始:', user)

    const { data, error } = await supabase
      .from('テスト')
      .select('user_id')
      .eq('user_id', user)

    if (error) {
      console.error('❌ Supabase DBエラー:', error)
      return NextResponse.json({ error: 'DBエラー' }, { status: 500 })
    }

    const exists = Array.isArray(data) && data.length > 0
    console.log('✅ user チェック結果:', exists ? '存在' : 'なし')

    return NextResponse.json({ exists })
  } catch (e) {
    console.error('❌ check-user API例外:', e)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
