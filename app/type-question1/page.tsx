'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Question1() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [answer, setAnswer] = useState('')

  // ✅ クエリパラメータをURLから取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setUserId(params.get('user') || '')
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer) {
      alert('機種名を選んでください')
      return
    }

    let route = '/default-question2'
    if (answer === '北斗の拳') route = '/hokuto-question2'
    else if (answer === 'からくりサーカス') route = '/karakuri-question2'
    else if (answer === '東京グール') route = '/ghoul-question2'
    else if (answer === 'モンキーターンV') route = '/monkey-question2'

    router.push(`${route}?user=${encodeURIComponent(userId)}&color=${encodeURIComponent(answer)}`)
  }

  return (
    <div className="px-4 py-8 text-white max-w-md mx-auto text-sm">
      <h2 className="text-lg font-semibold mb-4">質問1</h2>

      <p className="mb-4 text-white">
        期待値計算したい機種名を選択してください。
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 text-white bg-black rounded"
        >
          <option value="">-- 選択してください --</option>
          <option value="北斗の拳">北斗の拳</option>
          <option value="からくりサーカス">からくりサーカス（準備中）</option>
          <option value="東京グール">東京グール（準備中）</option>
          <option value="モンキーターンV">モンキーターンV（準備中）</option>
        </select>

        <button
          type="submit"
          className="w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
        >
          次へ
        </button>
      </form>
    </div>
  )
}
