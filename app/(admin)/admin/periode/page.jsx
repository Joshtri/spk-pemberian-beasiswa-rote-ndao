"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import ModalForm from "@/components/ui/modal-form"
import FormField from "@/components/ui/form-field"
import ThreeLoading from "@/components/three-loading"

export default function PeriodePage() {
  const [periodeData, setPeriodeData] = useState([
    { id: 1, nama: "2025", tanggalMulai: "1/1/2025", tanggalSelesai: "12/31/2025" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nama: "",
    tanggalMulai: "",
    tanggalSelesai: "",
  })
  const [editingId, setEditingId] = useState(null)

  const columns = [
    {
      header: "NO",
      accessorKey: "id",
      className: "w-16 text-center",
      cellClassName: "text-center font-medium",
    },
    {
      header: "NAMA PERIODE",
      accessorKey: "nama",
    },
    {
      header: "TANGGAL MULAI",
      accessorKey: "tanggalMulai",
    },
    {
      header: "TANGGAL SELESAI",
      accessorKey: "tanggalSelesai",
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddPeriode = () => {
    setFormData({
      nama: "",
      tanggalMulai: "",
      tanggalSelesai: "",
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditPeriode = (periode) => {
    setFormData({
      nama: periode.nama,
      tanggalMulai: periode.tanggalMulai,
      tanggalSelesai: periode.tanggalSelesai,
    })
    setEditingId(periode.id)
    setIsModalOpen(true)
  }

  const handleDeletePeriode = (id) => {
    // Show loading
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setPeriodeData(periodeData.filter((item) => item.id !== id))
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = () => {
    // Show loading
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (editingId) {
        // Update existing periode
        setPeriodeData(periodeData.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
      } else {
        // Add new periode
        const newId = Math.max(0, ...periodeData.map((item) => item.id)) + 1
        setPeriodeData([...periodeData, { id: newId, ...formData }])
      }

      setIsModalOpen(false)
      setIsLoading(false)
    }, 1500)
  }

  const renderActions = (item) => (
    <>
      <Button
        size="sm"
        variant="default"
        className="h-8 bg-amber-500 hover:bg-amber-600"
        onClick={() => handleEditPeriode(item)}
      >
        Edit
      </Button>
      <Button size="sm" variant="destructive" className="h-8" onClick={() => handleDeletePeriode(item.id)}>
        Hapus
      </Button>
    </>
  )

  return (
    <>
      {isLoading && <ThreeLoading text="Memproses data..." />}

      <DataTable
        title="Periode"
        description="Kelola periode penilaian rumah layak huni"
        data={periodeData}
        columns={columns}
        searchKey="nama"
        searchPlaceholder="Cari Periode"
        addButtonText="Tambah Periode"
        addButtonAction={handleAddPeriode}
        secondaryButtonText="View Alternatif"
        secondaryButtonAction={() => {}}
        renderActions={renderActions}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Periode" : "Tambah Periode Baru"}
        onSubmit={handleSubmit}
      >
        <FormField
          label="Nama Periode"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          placeholder="Contoh: 2025"
          required
        />

        <FormField
          label="Tanggal Mulai"
          type="date"
          name="tanggalMulai"
          value={formData.tanggalMulai}
          onChange={handleInputChange}
          placeholder="Pilih tanggal mulai"
          required
        />

        <FormField
          label="Tanggal Selesai"
          type="date"
          name="tanggalSelesai"
          value={formData.tanggalSelesai}
          onChange={handleInputChange}
          placeholder="Pilih tanggal selesai"
          required
        />
      </ModalForm>
    </>
  )
}

