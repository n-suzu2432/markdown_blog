import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeStringify from 'rehype-stringify'

const postsDirectory = path.join(process.cwd(), 'posts')

export type PostMeta = {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
}

export type Post = PostMeta & {
  contentHtml: string
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${year}年${month}月${day}日`
}

function extractExcerpt(content: string): string {
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  return plainText.slice(0, 120)
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))

  const posts = fileNames.flatMap((fileName) => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    if (!fileContents.trim()) {
      console.warn(`Warning: ${fileName} is empty. Skipping.`)
      return []
    }

    const { data, content } = matter(fileContents)

    if (!data.title || !data.date) {
      throw new Error(`${fileName}: frontmatterの必須フィールド (title, date) が不足しています`)
    }

    const excerpt = (data.excerpt as string | undefined) ?? extractExcerpt(content)
    const tags = (data.tags as string[] | undefined) ?? []

    return [
      {
        slug,
        title: data.title as string,
        date: data.date as string,
        tags,
        excerpt,
      },
    ]
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')

  if (!fileContents.trim()) {
    return null
  }

  const { data, content } = matter(fileContents)

  if (!data.title || !data.date) {
    throw new Error(`${slug}.md: frontmatterの必須フィールド (title, date) が不足しています`)
  }

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  const contentHtml = processedContent.toString()
  const excerpt = (data.excerpt as string | undefined) ?? extractExcerpt(content)
  const tags = (data.tags as string[] | undefined) ?? []

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    tags,
    excerpt,
    contentHtml,
  }
}
