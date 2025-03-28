"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/data-table"
import ModalForm from "@/components/ui/modal-form"
import FormField from "@/components/ui/form-field"
import ThreeLoading from "@/components/three-loading"

export default function KriteriaPage() {
  const [kriteriaData, setKriteriaData] = useState([
    { id: 1, nama: "Jenis Dinding", bobot: "10%", tipe: "Benefit" },
    { id: 2, nama: "Kondisi Dinding", bobot: "10%", tipe: "Benefit" },
    { id: 3, nama: "Jenis Atap", bobot: "10%", tipe: "Benefit" },
    { id: 4, nama: "Kondisi Atap", bobot: "10%", tipe: "Benefit" },
    { id: 5, nama: "Jenis Lantai", bobot: "10%", tipe: "Benefit" },
    { id: 6, nama: "Kondisi Lantai", bobot: "10%", tipe: "Benefit" },
    { id: 7, nama: "Kamar Mandi / Toilet", bobot: "10%", tipe: "Benefit" },
    { id: 8, nama: "Pendapatan Keluarga", bobot: "15%", tipe: "Cost" },
    { id: 9, nama: "Jumlah Tanggungan", bobot: "15%", tipe: "Benefit" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nama: "",
    bobot: "",
    tipe: "Benefit",
  })
  const [editingId, setEditingId] = useState(null)

  const columns = [
    {
      header: "No",
      accessorKey: "id",
      className: "w-16 text-center",
      cellClassName: "text-center font-medium",
    },
    {
      header: "Nama Kriteria",
      accessorKey: "nama",
    },
    {
      header: "Bobot",
      accessorKey: "bobot",
    },
    {
      header: "Tipe Kriteria",
      accessorKey: "tipe",
      cell: (row) => <Badge variant={row.tipe === "Benefit" ? "default" : "secondary"}>{row.tipe}</Badge>,
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddKriteria = () => {
    setFormData({
      nama: "",
      bobot: "",
      tipe: "Benefit",
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditKriteria = (kriteria) => {
    setFormData({
      nama: kriteria.nama,
      bobot: kriteria.bobot,
      tipe: kriteria.tipe,
    })
    setEditingId(kriteria.id)
    setIsModalOpen(true)
  }

  const handleDeleteKriteria = (id) => {
    // Show loading
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setKriteriaData(kriteriaData.filter((item) => item.id !== id))
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = () => {
    // Show loading
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (editingId) {
        // Update existing kriteria
        setKriteriaData(kriteriaData.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
      } else {
        // Add new kriteria
        const newId = Math.max(0, ...kriteriaData.map((item) => item.id)) + 1
        setKriteriaData([...kriteriaData, { id: newId, ...formData }])
      }

      setIsModalOpen(false)
      setIsLoading(false)
    }, 1500)
  }

  const handleAddSubkriteria = (id) => {
    // Navigate to subkriteria page or open modal for adding subkriteria
    console.log(`Add subkriteria for kriteria ID: ${id}`)
  }

  const handleViewSubkriteria = (id) => {
    // Navigate to subkriteria page filtered by kriteria ID
    console.log(`View subkriteria for kriteria ID: ${id}`)
  }

  const renderActions = (item) => (
    <>
      <Button
        size="sm"
        variant="default"
        className="h-8 bg-blue-500 hover:bg-blue-600"
        onClick={() => handleEditKriteria(item)}
      >
        Edit
      </Button>
      <Button size="sm" variant="destructive" className="h-8" onClick={() => handleDeleteKriteria(item.id)}>
        Hapus
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 bg-green-500 hover:bg-green-600 text-white border-0"
        onClick={() => handleAddSubkriteria(item.id)}
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
      {isLoading && <ThreeLoading text="Memproses data..." />}

      <DataTable
        title="Kriteria"
        description="Kelola kriteria untuk penilaian rumah layak huni"
        data={kriteriaData}
        columns={columns}
        searchKey="nama"
        searchPlaceholder="Cari Kriteria"
        addButtonText="Tambah Kriteria"
        addButtonAction={handleAddKriteria}
        secondaryButtonText="View Subkriteria"
        secondaryButtonAction={() => {}}
        renderActions={renderActions}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Kriteria" : "Tambah Kriteria Baru"}
        onSubmit={handleSubmit}
      >
        <FormField
          label="Nama Kriteria"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          placeholder="Masukkan nama kriteria"
          required
        />

        <FormField
          label="Bobot"
          name="bobot"
          value={formData.bobot}
          onChange={handleInputChange}
          placeholder="Contoh: 10%"
          required
        />

        <FormField
          label="Tipe Kriteria"
          type="select"
          name="tipe"
          value={formData.tipe}
          onChange={handleInputChange}
          options={[
            { value: "Benefit", label: "Benefit" },
            { value: "Cost", label: "Cost" },
          ]}
          required
        />
      </ModalForm>
    </>
  )
}

