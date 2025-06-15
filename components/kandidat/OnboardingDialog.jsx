"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  School,
  Save,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Award,
  AlertCircle,
  Loader2,
  PiggyBank,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm, FormProvider } from "react-hook-form"
import axios from "@/lib/axios"
import { toast } from "sonner"

import StepPersonalData from "./onboarding/StepPersonalData"
import StepEducationData from "./onboarding/StepEducationData"
import StepConfirmation from "./onboarding/StepConfirmation"
import StepBankAccount from "./onboarding/StepBankAccount"

 

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
      nama_lengkap: "",
      tanggal_lahir: "",
      alamat: "",
      rt_rw: "",
      kelurahan_desa: "",
      kecamatan: "",
      kabupaten: "Rote Ndao",
      provinsi: "Nusa Tenggara Timur",
      perguruan_tinggi: "",
      fakultas_prodi: "",
      jenjang: "",
      noRekening: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const res = await axios.post("/kandidat", data, {
        withCredentials: true,
      })

      if (res.status !== 200) {
        throw new Error("Gagal menyimpan data")
      }

      toast.success("Data berhasil disimpan!")
      onOpenChange(false)
      router.push("/kandidat/dashboard")
      window.location.reload()
    } catch (err) {
      console.error("Gagal submit form:", err)
      toast.error("Gagal menyimpan data. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      title: "Data Pribadi",
      description: "Masukkan data pribadi Anda sesuai dengan KTP",
      icon: <User className="h-5 w-5" />,
      fields: ["nama_lengkap", "tanggal_lahir", "alamat", "rt_rw", "kelurahan_desa", "kecamatan"],
    },
    {
      title: "Data Pendidikan",
      description: "Masukkan data pendidikan Anda sesuai dengan dokumen resmi",
      icon: <School className="h-5 w-5" />,
      fields: ["perguruan_tinggi", "fakultas_prodi", "jenjang"],
    },
    {
      title: "Informasi Rekening Bank",
      description: "Masukkan informasi rekening bank Anda",
      icon: <PiggyBank className="h-5 w-5" />,
      fields: ["noRekening"],
    },
    {
      title: "Konfirmasi",
      description: "Periksa kembali data yang telah Anda masukkan",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ]

  const handleNext = async () => {
    if (currentStep <= 3) {
      const currentStepFields = steps[currentStep - 1].fields
      const isValid = await trigger(currentStepFields)
      if (!isValid) return
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleConfirmChange = (checked) => {
    setIsConfirmed(checked)
    if (attemptedClose && checked) {
      setAttemptedClose(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          if (currentStep === steps.length && !isConfirmed && !isLoading) {
            setAttemptedClose(true)
            return
          }
          if (isLoading) {
            return
          }
        }
        onOpenChange(value)
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white border-b">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-6 w-6 text-primary" />
              <DialogTitle className="text-xl">Selamat Datang di Program Beasiswa</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              Lengkapi data diri Anda untuk melanjutkan proses pengajuan beasiswa
            </DialogDescription>
          </DialogHeader>

          {/* Improved Stepper */}
          <div className="px-6 pb-6">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const stepNumber = index + 1
                  const isActive = currentStep === stepNumber
                  const isCompleted = currentStep > stepNumber
                  const isUpcoming = currentStep < stepNumber

                  return (
                    <div key={index} className="flex flex-col items-center group">
                      {/* Step Circle */}
                      <div
                        className={`
                          relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                          border-2 transition-all duration-200 ease-in-out
                          ${
                            isCompleted
                              ? "bg-primary border-primary text-white shadow-md"
                              : isActive
                                ? "bg-white border-primary text-primary shadow-lg ring-4 ring-primary/20"
                                : "bg-white border-gray-300 text-gray-400"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-semibold">{stepNumber}</span>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="mt-3 text-center max-w-[120px]">
                        <div
                          className={`
                            text-sm font-medium transition-colors duration-200
                            ${isActive ? "text-primary" : isCompleted ? "text-gray-700" : "text-gray-500"}
                          `}
                        >
                          {step.title}
                        </div>
                        <div
                          className={`
                            text-xs mt-1 transition-colors duration-200
                            ${isActive ? "text-primary/70" : "text-gray-400"}
                          `}
                        >
                          {step.description}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <FormProvider {...{ register, handleSubmit, formState: { errors }, watch, trigger, control }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 pt-2 pb-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                <p className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Anda harus menyelesaikan proses onboarding ini untuk dapat mengakses fitur aplikasi.</span>
                </p>
              </div>

              {attemptedClose && currentStep === steps.length && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
                >
                  <p className="flex items-start">
                    <AlertCircle className="h-4 w-4 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Harap centang kotak konfirmasi dan klik tombol Simpan untuk menyelesaikan proses.</span>
                  </p>
                </motion.div>
              )}
            </div>

            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {currentStep === 1 && <StepPersonalData errors={errors} />}
                  {currentStep === 2 && <StepEducationData errors={errors} />}
                  {currentStep === 3 && <StepBankAccount />}
                  {currentStep === 4 && (
                    <StepConfirmation isConfirmed={isConfirmed} onCheckedChange={handleConfirmChange} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Step indicator */}
                  <span className="text-sm text-gray-500">
                    {currentStep} dari {steps.length}
                  </span>

                  {currentStep < steps.length ? (
                    <Button type="button" onClick={handleNext} disabled={isLoading} className="flex items-center gap-2">
                      Selanjutnya
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !isConfirmed}
                      className="flex items-center gap-2 min-w-[120px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Simpan
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
