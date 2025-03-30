"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, User, FileText, Award, LogOut, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import axios from "@/lib/axios"

export default function SidebarCalonPenerima({ isOpen, setIsOpen }) {
  const pathname = usePathname()
  const sidebarRef = useRef(null)

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth < 1024 && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, setIsOpen])

  // Close sidebar on navigation on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }, [pathname, setIsOpen])

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true })
      localStorage.removeItem("token")
      window.location.href = "/auth/login"
    } catch (err) {
      console.error("Logout gagal:", err)
    }
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/kandidat/dashboard",
    },
    {
      title: "Profil Saya",
      icon: <User className="h-5 w-5" />,
      path: "/kandidat/profile",
    },
    {
      title: "Formulir Beasiswa",
      icon: <FileText className="h-5 w-5" />,
      path: "/kandidat/formulir-beasiswa",
    },
  ]

  // Sidebar variants for animation
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r shadow-sm flex flex-col",
          "lg:translate-x-0 lg:w-64",
          "touch-manipulation", // Better touch handling for mobile
        )}
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        {/* Close button - only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Header */}
        <div className="p-4 border-b flex items-center">
          <Award className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
          <span className="font-semibold truncate">Beasiswa Rote Ndao</span>
        </div>

        {/* Profile completion status */}
        {/* <div className="px-4 py-3 border-b">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-muted-foreground">Kelengkapan Profil</span>
            <span className="text-xs font-medium">75%</span>
          </div>
          <Progress value={75} className="h-1.5" />
        </div> */}

        {/* Navigation */}
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
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm group",
                      isActive ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <span className="mr-3 flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.title}</span>
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t mt-auto">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </motion.aside>
    </>
  )
}

