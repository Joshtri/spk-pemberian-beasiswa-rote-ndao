'use client'

// ✅ Import dari React dan RHF
import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/ui/data-table'
import ModalForm from '@/components/ui/modal-form'
import FormField from '@/components/ui/form-field'
import ThreeLoading from '@/components/three-loading'
import api from '@/lib/axios'
import { formatDate } from '@/utils/formatDate'
import { toast } from 'sonner'
import { CheckIcon, XIcon } from 'lucide-react'
import { Tooltip } from '@/components/ui/tooltip'
export default function PeriodePage() {
  const [periodeData, setPeriodeData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const methods = useForm({
    defaultValues: {
      nama_periode: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods

  useEffect(() => {
    fetchPeriode()
  }, [])

  const fetchPeriode = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/periode')
      setPeriodeData(res.data)
    } catch (err) {
      console.error('Gagal fetch periode:', err)
      toast.error('Gagal memuat data', {
        description: 'Terjadi kesalahan saat mengambil data periode.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPeriode = () => {
    reset()
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditPeriode = periode => {
    reset({
      nama_periode: periode.nama_periode,
      tanggal_mulai: periode.tanggal_mulai?.slice(0, 10),
      tanggal_selesai: periode.tanggal_selesai?.slice(0, 10),
    })
    setEditingId(periode.id)
    setIsModalOpen(true)
  }

  const handleDeletePeriode = async id => {
    setIsLoading(true)
    try {
      await api.delete(`/periode/${id}`)
      toast.success('Periode berhasil dihapus', {
        description: 'Data periode berhasil dihapus.',
      })
      fetchPeriode()
    } catch (err) {
      console.error('Gagal hapus periode:', err)
      toast.error('Gagal menghapus periode', {
        description: 'Terjadi kesalahan saat menghapus periode.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (id, currentState) => {
    setIsLoading(true)
    try {
      if (currentState) {
        // Jika sedang aktif, nonaktifkan
        await api.put(`/periode/${id}`, { isActived: false })
        toast.success('Periode dinonaktifkan', {
          description: 'Periode ini berhasil dinonaktifkan.',
        })
      } else {
        // Jika belum aktif, coba aktifkan
        await api.put(`/periode/${id}/activate`)
        toast.success('Periode diaktifkan', {
          description: 'Periode ini sekarang menjadi aktif.',
        })
      }

      fetchPeriode()
    } catch (err) {
      console.error('Gagal toggle aktif:', err)

      // Tangani error dari server yang menyebut sudah ada periode aktif
      const message = err.response?.data?.message || 'Terjadi kesalahan saat toggle periode.'

      toast.error('Gagal mengubah status periode', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async data => {
    setIsLoading(true)
    try {
      if (editingId) {
        await api.put(`/periode/${editingId}`, data)
        toast.success('Periode berhasil diperbarui', {
          description: 'Data periode berhasil diperbarui.',
        })
      } else {
        await api.post('/periode', data)
        toast.success('Periode berhasil ditambahkan', {
          description: 'Data periode berhasil ditambahkan.',
        })
      }

      reset() // ✅ Reset form setelah simpan
      setIsModalOpen(false)
      fetchPeriode()
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
    { header: 'NAMA PERIODE', accessorKey: 'nama_periode' },
    {
      header: 'TANGGAL MULAI',
      accessorKey: 'tanggal_mulai',
      cell: row => formatDate(row.tanggal_mulai),
    },
    {
      header: 'TANGGAL SELESAI',
      accessorKey: 'tanggal_selesai',
      cell: row => formatDate(row.tanggal_selesai),
    },

    {
      header: 'STATUS',
      accessorKey: 'isActived',
      cell: row => (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            row.isActived ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {row.isActived ? 'Aktif' : 'Tidak Aktif'}
        </span>
      ),
    },
    {
      header: 'KETERANGAN',
      accessorKey: 'JadwalPendaftaran',
      cell: row => {
        if (!row.JadwalPendaftaran) {
          return <span className="text-[11px] text-yellow-600">⚠️ Belum ada jadwal</span>
        }

        return <span className="text-[11px] text-green-600">✅ Sudah ada jadwal</span>
      },
    },
  ]

  const renderActions = item => (
    <>
      <Button
        size="sm"
        variant="default"
        className="h-8 bg-amber-500 hover:bg-amber-600"
        onClick={() => handleEditPeriode(item)}
      >
        Edit
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="h-8"
        onClick={() => handleDeletePeriode(item.id)}
      >
        Hapus
      </Button>

      <Tooltip content={item.isActived ? 'Nonaktifkan Periode' : 'Aktifkan Periode'}>
        <Button
          size="icon"
          variant={item.isActived ? 'default' : 'outline'}
          className={`h-8 w-8 ${item.isActived ? 'bg-green-600 hover:bg-green-700' : 'border-green-500 text-green-600 hover:bg-green-50'}`}
          onClick={() => handleToggleActive(item.id, item.isActived)}
        >
          {item.isActived ? (
            <CheckIcon className="h-4 w-4 text-white" />
          ) : (
            <XIcon className="h-4 w-4" />
          )}
        </Button>
      </Tooltip>
    </>
  )

  return (
    <>
      {isLoading}

      <DataTable
        title="Periode"
        description="Kelola periode penilaian rumah layak huni"
        data={periodeData}
        columns={columns}
        searchKey="nama"
        searchPlaceholder="Cari Periode"
        addButtonText="Tambah Periode"
        addButtonAction={handleAddPeriode}
        renderActions={renderActions}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Periode' : 'Tambah Periode Baru'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormProvider {...methods}>
          <FormField
            label="Nama Periode"
            name="nama_periode"
            placeholder="Contoh: 2025"
            error={errors.nama_periode?.message}
            {...register('nama_periode', { required: 'Nama periode wajib diisi' })}
          />
          <FormField
            label="Tanggal Mulai"
            type="date"
            name="tanggal_mulai"
            placeholder="Pilih tanggal mulai"
            error={errors.tanggal_mulai?.message}
            {...register('tanggal_mulai', { required: 'Tanggal mulai wajib diisi' })}
          />
          <FormField
            label="Tanggal Selesai"
            type="date"
            name="tanggal_selesai"
            placeholder="Pilih tanggal selesai"
            error={errors.tanggal_selesai?.message}
            {...register('tanggal_selesai', { required: 'Tanggal selesai wajib diisi' })}
          />
        </FormProvider>
      </ModalForm>
    </>
  )
}
