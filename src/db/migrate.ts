import { promises as fs } from 'fs'
import * as path from 'path'
import { FileMigrationProvider, Migrator } from 'kysely'
import { db } from './database'

async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`マイグレーション "${it.migrationName}" が正常に実行されました`)
    } else if (it.status === 'Error') {
      console.error(`マイグレーション "${it.migrationName}" でエラーが発生しました`)
    }
  })

  if (error) {
    console.error('マイグレーション中にエラーが発生しました:', error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()

