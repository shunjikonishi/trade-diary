import { NextResponse } from 'next/server'
import { db } from '@/db'
import { sql } from 'kysely'

/**
 * Kyselyの使用例API
 * このファイルは参考用です。実際のAPIを作成する際の参考にしてください。
 */
export async function GET() {
  try {
    // クエリビルダーの例（テーブルが存在する場合）
    // const result = await db
    //   .selectFrom('trades')
    //   .selectAll()
    //   .limit(10)
    //   .execute()

    // Raw SQLの例
    const result = await sql`
      SELECT version()
    `.execute(db)

    return NextResponse.json({
      message: 'Kysely接続成功',
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'データベースエラーが発生しました' },
      { status: 500 }
    )
  }
}

