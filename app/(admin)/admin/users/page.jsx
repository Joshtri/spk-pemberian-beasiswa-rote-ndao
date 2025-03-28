"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/data-table"
import ModalForm from "@/components/ui/modal-form"
import FormField from "@/components/ui/form-field"
import ThreeLoading from "@/components/three-loading"

export default function UsersPage() {
  const [userData, setUserData] = useState([
    { id: 1, username: "samuel", email: "samuel@gmail.com", role: "ADMIN" },
    { id: 2, username: "perangkat_desa", email: "perangkatdesa@gmail.com", role: "PERANGKAT_DESA" },
    { id: 3, username: "kepala_desa", email: "kepaladesa@gmail.com", role: "KEPALA_DESA" },
    { id: 4, username: "admin@gmail.com", email: "admin@gmail.com", role: "ADMIN" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "ADMIN",
  })
  const [editingId, setEditingId] = useState(null)

  const columns = [
    {
      header: "USERNAME",
      accessorKey: "username",
    },
    {
      header: "EMAIL",
      accessorKey: "email",
    },
    {
      header: "ROLE",
      accessorKey: "role",
      cell: (row) => {
        let badgeVariant = "default"

        if (row.role === "PERANGKAT_DESA") {
          badgeVariant = "secondary"
        } else if (row.role === "KEPALA_DESA") {
          badgeVariant = "outline"
        }

        return <Badge variant={badgeVariant}>{row.role}</Badge>
      },
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddUser = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "ADMIN",
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    })
    setEditingId(user.id)
    setIsModalOpen(true)
  }

  const handleDeleteUser = (id) => {
    // Show loading
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setUserData(userData.filter((item) => item.id !== id))
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = () => {
    // Show loading
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (editingId) {
        // Update existing user
        setUserData(
          userData.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  username: formData.username,
                  email: formData.email,
                  role: formData.role,
                  // Only update password if provided
                  ...(formData.password ? { password: formData.password } : {}),
                }
              : item,
          ),
        )
      } else {
        // Add new user
        const newId = Math.max(0, ...userData.map((item) => item.id)) + 1
        setUserData([...userData, { id: newId, ...formData }])
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
        onClick={() => handleEditUser(item)}
      >
        Edit
      </Button>
      <Button size="sm" variant="destructive" className="h-8" onClick={() => handleDeleteUser(item.id)}>
        Hapus
      </Button>
    </>
  )

  return (
    <>
      {isLoading && <ThreeLoading text="Memproses data..." />}

      <DataTable
        title="Users Management"
        description="Kelola pengguna sistem SPK Penentuan Rumah Layak Huni"
        data={userData}
        columns={columns}
        searchKey="username"
        searchPlaceholder="Cari User"
        addButtonText="Tambah User"
        addButtonAction={handleAddUser}
        renderActions={renderActions}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit User" : "Tambah User Baru"}
        onSubmit={handleSubmit}
      >
        <FormField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Masukkan username"
          required
        />

        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Masukkan email"
          required
        />

        <FormField
          label={editingId ? "Password (kosongkan jika tidak diubah)" : "Password"}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Masukkan password"
          required={!editingId}
        />

        <FormField
          label="Role"
          type="select"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          options={[
            { value: "ADMIN", label: "Admin" },
            { value: "PERANGKAT_DESA", label: "Perangkat Desa" },
            { value: "KEPALA_DESA", label: "Kepala Desa" },
          ]}
          required
        />
      </ModalForm>
    </>
  )
}

