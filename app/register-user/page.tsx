'use client'
import { useState } from 'react'
import { supabase } from '../../utils/supabase/client'

export default function RegisterUserPage() {
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    if (userId.trim() === '') {
      setMessage('IDを入力してください')
      return
    }

    const { data: existing, error: checkError } = await supabase
      .from('テスト')
      .select('user_id')
      .eq('user_id', userId.trim())

    if (checkError) {
      console.error('チェックエラー:', checkError)
      setMessage('チェック中にエラーが発生しました')
      return
    }

    if (existing && existing.length > 0) {
      setMessage('このIDはすでに登録されています')
      return
    }

    const { error: insertError } = await supabase
      .from('テスト')
      .insert([{ user_id: userId.trim() }])

    if (insertError) {
      console.error('登録エラー:', insertError)
      setMessage('登録に失敗しました')
    } else {
      setMessage(`ID「${userId.trim()}」を登録しました`)
      setUserId('')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 text-white text-sm">
      <h1 className="text-xl font-bold mb-4 text-center">ユーザーID登録ページ</h1>

      <p className="mb-6 text-gray-300 text-sm leading-relaxed">
        このページでは、スロット収支管理アプリで利用するIDを事前に登録できます。<br />
        登録されたIDを使って、期待値の記録や実践データの入力が可能になります。
      </p>

      <input
        type="text"
        placeholder="新しいユーザーIDを入力（例：abc123）"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full p-3 text-white bg-gray-800 rounded mb-3 placeholder-gray-400"
      />

      <button
        onClick={handleRegister}
        className="w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 font-semibold"
      >
        登録する
      </button>

      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </div>
  )
}
