'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Clock,
  Award,
  Calendar,
  User,
  ArrowRight,
  AlertCircle,
  ClipboardList,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import OnboardingDialog from '@/components/kandidat/OnboardingDialog'
import JadwalTimeline from '@/components/Public/JadwalTimeline' // Import the timeline component

export default function CalonPenerimaDashboard() {
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isOnboarded, setIsOnboarded] = useState(true)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    profileCompletion: 0,
    penilaianCompletion: 0,
    kriteriaStatus: [],
    applicationStatus: 'pending',
    announcements: [],
    activePeriod: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Check onboarding status
        const onboardRes = await axios.get('/api/calon-penerima/check', {
          withCredentials: true,
        })

        const isOnboarded = onboardRes.data.onboarded
        setIsOnboarded(isOnboarded)

        // Only fetch dashboard data if already onboarded
        if (isOnboarded) {
          const dashboardRes = await axios.get('/api/calon-penerima/dashboard')
          const apiData = dashboardRes.data.data

          setDashboardData({
            profileCompletion: apiData.profileCompletion || 0,
            penilaianCompletion: apiData.penilaianCompletion || 0,
            kriteriaStatus: apiData.kriteriaStatus || [],
            applicationStatus: apiData.applicationStatus || 'pending',
            announcements: apiData.announcements || [],
            activePeriod: apiData.activePeriod || null,
          })
        } else {
          // Show onboarding if not completed
          setShowOnboarding(true)
        }
      } catch (err) {
        console.error('Gagal memuat data dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />
      case 'not_started':
        return <Clock className="h-5 w-5 text-gray-400" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'pending':
        return 'text-amber-500'
      case 'not_started':
        return 'text-gray-400'
      case 'in_progress':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = status => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'pending':
        return 'Menunggu'
      case 'not_started':
        return 'Belum Diisi'
      case 'in_progress':
        return 'Sedang Diproses'
      default:
        return 'Tidak Diketahui'
    }
  }

  const getApplicationStatusText = status => {
    switch (status) {
      case 'pending':
        return 'Menunggu Kelengkapan Data'
      case 'submitted':
        return 'Sedang Diverifikasi'
      case 'approved':
        return 'Diterima'
      case 'rejected':
        return 'Ditolak'
      default:
        return 'Belum Terdaftar'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Memuat dashboard...</p>
      </div>
    )
  }

  return (
    <>
      <OnboardingDialog open={showOnboarding} onOpenChange={setShowOnboarding} />

      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">Selamat Datang!</h1>
          <p className="text-muted-foreground">
            Pantau status pengajuan beasiswa dan kelengkapan data kriteria Anda di sini.
          </p>
        </motion.div>

        {/* Alert if profile is incomplete */}
        {!isOnboarded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Alert variant="warning" className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Profil Belum Lengkap</AlertTitle>
              <AlertDescription className="text-amber-700">
                Lengkapi profil dan data diri Anda untuk dapat mengajukan beasiswa.
                <Button
                  variant="link"
                  className="text-amber-800 p-0 h-auto ml-2"
                  onClick={() => setShowOnboarding(true)}
                >
                  Lengkapi Sekarang
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Kelengkapan Profil</span>
                  <span className="font-medium">
                    {isOnboarded ? dashboardData.profileCompletion : 0}%
                  </span>
                </div>
                <Progress
                  value={isOnboarded ? dashboardData.profileCompletion : 0}
                  className="h-2"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push('/kandidat/profile')}
              >
                Lihat Profil
                {/* {isOnboarded ? 'Lihat Profil' : 'Lengkapi Profil'} */}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                Kriteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Kriteria Terisi</span>
                  <span className="font-medium">
                    {
                      dashboardData.kriteriaStatus.filter(item => item.status === 'completed')
                        .length
                    }{' '}
                    / {dashboardData.kriteriaStatus.length}
                  </span>
                </div>
                <Progress
                  value={
                    (dashboardData.kriteriaStatus.filter(item => item.status === 'completed')
                      .length /
                      dashboardData.kriteriaStatus.length) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!isOnboarded}
                asChild
              >
                <Link href="/kandidat/formulir-beasiswa/create">
                  Isi Kriteria
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Timeline and Kriteria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Timeline Pengajuan
                </CardTitle>
                <CardDescription>Pantau proses pengajuan beasiswa Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <JadwalTimeline /> {/* Use the imported timeline component */}
              </CardContent>
            </Card>
          </motion.div>

          {/* Required Kriteria */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                  Kriteria yang Diperlukan
                </CardTitle>
                <CardDescription>
                  Kriteria yang harus dilengkapi untuk pengajuan beasiswa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dashboardData.kriteriaStatus.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        {getStatusIcon(item.status)}
                        <span className="ml-3">{item.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={!isOnboarded} asChild>
                  <Link href="/kandidat/formulir-beasiswa/create">Isi Kriteria</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-primary" />
                Pengumuman Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Status Pengajuan Beasiswa */}
              <div className="mb-4 p-4 rounded-md border border-gray-200 bg-gray-50">
                {dashboardData.applicationStatus === 'pending' && (
                  <div className="text-sm text-yellow-700">
                    <p className="font-semibold mb-1">
                      Status Pengajuan: <span className="text-yellow-800">Menunggu Verifikasi</span>
                    </p>
                    <p>
                      Data penilaian Anda telah dikirim. Silakan tunggu proses verifikasi dari
                      panitia.
                    </p>
                  </div>
                )}

                {dashboardData.applicationStatus === 'diterima' && (
                  <div className="text-sm text-green-700">
                    <p className="font-semibold mb-1">
                      Status Pengajuan: <span className="text-green-800">Diterima</span>
                    </p>
                    <p>
                      Selamat! Anda telah diterima sebagai penerima beasiswa untuk periode{' '}
                      <strong>{dashboardData.activePeriod?.nama_periode}</strong>.
                    </p>
                  </div>
                )}

                {dashboardData.applicationStatus === 'ditolak' && (
                  <div className="text-sm text-red-700">
                    <p className="font-semibold mb-1">
                      Status Pengajuan: <span className="text-red-800">Ditolak</span>
                    </p>
                    <p>
                      Mohon maaf, pengajuan beasiswa Anda belum memenuhi kriteria pada periode ini.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
