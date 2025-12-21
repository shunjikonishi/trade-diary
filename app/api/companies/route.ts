import { NextResponse } from 'next/server'
import { db } from '../../../src/db/database'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, code, monitor_status } = body

    // バリデーション
    if (!name || !code || monitor_status === undefined) {
      return NextResponse.json(
        { error: 'name, code, monitor_status は必須です' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'name は100文字以内で入力してください' },
        { status: 400 }
      )
    }

    if (code.length > 5) {
      return NextResponse.json(
        { error: 'code は5文字以内で入力してください' },
        { status: 400 }
      )
    }

    // データベースに挿入
    const result = await db
      .insertInto('companies')
      .values({
        name,
        code,
        monitor_status: Number(monitor_status),
      })
      .returningAll()
      .executeTakeFirst()

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: '企業の作成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const companies = await db
      .selectFrom('companies')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute()

    return NextResponse.json({ success: true, data: companies })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: '企業一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

