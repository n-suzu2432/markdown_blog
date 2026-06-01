---
title: "このブログで使える Markdown 記法まとめ"
date: "2026-05-20"
tags: ["Markdown"]
excerpt: "このブログで対応している Markdown 記法を一覧にまとめました。記事を書くときの参考にしてください。"
---

# このブログで使える Markdown 記法まとめ

このブログで使える Markdown 記法を一覧にまとめました。

## 見出し

```markdown
# H1
## H2
### H3
#### H4
```

## テキスト装飾

| 記法 | 表示 |
|------|------|
| `**太字**` | **太字** |
| `*斜体*` | *斜体* |
| `` `インラインコード` `` | `インラインコード` |

## リスト

箇条書き：

```markdown
- アイテム1
- アイテム2
  - ネスト
```

番号付き：

```markdown
1. 手順1
2. 手順2
3. 手順3
```

## コードブロック

言語を指定するとシンタックスハイライトが有効になります。

```typescript
type Post = {
  slug: string
  title: string
  date: string
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${year}年${month}月${day}日`
}
```

## リンク

```markdown
[リンクテキスト](https://example.com)
```

外部リンクは自動で `target="_blank"` が付き、新しいタブで開きます。

## 引用

```markdown
> 引用文をここに書きます。
> 複数行にまたがっても大丈夫です。
```

> 引用文をここに書きます。
> 複数行にまたがっても大丈夫です。

## 水平線

```markdown
---
```

---

上のように水平線が表示されます。
