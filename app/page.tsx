import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: SITE_NAME,
}

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{SITE_NAME}</h1>
      <p className="text-gray-600 mb-10">技術記事を発信するブログです。</p>
      <Link
        href="/posts"
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
      >
        記事一覧を見る
      </Link>
    </main>
  )
}
