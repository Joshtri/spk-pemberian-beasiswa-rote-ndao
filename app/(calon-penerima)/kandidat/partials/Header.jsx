'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Bell, LogOut, Award, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
export default function HeaderCalonPenerima({ isMobile, sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname()
  const [user, setUser] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me', {
          withCredentials: true,
        })
        setUser(res.data.data)
      } catch (err) {
        console.error('Gagal ambil data user:', err)
        // Optional: redirect kalau unauthorized
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true })
      localStorage.removeItem('token') // optional kalau pakai
      window.location.href = '/auth/login'
    } catch (err) {
      console.error('Logout gagal:', err)
    }
  }

  // Hardcoded user data
  // const userData = {
  //   name: 'Budi Santoso',
  //   email: 'budi@example.com',
  //   avatar: '', // fallback ke inisial
  // }

  // Hardcoded menu items
  const menuItems = [
    { title: 'Dashboard', path: '/calon-penerima/dashboard' },
    { title: 'Profil Saya', path: '/calon-penerima/profil' },
    { title: 'Dokumen Beasiswa', path: '/calon-penerima/dokumen' },
    { title: 'Status Pengajuan', path: '/calon-penerima/status' },
  ]

  const gotToProfile = () => {
    router.push('/kandidat/profile')
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b sticky top-0 z-40 flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/calon-penerima/dashboard" className="flex items-center">
            <Award className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold">Beasiswa Rote Ndao</span>
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
              <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {user?.username?.slice(0, 2).toUpperCase() || '??'}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/calon-penerima/profil">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/calon-penerima/dokumen">Dokumen</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between p-4 bg-white border-b sticky top-0 z-30">
        <h1 className="text-xl font-semibold">
          {menuItems.find(item => item.path === pathname)?.title || 'Dashboard'}
        </h1>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start py-2">
                  <span className="font-medium">Pengumuman Beasiswa</span>
                  <span className="text-xs text-muted-foreground">
                    Pengumuman penerima beasiswa akan diumumkan pada tanggal 1 April 2025
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">2 jam yang lalu</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-2">
                  <span className="font-medium">Dokumen Diterima</span>
                  <span className="text-xs text-muted-foreground">
                    Dokumen pengajuan beasiswa Anda telah diterima dan sedang diverifikasi
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">1 hari yang lalu</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {user?.username?.slice(0, 2).toUpperCase() || '??'}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={gotToProfile}>Profil</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/calon-penerima/dokumen">Dokumen</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}
