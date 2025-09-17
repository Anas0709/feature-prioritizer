import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Feature Prioritization Simulator',
  description: 'Interactive tool for data-driven product feature prioritization using RICE and MoSCoW frameworks',
  keywords: ['product management', 'prioritization', 'RICE framework', 'MoSCoW', 'feature planning'],
  authors: [{ name: 'Your Name' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Feature Prioritization Simulator',
    description: 'Make data-driven decisions with RICE and MoSCoW frameworks',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen gradient-bg">
          {children}
        </div>
      </body>
    </html>
  )
}
