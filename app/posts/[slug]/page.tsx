import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, formatDate } from '@/lib/posts'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return {}

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/posts/${post.slug}`,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{post.title}</h1>
          <time className="text-sm text-gray-500 block mb-4">{formatDate(post.date)}</time>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  )
}
