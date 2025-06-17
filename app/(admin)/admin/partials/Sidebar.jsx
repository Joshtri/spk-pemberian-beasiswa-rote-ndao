"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Users,
  Calculator,
  ClipboardList,
  Menu,
  X,
  ChevronRight,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SidebarAdmin() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setExpanded(false)
      } else {
        setExpanded(true)
      }
    }

    // Initial check
    checkMobile()

    // Add event listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false)
    }
  }, [pathname, isMobile])

  const menuItems = [
    {
      title: "UTAMA",
      items: [
        {
          title: "Dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: "/admin/dashboard",
        },
      ],
    },
    {
      title: "DATA PRIMARY",
      items: [
        {
          title: "Kriteria",
          icon: <FileText className="h-5 w-5" />,
          path: "/admin/kriteria",
        },
        {
          title: "Sub Kriteria",
          icon: <FileText className="h-5 w-5" />,
          path: "/admin/sub-kriteria",
        },
        {
          title: "Alternatif / Calon Penerima",
          icon: <Users className="h-5 w-5" />,
          path: "/admin/alternatif",
        },
        {
          title: "Periode",
          icon: <ClipboardList className="h-5 w-5" />,
          path: "/admin/periode",
        },
        {
          title: "Jadwal Pendaftaran",
          icon: <ClipboardList className="h-5 w-5" />,
          path: "/admin/jadwal-pendaftaran",
        },
      ],
    },
    {
      title: "PERHITUNGAN",
      items: [
        {
          title: "Perhitungan TOPSIS & SAW",
          icon: <Calculator className="h-5 w-5" />,
          path: "/admin/perhitungan",
        },
        {
          title: "Hasil Perhitungan",
          icon: <Calculator className="h-5 w-5" />,
          path: "/admin/hasil-perhitungan",
        },
      ],
    },
    {
      title: "MANAJEMEN",
      items: [
        {
          title: "Users Management",
          icon: <Users className="h-5 w-5" />,
          path: "/admin/users",
        },
        {
          title: "Penilaian Alternatif",
          icon: <ClipboardList className="h-5 w-5" />,
          path: "/admin/penilaian-alternatif",
        },

        {
          title: "Notifikasi",
          icon: <Bell className="h-5 w-5" />, // Import Bell dari lucide-react (sudah di atas)
          path: "/admin/notifikasi",
        },
      ],
    },
  ]

  // Mobile menu toggle button (shown in header)
  const MobileMenuToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden fixed top-3 left-3 z-50 bg-primary text-white hover:bg-primary/90"
      onClick={() => setMobileOpen(!mobileOpen)}
    >
      {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  )

  // Desktop sidebar toggle button
  const DesktopSidebarToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      className="absolute -right-3 top-20 hidden lg:flex h-6 w-6 bg-white border shadow-md rounded-full p-0"
      onClick={() => setExpanded(!expanded)}
    >
      <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
    </Button>
  )

  return (
    <>
      <MobileMenuToggle />

      <AnimatePresence>
        {(mobileOpen || !isMobile) && (
          <>
            {/* Backdrop for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
            )}

            <motion.div
              className={`h-screen bg-[#1e2a3b] text-white fixed left-0 top-0 z-50 flex flex-col ${
                isMobile ? "w-[280px] shadow-xl" : ""
              }`}
              initial={{
                width: isMobile ? 280 : 256,
                x: isMobile ? -280 : 0,
              }}
              animate={{
                width: isMobile ? 280 : expanded ? 256 : 80,
                x: 0,
              }}
              exit={{
                x: isMobile ? -280 : 0,
                width: isMobile ? 280 : expanded ? 256 : 80,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                {expanded || isMobile ? (
                  <h1 className="text-lg font-semibold">Admin Panel</h1>
                ) : (
                  <span className="text-lg font-semibold">AP</span>
                )}

                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-gray-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {menuItems.map((section, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="px-4 py-2 text-xs text-gray-400 font-medium">
                      {expanded || isMobile ? section.title : ""}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item, itemIdx) => {
                        const isActive = pathname === item.path

                        return (
                          <Link
                            key={itemIdx}
                            href={item.path}
                            className={`flex items-center px-4 py-2 text-sm ${
                              isActive
                                ? "bg-primary/10 text-primary border-l-4 border-primary"
                                : "text-gray-300 hover:bg-gray-700/50"
                            }`}
                          >
                            <span className="mr-3">{item.icon}</span>
                            {(expanded || isMobile) && (
                              <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-700 mt-auto">
                <button className="flex items-center w-full px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                  <LogOut className="h-5 w-5 mr-3" />
                  {(expanded || isMobile) && <span>Keluar</span>}
                </button>
              </div>

              {/* {!isMobile && <DesktopSidebarToggle />} */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

