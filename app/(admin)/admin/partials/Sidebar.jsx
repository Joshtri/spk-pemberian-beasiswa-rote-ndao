"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, LayoutDashboard, FileText, Users, Calculator, ClipboardList } from "lucide-react"

export default function SidebarAdmin() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

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
      ],
    },
  ]

  return (
    <motion.div
      className="h-screen bg-[#1e2a3b] text-white w-64 fixed left-0 top-0 z-50 flex flex-col"
      initial={{ width: 256 }}
      animate={{ width: expanded ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold">UTAMA</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-4">
            <div className="px-4 py-2 text-xs text-gray-400 font-medium">{expanded ? section.title : ""}</div>
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
                    {expanded && <span>{item.title}</span>}
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
          {expanded && <span>Keluar</span>}
        </button>
      </div>
    </motion.div>
  )
}

