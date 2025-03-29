import '../../globals.css'
import React from 'react'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import SidebarCalonPenerima from './partials/Sidebar'
import HeaderCalonPenerima from './partials/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Beasiswa Pemerintah Daerah Kabupaten Rote Ndao',
  description: 'Program beasiswa untuk putra-putri daerah Kabupaten Rote Ndao',
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootCalonPenerima({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gray-50">
            <SidebarCalonPenerima />
            <div className="ml-64">
              <HeaderCalonPenerima />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
