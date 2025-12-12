'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState<string>('読み込み中...')

  useEffect(() => {
    // APIエンドポイントを呼び出し
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || 'API接続成功')
      })
      .catch((err) => {
        setMessage('API接続エラー')
        console.error(err)
      })
  }, [])

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Trade Diary</h1>
      <p style={{ marginBottom: '1rem' }}>デイトレードの実績や反省点を記録するアプリケーション</p>
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <p>APIステータス: {message}</p>
      </div>
    </main>
  )
}

