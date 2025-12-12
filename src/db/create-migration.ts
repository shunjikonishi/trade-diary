import { promises as fs } from 'fs'
import * as path from 'path'

async function createMigration() {
  const migrationName = process.argv[2]

  if (!migrationName) {
    console.error('使用方法: npm run migrate:create <migration-name>')
    process.exit(1)
  }

  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0]
  const fileName = `${timestamp}_${migrationName}.ts`
  const filePath = path.join(__dirname, '../migrations', fileName)

  const template = `import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // マイグレーション処理をここに記述
  // 例:
  // await db.schema
  //   .createTable('users')
  //   .addColumn('id', 'serial', (col) => col.primaryKey())
  //   .addColumn('name', 'varchar(255)', (col) => col.notNull())
  //   .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // ロールバック処理をここに記述
  // 例:
  // await db.schema.dropTable('users').execute()
}
`

  await fs.writeFile(filePath, template)
  console.log(`マイグレーションファイルを作成しました: ${fileName}`)
}

createMigration()

