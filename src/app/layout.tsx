import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free AI Background Remover - 100% Automatic',
  description: 'Remove image backgrounds automatically and for free in seconds. Similar to remove.bg. Best tool for transparent backgrounds.',
  keywords: 'free background remover, remove image background online, transparent background maker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
