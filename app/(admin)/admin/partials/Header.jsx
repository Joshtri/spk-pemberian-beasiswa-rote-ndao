"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, BookOpen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HeaderAdmin({ title }) {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Perhitungan baru telah selesai", time: "5 menit yang lalu" },
    { id: 2, text: "User baru telah mendaftar", time: "1 jam yang lalu" },
  ])

  return (
    <motion.header
      className="h-16 border-b bg-white flex items-center px-4 sticky top-0 z-40 ml-64"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center flex-1">
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 text-amber-500 mr-2" />
          <h1 className="text-lg font-medium">SPK Penentuan Penerima Beasiswa | Pemda Kab. Rote Ndao</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
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
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
              <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">US</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Keluar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}

