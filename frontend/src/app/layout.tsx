import type { Metadata } from 'next'
import './layout.scss'

export const metadata: Metadata = {
  title: 'john.dev',
  icons: {
    icon: '/retro-computer.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
