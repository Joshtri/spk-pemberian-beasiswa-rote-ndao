'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Edit,
  AlertCircle,
  ClipboardList,
  FileText,
  Loader2,
  Calendar,
  Clock,
  Download,
  File,
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function PenilaianPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [penilaianData, setPenilaianData] = useState([])
  const [kriteriaMap, setKriteriaMap] = useState({})
  const [subKriteriaMap, setSubKriteriaMap] = useState({})
  const [activePeriode, setActivePeriode] = useState(null)
  const [calonPenerima, setCalonPenerima] = useState(null)
  const [error, setError] = useState(null)
  const [canEdit, setCanEdit] = useState(false)
  const [documents, setDocuments] = useState({
    KHS: null,
    KRS: null,
    SPP: null,
    PRESTASI: null,
    ORGANISASI: null,
  })
  const [currentPeriodStatus, setCurrentPeriodStatus] = useState({
    isSamePeriod: false,
    isRegistrationOpen: false,
    deadlinePassed: false,
  })

  useEffect(() => {
    const fetchPenilaianData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/penilaian/detail')
        const result = await response.json()

        if (!result.success) {
          // Handle specific case where no assessment for current period
          if (result.code === 'NO_ASSESSMENT_CURRENT_PERIOD') {
            toast.info(
              'Belum ada data penilaian untuk periode aktif. Redirecting ke halaman tambah penilaian...'
            )
            router.push('/kandidat/formulir-beasiswa/create')
            return
          }
          throw new Error(result.message || 'Failed to fetch penilaian data')
        }

        const { penilaian, kriteria, subKriteria, activePeriode, calonPenerima, documents } =
          result.data

        // Since we now only get data for current active period,
        // we don't need to check if assessment is from different period
        setPenilaianData(penilaian)
        setActivePeriode(activePeriode)
        setCalonPenerima(calonPenerima)

        // Set documents if available
        // Set documents if available
        if (documents) {
          setDocuments({
            KHS: documents.KHS || null,
            KRS: documents.KRS || null,
            SPP: documents.SPP || null,
            PRESTASI: documents.PRESTASI || null,
            ORGANISASI: documents.ORGANISASI || null,
          })
        }

        // Create maps for easier lookup
        const kriteriaObj = {}
        const subKriteriaObj = {}

        kriteria.forEach(k => {
          kriteriaObj[k.id] = k
        })

        subKriteria.forEach(sk => {
          subKriteriaObj[sk.id] = sk
        })

        setKriteriaMap(kriteriaObj)
        setSubKriteriaMap(subKriteriaObj)

        // Check registration status for current period
        const now = new Date()
        let isRegistrationOpen = false
        let deadlinePassed = false

        if (activePeriode?.jadwal_pendaftaran) {
          const { pembukaan, batas_akhir } = activePeriode.jadwal_pendaftaran
          const openingDate = new Date(pembukaan)
          const deadlineDate = new Date(batas_akhir)

          isRegistrationOpen = now >= openingDate && now <= deadlineDate
          deadlinePassed = now > deadlineDate
        }

        setCurrentPeriodStatus({
          isSamePeriod: true, // Always true since we only show current period data
          isRegistrationOpen,
          deadlinePassed,
        })

        // Can edit if registration is still open
        setCanEdit(isRegistrationOpen)
      } catch (error) {
        console.error('Error fetching penilaian data:', error)
        setError(error.message || 'Terjadi kesalahan saat memuat data')
        toast.error(error.message || 'Terjadi kesalahan saat memuat data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPenilaianData()
  }, [router])

  const handleEditClick = () => {
    // Since we only show current period data, always go to edit page
    router.push('/kandidat/formulir-beasiswa/edit')
  }

  const handleDownloadDocument = async documentType => {
    if (!documents[documentType]) {
      toast.error(`Dokumen ${documentType} tidak tersedia`)
      return
    }

    try {
      const response = await fetch(`/api/penilaian/document/${documentType}`)

      if (!response.ok) {
        throw new Error(`Gagal mengunduh dokumen ${documentType}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${documentType.toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error(`Error downloading ${documentType}:`, error)
      toast.error(error.message || `Gagal mengunduh dokumen ${documentType}`)
    }
  }

  const formatDate = dateString => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Memuat data penilaian...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="bg-red-50 border-red-200 max-w-3xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Error</AlertTitle>
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Detail Penilaian</h1>
            <p className="text-muted-foreground">
              Data penilaian kriteria untuk pengajuan beasiswa periode: {activePeriode?.nama || ''}
            </p>
          </div>

          {canEdit ? (
            <Button onClick={handleEditClick} className="bg-primary hover:bg-primary/90">
              <Edit className="mr-2 h-4 w-4" />
              Edit Penilaian
            </Button>
          ) : currentPeriodStatus.deadlinePassed ? (
            <Badge variant="outline" className="border-amber-500 text-amber-700 px-3 py-1">
              <Clock className="mr-2 h-4 w-4" />
              Batas waktu edit telah berakhir
            </Badge>
          ) : (
            <Button
              onClick={handleEditClick}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Penilaian
            </Button>
          )}
        </div>
      </motion.div>

      {activePeriode?.jadwal_pendaftaran && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Alert className="bg-blue-50 border-blue-200">
            <Calendar className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Informasi Jadwal</AlertTitle>
            <AlertDescription className="text-blue-700">
              Batas akhir pendaftaran dan edit penilaian:{' '}
              <span className="font-semibold">
                {formatDate(activePeriode.jadwal_pendaftaran.batas_akhir)}
              </span>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Data Penilaian
            </CardTitle>
            <CardDescription>Berikut adalah data penilaian yang telah Anda isi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {penilaianData.map(penilaian => {
                const kriteria = kriteriaMap[penilaian.kriteriaId]
                const subKriteria = subKriteriaMap[penilaian.sub_kriteriaId]

                if (!kriteria || !subKriteria) return null

                return (
                  <div
                    key={penilaian.id}
                    className="bg-gray-50 p-4 rounded-md border border-gray-200"
                  >
                    <div className="mb-2">
                      <h3 className="font-medium">{kriteria.nama_kriteria}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {/* <Badge
                          variant="outline"
                          className="text-xs bg-primary/5 text-primary border-primary/20"
                        >
                          Bobot: {kriteria.bobot_kriteria}
                        </Badge> */}
                        {/* <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {kriteria.tipe_kriteria}
                        </Badge> */}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium">Nilai yang dipilih:</p>
                      <p className="text-sm mt-1">
                        {subKriteria.nama_sub_kriteria}
                        {/* <span className="text-muted-foreground ml-1">
                          (bobot: {subKriteria.bobot_sub_kriteria})
                        </span> */}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Updated Document Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <File className="mr-2 h-5 w-5 text-primary" />
              Dokumen Penunjang
            </CardTitle>
            <CardDescription>Dokumen yang telah Anda unggah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(documents).map(([type, url]) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="font-medium">{type}</p>
                      {url && (
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {url.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </div>
                  {url ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => window.open(url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Lihat
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-300">
                      Tidak tersedia
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-primary" />
              Informasi Tambahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Tanggal Pengisian</h3>
                <p className="text-sm text-muted-foreground">
                  {penilaianData.length > 0 ? formatDate(penilaianData[0].createdAt) : '-'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Terakhir Diperbarui</h3>
                <p className="text-sm text-muted-foreground">
                  {penilaianData.length > 0 ? formatDate(penilaianData[0].updatedAt) : '-'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Status</h3>
                <Badge className="bg-green-500">Terkirim</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Data penilaian ini akan digunakan untuk perhitungan kelayakan penerima beasiswa.
              {canEdit ? (
                <span className="text-primary font-medium">
                  {' '}
                  Anda masih dapat melakukan perubahan hingga batas waktu yang ditentukan.
                </span>
              ) : (
                <span className="text-amber-600 font-medium">
                  {' '}
                  Batas waktu perubahan telah berakhir.
                </span>
              )}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
