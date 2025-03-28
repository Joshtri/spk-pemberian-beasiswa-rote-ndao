"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import ModalForm from "@/components/ui/modal-form"
import FormField from "@/components/ui/form-field"
import ThreeLoading from "@/components/three-loading"

export default function SubKriteriaPage() {
  const [subKriteriaData, setSubKriteriaData] = useState([
    { id: 1, kriteria: "Jenis Dinding", subKriteria: "Permanen (Full Tembok)", bobot: 1 },
    { id: 2, kriteria: "Jenis Dinding", subKriteria: "Semi Permanen (Setengah Tembok)", bobot: 2 },
    { id: 3, kriteria: "Jenis Dinding", subKriteria: "Tidak Permanen", bobot: 3 },
    { id: 4, kriteria: "Kondisi Dinding", subKriteria: "Baik", bobot: 1 },
    { id: 5, kriteria: "Kondisi Dinding", subKriteria: "Rusak Sedang", bobot: 2 },
    { id: 6, kriteria: "Kondisi Dinding", subKriteria: "Rusak", bobot: 3 },
    { id: 7, kriteria: "Jenis Atap", subKriteria: "Seng", bobot: 1 },
    { id: 8, kriteria: "Jenis Atap", subKriteria: "Genteng", bobot: 2 },
    { id: 9, kriteria: "Jenis Atap", subKriteria: "Alang-alang", bobot: 3 },
    { id: 10, kriteria: "Kondisi Atap", subKriteria: "Baik", bobot: 1 },
  ])

  const [kriteriaOptions, setKriteriaOptions] = useState([
    { value: "Jenis Dinding", label: "Jenis Dinding" },
    { value: "Kondisi Dinding", label: "Kondisi Dinding" },
    { value: "Jenis Atap", label: "Jenis Atap" },
    { value: "Kondisi Atap", label: "Kondisi Atap" },
    { value: "Jenis Lantai", label: "Jenis Lantai" },
    { value: "Kondisi Lantai", label: "Kondisi Lantai" },
    { value: "Kamar Mandi / Toilet", label: "Kamar Mandi / Toilet" },
    { value: "Pendapatan Keluarga", label: "Pendapatan Keluarga" },
    { value: "Jumlah Tanggungan", label: "Jumlah Tanggungan" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    kriteria: "",
    subKriteria: "",
    bobot: "",
  })
  const [editingId, setEditingId] = useState(null)

  const columns = [
    {
      header: "KRITERIA",
      accessorKey: "kriteria",
    },
    {
      header: "SUB KRITERIA",
      accessorKey: "subKriteria",
    },
    {
      header: "BOBOT",
      accessorKey: "bobot",
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubKriteria = () => {
    setFormData({
      kriteria: "",
      subKriteria: "",
      bobot: "",
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditSubKriteria = (subKriteria) => {
    setFormData({
      kriteria: subKriteria.kriteria,
      subKriteria: subKriteria.subKriteria,
      bobot: subKriteria.bobot.toString(),
    })
    setEditingId(subKriteria.id)
    setIsModalOpen(true)
  }

  const handleDeleteSubKriteria = (id) => {
    // Show loading
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSubKriteriaData(subKriteriaData.filter((item) => item.id !== id))
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = () => {
    // Show loading
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const processedData = {
        ...formData,
        bobot: Number.parseInt(formData.bobot, 10) || 0,
      }

      if (editingId) {
        // Update existing sub kriteria
        setSubKriteriaData(
          subKriteriaData.map((item) => (item.id === editingId ? { ...item, ...processedData } : item)),
        )
      } else {
        // Add new sub kriteria
        const newId = Math.max(0, ...subKriteriaData.map((item) => item.id)) + 1
        setSubKriteriaData([...subKriteriaData, { id: newId, ...processedData }])
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
        className="h-8 bg-blue-500 hover:bg-blue-600"
        onClick={() => handleEditSubKriteria(item)}
      >
        Edit
      </Button>
      <Button size="sm" variant="destructive" className="h-8" onClick={() => handleDeleteSubKriteria(item.id)}>
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
        searchKey="subKriteria"
        searchPlaceholder="Cari Sub Kriteria"
        addButtonText="Tambah Sub Kriteria"
        addButtonAction={handleAddSubKriteria}
        renderActions={renderActions}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Sub Kriteria" : "Tambah Sub Kriteria Baru"}
        onSubmit={handleSubmit}
      >
        <FormField
          label="Kriteria"
          type="select"
          name="kriteria"
          value={formData.kriteria}
          onChange={handleInputChange}
          options={kriteriaOptions}
          placeholder="Pilih kriteria"
          required
        />

        <FormField
          label="Sub Kriteria"
          name="subKriteria"
          value={formData.subKriteria}
          onChange={handleInputChange}
          placeholder="Masukkan sub kriteria"
          required
        />

        <FormField
          label="Bobot"
          type="number"
          name="bobot"
          value={formData.bobot}
          onChange={handleInputChange}
          placeholder="Masukkan bobot (angka)"
          min="1"
          max="10"
          required
        />
      </ModalForm>
    </>
  )
}

