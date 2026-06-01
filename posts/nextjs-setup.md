---
title: "Next.js App Router セットアップガイド"
date: "2026-05-10"
tags: ["Next.js", "TypeScript", "SSG"]
excerpt: "Next.js 15 の App Router を使ってプロジェクトをゼロから立ち上げる手順をまとめました。"
---

# Next.js App Router セットアップガイド

Next.js 15 の App Router を使ってプロジェクトをセットアップする手順を解説します。

## プロジェクト作成

```bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
```

オプションの意味：

| オプション | 説明 |
|-----------|------|
| `--typescript` | TypeScript を有効化 |
| `--tailwind` | Tailwind CSS を設定 |
| `--app` | App Router を使用（デフォルト） |

## ディレクトリ構成

App Router では `app/` ディレクトリがルーティングの基点になります。

```
app/
├── layout.tsx     # 全ページ共通のレイアウト
├── page.tsx       # / のページ
└── posts/
    ├── page.tsx           # /posts
    └── [slug]/
        └── page.tsx       # /posts/:slug
```

## Server Components を活かす

App Router のデフォルトはすべて **Server Components** です。データ取得をコンポーネント内に直接書けます。

```tsx
// app/posts/page.tsx
import { getAllPosts } from '@/lib/posts'

export default function PostsPage() {
  const posts = getAllPosts() // サーバー側で実行される
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>{post.title}</li>
      ))}
    </ul>
  )
}
```

クライアントに余分な JavaScript を送らないため、Lighthouse スコアが上がりやすくなります。

## 静的ビルドの確認

```bash
npm run build
```

ビルドログに `.` が表示されているページは静的生成（SSG）されています。
