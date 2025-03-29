// components/kriteria/SubkriteriaAddModal.js

'use client'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import ModalForm from '@/components/ui/modal-form'
import FormField from '@/components/ui/form-field'
import api from '@/lib/axios'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function SubkriteriaAddModal({
  open,
  onClose,
  kriteriaId,
  kriteriaName,
  onSuccess,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nama_sub_kriteria: '',
      bobot_sub_kriteria: '',
    },
  })

  const onSubmit = async data => {
    try {
      const payload = {
        ...data,
        kriteriaId,
        bobot_sub_kriteria: parseFloat(data.bobot_sub_kriteria),
      }

      await api.post('/sub-kriteria', payload)

      toast.success('Subkriteria berhasil ditambahkan')
      reset()
      onClose()
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error('Gagal tambah subkriteria:', err)
      toast.error('Gagal menyimpan subkriteria')
    }
  }

  return (
    <ModalForm
      isOpen={open}
      onClose={onClose}
      title="Tambah Subkriteria"
      description="Isi informasi subkriteria untuk kriteria yang dipilih"
      onSubmit={handleSubmit(onSubmit)}
    >
      {kriteriaName && (
        <Alert variant="default" className="mb-4">
          <Info className="h-4 w-4 text-blue-500 mr-2" />
          <AlertDescription>
            Menambahkan subkriteria untuk <span className="font-semibold">{kriteriaName}</span>
          </AlertDescription>
        </Alert>
      )}

      <FormField
        label="Nama Subkriteria"
        name="nama_sub_kriteria"
        placeholder="Masukkan nama subkriteria"
        {...register('nama_sub_kriteria', { required: 'Nama wajib diisi' })}
        error={errors.nama_sub_kriteria?.message}
      />

      <FormField
        label="Bobot Subkriteria"
        name="bobot_sub_kriteria"
        type="number"
        step="any"
        placeholder="Contoh: 5"
        {...register('bobot_sub_kriteria', { required: 'Bobot wajib diisi' })}
        error={errors.bobot_sub_kriteria?.message}
      />
    </ModalForm>
  )
}
