# Trade Diary

デイトレードの実績や反省点を記録するアプリケーション

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + React + TypeScript
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL
- **ORM/クエリビルダー**: Kysely（型安全なSQLクエリビルダー）
- **レンダリング**: クライアントサイドレンダリングのみ（SSR不使用）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. PostgreSQLの起動

```bash
# Docker ComposeでPostgreSQLを起動
docker-compose up -d

# 起動確認
docker-compose ps
```

PostgreSQLは `localhost:5432` で起動します。

デフォルト設定:
- ユーザー名: `postgres`
- パスワード: `postgres`
- データベース名: `trade_diary`
- ポート: `5432`

環境変数を変更する場合は、`.env` ファイルを作成して以下の変数を設定してください:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=trade_diary
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trade_diary
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

### データベースへの接続

```bash
# psqlでデータベースに接続
npm run db
```

### データベースマイグレーション

```bash
# 新しいマイグレーションファイルを作成
npm run migrate:create <migration-name>

# マイグレーションを実行（up）
npm run migrate

# マイグレーションをロールバック（down - 1つ前のマイグレーションに戻す）
npm run migrate:down

# データベースから型定義を生成（テーブル作成後）
npm run db:generate-types
```

マイグレーションファイルは `src/migrations/` ディレクトリに作成されます。

#### 使用例

```typescript
// src/db/database.ts から db をインポート
import { db } from '@/db'

// クエリの例
const trades = await db
  .selectFrom('trades')
  .selectAll()
  .where('profit_loss', '>', 0)
  .execute()

// Raw SQLの例
import { sql } from 'kysely'
const result = await sql`
  SELECT * FROM trades WHERE entry_time > NOW() - INTERVAL '1 day'
`.execute(db)
```

### PostgreSQLの停止

```bash
# コンテナを停止
docker-compose down

# データも削除する場合
docker-compose down -v
```

## プロジェクト構造

```
trade-diary/
├── app/
│   ├── api/          # API Routes（バックエンド）
│   ├── page.tsx      # ホームページ
│   ├── layout.tsx    # ルートレイアウト
│   └── globals.css   # グローバルスタイル
├── src/
│   ├── db/
│   │   ├── database.ts    # データベース接続設定
│   │   ├── types.ts       # 型定義（自動生成）
│   │   ├── migrate.ts     # マイグレーション実行
│   │   └── index.ts       # エクスポート
│   └── migrations/        # マイグレーションファイル
├── docker-compose.yml     # PostgreSQL設定
├── kysely-codegen.config.ts # 型生成設定
├── package.json
├── tsconfig.json
└── next.config.js
```

## スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーを起動
- `npm run lint` - リンターを実行
- `npm run db` - PostgreSQLにpsqlで接続（PostgreSQLが起動している必要があります）
- `npm run migrate:create <name>` - 新しいマイグレーションファイルを作成
- `npm run migrate` - マイグレーションを実行（up）
- `npm run migrate:down` - マイグレーションをロールバック（down - 1つ前のマイグレーションに戻す）
- `npm run db:generate-types` - データベースから型定義を生成
