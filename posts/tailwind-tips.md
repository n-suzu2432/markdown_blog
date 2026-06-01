---
title: "Tailwind CSS を使いこなす5つのコツ"
date: "2026-05-15"
tags: ["Tailwind", "React"]
excerpt: "Tailwind CSS を実際に使って気づいた、生産性が上がる書き方のポイントをまとめます。"
---

# Tailwind CSS を使いこなす5つのコツ

Tailwind CSS を実務で使って気づいた、生産性が上がる書き方のポイントをまとめます。

## 1. モバイルファーストで書く

Tailwind のブレークポイントは「以上」で効きます。`md:` は「768px 以上」の意味です。

```html
<!-- モバイル: 1列、デスクトップ: 3列 -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
```

最初からデスクトップ向けに書いてモバイルで打ち消すのは避けましょう。

## 2. `@apply` は最小限に

`@apply` は Tailwind のユーティリティをまとめる機能ですが、使いすぎると Tailwind の恩恵が薄れます。

```css
/* 避けたほうがいい例 */
.btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}
```

コンポーネントで管理できる場合は JSX 側にクラスを書いたほうがメンテしやすいです。

## 3. `prose` で Markdown を整形する

`@tailwindcss/typography` プラグインの `prose` クラスを使うと、Markdown から生成した HTML を自動で整形できます。

```tsx
<div className="prose prose-gray max-w-none">
  <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
</div>
```

見出しや段落の余白、テーブルのスタイルがすべて自動で整います。

## 4. カスタムカラーは `extend` に定義する

プロジェクト固有のカラーは `tailwind.config.ts` の `extend` に追加します。

```ts
theme: {
  extend: {
    colors: {
      brand: '#5B21B6',
    },
  },
},
```

こうすることで `bg-brand` `text-brand` のように使えます。

## 5. VSCode 拡張で補完を効かせる

[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) をインストールすると、クラス名の補完とプレビューが表示されます。長いクラス名を暗記する必要がなくなります。
