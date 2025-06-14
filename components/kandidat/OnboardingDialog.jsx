'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  School,
  Save,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Award,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import FormField from '@/components/ui/form-field'
import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'
import { toast } from 'sonner'

export default function OnboardingDialog({ open, onOpenChange }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [attemptedClose, setAttemptedClose] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    control,
  } = useForm({
    defaultValues: {
      nama_lengkap: '',
      tanggal_lahir: '',
      alamat: '',
      rt_rw: '',
      kelurahan_desa: '',
      kecamatan: '',
      kabupaten: 'Rote Ndao',
      provinsi: 'Nusa Tenggara Timur',
      perguruan_tinggi: '',
      fakultas_prodi: '',
      jenjang: '',
    },
  })

  const onSubmit = async data => {
    setIsLoading(true)
    try {
      const res = await axios.post('/kandidat', data, {
        withCredentials: true,
      })

      if (res.status !== 200) {
        throw new Error('Gagal menyimpan data')
      }

      toast.success('Data berhasil disimpan!') // ✅ Toast sukses

      onOpenChange(false)
      router.push('/kandidat/dashboard')
      window.location.reload()
    } catch (err) {
      console.error('Gagal submit form:', err)
      toast.error('Gagal menyimpan data. Silakan coba lagi.') // ❌ Toast gagal
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      title: 'Data Pribadi',
      description: 'Masukkan data pribadi Anda sesuai dengan KTP',
      icon: <User className="h-5 w-5" />,
      fields: ['nama_lengkap', 'tanggal_lahir', 'alamat', 'rt_rw', 'kelurahan_desa', 'kecamatan'],
    },
    {
      title: 'Data Pendidikan',
      description: 'Masukkan data pendidikan Anda sesuai dengan dokumen resmi',
      icon: <School className="h-5 w-5" />,
      fields: ['perguruan_tinggi', 'fakultas_prodi', 'jenjang'],
    },
    {
      title: 'Konfirmasi',
      description: 'Periksa kembali data yang telah Anda masukkan',
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ]

  const handleNext = async () => {
    // Validasi fields untuk step saat ini sebelum lanjut
    if (currentStep <= 2) {
      const currentStepFields = steps[currentStep - 1].fields
      const isValid = await trigger(currentStepFields)

      if (!isValid) return
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleConfirmChange = checked => {
    setIsConfirmed(checked)
    if (attemptedClose && checked) {
      setAttemptedClose(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        // If trying to close (value is false)
        if (!value) {
          // If on last step and not confirmed, prevent closing
          if (currentStep === steps.length && !isConfirmed && !isLoading) {
            setAttemptedClose(true)
            return
          }

          // If loading, prevent closing
          if (isLoading) {
            return
          }
        }

        // Otherwise allow the change
        onOpenChange(value)
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white border-b">
          <DialogHeader className="p-6 pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                <DialogTitle className="text-xl">Selamat Datang di Program Beasiswa</DialogTitle>
              </div>
            </div>
            <DialogDescription>
              Lengkapi data diri Anda untuk melanjutkan proses pengajuan beasiswa
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-2">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center ${index < steps.length - 1 ? 'relative' : ''}`}
                >
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center
                      ${
                        currentStep > index + 1
                          ? 'bg-green-100 text-green-600 border-2 border-green-200'
                          : currentStep === index + 1
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                      }`}
                  >
                    {currentStep > index + 1 ? <CheckCircle className="h-5 w-5" /> : step.icon}
                  </div>
                  <div className="mt-2 text-sm font-medium">{step.title}</div>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 ${
                        currentStep > index + 1 ? 'bg-green-200' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-2 pb-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
              <p className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  Anda harus menyelesaikan proses onboarding ini untuk dapat mengakses fitur
                  aplikasi.
                </span>
              </p>
            </div>

            {attemptedClose && currentStep === steps.length && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                <p className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>
                    Harap centang kotak konfirmasi dan klik tombol Simpan untuk menyelesaikan
                    proses.
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nama Lengkap"
                        name="nama_lengkap"
                        error={errors.nama_lengkap?.message}
                        {...register('nama_lengkap', { required: 'Nama wajib diisi' })}
                      />
                      <FormField
                        label="Tanggal Lahir"
                        type="date"
                        name="tanggal_lahir"
                        error={errors.tanggal_lahir?.message}
                        {...register('tanggal_lahir', { required: 'Tanggal lahir wajib diisi' })}
                      />
                    </div>
                    <FormField
                      label="Alamat"
                      type="textarea"
                      name="alamat"
                      error={errors.alamat?.message}
                      {...register('alamat', { required: 'Alamat wajib diisi' })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="RT/RW"
                        name="rt_rw"
                        error={errors.rt_rw?.message}
                        {...register('rt_rw', { required: 'RT/RW wajib diisi' })}
                      />
                      <FormField
                        label="Kelurahan/Desa"
                        name="kelurahan_desa"
                        error={errors.kelurahan_desa?.message}
                        {...register('kelurahan_desa', { required: 'Kelurahan/Desa wajib diisi' })}
                      />
                      <FormField
                        label="Kecamatan"
                        name="kecamatan"
                        error={errors.kecamatan?.message}
                        {...register('kecamatan', { required: 'Kecamatan wajib diisi' })}
                      />
                      <FormField
                        label="Kabupaten"
                        name="kabupaten"
                        disabled
                        value="Rote Ndao"
                        {...register('kabupaten')}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Perguruan Tinggi"
                        name="perguruan_tinggi"
                        error={errors.perguruan_tinggi?.message}
                        {...register('perguruan_tinggi', {
                          required: 'Perguruan tinggi wajib diisi',
                        })}
                      />
                      <FormField
                        label="Fakultas/Program Studi"
                        name="fakultas_prodi"
                        error={errors.fakultas_prodi?.message}
                        {...register('fakultas_prodi', { required: 'Fakultas/Prodi wajib diisi' })}
                      />
                      <FormField
                        label="Jenjang"
                        type="select"
                        name="jenjang"
                        control={control}
                        options={[
                          { value: 'D3', label: 'D3' },
                          { value: 'D4', label: 'D4' },
                          { value: 'S1', label: 'S1' },
                          { value: 'S2', label: 'S2' },
                          { value: 'S3', label: 'S3' },
                        ]}
                        {...register('jenjang', { required: 'Jenjang wajib diisi' })}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="confirm"
                        checked={isConfirmed}
                        onCheckedChange={handleConfirmChange}
                        required
                      />
                      <label htmlFor="confirm" className="text-sm text-gray-700">
                        Saya menyatakan bahwa data yang saya masukkan adalah benar dan dapat
                        dipertanggungjawabkan
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
              </Button>
            )}

            {currentStep < steps.length ? (
              <Button type="button" onClick={handleNext} disabled={isLoading}>
                Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !isConfirmed}>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Simpan
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
