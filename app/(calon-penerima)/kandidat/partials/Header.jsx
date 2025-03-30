'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X, Bell, LogOut, Award, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from '@/lib/axios'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default function HeaderCalonPenerima({ toggleSidebar, isSidebarOpen }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/calon-penerima/notification')
        setNotifications(res.data.data || [])
        setUnreadCount(res.data.data?.filter(n => !n.dibaca).length || 0)
      } catch (err) {
        console.error('Gagal ambil notifikasi:', err)
      }
    }

    fetchNotifications()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me', {
          withCredentials: true,
        })
        setUser(res.data.data)
      } catch (err) {
        console.error('Gagal ambil data user:', err)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true })
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    } catch (err) {
      console.error('Logout gagal:', err)
    }
  }

  const goToProfile = () => {
    router.push('/kandidat/profile')
  }

  const handleMarkAsRead = async id => {
    try {
      await axios.patch(`/calon-penerima/notification/${id}/read`)
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, dibaca: true } : n)))
      setUnreadCount(prev => Math.max(prev - 1, 0))
    } catch (error) {
      console.error('Gagal menandai notifikasi sebagai dibaca:', error)
    }
  }

  // Menu items for page title
  const menuItems = [
    { title: 'Dashboard', path: '/kandidat/dashboard' },
    { title: 'Profil Saya', path: '/kandidat/profile' },
    { title: 'Formulir Beasiswa', path: '/kandidat/formulir-beasiswa' },
  ]

  // Get current page title
  const currentPageTitle = menuItems.find(item => item.path === pathname)?.title || 'Dashboard'

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 w-full bg-white border-b shadow-sm"
    >
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left side - Menu toggle and title */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 md:mr-4"
            aria-label={isSidebarOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center">
            {/* Logo on mobile */}
            <Link href="/kandidat/dashboard" className="flex items-center md:hidden">
              <Award className="h-5 w-5 text-primary mr-2" />
              <span className="font-semibold text-sm">Beasiswa</span>
            </Link>

            {/* Page title on larger screens */}
            <h1 className="hidden md:block text-lg font-medium">{currentPageTitle}</h1>
          </div>
        </div>

        {/* Right side - Notifications and User menu */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500"
                    aria-label={`${unreadCount} notifikasi belum dibaca`}
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] sm:w-[350px]">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <DropdownMenuItem
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="flex flex-col items-start py-2 cursor-pointer"
                    >
                      <div className="flex items-start w-full">
                        <div className="flex-1">
                          <span className={`font-medium ${!notif.dibaca ? 'text-primary' : ''}`}>
                            {notif.judul}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notif.isi}
                          </p>
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              locale: id,
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        {!notif.dibaca && (
                          <div className="h-2 w-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Tidak ada notifikasi
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-primary text-sm justify-center">
                    Lihat semua notifikasi
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 h-9 px-2 hover:bg-gray-100 rounded-full"
              >
                <div className="bg-primary/10 h-7 w-7 rounded-full flex items-center justify-center text-primary">
                  <span className="text-xs font-medium">
                    {user?.username?.slice(0, 2).toUpperCase() || <User className="h-4 w-4" />}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px]">
                  {user?.username || 'Pengguna'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.username || 'Pengguna'}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email || ''}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={goToProfile}>
                <User className="h-4 w-4 mr-2" />
                Profil Saya
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
