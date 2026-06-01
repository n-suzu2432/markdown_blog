# Markdownブログ（静的サイト生成）要件定義

## プロジェクト概要

WordPress代替の軽量CMSとして静的サイト生成（SSG）で構築するMarkdownブログ。
`/posts` ディレクトリのMarkdownファイルから一覧・詳細ページを生成する。

## 市場背景

Web制作系の依頼119件中、「WordPress代替で軽量CMS欲しい」系の依頼が一定数存在し、
SSGで十分対応できる典型ケース。

---

## 推奨スタック

| ツール | 用途 |
|--------|------|
| Next.js (App Router) | フレームワーク・SSG |
| gray-matter | frontmatterパース |
| remark / remark-html | MarkdownをHTMLに変換 |
| remark-gfm | テーブル等のGFM記法対応 |
| rehype-highlight | シンタックスハイライト |
| rehype-external-links | 外部リンクに `target="_blank"` + `rel="noopener noreferrer"` を自動付与 |
| @tailwindcss/typography | Markdownコンテンツの本文整形（`prose` クラス） |
| Tailwind CSS | スタイリング |
| Vercel | デプロイ |

---

## AI活用ポイント

- **AIに任せる**：mdパーサーの実装、TOC自動生成
- **自分で判断する**：URL設計、SEO用メタタグの内容、tagsの運用ルール

---

## 機能要件

### 1. Markdownファイルの読み込みと一覧表示

- `/posts` ディレクトリ配下の `.md` ファイルをすべて読み込む
- `generateStaticParams`（App Router）でビルド時に取得
- `/posts` に記事カード一覧を表示する
- `/`（トップページ）は将来の自己紹介・別コンテンツのために独立して確保する
  - 初期フェーズはサイト名と `/posts` への導線ボタンのみ表示するシンプルな構成にする
- カードには `title`・`date`・`tags`・`excerpt` を表示する
- 記事は `date` の降順（新しい順）でソートする
- `date` の表示フォーマット：`2026-01-01` → `2026年1月1日` に変換して表示する

### 2. frontmatterのパースとカード表示

frontmatterの必須フィールド：

```yaml
---
title: "記事タイトル"
date: "2026-01-01"
tags: ["Next.js", "React"]
excerpt: "記事のあらすじ（任意）"
---
```

- `gray-matter` でパースする
- `tags` は配列として扱い、バッジ形式でカード上に表示する
- `excerpt` は任意フィールドとする。未記載の場合は本文冒頭120文字を自動抽出してフォールバックする

### 3. シンタックスハイライト

- コードブロック（` ``` `）に言語指定がある場合、ハイライトを適用する
- `rehype-highlight` を使用する
- ダークテーマ推奨（`github-dark` など）

### 4. 詳細ページ

- ルート：`/posts/[slug]`
- `slug` はファイル名（拡張子なし）をそのまま使用する
- H1〜H6の見出し階層が正しくレンダリングされること
- 目次（Table of Contents）は初期フェーズでは実装しない

### 5. URL設計

- slugの命名規則：英数字・ハイフン区切りのみ（例：`nextjs-setup`）
  - 日本語・スペース・大文字は使用しない
  - ファイル名がそのままslugになるため、ファイル作成時に命名規則を守る
- 記事一覧は `/posts` に配置し、`/` はトップページとして別途用意する
- 存在しないslugにアクセスした場合は `notFound()` を返しデフォルト404ページを表示する

### 6. SEOメタタグ

- `<title>` の形式：`{記事タイトル} | {サイト名}`
- `<meta name="description">` の内容：
  - frontmatterの `excerpt` フィールドを使用する
  - `excerpt` がない場合は本文冒頭120文字を自動抽出してフォールバックする
- OGP（Open Graph Protocol）は最低限以下を対応する
  - `og:title`・`og:description`・`og:url`
  - `og:image` は対応しない（初期フェーズのスコープ外）
- 実装はNext.js App Routerの `generateMetadata()` を使用する

### 7. tagsの運用ルール

- タグ名は表記を統一する（例：`Next.js` に統一し `nextjs`・`Nextjs` は使用しない）
- 1記事あたりのタグ上限は5つまで
- タグ一覧ページ（`/tags/[tag]`）は初期フェーズでは作成しない
- 使用可能な初期タグセット（追加する場合はセットに追記してから使用する）
  - `Next.js` / `React` / `Tailwind` / `Markdown` / `SSG` / `TypeScript`

### 8. エラーハンドリング

- frontmatterの必須フィールド（`title`・`date`）が欠けている場合はビルドエラーとして検知する
  - `tags` が欠けている場合は空配列 `[]` をデフォルト値として扱う
- mdファイルが空の場合はビルド時にコンソール警告を出力し、一覧には表示しない
- 存在しないslugにアクセスした場合は `notFound()` を返しデフォルト404ページを表示する

### 9. 画像の扱い

- 記事内画像は `/public/images/[slug]/` 以下に配置する
  - 例：`/public/images/nextjs-setup/cover.png`
- md内の画像は通常の `![alt](path)` 記法で記述する
- 記事本文内の画像は初期フェーズでは `<img>` タグのままとし、`next/image` 対応は後回しにする

### 10. Markdown要素の対応範囲

**対応する：**
- 見出し（H1〜H6）
- 本文・太字・斜体・インラインコード
- コードブロック（シンタックスハイライトあり）
- リスト（番号あり・なし）
- リンク（外部リンクは `target="_blank"` + `rel="noopener noreferrer"`）
- 画像（通常のimgタグ）
- 水平線・引用（blockquote）
- テーブル（`remark-gfm` を追加して対応）

**初期フェーズでは対応しない：**
- 画像キャプション
- 脚注
- 数式（KaTeX等）
- カスタムコンポーネントの埋め込み

---

## 達成基準

| # | 基準 | 検証方法 |
|---|------|----------|
| 1 | `/posts` に `.md` を5本配置して `next build` が通る | `npm run build` がエラーなく完了 |
| 2 | `/posts/[slug]` にアクセスすると見出し階層が正しく表示される | ブラウザでH1〜H3を目視確認 |
| 3 | Lighthouseのパフォーマンスが90以上 | Chrome DevToolsのLighthouse計測 |

---

## ディレクトリ構成（想定）

```
/
├── posts/                        # Markdownファイル置き場
│   ├── hello-world.md
│   ├── nextjs-setup.md
│   ├── tailwind-tips.md
│   ├── markdown-guide.md
│   └── ssg-vs-ssr.md
├── public/
│   └── images/                   # 記事内画像置き場
│       └── [slug]/
├── app/
│   ├── page.tsx                  # トップページ
│   ├── posts/
│   │   ├── page.tsx              # 記事一覧
│   │   └── [slug]/
│   │       └── page.tsx          # 記事詳細
│   └── layout.tsx
├── lib/
│   ├── posts.ts                  # Markdownファイル読み込みユーティリティ
│   └── constants.ts              # サイト基本情報定数
├── components/
│   ├── Header.tsx                # ヘッダー（サイト名 + /postsリンク）
│   ├── Footer.tsx                # フッター（著作権表記のみ）
│   └── PostCard.tsx              # 記事カードコンポーネント
├── CLAUDE.md
├── tailwind.config.ts
└── next.config.ts
```

---

## 定数管理

- サイト名・ベースURLは `lib/constants.ts` に定数として定義し、全体で使い回す

```ts
export const SITE_NAME = "My Blog"
export const SITE_URL = "https://myblog.vercel.app"
```

- titleタグの形式：`{記事タイトル} | {SITE_NAME}`
- トップページのtitle：`{SITE_NAME}`

---

## 実装メモ

### `lib/posts.ts` の責務

- `getAllPosts()`：`/posts` 以下の全 `.md` を読んでfrontmatterとslugの配列を返す
- `getPostBySlug(slug)`：指定slugのfrontmatter + HTML変換済みコンテンツを返す

### パフォーマンス要件補足

- 画像は `next/image` を使用し自動最適化（トップページのカバー画像のみ）
- フォントはシステムフォントを使用する（外部フォントの読み込みなし・レイアウトシフト発生しない）
- 不要なJSをクライアントに送らないようServer Componentsを基本とする

---

## デザイン方針

- ダークモード対応：**しない**（初期フェーズのスコープ外）
- フォント：**システムフォント**を使用する（`next/font` でのカスタムフォント導入は後回し）
- アクセントカラー：**1色のみ**（具体的な色は実装時に決定）
- 上記を固定することでLighthouseスコアを稼ぎやすくし、設計の迷いをなくす

### レスポンシブ対応

- **モバイルファースト**で実装する（Tailwindのデフォルト方針に沿う）
- 主要ブレークポイントは **`md`（768px）のみ**を使用する
  - モバイル（〜767px）とデスクトップ（768px〜）の2段階で設計する

### ヘッダー・フッター構成

**ヘッダー：**
- サイト名（`SITE_NAME`）をロゴ代わりに表示し、`/` へリンク
- ナビゲーションに `/posts`（記事一覧）へのリンクを1つ置く

**フッター：**
- 著作権表記のみ（例：`© 2026 My Blog`）

### 記事一覧のレイアウト

- **リスト形式（1列）**で表示する
- 初期記事数が少ないためグリッドは使用しない
- 記事が増えた場合のグリッド対応は後回しにする

---

## スコープ外の明示

以下は初期フェーズでは対応しない：

- `sitemap.xml` の自動生成（Next.js App Routerの `sitemap.ts` で後から追加可能）
- `robots.txt` の配置
- タグ一覧ページ（`/tags/[tag]`）
- OGP画像（`og:image`）
- ダークモード

---

## 制約・方針

- `src/` ディレクトリは使用しない（`app/` はルート直下に配置）
- Pages RouterではなくApp Routerを使用する
- CSS-in-JSは使用しない（Tailwindのみ）
- データベース・APIルートは使用しない（純粋なSSG）
- Node.js 20 LTS以上を前提とする
- パッケージマネージャーは `npm` に統一する（yarn・pnpmは使用しない）
- `package-lock.json` をGit管理対象に含める

### ビルドコマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # 本番ビルド
```
