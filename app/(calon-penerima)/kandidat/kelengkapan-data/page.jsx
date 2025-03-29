'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, AlertCircle } from 'lucide-react'
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
import ThreeLoading from '@/components/three-loading'

export default function PenilaianPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    alternatif: '',
    periode: '',
    jenisDinding: '',
    kondisiDinding: '',
    jenisAtap: '',
    kondisiAtap: '',
    jenisLantai: '',
    kondisiLantai: '',
    kamarMandi: '',
    pendapatanKeluarga: '',
    jumlahTanggungan: '',
  })

  const [alternatifOptions] = useState([
    { value: '1', label: 'Jermias Poy' },
    { value: '2', label: 'Setron Dalia' },
  ])

  const [periodeOptions] = useState([
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
  ])

  const [jenisDindingOptions] = useState([
    { value: '1', label: 'Permanen (Full Tembok) - bobot: 1' },
    { value: '2', label: 'Semi Permanen (Setengah Tembok) - bobot: 2' },
    { value: '3', label: 'Tidak Permanen - bobot: 3' },
  ])

  const [jenisAtapOptions] = useState([
    { value: '1', label: 'Seng - bobot: 1' },
    { value: '2', label: 'Genteng - bobot: 2' },
    { value: '3', label: 'Alang-alang - bobot: 3' },
  ])

  const [kondisiOptions] = useState([
    { value: '1', label: 'Baik - bobot: 1' },
    { value: '2', label: 'Rusak Sedang - bobot: 2' },
    { value: '3', label: 'Rusak - bobot: 3' },
  ])

  const [jenisLantaiOptions] = useState([
    { value: '1', label: 'Keramik - bobot: 1' },
    { value: '2', label: 'Semen - bobot: 2' },
    { value: '3', label: 'Tanah - bobot: 3' },
  ])

  const [kamarMandiOptions] = useState([
    { value: '1', label: 'Ada, Milik Sendiri - bobot: 1' },
    { value: '2', label: 'Ada, Berbagi - bobot: 2' },
    { value: '3', label: 'Tidak Ada - bobot: 3' },
  ])

  const [pendapatanOptions] = useState([
    { value: '1', label: '> Rp 3.000.000 - bobot: 1' },
    { value: '2', label: 'Rp 1.000.000 - Rp 3.000.000 - bobot: 2' },
    { value: '3', label: '< Rp 1.000.000 - bobot: 3' },
  ])

  const [tanggunganOptions] = useState([
    { value: '1', label: '1-2 Orang - bobot: 1' },
    { value: '2', label: '3-4 Orang - bobot: 2' },
    { value: '3', label: '> 4 Orang - bobot: 3' },
  ])

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Show success message or redirect
      alert('Data penilaian berhasil disimpan!')
    }, 1500)
  }

  return (
    <>
      {isLoading && <ThreeLoading text="Menyimpan data penilaian..." />}

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">Penilaian Kriteria</h1>
          <p className="text-muted-foreground">
            Lengkapi data penilaian kriteria untuk pengajuan beasiswa
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Form Input Penilaian</CardTitle>
              <CardDescription>Pilih nilai untuk setiap kriteria penilaian</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Alternatif</label>
                    <Select
                      value={formData.alternatif}
                      onValueChange={value => handleSelectChange('alternatif', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih alternatif" />
                      </SelectTrigger>
                      <SelectContent>
                        {alternatifOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Periode</label>
                    <Select
                      value={formData.periode}
                      onValueChange={value => handleSelectChange('periode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih periode" />
                      </SelectTrigger>
                      <SelectContent>
                        {periodeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Jenis Dinding</label>
                      <Select
                        value={formData.jenisDinding}
                        onValueChange={value => handleSelectChange('jenisDinding', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Sub Kriteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {jenisDindingOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Kondisi Dinding</label>
                      <Select
                        value={formData.kondisiDinding}
                        onValueChange={value => handleSelectChange('kondisiDinding', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Sub Kriteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {kondisiOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Jenis Atap</label>
                      <Select
                        value={formData.jenisAtap}
                        onValueChange={value => handleSelectChange('jenisAtap', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Sub Kriteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {jenisAtapOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Kondisi Atap</label>
                      <Select
                        value={formData.kondisiAtap}
                        onValueChange={value => handleSelectChange('kondisiAtap', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Sub Kriteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {kondisiOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Jenis Lantai</label>
                      <Select
                        value={formData.jenisLantai}
                        onValueChange={value => handleSelectChange('jenisLantai', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Sub Kriteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {jenisLantaiOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Kondisi Lantai</label>
                      <Select
                        value={formData.kondisiLantai}
                        onValueChange={value => handleSelectChange('kondisiLantai', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Sub Kriteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {kondisiOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Kamar Mandi / Toilet</label>
                      <Select
                        value={formData.kamarMandi}
                        onValueChange={value => handleSelectChange('kamarMandi', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Sub Kriteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {kamarMandiOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Pendapatan Keluarga</label>
                      <Select
                        value={formData.pendapatanKeluarga}
                        onValueChange={value => handleSelectChange('pendapatanKeluarga', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Sub Kriteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {pendapatanOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Jumlah Tanggungan</label>
                      <Select
                        value={formData.jumlahTanggungan}
                        onValueChange={value => handleSelectChange('jumlahTanggungan', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Sub Kriteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {tanggunganOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Penilaian
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
