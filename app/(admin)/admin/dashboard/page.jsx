"use client"

import StatCard from "@/components/ui/stat-card"
import { motion } from "framer-motion"
import { Calendar, FileText, User, Users } from "lucide-react"
const DashboardPage = () => {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Total Alternatif",
      value: "2",
      buttonText: "Lihat Semua",
      buttonHref: "/admin/alternatif",
      delay: 0,
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Total Periode",
      value: "1",
      buttonText: "Lihat Semua",
      buttonHref: "/admin/periode",
      delay: 0.1,
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Total Kriteria",
      value: "9",
      buttonText: "Lihat Semua",
      buttonHref: "/admin/kriteria",
      delay: 0.2,
    },
    {
      icon: <User className="h-8 w-8 text-primary" />,
      title: "Alternatif Terdaftar",
      value: "2",
      buttonText: "Detail",
      buttonHref: "/admin/alternatif",
      delay: 0.3,
    },
  ]

  return (
    <div className="p-6">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Selamat Sore, admin@gmail.com!</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">ADMIN</span>
          <p className="text-muted-foreground">Semoga harimu menyenangkan dan produktif ✌️</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  )
}

 

export default DashboardPage
