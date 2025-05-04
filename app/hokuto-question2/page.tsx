'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Question2() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('user') || ''
  const machineName = searchParams.get('color') || ''
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [totalExpected, setTotalExpected] = useState<number | null>(null)
  const [totalResult, setTotalResult] = useState<number | null>(null)

  const expectedValues: { [g: string]: number } = {
    "0G": -1929, "10G": -1962, "20G": -1995, "30G": -2029, "40G": -2062,
    "50G": -2095, "60G": -2056, "70G": -2017, "80G": -1979, "90G": -1940,
    "100G": -1901, "110G": -1853, "120G": -1805, "130G": -1756, "140G": -1708,
    "150G": -1660, "160G": -1606, "170G": -1553, "180G": -1499, "190G": -1446,
    "200G": -1392, "210G": -1335, "220G": -1279, "230G": -1222, "240G": -1166,
    "250G": -1109, "260G": -1064, "270G": -1020, "280G": -975, "290G": -931,
    "300G": -886, "310G": -833, "320G": -781, "330G": -728, "340G": -676,
    "350G": -623, "360G": -558, "370G": -493, "380G": -427, "390G": -362,
    "400G": -297, "410G": -226, "420G": -156, "430G": -85, "440G": -15,
    "450G": 56, "460G": 138, "470G": 220, "480G": 303, "490G": 385,
    "500G": 467, "510G": 552, "520G": 637, "530G": 723, "540G": 808,
    "550G": 893, "560G": 991, "570G": 1088, "580G": 1186, "590G": 1283,
    "600G": 1381, "610G": 1492, "620G": 1602, "630G": 1713, "640G": 1823,
    "650G": 1934, "660G": 2051, "670G": 2168, "680G": 2286, "690G": 2403,
    "700G": 2520, "710G": 2654, "720G": 2788, "730G": 2922, "740G": 3056,
    "750G": 3190, "760G": 3253, "770G": 3315, "780G": 3378, "790G": 3440,
    "800G": 3503, "810G": 3592, "820G": 3681, "830G": 3769, "840G": 3858,
    "850G": 3947, "860G": 4104, "870G": 4261, "880G": 4418, "890G": 4575,
    "900G": 4732, "910G": 4914, "920G": 5097, "930G": 5279, "940G": 5462,
    "950G": 5644, "960G": 5836, "970G": 6028, "980G": 6221, "990G": 6413,
    "1000G": 6605, "1010G": 6823, "1020G": 7042, "1030G": 7260, "1040G": 7479,
    "1050G": 7697, "1060G": 7945, "1070G": 8192, "1080G": 8440, "1090G": 8687,
    "1100G": 8935, "1110G": 9211, "1120G": 9487, "1130G": 9764, "1140G": 10040,
    "1150G": 10316, "1160G": 10648, "1170G": 10980, "1180G": 11312,
    "1190G": 11644, "1200G": 11976, "1210G": 12327, "1220G": 12678,
    "1230G": 13029, "1240G": 13380, "1250G": 13731, "1260G": 13731
  }
  

  const expected = answer && expectedValues[answer] !== undefined
    ? expectedValues[answer]
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer) {
      alert('開始G数を選んでください')
      return
    }

    const parsedResult = result === null || isNaN(result) ? null : result

    const { error } = await supabase.from('テスト').insert({
      user_id: userId,
      question1type: machineName,
      question2game: answer,
      expected_value: expected,
      result: parsedResult,
    })

    if (error) {
      alert('保存に失敗しました')
      console.error('保存エラー:', JSON.stringify(error, null, 2))
      return
    }

    alert('保存しました！')

    const { data, error: fetchError } = await supabase
      .from('テスト')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('履歴取得エラー:', fetchError)
      return
    }

    setHistory(data || [])

    const totalExp = (data || []).reduce((sum, item) => sum + (item.expected_value ?? 0), 0)
    const totalRes = (data || []).reduce((sum, item) => sum + (item.result ?? 0), 0)

    setTotalExpected(totalExp)
    setTotalResult(totalRes)
  }

  const options = Object.keys(expectedValues)

  return (
    <div className="px-4 py-8 text-white max-w-md mx-auto text-sm">
      <h2 className="text-lg font-semibold mb-4">質問2</h2>

      {/* 説明文（修正済み） */}
      <p className="mb-4 text-white leading-relaxed">
        開始G数を選択すると、想定期待値が表示されます。<br />
        そのまま実践する場合は「送信」ボタンを押してください。（実践記録として記録されます）<br />
        実践終了後、実践結果を記録したい場合は「実践終了」を選択の上、実践結果欄を記載してください。（実践記録として記録されます）
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 text-white bg-black rounded"
        >
          <option value="">-- 開始G数を選択 --</option>
          <option value="実践終了">実践終了</option>
          {options.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <div>
          <label className="block mb-1">実践結果（円）：</label>
          <input
            type="number"
            value={result ?? ''}
            onChange={(e) =>
              setResult(e.target.value === '' ? null : parseInt(e.target.value))
            }
            className="w-full p-2 text-white bg-black rounded"
            placeholder="例：5000"
          />
        </div>

        {expected !== null && (
          <p className="text-sm mt-2">
            期待値：<strong>{expected.toLocaleString()}円</strong>
          </p>
        )}

        <button
          type="submit"
          className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
        >
          送信
        </button>
      </form>

      {history.length > 0 && (
        <div className="mt-10">
          <h3 className="text-base font-bold mb-2">あなたの履歴</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full table-auto border border-white">
              <thead>
                <tr>
                  <th className="border px-2 py-1">日付</th>
                  <th className="border px-2 py-1">機種名</th>
                  <th className="border px-2 py-1">開始G数</th>
                  <th className="border px-2 py-1">期待値</th>
                  <th className="border px-2 py-1">実践結果</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">
                      {new Date(item.created_at).toLocaleString('ja-JP')}
                    </td>
                    <td className="border px-2 py-1">{item.question1type}</td>
                    <td className="border px-2 py-1">{item.question2game}</td>
                    <td className="border px-2 py-1">
                      {item.expected_value != null
                        ? `${item.expected_value.toLocaleString()}円`
                        : '―'}
                    </td>
                    <td className="border px-2 py-1">
                      {item.result != null
                        ? `${item.result.toLocaleString()}円`
                        : '―'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            <strong>累計期待値：</strong>{totalExpected?.toLocaleString()}円<br />
            <strong>累計実践結果：</strong>{totalResult?.toLocaleString()}円
          </p>
        </div>
      )}
    </div>
  )
}
