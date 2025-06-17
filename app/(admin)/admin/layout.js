import { Inter } from 'next/font/google'
import '../../globals.css'
import AdminLayoutGuard from './AdminLayoutGuard'
import HeaderAdmin from './partials/Header'
import SidebarAdmin from './partials/Sidebar'
const inter = Inter({ subsets: ['latin'] })
import { SidebarProvider } from '@/contexts/SidebarContext' // path sesuaikan
import ContentLayout from '@/components/layouts/ContentLayout' // pastikan path benar
import ContentWrapper from '@/components/ContentWrapper'

export const metadata = {
  title: 'Beasiswa Pemerintah Daerah Kabupaten Rote Ndao',
  description: 'Program beasiswa untuk putra-putri daerah Kabupaten Rote Ndao',
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootAdminLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
        <SidebarProvider>
          <AdminLayoutGuard>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <SidebarAdmin />
              <ContentWrapper>
                <HeaderAdmin />
                <main className="p-4 sm:p-6 flex-1">{children}</main>
              </ContentWrapper>
            </div>
          </AdminLayoutGuard>
        </SidebarProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
