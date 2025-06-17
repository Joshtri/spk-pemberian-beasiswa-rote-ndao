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
  Upload,
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
import FormField from '@/components/ui/form-field'

export default function CreatePenilaianPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeKriteria, setActiveKriteria] = useState(null)
  const [kriteriaList, setKriteriaList] = useState([])
  const [formData, setFormData] = useState({})
  const [activePeriode, setActivePeriode] = useState(null)
  const [calonPenerima, setCalonPenerima] = useState(null)
  const [error, setError] = useState(null)
  const [files, setFiles] = useState({
    KHS: null,
    KRS: null,
    UKT: null,
    PRESTASI: null,
  })
  const [fileErrors, setFileErrors] = useState({})
  const [ipkValue, setIpkValue] = useState('')

  // Fetch all data in a single API call
  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/penilaian/form-data')
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch form data')
        }

        const { calonPenerima, activePeriode, kriteria, existingPenilaian } = result.data

        // If user already has assessments, redirect to view page
        if (existingPenilaian && existingPenilaian.length > 0) {
          toast.info('Anda sudah memiliki data penilaian. Redirecting ke halaman detail...')
          router.push('/kandidat/formulir-beasiswa')
          return
        }

        setCalonPenerima(calonPenerima)
        setActivePeriode(activePeriode)
        setKriteriaList(kriteria)

        if (kriteria.length > 0) {
          setActiveKriteria(kriteria[0].id)
        }

        // Initialize formData with empty values for each criteria
        const initialFormData = {}
        kriteria.forEach(k => {
          initialFormData[k.id] = ''
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

  const handleSelectChange = (kriteriaId, subKriteriaId) => {
    setFormData(prev => ({ ...prev, [kriteriaId]: subKriteriaId }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]

    // Validate file type
    if (file && file.type !== 'application/pdf') {
      setFileErrors(prev => ({ ...prev, [fileType]: 'Hanya file PDF yang diperbolehkan' }))
      return
    }

    // Validate file size (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setFileErrors(prev => ({ ...prev, [fileType]: 'Ukuran file maksimal 5MB' }))
      return
    }

    // Clear error if valid
    setFileErrors(prev => ({ ...prev, [fileType]: null }))
    setFiles(prev => ({ ...prev, [fileType]: file }))
  }

  const validateFiles = () => {
    const newErrors = {}
    let isValid = true

    // Check required files
    if (!files.KHS) {
      newErrors.KHS = 'File KHS wajib diunggah'
      isValid = false
    }

    if (!files.KRS) {
      newErrors.KRS = 'File KRS wajib diunggah'
      isValid = false
    }

    if (!files.UKT) {
      newErrors.UKT = 'File bukti pembayaran UKT wajib diunggah'
      isValid = false
    }

    // PRESTASI is optional, no validation needed

    setFileErrors(newErrors)
    return isValid
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

    // Validate files
    if (!validateFiles()) {
      toast.warning('Harap unggah semua dokumen yang diperlukan')
      return
    }

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

      // Append files
      if (files.KHS) formDataWithFiles.append('KHS', files.KHS)
      if (files.KRS) formDataWithFiles.append('KRS', files.KRS)
      if (files.UKT) formDataWithFiles.append('UKT', files.UKT)
      if (files.PRESTASI) formDataWithFiles.append('PRESTASI', files.PRESTASI)

      // Submit data
      const response = await fetch('/api/penilaian', {
        method: 'POST',
        body: formDataWithFiles,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Gagal menyimpan data penilaian')
      }

      toast.success('Data penilaian dan dokumen berhasil disimpan')
      router.push('/kandidat/formulir-beasiswa')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      toast.error(error.message || 'Terjadi kesalahan saat menyimpan data')
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

  if (!activePeriode) {
    return (
      <Alert className="bg-amber-50 border-amber-200 max-w-3xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Tidak ada periode aktif</AlertTitle>
        <AlertDescription className="text-amber-700">
          Saat ini tidak ada periode penilaian yang aktif. Silakan hubungi administrator untuk
          informasi lebih lanjut.
        </AlertDescription>
      </Alert>
    )
  }

  if (!calonPenerima) {
    return (
      <Alert className="bg-amber-50 border-amber-200 max-w-3xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Data tidak lengkap</AlertTitle>
        <AlertDescription className="text-amber-700">
          Data calon penerima beasiswa tidak ditemukan. Silakan lengkapi profil Anda terlebih
          dahulu.
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
        <h1 className="text-2xl font-bold">Pengisian Kriteria</h1>
        <p className="text-muted-foreground">
          Lengkapi data penilaian kriteria untuk pengajuan beasiswa periode:{' '}
          {activePeriode?.nama || ''}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Informasi Penting</AlertTitle>
          <AlertDescription className="text-blue-700">
            Pastikan data yang Anda masukkan sesuai dengan kondisi sebenarnya. Data ini akan
            digunakan untuk penilaian kelayakan penerima beasiswa.
          </AlertDescription>
        </Alert>
      </motion.div>

      <form onSubmit={handleSubmit}>
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
                          type="button"
                          onClick={() => setActiveKriteria(kriteria.id)}
                          className={`w-full flex items-center justify-between p-3 text-left text-sm transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-gray-100'
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
              <CardContent>
                <div className="space-y-4">
                  {kriteriaList.map(kriteria => {
                    if (kriteria.id !== activeKriteria) return null

                    const currentSubKriteria = kriteria.subKriteria || []

                    return (
                      <div key={kriteria.id} className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                          <h3 className="font-medium text-sm mb-2">Deskripsi Kriteria</h3>
                          <p className="text-sm text-muted-foreground">
                            {kriteria.keterangan || `Kriteria ${kriteria.nama_kriteria}`}
                            {/*  // `Kriteria ${kriteria.nama_kriteria} dengan bobot ${kriteria.bobot_kriteria}`}
                             */}
                          </p>
                          {/* <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Tipe Kriteria:</span>{' '}
                            {kriteria.tipe_kriteria}
                          </p> */}
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Pilih {kriteria.nama_kriteria}
                          </label>

                          <Select
                            value={formData[kriteria.id] || ''}
                            onValueChange={value => handleSelectChange(kriteria.id, value)}
                            disabled={
                              kriteria.nama_kriteria.toLowerCase().includes('ipk') ||
                              kriteria.nama_kriteria.toLowerCase().includes('indeks')
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Pilih ${kriteria.nama_kriteria}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {currentSubKriteria.map(subKriteria => (
                                <SelectItem
                                  key={subKriteria.id}
                                  value={subKriteria.id}
                                  disabled={
                                    kriteria.nama_kriteria.toLowerCase().includes('ipk') ||
                                    kriteria.nama_kriteria.toLowerCase().includes('indeks')
                                  }
                                >
                                  {subKriteria.nama_sub_kriteria} - bobot:{' '}
                                  {subKriteria.bobot_sub_kriteria}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Input manual untuk Semester */}
                          {kriteria.nama_kriteria.toLowerCase().includes('semester') && (
                            <div className="mt-2">
                              <label className="text-sm">Isi Semester Anda</label>
                              <input
                                type="number"
                                min="1"
                                max="8"
                                className="mt-1 border px-3 py-2 rounded-md w-full"
                                placeholder="Contoh: 3"
                                onChange={e => {
                                  const value = parseInt(e.target.value)
                                  if (isNaN(value) || value < 1 || value > 8) {
                                    toast.warning('Semester hanya valid antara 1 - 8')
                                    handleSelectChange(kriteria.id, '')
                                    return
                                  }

                                  const matched = currentSubKriteria.find(sub =>
                                    sub.nama_sub_kriteria.includes(`${value}`)
                                  )

                                  if (matched) {
                                    handleSelectChange(kriteria.id, matched.id)
                                  } else {
                                    toast.warning('Semester tidak sesuai rentang subkriteria')
                                    handleSelectChange(kriteria.id, '')
                                  }
                                }}
                              />
                            </div>
                          )}

                          {/* Input manual untuk UKT */}
                          {kriteria.nama_kriteria.toLowerCase().includes('ukt') && (
                            <div className="mt-2">
                              <label className="text-sm">Isi Jumlah UKT Anda (Rp)</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                className="mt-1 border px-3 py-2 rounded-md w-full"
                                placeholder="Contoh: 1.500.000"
                                onChange={e => {
                                  // Hapus titik & karakter non-digit
                                  const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '')
                                  const value = parseInt(raw)

                                  // Format kembali ke nominal dengan titik
                                  const formatted = new Intl.NumberFormat('id-ID').format(
                                    value || 0
                                  )
                                  e.target.value = formatted // tampilkan angka format

                                  if (isNaN(value)) {
                                    handleSelectChange(kriteria.id, '')
                                    return
                                  }

                                  const matched = currentSubKriteria.find(sub => {
                                    const nama = sub.nama_sub_kriteria
                                      .replace(/\./g, '')
                                      .replace(/RP|Rp/gi, '')
                                      .replace(/\s/g, '')
                                    if (nama.includes('≤999000')) return value <= 999000
                                    if (nama.includes('≥4000000')) return value >= 4000000

                                    const matchRange = nama.match(/(\d+)-(\d+)/)
                                    if (matchRange) {
                                      const [_, min, max] = matchRange
                                      return value >= parseInt(min) && value <= parseInt(max)
                                    }

                                    return false
                                  })

                                  if (matched) {
                                    handleSelectChange(kriteria.id, matched.id)
                                  } else {
                                    toast.warning('Nilai UKT tidak sesuai rentang yang tersedia.')
                                    handleSelectChange(kriteria.id, '')
                                  }
                                }}
                              />
                            </div>
                          )}

                          {/* Input Manual IPK */}
                          {(kriteria.nama_kriteria.toLowerCase().includes('ipk') ||
                            kriteria.nama_kriteria.toLowerCase().includes('indeks')) && (
                            <div className="mt-2">
                              <label className="text-sm">Isi IPK Anda</label>
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

                                  if (isNaN(value)) return

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
                                    // Nilai tidak valid untuk range yang tersedia
                                    toast.warning(
                                      'Nilai IPK tidak sesuai dengan rentang yang tersedia.'
                                    )
                                    handleSelectChange(kriteria.id, '') // reset pilihan
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
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
              </CardFooter>
            </Card>
          </div>
        </motion.div>

        {/* Document Upload Section */}
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
                Unggah Dokumen Penunjang
              </CardTitle>
              <CardDescription>
                Unggah dokumen-dokumen berikut dalam format PDF (maksimal 5MB per file)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Kartu Hasil Studi (KHS)"
                  name="khs"
                  type="file"
                  required={true}
                  onChange={e => handleFileChange(e, 'KHS')}
                  error={fileErrors.KHS}
                />

                <FormField
                  label="Kartu Rencana Studi (KRS)"
                  name="krs"
                  type="file"
                  required={true}
                  onChange={e => handleFileChange(e, 'KRS')}
                  error={fileErrors.KRS}
                />

                <FormField
                  label="Bukti Pembayaran UKT"
                  name="ukt"
                  type="file"
                  required={true}
                  onChange={e => handleFileChange(e, 'UKT')}
                  error={fileErrors.UKT}
                />

                <FormField
                  label="Sertifikat Prestasi (Opsional)"
                  name="prestasi"
                  type="file"
                  required={false}
                  onChange={e => handleFileChange(e, 'PRESTASI')}
                  error={fileErrors.PRESTASI}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ringkasan Kriteria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                Ringkasan Kriteria
              </CardTitle>
              <CardDescription>
                Berikut adalah ringkasan kriteria yang telah Anda isi
              </CardDescription>
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
                          {selectedSubKriteria.nama_sub_kriteria} - bobot:{' '}
                          {selectedSubKriteria.bobot_sub_kriteria}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Belum ada data</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
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
                    Simpan Semua Data
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </form>
    </div>
  )
}
