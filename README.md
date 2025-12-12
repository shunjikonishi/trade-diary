# Trade Diary

デイトレードの実績や反省点を記録するアプリケーション

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + React + TypeScript
- **バックエンド**: Next.js API Routes
- **レンダリング**: クライアントサイドレンダリングのみ（SSR不使用）

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

## プロジェクト構造

```
trade-diary/
├── app/
│   ├── api/          # API Routes（バックエンド）
│   ├── page.tsx      # ホームページ
│   ├── layout.tsx    # ルートレイアウト
│   └── globals.css   # グローバルスタイル
├── package.json
├── tsconfig.json
└── next.config.js
```

## スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーを起動
- `npm run lint` - リンターを実行
