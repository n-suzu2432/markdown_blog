import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export default function Header() {
  return (
    <header className="border-b border-gray-200 py-4">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
        >
          {SITE_NAME}
        </Link>
        <nav>
          <Link
            href="/posts"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            記事一覧
          </Link>
        </nav>
      </div>
    </header>
  )
}
