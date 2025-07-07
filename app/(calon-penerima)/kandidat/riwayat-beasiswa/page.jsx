'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Trophy,
  X,
  CheckCircle,
  Clock,
  FileText,
  Award,
  AlertCircle,
  Loader2,
  Eye,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function RiwayatBeasiswaPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [riwayatData, setRiwayatData] = useState([])
  const [selectedPenilaian, setSelectedPenilaian] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRiwayatData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/penilaian/riwayat')
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch riwayat data')
        }

        setRiwayatData(result.data)
      } catch (error) {
        console.error('Error fetching riwayat data:', error)
        setError(error.message || 'Terjadi kesalahan saat memuat data riwayat')
        toast.error(error.message || 'Terjadi kesalahan saat memuat data riwayat')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRiwayatData()
  }, [])

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'diterima':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'ditolak':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
      case 'menunggu':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = status => {
    switch (status?.toLowerCase()) {
      case 'diterima':
        return <CheckCircle className="h-4 w-4" />
      case 'ditolak':
        return <X className="h-4 w-4" />
      case 'pending':
      case 'menunggu':
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
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

  const handleDownloadDocument = async (documentType, periodeId) => {
    try {
      const response = await fetch(`/api/penilaian/document/${documentType}?periode=${periodeId}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Gagal mengunduh dokumen ${documentType}`)
      }

      // Get the file URL from the response
      const fileUrl = result.data.fileUrl
      const fileName = result.data.fileName

      // Create a link and click it to download
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName
      link.target = '_blank' // Open in new tab if download fails
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`Dokumen ${documentType} berhasil diunduh`)
    } catch (error) {
      console.error(`Error downloading ${documentType}:`, error)
      toast.error(error.message || `Gagal mengunduh dokumen ${documentType}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Memuat riwayat beasiswa...</p>
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

  if (riwayatData.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada riwayat beasiswa</h3>
        <p className="text-gray-500 mb-6">Anda belum pernah mendaftar beasiswa sebelumnya.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Riwayat Beasiswa</h1>
            <p className="text-muted-foreground">
              Daftar semua pendaftaran beasiswa yang pernah Anda ajukan
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6">
        {riwayatData.map((riwayat, index) => (
          <motion.div
            key={riwayat.periode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      {riwayat.periode.nama_periode}
                    </CardTitle>
                    <CardDescription>
                      Periode: {formatDate(riwayat.periode.tanggal_mulai)} -{' '}
                      {formatDate(riwayat.periode.tanggal_selesai)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(riwayat.hasil?.status)} flex items-center gap-1`}
                    >
                      {getStatusIcon(riwayat.hasil?.status)}
                      {riwayat.hasil?.status || 'Menunggu'}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPenilaian(riwayat)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Detail Penilaian - {riwayat.periode.nama_periode}
                          </DialogTitle>
                          <DialogDescription>
                            Data lengkap penilaian beasiswa periode {riwayat.periode.nama_periode}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedPenilaian && (
                          <div className="space-y-6">
                            {/* Status Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="font-medium mb-3">Status Pendaftaran</h3>
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className={`${getStatusColor(selectedPenilaian.hasil?.status)} flex items-center gap-1`}
                                >
                                  {getStatusIcon(selectedPenilaian.hasil?.status)}
                                  {selectedPenilaian.hasil?.status || 'Menunggu'}
                                </Badge>
                                {selectedPenilaian.hasil?.ranking && (
                                  <span className="text-sm text-gray-600">
                                    Peringkat: {selectedPenilaian.hasil.ranking}
                                  </span>
                                )}
                              </div>
                              {selectedPenilaian.hasil?.keterangan && (
                                <p className="text-sm text-gray-600 mt-2">
                                  {selectedPenilaian.hasil.keterangan}
                                </p>
                              )}
                            </div>

                            {/* Penilaian Data */}
                            <div>
                              <h3 className="font-medium mb-3">Data Penilaian</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedPenilaian.penilaian.map(penilaian => (
                                  <div
                                    key={penilaian.id}
                                    className="bg-gray-50 p-4 rounded-lg border"
                                  >
                                    <h4 className="font-medium text-sm mb-2">
                                      {penilaian.kriteria.nama_kriteria}
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Sub Kriteria:</span>
                                        <span>{penilaian.subKriteria.nama_sub_kriteria}</span>
                                      </div>
                                      {/* <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Bobot:</span>
                                        <Badge variant="secondary">{penilaian.subKriteria.bobot}</Badge>
                                      </div> */}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Documents */}
                            {selectedPenilaian.dokumen && selectedPenilaian.dokumen.length > 0 && (
                              <div>
                                <h3 className="font-medium mb-3">Dokumen Pendukung</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {selectedPenilaian.dokumen.map((doc, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      className="h-auto p-3 flex flex-col items-center gap-2"
                                      onClick={() =>
                                        handleDownloadDocument(
                                          doc.tipe_dokumen,
                                          selectedPenilaian.periode.id
                                        )
                                      }
                                    >
                                      <FileText className="h-6 w-6" />
                                      <span className="text-xs text-center">
                                        {doc.tipe_dokumen}
                                      </span>
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pendaftaran</p>
                    <p className="font-medium">{formatDate(riwayat.tanggal_daftar)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Kriteria</p>
                    <p className="font-medium">{riwayat.penilaian.length} kriteria</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="font-medium">
                      {riwayat.hasil?.total_score
                        ? `${Number(riwayat.hasil.total_score).toFixed(2)}`
                        : 'Belum dihitung'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
