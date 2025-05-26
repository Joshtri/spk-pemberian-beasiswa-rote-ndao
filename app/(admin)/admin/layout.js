import "../../globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider"
import SidebarAdmin from "./partials/Sidebar"
import HeaderAdmin from "./partials/Header"
import AdminLayoutGuard from "./AdminLayoutGuard"
import { Toaster } from "sonner"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Beasiswa Pemerintah Daerah Kabupaten Rote Ndao",
  description: "Program beasiswa untuk putra-putri daerah Kabupaten Rote Ndao",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootAdminLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
          <AdminLayoutGuard>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <SidebarAdmin />
              <div className="flex flex-col min-h-screen lg:ml-[80px] xl:ml-[256px] transition-all duration-300">
                <HeaderAdmin />
                <main className="p-4 sm:p-6 flex-1">
                  <Toaster position="top-right" richColors />
                  {children}
                </main>
              </div>
            </div>
          </AdminLayoutGuard>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

