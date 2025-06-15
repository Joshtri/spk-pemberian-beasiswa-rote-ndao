'use client'

import { useFormContext } from 'react-hook-form'
import FormField from '@/components/ui/form-field'

export default function StepBankAccount() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

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
        error={errors.noRekening}
      />
    </div>
  )
}
