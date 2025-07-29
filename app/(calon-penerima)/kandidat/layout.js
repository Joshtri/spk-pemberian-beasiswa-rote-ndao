'use client'

import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import '../../globals.css'
import CalonPenerimaLayoutGuard from './CalonPenerimaLayoutGuard'
import HeaderCalonPenerima from './partials/Header'
import SidebarCalonPenerima from './partials/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export default function RootCalonPenerima({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth >= 1024
      setIsLargeScreen(largeScreen)

      if (largeScreen && !isSidebarOpen) {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    setIsMounted(true)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isSidebarOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  if (!isMounted) return null

  return (
    // <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
    <CalonPenerimaLayoutGuard>
      <div className={`min-h-screen bg-gray-50 flex flex-col ${inter.className}`}>
        <SidebarCalonPenerima isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen && isLargeScreen ? 'lg:ml-64' : ''
          }`}
        >
          <HeaderCalonPenerima toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="p-4 sm:p-6">{children}</main>
        </div>
        {/* <Toaster position="top-right" richColors /> */}
      </div>
    </CalonPenerimaLayoutGuard>
    // </ThemeProvider>
  )
}
