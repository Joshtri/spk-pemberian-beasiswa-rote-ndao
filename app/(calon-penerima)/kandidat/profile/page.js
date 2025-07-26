'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import FormField from '@/components/ui/form-field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { AlertCircle, Check, ChevronsUpDown, Save, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'
import { Popover, PopoverTrigger } from '@radix-ui/react-popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { kecamatanWithDesaKelurahan } from '@/constants/kecamatanWithKelurahan'

export default function CalonPenerimaProfile() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [userId, setUserId] = useState(null)
  const [isRekeningMasked, setIsRekeningMasked] = useState(true)

  const maskRekening = (value = '') => {
    if (!value) return ''
    const visible = value.slice(-4)
    const masked = '•'.repeat(value.length - 4)
    return masked + visible
  }

  const [openKecamatan, setOpenKecamatan] = useState(false)
  const [openKelurahan, setOpenKelurahan] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nama_lengkap: '',
      alamat: '',
      tanggal_lahir: '',
      rt_rw: '',
      kelurahan_desa: '',
      kecamatan: '',
      perguruan_tinggi: '',
      fakultas_prodi: '',
      noRekening: '',
      username: '',
      email: '',
      password: '',
      buktiRekening: '',
      password_confirmation: '',
    },
  })
  const [kelurahanOptions, setKelurahanOptions] = useState([])

  const kecamatanList = Object.keys(kecamatanWithDesaKelurahan)
  const selectedKecamatan = watch('kecamatan')
  const selectedKelurahan = watch('kelurahan_desa')
  const [showBuktiModal, setShowBuktiModal] = useState(false)

  useEffect(() => {
    const kelurahan = kecamatanWithDesaKelurahan[selectedKecamatan?.trim()] || []
    setKelurahanOptions(kelurahan)
    setValue('kelurahan_desa', '') // reset kelurahan saat kecamatan berubah
  }, [selectedKecamatan, setValue])

  const password = watch('password')

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true)
        const res = await axios.get('/kandidat/profile', { withCredentials: true })
        const data = res.data
        setUserId(data.id)

        reset({
          nama_lengkap: data.nama_lengkap || '',
          alamat: data.alamat || '',
          tanggal_lahir: data.tanggal_lahir || '',
          rt_rw: data.rt_rw || '',
          kelurahan_desa: data.kelurahan_desa || '',
          kecamatan: data.kecamatan || '',
          perguruan_tinggi: data.perguruan_Tinggi || '',
          fakultas_prodi: data.fakultas_prodi || '',
          username: data.user?.username || '',
          email: data.user?.email || '',
          password: '',
          noRekening: data.noRekening || '',

          password_confirmation: '',
          buktiRekening: data.buktiRekening || '',
        })
      } catch (error) {
        console.error('Gagal fetch profil:', error)
        alert('Gagal memuat data profil Anda.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [reset])

  const onSubmit = async formData => {
    if (formData.password && formData.password !== formData.password_confirmation) {
      alert('Password dan konfirmasi password tidak sama!')
      return
    }

    if (!userId) {
      alert('User ID tidak ditemukan.')
      return
    }

    setIsSaving(true)

    try {
      const updateData = {
        userId,
        nama_lengkap: formData.nama_lengkap,
        alamat: formData.alamat,
        tanggal_lahir: formData.tanggal_lahir,
        rt_rw: formData.rt_rw,
        kelurahan_desa: formData.kelurahan_desa,
        kecamatan: formData.kecamatan,
        perguruan_Tinggi: formData.perguruan_tinggi,

        noRekening: formData.noRekening,
        buktiRekening: formData.buktiRekening,
        fakultas_prodi: formData.fakultas_prodi,
        ...(formData.password ? { password: formData.password } : {}),
      }

      await axios.put('/kandidat/profile', updateData, { withCredentials: true })

      alert('Data profil berhasil disimpan')
    } catch (error) {
      console.error('Gagal update profil:', error)
      alert('Gagal menyimpan data profil Anda.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading data profil...</p>
      </div>
    )
  }

  return (
    <>
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow">Menyimpan data...</div>
        </div>
      )}

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
            {/*set this as a grid-cols-4 because we have 4 tabs*/}
            <TabsList className="grid w-full grid-cols-4">
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
              <TabsTrigger value="bank_account">
                <span className="hidden sm:inline">Data Akun Bank</span>
                <span className="sm:hidden">Akun Bank</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)}>
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
                        {...register('nama_lengkap', { required: 'Nama lengkap wajib diisi' })}
                        placeholder="Masukkan nama lengkap"
                        error={errors.nama_lengkap?.message}
                      />

                      <FormField
                        label="Tanggal Lahir"
                        type="date"
                        name="tanggal_lahir"
                        {...register('tanggal_lahir', { required: 'Tanggal lahir wajib diisi' })}
                        error={errors.tanggal_lahir?.message}
                      />
                    </div>

                    <FormField
                      label="Alamat"
                      type="textarea"
                      name="alamat"
                      {...register('alamat', { required: 'Alamat wajib diisi' })}
                      placeholder="Masukkan alamat lengkap"
                      error={errors.alamat?.message}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="RT/RW"
                        name="rt_rw"
                        {...register('rt_rw', { required: 'RT/RW wajib diisi' })}
                        placeholder="Contoh: 001/002"
                        error={errors.rt_rw?.message}
                      />

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Kelurahan/Desa</label>
                        <Popover open={openKelurahan} onOpenChange={setOpenKelurahan}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openKelurahan}
                              className="w-full justify-between"
                              disabled={!selectedKecamatan}
                            >
                              {selectedKelurahan || 'Pilih kelurahan/desa...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Cari kelurahan..." />
                              <CommandList>
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {kelurahanOptions.map(item => (
                                    <CommandItem
                                      key={item}
                                      value={item}
                                      onSelect={() => {
                                        setValue('kelurahan_desa', item, { shouldValidate: true })
                                        setOpenKelurahan(false)
                                      }}
                                    >
                                      {item}
                                      <Check
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          selectedKelurahan === item ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {errors.kelurahan_desa?.message && (
                          <p className="text-sm text-red-500">{errors.kelurahan_desa.message}</p>
                        )}
                      </div>

                      {/* <FormField
                        label="Kecamatan"
                        name="kecamatan"
                        {...register('kecamatan', { required: 'Kecamatan wajib diisi' })}
                        placeholder="Masukkan kecamatan"
                        error={errors.kecamatan?.message}
                      /> */}

                      {/* Combobox Kecamatan */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Kecamatan</label>
                        <Popover open={openKecamatan} onOpenChange={setOpenKecamatan}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openKecamatan}
                              className="w-full justify-between"
                            >
                              {selectedKecamatan || 'Pilih kecamatan...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Cari kecamatan..." />
                              <CommandList>
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {kecamatanList.map(item => (
                                    <CommandItem
                                      key={item}
                                      value={item}
                                      onSelect={() => {
                                        setValue('kecamatan', item, { shouldValidate: true })
                                        setOpenKecamatan(false)
                                      }}
                                    >
                                      {item}
                                      <Check
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          selectedKecamatan === item ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {errors.kecamatan?.message && (
                          <p className="text-sm text-red-500">{errors.kecamatan.message}</p>
                        )}
                      </div>
                    </div>
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
                        {...register('perguruan_tinggi', {
                          required: 'Perguruan tinggi wajib diisi',
                        })}
                        placeholder="Masukkan nama perguruan tinggi"
                        error={errors.perguruan_tinggi?.message}
                      />

                      <FormField
                        label="Fakultas/Program Studi"
                        name="fakultas_prodi"
                        {...register('fakultas_prodi', { required: 'Fakultas/Prodi wajib diisi' })}
                        placeholder="Masukkan fakultas/prodi"
                        error={errors.fakultas_prodi?.message}
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

              <TabsContent value="bank_account">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Akun Bank</CardTitle>
                    <CardDescription>
                      Masukkan data akun bank Anda untuk pencairan beasiswa
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      label="Nomor Rekening"
                      name="noRekening"
                      type="text"
                      value={
                        isRekeningMasked ? maskRekening(watch('noRekening')) : watch('noRekening')
                      }
                      onFocus={() => setIsRekeningMasked(false)}
                      onBlur={() => setIsRekeningMasked(true)}
                      onChange={e => {
                        const raw = e.target.value.replace(/[^0-9]/g, '')
                        setValue('noRekening', raw)
                      }}
                      placeholder="Masukkan nomor rekening"
                      error={errors.noRekening?.message}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Bukti Rekening (maks 500KB)
                      </label>

                      {watch('buktiRekening') ? (
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="link"
                            className="text-blue-600 p-0"
                            onClick={() => setShowBuktiModal(true)}
                          >
                            Lihat Bukti Rekening
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => setValue('buktiRekening', '')}
                          >
                            Hapus
                          </Button>
                        </div>
                      ) : null}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          if (file.size > 500 * 1024) {
                            alert('Ukuran gambar maksimal 500KB')
                            return
                          }

                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setValue('buktiRekening', reader.result, { shouldValidate: true })
                          }
                          reader.readAsDataURL(file)
                        }}
                        className="text-sm"
                      />

                      {errors.buktiRekening && (
                        <p className="text-sm text-red-500">{errors.buktiRekening.message}</p>
                      )}
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
                    <Button variant="outline" type="button" onClick={() => setActiveTab('account')}>
                      Selanjutnya
                    </Button>
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
                        {...register('username')}
                        placeholder="Masukkan username"
                        disabled
                      />

                      <FormField
                        label="Email"
                        type="email"
                        name="email"
                        {...register('email')}
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
                          {...register('password')}
                          placeholder="Masukkan password baru"
                          error={errors.password?.message}
                        />

                        <FormField
                          label="Konfirmasi Password"
                          type="password"
                          name="password_confirmation"
                          {...register('password_confirmation', {
                            validate: value =>
                              !password || value === password || 'Konfirmasi password tidak cocok',
                          })}
                          placeholder="Konfirmasi password baru"
                          error={errors.password_confirmation?.message}
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

      {showBuktiModal && watch('buktiRekening') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-2">Pratinjau Bukti Rekening</h2>
            <img
              src={watch('buktiRekening')}
              alt="Bukti Rekening"
              className="w-full h-auto object-contain border"
            />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowBuktiModal(false)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
