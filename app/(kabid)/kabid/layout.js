"use client"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider"
import SidebarKabid from "./partials/Sidebar"
import HeaderKabid from "./partials/Header"
import { Toaster } from "sonner"
import "../../globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootKabidLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth >= 1024
      setIsLargeScreen(largeScreen)

      // Auto-open sidebar on large screens
      if (largeScreen && !isSidebarOpen) {
        setIsSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()
    setIsMounted(true)

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [isSidebarOpen])

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  // Prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <SidebarKabid />

            <div
              className={`flex-1 transition-all duration-300 ease-in-out ${
                isSidebarOpen && isLargeScreen ? "lg:ml-64" : ""
              }`}
            >
              <HeaderKabid />

              <main className="p-4 sm:p-6">{children}</main>
            </div>

            <Toaster position="top-right" richColors />
          </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

