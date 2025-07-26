'use client'

import { useFormContext } from 'react-hook-form'
import FormField from '@/components/ui/form-field'
import { useState } from 'react'
import { toast } from 'sonner'

export default function StepBankAccount() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const [preview, setPreview] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 500 * 1024) {
      toast.error('Ukuran gambar maksimal 500KB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result
      setValue('buktiRekening', base64, { shouldValidate: true })
      setPreview(base64)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Informasi Rekening Bank</h2>

      <FormField
        label="Nomor Rekening"
        placeholder="Masukkan nomor rekening"
        description="Hanya rekening dari BANK NTT yang diterima"
        {...register('noRekening', {
          required: 'Nomor rekening wajib diisi',
          pattern: {
            value: /^[0-9]{8,20}$/,
            message: 'Nomor rekening harus berupa angka (8–20 digit)',
          },
        })}
        error={errors.noRekening?.message}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Upload Bukti Rekening (maks 500KB)
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />

        {/* ✅ hidden input agar React Hook Form bisa validasi */}
        <input
          type="hidden"
          {...register('buktiRekening', {
            required: 'Bukti rekening wajib diunggah',
          })}
        />

        {preview && (
          <img src={preview} alt="Preview" className="mt-2 max-h-48 rounded border" />
        )}
        {errors.buktiRekening?.message && (
          <p className="text-sm text-red-500">{errors.buktiRekening.message}</p>
        )}
      </div>
    </div>
  )
}
