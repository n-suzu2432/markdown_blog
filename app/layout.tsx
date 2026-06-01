import type { Metadata } from 'next'
import './globals.css'
import 'highlight.js/styles/github-dark.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: '技術記事を発信するブログです。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
