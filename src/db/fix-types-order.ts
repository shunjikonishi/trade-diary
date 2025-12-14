import { promises as fs } from 'fs'
import * as path from 'path'
import { Pool } from 'pg'

/**
 * types.tsのカラム順序をデータベースのordinal_positionに基づいて修正するスクリプト
 * データベースから直接カラム順序を取得するため、テーブルごとの定義不要
 */
async function fixTypesOrder() {
  const typesFilePath = path.join(__dirname, 'types.ts')
  const content = await fs.readFile(typesFilePath, 'utf-8')

  // データベース接続
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'trade_diary',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
  })

  try {
    // すべてのテーブルとそのカラム順序を取得
    const result = await pool.query(`
      SELECT
        table_name,
        column_name,
        ordinal_position
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name IN (
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
        )
      ORDER BY table_name, ordinal_position
    `)

    // テーブルごとにカラム順序を整理
    const tableColumnOrder: Record<string, string[]> = {}
    for (const row of result.rows) {
      if (!tableColumnOrder[row.table_name]) {
        tableColumnOrder[row.table_name] = []
      }
      tableColumnOrder[row.table_name].push(row.column_name)
    }

    // 各テーブルのインターフェースを順序修正
    let newContent = content
    for (const [tableName, columnOrder] of Object.entries(tableColumnOrder)) {
      // テーブル名をPascalCaseに変換（例: companies -> Companies）
      const interfaceName = tableName
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')

      // インターフェース定義を抽出
      const interfaceRegex = new RegExp(
        `export interface ${interfaceName} \\{([^}]+)\\}`,
        's'
      )
      const interfaceMatch = newContent.match(interfaceRegex)

      if (!interfaceMatch) {
        console.log(`${interfaceName}インターフェースが見つかりませんでした（スキップ）`)
        continue
      }

      const interfaceBody = interfaceMatch[1]

      // カラム定義を抽出（型名: 型; の形式）
      const columnMatches = interfaceBody.matchAll(/(\w+):\s*([^;]+);/g)
      const columns = Array.from(columnMatches).map((match) => ({
        name: match[1],
        type: match[2].trim(),
      }))

      // データベースのordinal_position順でソート
      const sortedColumns = columnOrder
        .map((colName) => columns.find((col) => col.name === colName))
        .filter((col): col is { name: string; type: string } => col !== undefined)

      // 見つからなかったカラムを追加（念のため）
      const foundColumnNames = new Set(sortedColumns.map((col) => col.name))
      const missingColumns = columns.filter((col) => !foundColumnNames.has(col.name))
      sortedColumns.push(...missingColumns)

      // 新しいインターフェース定義を生成
      const newInterfaceBody = sortedColumns
        .map((col) => `  ${col.name}: ${col.type};`)
        .join('\n')

      newContent = newContent.replace(
        interfaceRegex,
        `export interface ${interfaceName} {\n${newInterfaceBody}\n}`
      )

      console.log(`${interfaceName}インターフェースのカラム順序を修正しました`)
    }

    await fs.writeFile(typesFilePath, newContent, 'utf-8')
    console.log('types.tsのカラム順序を修正しました')
  } finally {
    await pool.end()
  }
}

fixTypesOrder().catch(console.error)
