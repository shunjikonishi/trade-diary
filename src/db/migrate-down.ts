import { promises as fs } from 'fs'
import * as path from 'path'
import { FileMigrationProvider, Migrator } from 'kysely'
import { db } from './database'

async function migrateDown() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../migrations'),
    }),
  })

  const { error, results } = await migrator.migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`マイグレーション "${it.migrationName}" が正常にロールバックされました`)
    } else if (it.status === 'Error') {
      console.error(`マイグレーション "${it.migrationName}" のロールバックでエラーが発生しました`)
    }
  })

  if (error) {
    console.error('ロールバック中にエラーが発生しました:', error)
    process.exit(1)
  }

  await db.destroy()
}

migrateDown()

