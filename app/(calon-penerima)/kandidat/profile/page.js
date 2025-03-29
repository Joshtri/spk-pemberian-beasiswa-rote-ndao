'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FormField from '@/components/ui/form-field'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ThreeLoading from '@/components/three-loading'
import { toast } from 'sonner'

import axios from '@/lib/axios'

export default function CalonPenerimaProfile() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    alamat: '',
    tanggal_lahir: '',
    rt_rw: '',
    kelurahan_desa: '',
    kecamatan: '',
    perguruan_tinggi: '',
    fakultas_prodi: '',
    username: '',
    email: '',
    // Additional fields that might not be in the database yet
    kabupaten: '',
    provinsi: '',
    kode_pos: '',
    no_telepon: '',
    jenjang: '',
    semester: '',
    tahun_masuk: '',
    nim: '',
    ipk: '',
    password: '',
    password_confirmation: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get('/kandidat/profile', {
          withCredentials: true, // kirim cookie auth_token
        })

        setFormData(prev => ({
          ...prev,
          // Map database fields
          nama_lengkap: res.data.nama_lengkap || '',
          alamat: res.data.alamat || '',
          tanggal_lahir: res.data.tanggal_lahir || '',
          rt_rw: res.data.rt_rw || '',
          kelurahan_desa: res.data.kelurahan_desa || '',
          kecamatan: res.data.kecamatan || '',
          perguruan_tinggi: res.data.perguruan_Tinggi || '', // Note the capital T in the API response
          fakultas_prodi: res.data.fakultas_prodi || '',
          username: res.data.username || '',
          email: res.data.email || '',
        }))
      } catch (err) {
        console.error('Gagal fetch profil:', err)
        toast({
        variant: 'destructive',
          title: 'Gagal memuat data',
          description: 'Terjadi kesalahan saat mengambil data profil Anda.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [toast])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Prepare data for update based on your API requirements
      const updateData = {
        nama_lengkap: formData.nama_lengkap,
        alamat: formData.alamat,
        tanggal_lahir: formData.tanggal_lahir,
        rt_rw: formData.rt_rw,
        kelurahan_desa: formData.kelurahan_desa,
        kecamatan: formData.kecamatan,
        perguruan_Tinggi: formData.perguruan_tinggi, // Match the database field name
        fakultas_prodi: formData.fakultas_prodi,
      }

      // If password fields are filled, add them to the update data
      if (formData.password && formData.password === formData.password_confirmation) {
        updateData.password = formData.password
      }

      await axios.put('/api/kandidat/profile', updateData, {
        withCredentials: true,
      })

      toast({
        title: 'Berhasil',
        description: 'Data profil berhasil disimpan',
      })
    } catch (err) {
      console.error('Gagal update profil:', err)
      toast({
        variant: 'destructive',
        title: 'Gagal menyimpan data',
        description: 'Terjadi kesalahan saat menyimpan data profil Anda.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <ThreeLoading text="Memuat data..." />
  }

  return (
    <>
      {isSaving && <ThreeLoading text="Menyimpan data..." />}

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">Profil Saya</h1>
          <p className="text-muted-foreground">Lengkapi data diri Anda untuk pengajuan beasiswa</p>
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
              Pastikan data yang Anda masukkan sesuai dengan dokumen resmi (KTP, Ijazah, dll). Data
              yang tidak sesuai dapat menyebabkan pengajuan beasiswa Anda ditolak.
            </AlertDescription>
          </Alert>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Data Pribadi</span>
                <span className="sm:hidden">Pribadi</span>
              </TabsTrigger>
              <TabsTrigger value="education">
                <span className="hidden sm:inline">Data Pendidikan</span>
                <span className="sm:hidden">Pendidikan</span>
              </TabsTrigger>
              <TabsTrigger value="account">
                <span className="hidden sm:inline">Data Akun</span>
                <span className="sm:hidden">Akun</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Pribadi</CardTitle>
                    <CardDescription>Masukkan data pribadi Anda sesuai dengan KTP</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nama Lengkap"
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />

                      <FormField
                        label="Tanggal Lahir"
                        type="date"
                        name="tanggal_lahir"
                        value={formData.tanggal_lahir}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <FormField
                      label="Alamat"
                      type="textarea"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      placeholder="Masukkan alamat lengkap"
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="RT/RW"
                        name="rt_rw"
                        value={formData.rt_rw}
                        onChange={handleInputChange}
                        placeholder="Contoh: 001/002"
                        required
                      />

                      <FormField
                        label="Kelurahan/Desa"
                        name="kelurahan_desa"
                        value={formData.kelurahan_desa}
                        onChange={handleInputChange}
                        placeholder="Masukkan kelurahan/desa"
                        required
                      />

                      <FormField
                        label="Kecamatan"
                        name="kecamatan"
                        value={formData.kecamatan}
                        onChange={handleInputChange}
                        placeholder="Masukkan kecamatan"
                        required
                      />

                      <FormField
                        label="Kabupaten"
                        name="kabupaten"
                        value={formData.kabupaten}
                        onChange={handleInputChange}
                        placeholder="Masukkan kabupaten"
                      />

                      <FormField
                        label="Provinsi"
                        name="provinsi"
                        value={formData.provinsi}
                        onChange={handleInputChange}
                        placeholder="Masukkan provinsi"
                      />

                      <FormField
                        label="Kode Pos"
                        name="kode_pos"
                        value={formData.kode_pos}
                        onChange={handleInputChange}
                        placeholder="Masukkan kode pos"
                      />
                    </div>

                    <FormField
                      label="Nomor Telepon"
                      name="no_telepon"
                      value={formData.no_telepon}
                      onChange={handleInputChange}
                      placeholder="Masukkan nomor telepon"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setActiveTab('education')}
                    >
                      Selanjutnya
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Pendidikan</CardTitle>
                    <CardDescription>
                      Masukkan data pendidikan Anda sesuai dengan dokumen resmi
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Perguruan Tinggi"
                        name="perguruan_tinggi"
                        value={formData.perguruan_tinggi}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama perguruan tinggi"
                        required
                      />

                      <FormField
                        label="Fakultas/Program Studi"
                        name="fakultas_prodi"
                        value={formData.fakultas_prodi}
                        onChange={handleInputChange}
                        placeholder="Masukkan fakultas/prodi"
                        required
                      />

                      <FormField
                        label="Jenjang"
                        type="select"
                        name="jenjang"
                        value={formData.jenjang}
                        onChange={handleInputChange}
                        options={[
                          { value: 'D3', label: 'D3' },
                          { value: 'D4', label: 'D4' },
                          { value: 'S1', label: 'S1' },
                          { value: 'S2', label: 'S2' },
                          { value: 'S3', label: 'S3' },
                        ]}
                      />

                      <FormField
                        label="Semester"
                        type="select"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        options={[
                          { value: '1', label: '1' },
                          { value: '2', label: '2' },
                          { value: '3', label: '3' },
                          { value: '4', label: '4' },
                          { value: '5', label: '5' },
                          { value: '6', label: '6' },
                          { value: '7', label: '7' },
                          { value: '8', label: '8' },
                        ]}
                      />

                      <FormField
                        label="Tahun Masuk"
                        name="tahun_masuk"
                        value={formData.tahun_masuk}
                        onChange={handleInputChange}
                        placeholder="Contoh: 2021"
                      />

                      <FormField
                        label="NIM"
                        name="nim"
                        value={formData.nim}
                        onChange={handleInputChange}
                        placeholder="Masukkan NIM"
                      />

                      <FormField
                        label="IPK"
                        name="ipk"
                        value={formData.ipk}
                        onChange={handleInputChange}
                        placeholder="Contoh: 3.75"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setActiveTab('personal')}
                      >
                        Sebelumnya
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setActiveTab('account')}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Akun</CardTitle>
                    <CardDescription>Kelola informasi akun Anda</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Masukkan username"
                        disabled
                      />

                      <FormField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Masukkan email"
                        disabled
                      />
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-sm font-medium mb-4">Ubah Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Password Baru"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Masukkan password baru"
                        />

                        <FormField
                          label="Konfirmasi Password"
                          type="password"
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleInputChange}
                          placeholder="Konfirmasi password baru"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setActiveTab('education')}
                    >
                      Sebelumnya
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </motion.div>
      </div>
    </>
  )
}
