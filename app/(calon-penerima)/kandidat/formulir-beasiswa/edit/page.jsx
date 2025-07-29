'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Save,
  AlertCircle,
  ClipboardList,
  CheckCircle,
  ArrowRight,
  Loader2,
  Calendar,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { File, Upload } from 'lucide-react'
import FormField from '@/components/ui/form-field'
import axios from 'axios'
import AutocompleteInput from '@/components/AutocompleteInput'

export default function EditPenilaianPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeKriteria, setActiveKriteria] = useState(null)
  const [kriteriaList, setKriteriaList] = useState([])
  const [formData, setFormData] = useState({})
  const [activePeriode, setActivePeriode] = useState(null)
  const [calonPenerima, setCalonPenerima] = useState(null)
  const [error, setError] = useState(null)
  const [ipkValue, setIpkValue] = useState('')

  const [currentPeriodStatus, setCurrentPeriodStatus] = useState({
    isSamePeriod: false,
    isRegistrationOpen: false,
    deadlinePassed: false,
  })

  const [files, setFiles] = useState({
    KHS: null,
    KRS: null,
    SPP: null,
    PRESTASI: null,
    ORGANISASI: null, // New field for organization document
  })
  // Add these state declarations
  const [filePreviews, setFilePreviews] = useState({
    KHS: null,
    KRS: null,
    SPP: null,
    PRESTASI: null,
    ORGANISASI: null,
  })
  const [fileErrors, setFileErrors] = useState({})
  const [existingDocuments, setExistingDocuments] = useState(null)

  // Fetch all data in a single API call
  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/penilaian/detail')
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch penilaian data')
        }

        const { penilaian, kriteria, subKriteria, activePeriode, calonPenerima, documents } =
          result.data

        // If no assessment data, redirect to create page
        if (!penilaian || penilaian.length === 0) {
          toast.info(
            'Anda belum memiliki data penilaian. Redirecting ke halaman tambah penilaian...'
          )
          router.push('/kandidat/formulir-beasiswa/create')
          return
        }

        if (documents) {
          setExistingDocuments(documents)
          setFilePreviews({
            KHS: documents.KHS || null,
            KRS: documents.KRS || null,
            SPP: documents.SPP || null,
            PRESTASI: documents.PRESTASI || null,
            ORGANISASI: documents.ORGANISASI || null,
          })
        }

        // Check period and registration status
        const now = new Date()
        const assessmentPeriodId = penilaian[0]?.periodeId
        const isSamePeriod = assessmentPeriodId === activePeriode?.id

        let isRegistrationOpen = false
        let deadlinePassed = false

        if (activePeriode?.JadwalPendaftaran) {
          const { pembukaan, batas_akhir } = activePeriode.JadwalPendaftaran
          const openingDate = new Date(pembukaan)
          const deadlineDate = new Date(batas_akhir)

          isRegistrationOpen = now >= openingDate && now <= deadlineDate
          deadlinePassed = now > deadlineDate

          // Redirect if deadline has passed
          if (deadlinePassed) {
            toast.error('Batas waktu edit penilaian telah berakhir')
            router.push('/kandidat/formulir-beasiswa')
            return
          }

          // Redirect if not same period
          if (!isSamePeriod) {
            toast.error('Anda tidak dapat mengedit penilaian dari periode sebelumnya')
            router.push('/kandidat/formulir-beasiswa')
            return
          }
        }

        setCurrentPeriodStatus({
          isSamePeriod,
          isRegistrationOpen,
          deadlinePassed,
        })

        setCalonPenerima(calonPenerima)
        setActivePeriode(activePeriode)
        setKriteriaList(kriteria)

        if (kriteria.length > 0) {
          setActiveKriteria(kriteria[0].id)
        }

        // Initialize formData with existing values
        const initialFormData = {}
        kriteria.forEach(k => {
          initialFormData[k.id] = ''
        })

        // Pre-fill form with existing assessments
        penilaian.forEach(p => {
          initialFormData[p.kriteriaId] = p.sub_kriteriaId
        })

        setFormData(initialFormData)
      } catch (error) {
        console.error('Error fetching form data:', error)
        setError(error.message || 'Terjadi kesalahan saat memuat data')
        toast.error(error.message || 'Terjadi kesalahan saat memuat data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormData()
  }, [router])

  const handleRemoveFile = fileType => {
    setFiles(prev => ({ ...prev, [fileType]: null }))
    setFilePreviews(prev => ({ ...prev, [fileType]: null }))
    setFileErrors(prev => ({ ...prev, [fileType]: null }))

    // Jika ingin langsung menghapus dari existing documents
    setExistingDocuments(prev => ({ ...prev, [fileType]: null }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]

    // Validate file
    if (file && file.type !== 'application/pdf') {
      setFileErrors(prev => ({ ...prev, [fileType]: 'Hanya file PDF yang diperbolehkan' }))
      return
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setFileErrors(prev => ({ ...prev, [fileType]: 'Ukuran file maksimal 5MB' }))
      return
    }

    // Create preview URL
    const previewUrl = file ? URL.createObjectURL(file) : null

    setFilePreviews(prev => ({ ...prev, [fileType]: previewUrl }))
    setFiles(prev => ({ ...prev, [fileType]: file }))
    setFileErrors(prev => ({ ...prev, [fileType]: null }))
  }

  const validateFiles = () => {
    // Optional - only validate if you want to require files on edit
    return true
  }

  const renderIPKInput = kriteria => {
    const currentSubKriteria = kriteria.subKriteria || []

    return (
      <div className="space-y-2">
        <div>
          <label className="text-sm font-medium">Isi IPK Anda (0.00 - 4.00)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            className="mt-1 border px-3 py-2 rounded-md w-full"
            placeholder="Contoh: 3.75"
            onChange={e => {
              const value = parseFloat(e.target.value)

              const matched = currentSubKriteria.find(sub => {
                const label = sub.nama_sub_kriteria
                if (label.includes('<')) return value < 3.0
                if (label.includes('3.00') && label.includes('3.19'))
                  return value >= 3.0 && value <= 3.19
                if (label.includes('3.20') && label.includes('3.39'))
                  return value >= 3.2 && value <= 3.39
                if (label.includes('3.40') && label.includes('3.59'))
                  return value >= 3.4 && value <= 3.59
                if (label.includes('3.60') && label.includes('4.00'))
                  return value >= 3.6 && value <= 4.0
                return false
              })

              if (matched) {
                handleSelectChange(kriteria.id, matched.id)
              } else {
                handleSelectChange(kriteria.id, '')
                toast.warning('Nilai IPK tidak sesuai kategori manapun')
              }
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Atau pilih dari daftar:</label>
          <Select
            value={formData[kriteria.id] || ''}
            onValueChange={value => handleSelectChange(kriteria.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori IPK" />
            </SelectTrigger>
            <SelectContent>
              {currentSubKriteria.map(sub => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.nama_sub_kriteria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData[kriteria.id] && (
          <div className="text-sm text-green-600">
            Kategori:{' '}
            <span className="font-medium">
              {currentSubKriteria.find(s => s.id === formData[kriteria.id])?.nama_sub_kriteria}
            </span>
          </div>
        )}
      </div>
    )
  }

  const handleSelectChange = (kriteriaId, subKriteriaId) => {
    setFormData(prev => ({ ...prev, [kriteriaId]: subKriteriaId }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!activePeriode || !calonPenerima) {
      toast.error('Data periode atau data pengguna tidak tersedia')
      return
    }

    // Validate that all criteria have been filled
    const emptyFields = Object.entries(formData).filter(([_, value]) => !value)
    if (emptyFields.length > 0) {
      toast.warning('Harap isi semua kriteria sebelum menyimpan')
      return
    }

    // Clean up preview URLs
    Object.values(filePreviews).forEach(preview => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    })

    setIsSubmitting(true)

    try {
      // Prepare data for submission
      const penilaianData = Object.entries(formData).map(([kriteriaId, subKriteriaId]) => ({
        kriteriaId,
        sub_kriteriaId: subKriteriaId,
        periodeId: activePeriode.id,
      }))

      // Create FormData for file uploads
      const formDataWithFiles = new FormData()
      formDataWithFiles.append('penilaian', JSON.stringify(penilaianData))

      // Append new files if they exist
      if (files.KHS) formDataWithFiles.append('KHS', files.KHS)
      if (files.KRS) formDataWithFiles.append('KRS', files.KRS)
      if (files.SPP) formDataWithFiles.append('SPP', files.SPP)
      if (files.PRESTASI) formDataWithFiles.append('PRESTASI', files.PRESTASI)
      if (files.ORGANISASI) formDataWithFiles.append('ORGANISASI', files.ORGANISASI)

      // Append existing document URLs
      if (existingDocuments?.KHS) formDataWithFiles.append('KHS_existing', existingDocuments.KHS)
      if (existingDocuments?.KRS) formDataWithFiles.append('KRS_existing', existingDocuments.KRS)
      if (existingDocuments?.SPP) formDataWithFiles.append('SPP_existing', existingDocuments.SPP)
      if (existingDocuments?.PRESTASI)
        formDataWithFiles.append('PRESTASI_existing', existingDocuments.PRESTASI)
      if (existingDocuments?.ORGANISASI)
        formDataWithFiles.append('ORGANISASI_existing', existingDocuments.ORGANISASI)

      const response = await axios.patch('/api/penilaian/edit', formDataWithFiles, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const result = response.data

      if (!result.success) {
        throw new Error(result.message || 'Gagal memperbarui data penilaian')
      }

      toast.success('Data penilaian dan dokumen berhasil diperbarui')
      router.push('/kandidat/formulir-beasiswa')
    } catch (error) {
      console.error('Error updating assessment:', error)
      toast.error(error.message || 'Terjadi kesalahan saat memperbarui data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCompletionPercentage = () => {
    if (Object.keys(formData).length === 0) return 0
    const filledFields = Object.values(formData).filter(value => value !== '').length
    return (filledFields / Object.keys(formData).length) * 100
  }

  const moveToNextKriteria = () => {
    const currentIndex = kriteriaList.findIndex(item => item.id === activeKriteria)
    if (currentIndex < kriteriaList.length - 1) {
      setActiveKriteria(kriteriaList[currentIndex + 1].id)
    }
  }

  const moveToPrevKriteria = () => {
    const currentIndex = kriteriaList.findIndex(item => item.id === activeKriteria)
    if (currentIndex > 0) {
      setActiveKriteria(kriteriaList[currentIndex - 1].id)
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

  if (currentPeriodStatus.deadlinePassed) {
    return (
      <Alert className="bg-amber-50 border-amber-200 max-w-3xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Batas Waktu Edit Telah Berakhir</AlertTitle>
        <AlertDescription className="text-amber-700">
          Anda tidak dapat mengedit data penilaian karena batas waktu pendaftaran telah berakhir.
        </AlertDescription>
      </Alert>
    )
  }

  if (!currentPeriodStatus.isSamePeriod) {
    return (
      <Alert className="bg-amber-50 border-amber-200 max-w-3xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Periode Tidak Sesuai</AlertTitle>
        <AlertDescription className="text-amber-700">
          Anda tidak dapat mengedit penilaian dari periode sebelumnya.
        </AlertDescription>
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
        <h1 className="text-2xl font-bold">Edit Penilaian Kriteria</h1>
        <p className="text-muted-foreground">
          Perbarui data penilaian kriteria untuk pengajuan beasiswa periode:{' '}
          {activePeriode?.nama || ''}
        </p>
      </motion.div>
      {activePeriode?.jadwal_pendaftaran && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Alert className="bg-blue-50 border-blue-200">
            <Calendar className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Informasi Batas Waktu</AlertTitle>
            <AlertDescription className="text-blue-700">
              Anda dapat mengedit data penilaian hingga:{' '}
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
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {/* Sidebar Kriteria */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                Daftar Kriteria
              </CardTitle>
              <CardDescription>{getCompletionPercentage().toFixed(0)}% Selesai</CardDescription>
              <Progress value={getCompletionPercentage()} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-1">
                {kriteriaList.map(kriteria => {
                  const isCompleted =
                    formData[kriteria.id] !== '' && formData[kriteria.id] !== undefined
                  const isActive = activeKriteria === kriteria.id

                  return (
                    <li key={kriteria.id}>
                      <button
                        onClick={() => setActiveKriteria(kriteria.id)}
                        className={`w-full flex items-center justify-between p-3 text-left text-sm transition-colors ${
                          isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'
                        }`}
                      >
                        <span>{kriteria.nama_kriteria}</span>
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Form Kriteria */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {kriteriaList.find(k => k.id === activeKriteria)?.nama_kriteria || 'Kriteria'}
              </CardTitle>
              <CardDescription>Pilih nilai yang sesuai dengan kondisi Anda</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="space-y-4 mb-3">
                  {kriteriaList.map(kriteria => {
                    if (kriteria.id !== activeKriteria) return null

                    const currentSubKriteria = kriteria.subKriteria || []
                    const isIPK =
                      kriteria.nama_kriteria.toLowerCase().includes('ipk') ||
                      kriteria.nama_kriteria.toLowerCase().includes('indeks')
                    const isSPP = kriteria.nama_kriteria.toLowerCase().includes('spp')
                    const isSemester = kriteria.nama_kriteria.toLowerCase().includes('semester')

                    return (
                      <div key={kriteria.id} className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                          <h3 className="font-medium text-sm mb-2">Deskripsi Kriteria</h3>
                          <p className="text-sm text-muted-foreground">
                            {kriteria.keterangan ||
                              `Kriteria ${kriteria.nama_kriteria} dengan bobot ${kriteria.bobot_kriteria}`}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Tipe Kriteria:</span>{' '}
                            {kriteria.tipe_kriteria}
                          </p>
                        </div>

                        {isIPK ? (
                          <div className="space-y-4">
                            <label className="text-sm font-medium">
                              Isi IPK Anda (0.00 - 4.00)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="4"
                              className="mt-1 border px-3 py-2 rounded-md w-full"
                              placeholder="Contoh: 3.75"
                              value={ipkValue}
                              onChange={e => {
                                const value = parseFloat(e.target.value)
                                setIpkValue(e.target.value)

                                const matched = currentSubKriteria.find(sub => {
                                  const label = sub.nama_sub_kriteria
                                  if (label.includes('<')) return value < 3.0
                                  if (label.includes('3.00') && label.includes('3.19'))
                                    return value >= 3.0 && value <= 3.19
                                  if (label.includes('3.20') && label.includes('3.39'))
                                    return value >= 3.2 && value <= 3.39
                                  if (label.includes('3.40') && label.includes('3.59'))
                                    return value >= 3.4 && value <= 3.59
                                  if (label.includes('3.60') && label.includes('4.00'))
                                    return value >= 3.6 && value <= 4.0
                                  return false
                                })

                                if (matched) {
                                  handleSelectChange(kriteria.id, matched.id)
                                } else {
                                  handleSelectChange(kriteria.id, '')
                                  toast.warning('Nilai IPK tidak sesuai kategori manapun')
                                }
                              }}
                            />

                            {formData[kriteria.id] && (
                              <div className="text-sm text-green-600">
                                Kategori:{' '}
                                <span className="font-medium">
                                  {currentSubKriteria.find(s => s.id === formData[kriteria.id])
                                    ?.nama_sub_kriteria || 'Tidak cocok'}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : isSPP || isSemester ? (
                          <AutocompleteInput
                            label={
                              isSPP
                                ? 'Pilih Rentang SPP'
                                : isSemester
                                  ? 'Pilih Semester Anda'
                                  : `Pilih ${kriteria.nama_kriteria}`
                            }
                            options={currentSubKriteria.map(sub => ({
                              id: sub.id,
                              label: sub.nama_sub_kriteria,
                            }))}
                            value={formData[kriteria.id] || ''}
                            onChange={val => handleSelectChange(kriteria.id, val)}
                            placeholder={`Pilih ${kriteria.nama_kriteria}`}
                          />
                        ) : (
                          <div>
                            <label className="text-sm font-medium mb-1 block">
                              Pilih {kriteria.nama_kriteria}
                            </label>
                            <Select
                              value={formData[kriteria.id] || ''}
                              onValueChange={value => handleSelectChange(kriteria.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Pilih ${kriteria.nama_kriteria}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {currentSubKriteria.map(sub => (
                                  <SelectItem key={sub.id} value={sub.id}>
                                    {sub.nama_sub_kriteria}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={moveToPrevKriteria}
                    disabled={kriteriaList.findIndex(k => k.id === activeKriteria) === 0}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={moveToNextKriteria}
                    disabled={
                      kriteriaList.findIndex(k => k.id === activeKriteria) ===
                      kriteriaList.length - 1
                    }
                  >
                    Selanjutnya
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </motion.div>
      {/* Ringkasan Kriteria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-primary" />
              Ringkasan Kriteria
            </CardTitle>
            <CardDescription>Berikut adalah ringkasan kriteria yang telah Anda isi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kriteriaList.map(kriteria => {
                const subKriteriaId = formData[kriteria.id]
                const subKriteriaList = kriteria.subKriteria || []
                const selectedSubKriteria = subKriteriaList.find(sk => sk.id === subKriteriaId)

                return (
                  <div key={kriteria.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm">{kriteria.nama_kriteria}</h3>
                      {subKriteriaId ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                          Belum diisi
                        </span>
                      )}
                    </div>
                    {selectedSubKriteria ? (
                      <p className="text-sm">
                        {selectedSubKriteria.nama_sub_kriteria}
                        {/* - bobot:{' '}
                        {selectedSubKriteria.bobot_sub_kriteria} */}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Belum ada data</p>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* // Add this new section to your JSX (before the Ringkasan Kriteria section) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5 text-primary" />
              Dokumen Penunjang
            </CardTitle>
            <CardDescription>
              Unggah dokumen-dokumen berikut dalam format PDF (maksimal 5MB per file)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KRS */}
              <div>
                <FormField
                  description="  Unggah KRS untuk semester terakhir yang sedang Anda jalani."
                  label="Kartu Rencana Studi (KRS)"
                  name="krs"
                  type="file"
                  required={false}
                  onChange={e => handleFileChange(e, 'KRS')}
                  error={fileErrors.KRS}
                />

                {filePreviews.KRS && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={filePreviews.KRS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      {files?.KRS ? 'Preview file baru' : 'Lihat file saat ini'}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('KRS')}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
                {!filePreviews.KRS && existingDocuments?.KRS && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={existingDocuments.KRS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      Lihat file saat ini
                    </a>
                    <span className="text-muted-foreground text-xs">
                      ({existingDocuments.KRS.split('/').pop()})
                    </span>
                  </div>
                )}

                {/* ORGANISASI */}

                {/* ORGANISASI */}
              </div>

              {/* KHS */}
              <div>
                <FormField
                  label="Kartu Hasil Studi (KHS)"
                  name="khs"
                  type="file"
                  required={false}
                  onChange={e => handleFileChange(e, 'KHS')}
                  error={fileErrors.KHS}
                  description="Unggah KHS untuk semester terakhir yang sedang Anda jalani."
                />
                {filePreviews.KHS && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={filePreviews.KHS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      {files?.KHS ? 'Preview file baru' : 'Lihat file saat ini'}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('KHS')}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
                {!filePreviews.KRS && existingDocuments?.KRS && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={existingDocuments.KRS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      Lihat file saat ini
                    </a>
                    <span className="text-muted-foreground text-xs">
                      ({existingDocuments.KRS.split('/').pop()})
                    </span>
                  </div>
                )}
              </div>

              {/* SPP */}
              <div>
                <FormField
                  label="Bukti Pembayaran SPP"
                  name="spp"
                  type="file"
                  required={false}
                  onChange={e => handleFileChange(e, 'SPP')}
                  error={fileErrors.SPP}
                />
                {filePreviews.SPP && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={filePreviews.SPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      {files?.SPP ? 'Preview file baru' : 'Lihat file saat ini'}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('SPP')}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
                {!filePreviews.SPP && existingDocuments?.SPP && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={existingDocuments.SPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      Lihat file saat ini
                    </a>
                    <span className="text-muted-foreground text-xs">
                      ({existingDocuments.SPP.split('/').pop()})
                    </span>
                  </div>
                )}
              </div>

              {/* PRESTASI */}
              <div>
                <FormField
                  label="Sertifikat Prestasi (Opsional)"
                  name="prestasi"
                  type="file"
                  required={false}
                  onChange={e => handleFileChange(e, 'PRESTASI')}
                  error={fileErrors.PRESTASI}
                />
                {filePreviews.PRESTASI && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={filePreviews.PRESTASI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      {files?.PRESTASI ? 'Preview file baru' : 'Lihat file saat ini'}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('PRESTASI')}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
                {!filePreviews.PRESTASI && existingDocuments?.PRESTASI && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={existingDocuments.PRESTASI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      Lihat file saat ini
                    </a>
                    <span className="text-muted-foreground text-xs">
                      ({existingDocuments.PRESTASI.split('/').pop()})
                    </span>
                  </div>
                )}
              </div>

              <div>
                <FormField
                  label="Bukti Pernah Mengikuti Organisasi (Opsional)"
                  name="organisasi"
                  type="file"
                  required={false}
                  onChange={e => handleFileChange(e, 'ORGANISASI')}
                  error={fileErrors.ORGANISASI}
                />
                {filePreviews.ORGANISASI && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={filePreviews.ORGANISASI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      {files?.ORGANISASI ? 'Preview file baru' : 'Lihat file saat ini'}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('ORGANISASI')}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
                {!filePreviews.ORGANISASI && existingDocuments?.ORGANISASI && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <a
                      href={existingDocuments.ORGANISASI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      Lihat file saat ini
                    </a>
                    <span className="text-muted-foreground text-xs">
                      ({existingDocuments.ORGANISASI.split('/').pop()})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
