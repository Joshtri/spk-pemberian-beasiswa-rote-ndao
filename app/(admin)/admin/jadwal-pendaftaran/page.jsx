'use client'

import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/ui/data-table'
import ModalForm from '@/components/ui/modal-form'
import FormField from '@/components/ui/form-field'
import ThreeLoading from '@/components/three-loading'
import api from '@/lib/axios'
import { formatDate } from '@/utils/formatDate'

export default function JadwalPendaftaranPage() {
  const [jadwalData, setJadwalData] = useState([])
  const [periodeOptions, setPeriodeOptions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const methods = useForm({
    defaultValues: {
      periodeId: '',
      pembukaan: '',
      batas_akhir: '',
      seleksi_mulai: '',
      seleksi_selesai: '',
      pengumuman_penerima: '',
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods

  useEffect(() => {
    fetchJadwal()
    fetchPeriodeOptions()
  }, [])

  const fetchJadwal = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/jadwal-pendaftaran')
      setJadwalData(res.data)
    } catch (err) {
      console.error('Gagal fetch jadwal:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPeriodeOptions = async () => {
    try {
      const res = await api.get('/periode')
      const options = res.data.map(p => ({
        value: p.id,
        label: p.nama_periode || `Periode ${p.id}`, // Sesuaikan dengan field yang ada
      }))
      setPeriodeOptions(options)
    } catch (err) {
      console.error('Gagal fetch periode:', err)
    }
  }

  const handleAddJadwal = () => {
    reset()
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditJadwal = jadwal => {
    reset({
      periodeId: jadwal.periodeId,
      pembukaan: jadwal.pembukaan?.slice(0, 10),
      batas_akhir: jadwal.batas_akhir?.slice(0, 10),
      seleksi_mulai: jadwal.seleksi_mulai?.slice(0, 10),
      seleksi_selesai: jadwal.seleksi_selesai?.slice(0, 10),
      pengumuman_penerima: jadwal.pengumuman_penerima?.slice(0, 10),
    })
    setEditingId(jadwal.id)
    setIsModalOpen(true)
  }

  const handleDeleteJadwal = async id => {
    setIsLoading(true)
    try {
      await api.delete(`/jadwal-pendaftaran/${id}`)
      fetchJadwal()
    } catch (err) {
      console.error('Gagal hapus jadwal:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async data => {
    setIsLoading(true)
    try {
      if (editingId) {
        await api.put(`/jadwal-pendaftaran/${editingId}`, data)
      } else {
        await api.post('/jadwal-pendaftaran', data)
      }

      reset()
      setIsModalOpen(false)
      fetchJadwal()
    } catch (err) {
      console.error('Gagal simpan:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    {
      header: 'NO',
      accessorKey: 'id',
      className: 'w-16 text-center',
      cellClassName: 'text-center font-medium',
    },
    {
      header: 'PERIODE',
      accessorKey: 'periodeId',
      cell: row => {
        const periode = periodeOptions.find(p => p.value === row.periodeId)
        return periode ? periode.label : row.periodeId
      },
    },
    { header: 'PEMBUKAAN', accessorKey: 'pembukaan', cell: row => formatDate(row.pembukaan) },
    { header: 'BATAS AKHIR', accessorKey: 'batas_akhir', cell: row => formatDate(row.batas_akhir) },
    {
      header: 'SELEKSI MULAI',
      accessorKey: 'seleksi_mulai',
      cell: row => formatDate(row.seleksi_mulai),
    },
    {
      header: 'SELEKSI SELESAI',
      accessorKey: 'seleksi_selesai',
      cell: row => formatDate(row.seleksi_selesai),
    },
    {
      header: 'PENGUMUMAN',
      accessorKey: 'pengumuman_penerima',
      cell: row => formatDate(row.pengumuman_penerima),
    },
  ]

  const renderActions = item => (
    <>
      <Button
        size="sm"
        variant="default"
        className="h-8 bg-amber-500 hover:bg-amber-600"
        onClick={() => handleEditJadwal(item)}
      >
        Edit
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="h-8"
        onClick={() => handleDeleteJadwal(item.id)}
      >
        Hapus
      </Button>
    </>
  )

  return (
    <>
      {isLoading}

      <DataTable
        title="Jadwal Pendaftaran"
        description="Kelola jadwal pendaftaran tiap periode"
        data={jadwalData}
        columns={columns}
        searchKey="periodeId"
        searchPlaceholder="Cari Periode"
        addButtonText="Tambah Jadwal"
        addButtonAction={handleAddJadwal}
        renderActions={renderActions}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormProvider {...methods}>
          <FormField
            label="Periode"
            type="select"
            name="periodeId"
            options={periodeOptions}
            placeholder="Pilih Periode"
            error={errors.periodeId?.message}
            control={control}
            rules={{ required: 'Periode wajib dipilih' }}
          />
          <FormField
            label="Tanggal Pembukaan"
            type="date"
            name="pembukaan"
            {...register('pembukaan', { required: 'Wajib diisi' })}
          />
          <FormField
            label="Batas Akhir"
            type="date"
            name="batas_akhir"
            {...register('batas_akhir', { required: 'Wajib diisi' })}
          />
          <FormField
            label="Seleksi Mulai"
            type="date"
            name="seleksi_mulai"
            {...register('seleksi_mulai', { required: 'Wajib diisi' })}
          />
          <FormField
            label="Seleksi Selesai"
            type="date"
            name="seleksi_selesai"
            {...register('seleksi_selesai', { required: 'Wajib diisi' })}
          />
          <FormField
            label="Pengumuman Penerima"
            type="date"
            name="pengumuman_penerima"
            {...register('pengumuman_penerima', { required: 'Wajib diisi' })}
          />
        </FormProvider>
      </ModalForm>
    </>
  )
}
