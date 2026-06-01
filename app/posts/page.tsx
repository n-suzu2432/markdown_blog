import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `記事一覧 | ${SITE_NAME}`,
}

export default function PostsPage() {
  const posts = getAllPosts()

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">記事一覧</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">まだ記事がありません。</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  )
}
