import type { CodegenConfig } from 'kysely-codegen'

const config: CodegenConfig = {
  dialect: 'postgres',
  connectionString: process.env.DATABASE_URL ||
    `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB || 'trade_diary'}`,
  outFile: './src/db/types.ts',
}

export default config

