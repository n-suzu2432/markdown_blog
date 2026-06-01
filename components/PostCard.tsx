import Link from 'next/link'
import { PostMeta, formatDate } from '@/lib/posts'

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors mb-2">
          {post.title}
        </h2>
      </Link>
      <time className="text-sm text-gray-500 mb-3 block">{formatDate(post.date)}</time>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{post.excerpt}</p>
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
    </article>
  )
}
