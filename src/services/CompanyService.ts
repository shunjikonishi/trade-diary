import { db } from '../db/database'
import type { Company, CreateCompanyInput, UpdateCompanyInput } from '../models/Company'

/**
 * 企業サービスのエラークラス
 */
export class CompanyServiceError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message)
    this.name = 'CompanyServiceError'
  }
}

/**
 * 企業サービス
 */
export class CompanyService {
  /**
   * 企業一覧を取得
   */
  static async list(): Promise<Company[]> {
    try {
      const companies = await db
        .selectFrom('companies')
        .selectAll()
        .orderBy('created_at', 'desc')
        .execute()

      return companies.map((company) => ({
        ...company,
        monitor_status: company.monitor_status as Company['monitor_status'],
      }))
    } catch (error) {
      console.error('Error listing companies:', error)
      throw new CompanyServiceError('企業一覧の取得に失敗しました', 500)
    }
  }

  /**
   * 企業を作成
   */
  static async create(input: CreateCompanyInput): Promise<Company> {
    // バリデーション
    if (!input.name || !input.code || input.monitor_status === undefined) {
      throw new CompanyServiceError('name, code, monitor_status は必須です', 400)
    }

    if (input.name.length > 100) {
      throw new CompanyServiceError('name は100文字以内で入力してください', 400)
    }

    if (input.code.length > 5) {
      throw new CompanyServiceError('code は5文字以内で入力してください', 400)
    }

    try {
      const result = await db
        .insertInto('companies')
        .values({
          name: input.name,
          code: input.code,
          monitor_status: input.monitor_status,
        })
        .returningAll()
        .executeTakeFirst()

      if (!result) {
        throw new CompanyServiceError('企業の作成に失敗しました', 500)
      }

      return {
        ...result,
        monitor_status: result.monitor_status as Company['monitor_status'],
      }
    } catch (error) {
      if (error instanceof CompanyServiceError) {
        throw error
      }
      console.error('Error creating company:', error)
      throw new CompanyServiceError('企業の作成に失敗しました', 500)
    }
  }

  /**
   * 企業を更新
   */
  static async update(id: number, input: UpdateCompanyInput): Promise<Company> {
    // バリデーション
    if (input.name !== undefined && input.name.length > 100) {
      throw new CompanyServiceError('name は100文字以内で入力してください', 400)
    }

    if (input.code !== undefined && input.code.length > 5) {
      throw new CompanyServiceError('code は5文字以内で入力してください', 400)
    }

    try {
      // 更新するフィールドを構築
      const updateData: Partial<{
        name: string
        code: string
        monitor_status: number
        updated_at: Date
      }> = {}

      if (input.name !== undefined) {
        updateData.name = input.name
      }
      if (input.code !== undefined) {
        updateData.code = input.code
      }
      if (input.monitor_status !== undefined) {
        updateData.monitor_status = input.monitor_status
      }

      // 更新するフィールドがない場合はエラー
      if (Object.keys(updateData).length === 0) {
        throw new CompanyServiceError('更新するフィールドがありません', 400)
      }

      updateData.updated_at = new Date()

      const result = await db
        .updateTable('companies')
        .set(updateData)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst()

      if (!result) {
        throw new CompanyServiceError('企業が見つかりません', 404)
      }

      return {
        ...result,
        monitor_status: result.monitor_status as Company['monitor_status'],
      }
    } catch (error) {
      if (error instanceof CompanyServiceError) {
        throw error
      }
      console.error('Error updating company:', error)
      throw new CompanyServiceError('企業の更新に失敗しました', 500)
    }
  }

  /**
   * 企業を削除
   */
  static async delete(id: number): Promise<void> {
    try {
      const result = await db
        .deleteFrom('companies')
        .where('id', '=', id)
        .executeTakeFirst()

      if (!result) {
        throw new CompanyServiceError('企業が見つかりません', 404)
      }
    } catch (error) {
      if (error instanceof CompanyServiceError) {
        throw error
      }
      console.error('Error deleting company:', error)
      throw new CompanyServiceError('企業の削除に失敗しました', 500)
    }
  }
}

