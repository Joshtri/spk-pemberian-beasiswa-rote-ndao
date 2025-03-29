'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, User, FileText, Award, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function SidebarCalonPenerima({ sidebarOpen }) {
  const pathname = usePathname()

  // Hardcoded user data
  const userData = {
    name: 'Budi Santoso',
    email: 'budi@example.com',
    avatar: 'dfdf', // Kosong untuk fallback avatar (inisial nama akan ditampilkan)
    completionStatus: 75,
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/kandidat/dashboard',
    },
 
    {
      title: 'Pengisian Formulir Beasiswa',
      icon: <FileText className="h-5 w-5" />,
      path: '/kandidat/formulir-beasiswa',
    },
 
  ]

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Link href="/kandidat/dashboard" className="flex items-center">
            <Award className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold">Beasiswa Rote Ndao</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path

              return (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.path}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm
                      ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t mt-auto">
          <Button variant="destructive" className="w-full" asChild>
            <Link href="/login">
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
