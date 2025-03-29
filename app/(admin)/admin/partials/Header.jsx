"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, BookOpen, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "@/lib/axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HeaderAdmin({ title }) {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Perhitungan baru telah selesai", time: "5 menit yang lalu" },
    { id: 2, text: "User baru telah mendaftar", time: "1 jam yang lalu" },
  ])

  const [user, setUser] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  const router = useRouter()

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const goToProfile = () => {
    router.push("/admin/profile")
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me", {
          withCredentials: true,
        })
        setUser(res.data.data)
      } catch (err) {
        console.error("Gagal ambil data user:", err)
        // Optional: redirect kalau unauthorized
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true })
      localStorage.removeItem("token") // optional kalau pakai
      window.location.href = "/auth/login"
    } catch (err) {
      console.error("Logout gagal:", err)
    }
  }

  return (
    <motion.header
      className="h-16 border-b bg-white flex items-center px-4 sticky top-0 z-30 w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left space for mobile menu toggle */}
      <div className="w-10 lg:hidden"></div>

      <div className="flex items-center flex-1 justify-between">
        <div className="flex items-center ml-8 lg:ml-0">
          {!isMobile && <BookOpen className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />}
          <h1 className={`font-medium ${isMobile ? "text-sm" : isTablet ? "text-base" : "text-lg"}`}>
            {isMobile
              ? "SPK Beasiswa"
              : isTablet
                ? "SPK Beasiswa Rote Ndao"
                : "SPK Penentuan Penerima Beasiswa | Pemda Kab. Rote Ndao"}
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] sm:w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
                  <span>{notification.text}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </DropdownMenuItem>
              ))}
              {notifications.length === 0 && <DropdownMenuItem disabled>Tidak ada notifikasi</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {user?.username?.slice(0, 2).toUpperCase() || <User className="h-4 w-4" />}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={goToProfile}>Profil</DropdownMenuItem>
              <DropdownMenuItem>Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}

