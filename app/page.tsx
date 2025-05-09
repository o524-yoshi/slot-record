'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

export default function Home() {
  const [userId, setUserId] = useState('trial2025')
  const router = useRouter()

  const handleSubmit = async () => {
    if (userId.trim() === '') {
      alert('IDを入力してください')
      return
    }

    // DBに登録されているか確認（GET）
    const res = await fetch(`/api/check-user?user=${encodeURIComponent(userId)}`)

    if (!res.ok) {
      console.error('check-user API エラー:', res.status)
      alert('ユーザー確認中にエラーが発生しました')
      return
    }

    const data = await res.json()

    if (!data.exists) {
      alert('このIDは登録されていません')
      return
    }

    router.push(`/type-question1?user=${encodeURIComponent(userId)}`)
  }

  return (
    <>
      <Head>
        <title>スロット期待値チェッカー｜収支・G数を記録しよう</title>
        <meta
          name="description"
          content="スロット好きのあなたへ。期待値と実践結果を記録・分析できるシンプルなツールです。"
        />
        <meta
          name="keywords"
          content="スロット, パチスロ, 期待値, 収支管理, G数, 実践記録, 北斗の拳, モンキーターン, からくりサーカス, 東京グール, X"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="px-4 py-8 text-white max-w-md mx-auto text-center text-sm">
        <h1 className="text-lg font-semibold mb-4">かんたん期待値計算・収支管理ツール</h1>

        <p className="mb-4">任意のIDを入力してください（例：abc123）</p>

        <form className="space-y-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="例：abc123"
            className="w-full p-2 text-white bg-black rounded"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
          >
            次へ
          </button>
        </form>

        <div className="mt-8 text-left bg-gray-800 p-4 rounded text-xs">
          <h2 className="text-white text-sm font-bold mb-2">このサイトについて</h2>
          <p>
            スロット実践時の「開始G数」「期待値」「収支（実践結果）」を記録し、
            後から振り返ったり、累計データを把握するためのツールです。<br />
            スマホからサクッと入力・確認ができるので、ホール内でも手軽に使えます。対応機種は随時追加予定です。
            画面上表示される期待値結果は全て5.6枚交換を前提にしてます。<br />
            自分専用のIDを使用することで自分の収支記録のみ管理することも可能です。
          </p>
        </div>

        <footer className="mt-16 text-xs text-gray-400 text-center">
          <div className="space-x-4">
            <a href="/privacy" className="underline">プライバシーポリシー</a>
            <a href="/terms" className="underline">利用規約</a>
            <a href="/legal" className="underline">特定商取引法に基づく表記</a>
          </div>
        </footer>
      </div>
    </>
  )
}
