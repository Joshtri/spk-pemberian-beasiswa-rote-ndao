'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ThreeLoading from '@/components/three-loading'
import UserProfileCard from '@/components/profile/UserProfileCard'

export default function AdminProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          withCredentials: true,
        })
        setUser(res.data.data)
      } catch (err) {
        console.error('Gagal mengambil data profil:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <ThreeLoading text="Memuat profil..." />

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto mt-6 space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Profil Pengguna</h1>
        <p className="text-muted-foreground">Informasi akun dan data pengguna</p>
      </div>

      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Perhatian</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Ini adalah informasi akun Anda. Data tidak bisa diubah di sini.
        </AlertDescription>
      </Alert>

      {/* Komponen reusable */}
      <UserProfileCard user={user} />
    </motion.div>
  )
}
