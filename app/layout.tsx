import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Darker_Grotesque } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const darkerGrotesque = Darker_Grotesque({
  weight: ['800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-darker',
})

export const metadata: Metadata = {
  title: 'MusicAI - AI-Powered Playlist Generator',
  description: 'Create emotion-driven, personalized playlists using artificial intelligence',
  keywords: 'music, AI, playlist, generator, personalized music, emotion-based playlists',
  authors: [{ name: 'Your Name' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${darkerGrotesque.variable}`}>{children}</body>
    </html>
  )
}
