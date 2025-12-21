import { NextResponse } from 'next/server'
import { CompanyService, CompanyServiceError } from '../../../src/services/CompanyService'
import type { CreateCompanyInput } from '../../../src/models/Company'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input: CreateCompanyInput = {
      name: body.name,
      code: body.code,
      monitor_status: body.monitor_status,
    }

    const company = await CompanyService.create(input)
    return NextResponse.json({ success: true, data: company }, { status: 201 })
  } catch (error) {
    if (error instanceof CompanyServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: '企業の作成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const companies = await CompanyService.list()
    return NextResponse.json({ success: true, data: companies })
  } catch (error) {
    if (error instanceof CompanyServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: '企業一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

