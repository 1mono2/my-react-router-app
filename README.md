# React Router Blog

React Router v7を使ったモダンなブログアプリケーションです。サーバーサイドレンダリング（SSR）、データローディング、ルーティングなどの機能を実装しています。

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## 機能

- 🚀 サーバーサイドレンダリング（SSR）
- 📝 ブログ記事の作成・編集・削除
- 🏷️ タグによる記事の分類とフィルタリング
- 🔍 記事の検索機能
- 📱 レスポンシブデザイン
- 🌙 ダークモード対応
- ⚡️ Hot Module Replacement (HMR)
- 🔒 TypeScriptによる型安全性
- 🎨 TailwindCSSによるスタイリング

## ページ構成

- `/` - 記事一覧ページ（検索・タグフィルタ対応）
- `/posts/:slug` - 記事詳細ページ
- `/tags/:tag` - タグ別記事一覧
- `/admin` - 管理画面（記事一覧）
- `/admin/posts/new` - 新規記事作成
- `/admin/posts/:slug/edit` - 記事編集

## 認証

管理画面は簡易的なトークン認証を使用しています。デフォルトのトークンは `admin123` です。

本番環境では、環境変数 `ADMIN_TOKEN` を設定してセキュリティを強化してください。

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Renderへのデプロイ

このプロジェクトには `render.yaml` が含まれています。Renderでデプロイするには：

1. [Render](https://render.com) にアカウントを作成
2. 新しいWebサービスを作成
3. GitHubリポジトリを接続
4. 環境変数 `ADMIN_TOKEN` を設定（オプション）
5. デプロイを開始

Renderは自動的に `render.yaml` の設定を読み込みます。

### Docker Deployment

Dockerを使用してデプロイする場合:

```bash
docker build -t react-router-blog .

# Run the container
docker run -p 3000:3000 react-router-blog
```

Dockerコンテナは以下のプラットフォームにデプロイできます：

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### その他のデプロイ方法

Node.jsアプリケーションとして、以下のファイルをデプロイしてください：

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # 静的アセット
│   └── server/    # サーバーサイドコード
```

`npm run build` でビルド後、`npm start` でサーバーを起動します。

## データストレージ

現在はインメモリデータストアを使用しています。本番環境では、以下のようなデータベースへの移行を推奨します：

- PostgreSQL
- MongoDB
- SQLite
- その他のデータベース

データアクセス層は `app/data/posts.server.ts` に集約されているため、データベースへの移行は比較的簡単です。

## スタイリング

[Tailwind CSS](https://tailwindcss.com/) を使用してスタイリングしています。ブログコンテンツには `prose` クラスを使用して読みやすいスタイルを適用しています。

## 参考資料

- [React Router ドキュメント](https://reactrouter.com/)
- [React Router v7 ガイド](https://reactrouter.com/docs)

---

Built with ❤️ using React Router v7.
