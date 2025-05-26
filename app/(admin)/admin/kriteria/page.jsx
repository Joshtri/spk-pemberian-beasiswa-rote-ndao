'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DataTable from '@/components/ui/data-table'
import ModalForm from '@/components/ui/modal-form'
import FormField from '@/components/ui/form-field'
import ThreeLoading from '@/components/three-loading'
import api from '@/lib/axios'
import { toast } from 'sonner'
import SubkriteriaAddModal from '@/components/kriteria/SubKriteriaAddModal'
import SubkriteriaListModal from '@/components/kriteria/SubKriteriaListModal'

export default function KriteriaPage() {
  const [kriteriaData, setKriteriaData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)
  const [selectedKriteriaId, setSelectedKriteriaId] = useState(null)
  const [selectedKriteriaName, setSelectedKriteriaName] = useState('')
  const [isViewSubModalOpen, setIsViewSubModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nama_kriteria: '',
      bobot_kriteria: '',
      tipe_kriteria: 'BENEFIT',
      keterangan: '',
    },
  })

  useEffect(() => {
    fetchKriteria()
  }, [])

  const fetchKriteria = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/kriteria')
      setKriteriaData(res.data)
    } catch (err) {
      console.error('Gagal fetch kriteria:', err)
      toast.error('Gagal memuat data', {
        description: 'Terjadi kesalahan saat mengambil data kriteria.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddKriteria = () => {
    reset({
      nama_kriteria: '',
      bobot_kriteria: '',
      tipe_kriteria: 'BENEFIT',
      keterangan: '',
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditKriteria = kriteria => {
    reset({
      nama_kriteria: kriteria.nama_kriteria,
      bobot_kriteria: kriteria.bobot_kriteria,
      tipe_kriteria: kriteria.tipe_kriteria,
      keterangan: kriteria.keterangan || '',
    })
    setEditingId(kriteria.id)
    setIsModalOpen(true)
  }

  const handleDeleteKriteria = async id => {
    setIsLoading(true)
    try {
      await api.delete(`/kriteria/${id}`)
      await fetchKriteria()
      toast.success('Berhasil', {
        description: 'Kriteria berhasil dihapus',
      })
    } catch (err) {
      console.error('Gagal hapus:', err)
      toast.error('Gagal menghapus', {
        description: 'Terjadi kesalahan saat menghapus kriteria.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitRHF = async data => {
    setIsLoading(true)
    try {
      const payload = {
        ...data,
        bobot_kriteria: parseFloat(data.bobot_kriteria),
      }

      if (editingId) {
        await api.put(`/kriteria/${editingId}`, payload)
        toast.success('Berhasil', {
          description: 'Kriteria berhasil diperbarui',
        })
      } else {
        await api.post('/kriteria', payload)
        toast.success('Berhasil', {
          description: 'Kriteria baru berhasil ditambahkan',
        })
      }

      setIsModalOpen(false)
      await fetchKriteria()
    } catch (err) {
      console.error('Gagal simpan:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSubkriteria = (id, name) => {
    setSelectedKriteriaId(id)
    setSelectedKriteriaName(name)
    setIsSubModalOpen(true)
  }

  const handleViewSubkriteria = id => {
    setSelectedKriteriaId(id)
    setIsViewSubModalOpen(true)
  }

  const columns = [
    {
      header: 'No',
      accessorKey: 'id',
      className: 'w-16 text-center',
      cellClassName: 'text-center font-medium',
    },
    { header: 'Nama Kriteria', accessorKey: 'nama_kriteria' },
    { header: 'Bobot', accessorKey: 'bobot_kriteria' },
    {
      header: 'Tipe Kriteria',
      accessorKey: 'tipe_kriteria',
      cell: row => (
        <Badge variant={row.tipe_kriteria === 'BENEFIT' ? 'default' : 'secondary'}>
          {row.tipe_kriteria}
        </Badge>
      ),
    },
  ]

  const renderActions = item => (
    <>
      <Button
        size="sm"
        variant="default"
        className="h-8 bg-blue-500 hover:bg-blue-600"
        onClick={() => handleEditKriteria(item)}
      >
        Edit
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="h-8"
        onClick={() => handleDeleteKriteria(item.id)}
      >
        Hapus
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 bg-green-500 hover:bg-green-600 text-white border-0"
        onClick={() => handleAddSubkriteria(item.id, item.nama_kriteria)}
      >
        Tambah Subkriteria
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="h-8 bg-purple-500 hover:bg-purple-600 text-white border-0"
        onClick={() => handleViewSubkriteria(item.id)}
      >
        Lihat Subkriteria
      </Button>
    </>
  )

  return (
    <>
       <DataTable
        title="Kriteria"
        description="Kelola kriteria untuk penilaian rumah layak huni"
        data={kriteriaData}
        columns={columns}
        searchKey="nama_kriteria"
        searchPlaceholder="Cari Kriteria"
        addButtonText="Tambah Kriteria"
        addButtonAction={handleAddKriteria}
        renderActions={renderActions}
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}
        onSubmit={handleSubmit(onSubmitRHF)} // react-hook-form submit
      >
        <FormField
          label="Nama Kriteria"
          name="nama_kriteria"
          placeholder="Masukkan nama kriteria"
          error={errors.nama_kriteria?.message}
          {...register('nama_kriteria', { required: 'Nama wajib diisi' })}
        />

        <FormField
          label="Bobot"
          name="bobot_kriteria"
          type="number"
          step="any"
          placeholder="Contoh: 10"
          error={errors.bobot_kriteria?.message}
          {...register('bobot_kriteria', {
            required: 'Bobot wajib diisi',
            valueAsNumber: true,
          })}
        />

        <FormField
          label="Tipe Kriteria"
          type="select"
          name="tipe_kriteria"
          control={control}
          rules={{ required: 'Tipe wajib dipilih' }}
          options={[
            { value: 'BENEFIT', label: 'Benefit' },
            { value: 'COST', label: 'Cost' },
          ]}
          error={errors.tipe_kriteria?.message}
        />

        <FormField
          label="Keterangan"
          name="keterangan"
          placeholder="Opsional"
          error={errors.keterangan?.message}
          {...register('keterangan')}
        />
      </ModalForm>

      <SubkriteriaAddModal
        open={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        kriteriaId={selectedKriteriaId}
        kriteriaName={selectedKriteriaName}
        onSuccess={fetchKriteria}
      />

      <SubkriteriaListModal
        open={isViewSubModalOpen}
        onClose={() => setIsViewSubModalOpen(false)}
        kriteriaId={selectedKriteriaId}
      />
    </>
  )
}
