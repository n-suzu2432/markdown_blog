---
title: "SSG と SSR の違いを整理する"
date: "2026-05-25"
tags: ["Next.js", "SSG", "React"]
excerpt: "Next.js で選べるレンダリング方式 SSG と SSR の違い、使い分けの基準をまとめました。"
---

# SSG と SSR の違いを整理する

Next.js では用途に応じてレンダリング方式を選べます。代表的な2つを比較します。

## 定義

**SSG（Static Site Generation）**：ビルド時に HTML を生成して配信する。

**SSR（Server-Side Rendering）**：リクエストのたびにサーバーで HTML を生成して返す。

## 比較表

| 項目 | SSG | SSR |
|------|-----|-----|
| HTML の生成タイミング | ビルド時 | リクエスト時 |
| レスポンス速度 | 速い（CDN キャッシュ可） | やや遅い |
| 常に最新データ | 再ビルドが必要 | 毎回最新 |
| サーバー負荷 | 低い | 高い |
| 向いているコンテンツ | ブログ・ドキュメント | ダッシュボード・EC |

## SSG に向いているケース

- 記事の更新頻度が低い
- 全ユーザーに同じ内容を見せる
- Lighthouse スコアを最大化したい

このブログはまさに SSG の典型例です。

## SSR に向いているケース

- ユーザーごとにパーソナライズされたページ
- リアルタイムな在庫・価格表示
- ログイン状態によって内容が変わるページ

## Next.js での書き方の違い

```tsx
// SSG：デフォルト。export const dynamic = 'force-static' も可
export default async function Page() {
  const data = await fetchData() // ビルド時に実行
  return <div>{data.title}</div>
}

// SSR：dynamic を 'force-dynamic' にする
export const dynamic = 'force-dynamic'

export default async function Page() {
  const data = await fetchData() // リクエストごとに実行
  return <div>{data.title}</div>
}
```

## まとめ

迷ったらまず SSG から始めるのが正解です。ビルドが速く、コストも低い。「リアルタイムでなければ困る」という要件が出てきたときに SSR を検討しましょう。
