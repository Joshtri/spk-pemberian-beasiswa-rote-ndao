'use client'
import FormField from '@/components/ui/form-field'
import { useFormContext } from 'react-hook-form'

export default function StepPersonalData({ errors }) {
  const { register } = useFormContext()

  return (
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
  )
}
