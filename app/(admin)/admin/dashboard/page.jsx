'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import StatCard from '@/components/ui/stat-card'
import { motion } from 'framer-motion'
import { Calendar, FileText, User, Users } from 'lucide-react'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalAlternatif: 0,
    totalPeriode: 0,
    totalKriteria: 0,
    alternatifTerdaftar: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          axios.get('/auth/me'),
          axios.get('/admin/stats'),
        ])
        setUser(userRes.data.data)
        setStats(statsRes.data.data)
      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error)
      }
    }

    fetchData()
  }, [])

  const statItems = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Total Alternatif',
      value: stats.totalAlternatif.toString(),
      buttonText: 'Lihat Semua',
      buttonHref: '/admin/alternatif',
      delay: 0,
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: 'Total Periode',
      value: stats.totalPeriode.toString(),
      buttonText: 'Lihat Semua',
      buttonHref: '/admin/periode',
      delay: 0.1,
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: 'Total Kriteria',
      value: stats.totalKriteria.toString(),
      buttonText: 'Lihat Semua',
      buttonHref: '/admin/kriteria',
      delay: 0.2,
    },
    {
      icon: <User className="h-8 w-8 text-primary" />,
      title: 'Alternatif Terdaftar',
      value: stats.alternatifTerdaftar.toString(),
      buttonText: 'Detail',
      buttonHref: '/admin/alternatif',
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
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {user?.email || 'Admin'}!
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
            {user?.role?.toUpperCase() || 'ADMIN'}
          </span>
          <p className="text-muted-foreground">
            Semoga harimu menyenangkan dan produktif ✌️
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  )
}
