'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/ui/data-table'
import ModalForm from '@/components/ui/modal-form'
import FormField from '@/components/ui/form-field'
import ThreeLoading from '@/components/three-loading'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/axios'

export default function SubKriteriaPage() {
  const [subKriteriaData, setSubKriteriaData] = useState([])
  const [kriteriaOptions, setKriteriaOptions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      kriteriaId: '',
      nama_sub_kriteria: '',
      bobot_sub_kriteria: '',
    },
  })

  useEffect(() => {
    fetchSubKriteria()
    fetchKriteriaOptions()
  }, [])

  const fetchSubKriteria = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/sub-kriteria')
      const mapped = res.data.map(item => ({
        ...item,
        nama_kriteria: item.kriteria?.nama_kriteria || '-', // pastikan include
      }))
      setSubKriteriaData(mapped)
    } catch (err) {
      console.error('Gagal fetch sub kriteria:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchKriteriaOptions = async () => {
    try {
      const res = await api.get('/kriteria')
      const options = res.data.map(k => ({
        value: k.id,
        label: k.nama_kriteria,
      }))
      setKriteriaOptions(options)
    } catch (err) {
      console.error('Gagal fetch kriteria:', err)
    }
  }

  const handleAddSubKriteria = () => {
    reset()
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditSubKriteria = async sub => {
    // Ensure options are loaded before setting value
    if (kriteriaOptions.length === 0) {
      await fetchKriteriaOptions()
    }

    reset({
      kriteriaId: sub.kriteriaId,
      nama_sub_kriteria: sub.nama_sub_kriteria,
      bobot_sub_kriteria: sub.bobot_sub_kriteria.toString(),
    })

    setEditingId(sub.id)
    setIsModalOpen(true)
  }

  const handleDeleteSubKriteria = async id => {
    setIsLoading(true)
    try {
      await api.delete(`/sub-kriteria/${id}`)
      fetchSubKriteria()
    } catch (err) {
      console.error('Gagal hapus:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async data => {
    setIsLoading(true)
    try {
      const payload = {
        ...data,
        bobot_sub_kriteria: parseFloat(data.bobot_sub_kriteria),
      }

      if (editingId) {
        await api.put(`/sub-kriteria/${editingId}`, payload)
      } else {
        await api.post('/sub-kriteria', payload)
      }

      // ✅ Reset form setelah submit berhasil
      reset({
        kriteriaId: '',
        nama_sub_kriteria: '',
        bobot_sub_kriteria: '',
      })

      // ✅ Tutup modal
      setIsModalOpen(false)

      // ✅ Refresh data
      fetchSubKriteria()
    } catch (err) {
      console.error('Gagal simpan:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    {
      header: 'KRITERIA',
      accessorKey: 'nama_kriteria',
    },
    {
      header: 'SUB KRITERIA',
      accessorKey: 'nama_sub_kriteria',
    },
    {
      header: 'BOBOT',
      accessorKey: 'bobot_sub_kriteria',
      cell: row => <Badge>{row.bobot_sub_kriteria}</Badge>,
    },
  ]

  const renderActions = item => (
    <>
      <Button
        size="sm"
        onClick={() => handleEditSubKriteria(item)}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleDeleteSubKriteria(item.id)}>
        Hapus
      </Button>
    </>
  )

  return (
    <>
      {isLoading && <ThreeLoading text="Memproses data..." />}

      <DataTable
        title="Sub Kriteria"
        description="Kelola sub kriteria untuk penilaian rumah layak huni"
        data={subKriteriaData}
        columns={columns}
        searchKey="nama_sub_kriteria"
        searchPlaceholder="Cari Sub Kriteria"
        addButtonText="Tambah Sub Kriteria"
        addButtonAction={handleAddSubKriteria}
        renderActions={renderActions}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Sub Kriteria' : 'Tambah Sub Kriteria Baru'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          label="Kriteria"
          type="select"
          name="kriteriaId"
          options={kriteriaOptions} // ← ini harus value=id dari Kriteria
          placeholder="Pilih kriteria"
          error={errors.kriteriaId?.message}
          control={control}
          rules={{ required: 'Kriteria wajib dipilih' }}
        />

        <FormField
          label="Nama Sub Kriteria"
          name="nama_sub_kriteria"
          placeholder="Masukkan sub kriteria"
          error={errors.nama_sub_kriteria?.message}
          {...register('nama_sub_kriteria', { required: 'Sub kriteria wajib diisi' })}
        />
        <FormField
          label="Bobot Sub Kriteria"
          type="number"
          name="bobot_sub_kriteria"
          placeholder="Masukkan bobot"
          error={errors.bobot_sub_kriteria?.message}
          {...register('bobot_sub_kriteria', {
            required: 'Bobot wajib diisi',
            min: { value: 1, message: 'Minimal bobot 1' },
            max: { value: 10, message: 'Maksimal bobot 10' },
          })}
        />
      </ModalForm>
    </>
  )
}
