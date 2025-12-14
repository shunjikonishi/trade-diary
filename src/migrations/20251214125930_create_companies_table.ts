import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('companies')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(100)', (col) => col.notNull())
    .addColumn('code', 'varchar(5)', (col) => col.notNull())
    .addColumn('monitor_status', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('companies').execute()
}

