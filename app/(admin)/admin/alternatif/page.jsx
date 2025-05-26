'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/ui/data-table'
import ModalForm from '@/components/ui/modal-form'
import FormField from '@/components/ui/form-field'
import ThreeLoading from '@/components/three-loading'
import api from '@/lib/axios'
import { toast } from 'sonner'
import DetailCalonPenerimaModal from '@/components/admin/kandidat/DetailCalonPenerimaModal'

export default function CalonPenerimaPage() {
  const [calonPenerimaData, setCalonPenerimaData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedCalonPenerima, setSelectedCalonPenerima] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nama_lengkap: '',
      alamat: '',
      tanggal_lahir: '',
      rt_rw: '',
      kelurahan_desa: '',
      kecamatan: '',
      perguruan_Tinggi: '', // Changed from perguruan_tinggi to perguruan_Tinggi
      fakultas_prodi: '',
    },
  })

  useEffect(() => {
    fetchCalonPenerima()
  }, [])

  const fetchCalonPenerima = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/calon-penerima/list')
      setCalonPenerimaData(res.data.data || res.data)
    } catch (err) {
      console.error('Gagal fetch calon penerima:', err)
      toast.error('Gagal memuat data')
      setCalonPenerimaData([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCalonPenerima = () => {
    reset({
      nama_lengkap: '',
      alamat: '',
      tanggal_lahir: '',
      rt_rw: '',
      kelurahan_desa: '',
      kecamatan: '',
      perguruan_Tinggi: '', // Changed from perguruan_tinggi to perguruan_Tinggi
      fakultas_prodi: '',
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditCalonPenerima = calonPenerima => {
    reset({
      nama_lengkap: calonPenerima.nama_lengkap,
      alamat: calonPenerima.alamat,
      tanggal_lahir: calonPenerima.tanggal_lahir,
      rt_rw: calonPenerima.rt_rw,
      kelurahan_desa: calonPenerima.kelurahan_desa,
      kecamatan: calonPenerima.kecamatan,
      perguruan_Tinggi: calonPenerima.perguruan_Tinggi, // Changed from perguruan_tinggi to perguruan_Tinggi
      fakultas_prodi: calonPenerima.fakultas_prodi,
    })
    setEditingId(calonPenerima.id)
    setIsModalOpen(true)
  }

  const handleViewDetail = item => {
    setSelectedCalonPenerima(item)
    setIsDetailModalOpen(true)
  }

  const handleDeleteCalonPenerima = async id => {
    setIsLoading(true)
    try {
      await api.delete(`/calon-penerima/${id}`)
      await fetchCalonPenerima()
      toast.success('Data berhasil dihapus')
    } catch (err) {
      console.error('Gagal hapus:', err)
      toast.error('Gagal menghapus data')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async data => {
    setIsLoading(true)
    try {
      if (editingId) {
        await api.put(`/calon-penerima/${editingId}`, data)
        toast.success('Data berhasil diperbarui')
      } else {
        await api.post('/calon-penerima', data)
        toast.success('Data berhasil ditambahkan')
      }
      setIsModalOpen(false)
      await fetchCalonPenerima()
    } catch (err) {
      console.error('Gagal simpan:', err)
      toast.error('Gagal menyimpan data')
    } finally {
      setIsLoading(false)
    }
  }

  // Update columns to include all fields
  const columns = [
    { header: 'Nama Lengkap', accessorKey: 'nama_lengkap' },
    { header: 'Alamat', accessorKey: 'alamat' },
    { header: 'Tanggal Lahir', accessorKey: 'tanggal_lahir' },
    { header: 'RT/RW', accessorKey: 'rt_rw' },
    { header: 'Kelurahan/Desa', accessorKey: 'kelurahan_desa' },
    { header: 'Kecamatan', accessorKey: 'kecamatan' },
    { header: 'Perguruan Tinggi', accessorKey: 'perguruan_Tinggi' }, // Changed from perguruan_tinggi to perguruan_Tinggi
    { header: 'Fakultas/Prodi', accessorKey: 'fakultas_prodi' },
  ]

  const renderActions = item => (
    <>
      <Button size="sm" variant="default" onClick={() => handleEditCalonPenerima(item)}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleDeleteCalonPenerima(item.id)}>
        Hapus
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-blue-500 hover:bg-blue-600 text-white border-0"
        onClick={() => handleViewDetail(item)}
      >
        Detail
      </Button>
    </>
  )

  return (
    <>
      {isLoading}

      <DataTable
        title="Calon Penerima Beasiswa"
        description="Daftar calon penerima beasiswa"
        data={Array.isArray(calonPenerimaData) ? calonPenerimaData : []}
        columns={columns}
        searchKey="nama_lengkap"
        addButtonText="Tambah Calon Penerima"
        addButtonAction={handleAddCalonPenerima}
        renderActions={renderActions}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Calon Penerima' : 'Tambah Calon Penerima'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          label="Nama Lengkap"
          name="nama_lengkap"
          error={errors.nama_lengkap?.message}
          {...register('nama_lengkap', { required: 'Wajib diisi' })}
        />

        <FormField
          label="Tanggal Lahir"
          name="tanggal_lahir"
          type="date"
          error={errors.tanggal_lahir?.message}
          {...register('tanggal_lahir', { required: 'Wajib diisi' })}
        />

        <FormField
          label="Alamat"
          name="alamat"
          error={errors.alamat?.message}
          {...register('alamat', { required: 'Wajib diisi' })}
        />

        <FormField
          label="RT/RW"
          name="rt_rw"
          error={errors.rt_rw?.message}
          {...register('rt_rw', { required: 'Wajib diisi' })}
        />

        <FormField
          label="Kelurahan/Desa"
          name="kelurahan_desa"
          error={errors.kelurahan_desa?.message}
          {...register('kelurahan_desa', { required: 'Wajib diisi' })}
        />

        <FormField
          label="Kecamatan"
          name="kecamatan"
          error={errors.kecamatan?.message}
          {...register('kecamatan', { required: 'Wajib diisi' })}
        />

        <FormField
          label="Perguruan Tinggi"
          name="perguruan_Tinggi" // Changed from perguruan_tinggi to perguruan_Tinggi
          error={errors.perguruan_Tinggi?.message} // Changed from perguruan_tinggi to perguruan_Tinggi
          {...register('perguruan_Tinggi', { required: 'Wajib diisi' })} // Changed from perguruan_tinggi to perguruan_Tinggi
        />

        <FormField
          label="Fakultas/Prodi"
          name="fakultas_prodi"
          error={errors.fakultas_prodi?.message}
          {...register('fakultas_prodi', { required: 'Wajib diisi' })}
        />
      </ModalForm>

      <DetailCalonPenerimaModal
        open={isDetailModalOpen}
        calonPenerimaId={selectedCalonPenerima?.id}
        onClose={() => setIsDetailModalOpen(false)}
        calonPenerima={selectedCalonPenerima}
      />
    </>
  )
}
