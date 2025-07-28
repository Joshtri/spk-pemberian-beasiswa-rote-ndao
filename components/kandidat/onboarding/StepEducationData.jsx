'use client'
import FormField from '@/components/ui/form-field'
import { useFormContext } from 'react-hook-form'

export default function StepEducationData({ errors }) {
  const { register, control } = useFormContext()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Perguruan Tinggi"
          name="perguruan_tinggi"
          error={errors.perguruan_tinggi?.message}
          {...register('perguruan_tinggi', { required: 'Perguruan tinggi wajib diisi' })}
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
            { value: 'S1', label: 'S1 ' },
            // { value: 'D3', label: 'D3' },
            // { value: 'D4', label: 'D4' },
            // { value: 'S2', label: 'S2' },
            // { value: 'S3', label: 'S3' },
          ]}
          {...register('jenjang', { required: 'Jenjang wajib diisi' })}
        />
      </div>
    </div>
  )
}
