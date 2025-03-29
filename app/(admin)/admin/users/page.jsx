'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DataTable from '@/components/ui/data-table'
import ModalForm from '@/components/ui/modal-form'
import FormField from '@/components/ui/form-field'
import ThreeLoading from '@/components/three-loading'

export default function UsersPage() {
  const [userData, setUserData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: 'ADMIN',
    },
  })

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const columns = [
    {
      header: 'USERNAME',
      accessorKey: 'username',
    },
    {
      header: 'EMAIL',
      accessorKey: 'email',
    },
    {
      header: 'ROLE',
      accessorKey: 'role',
      cell: row => {
        let badgeVariant = 'default'
        if (row.role === 'KEPALA_BIDANG') {
          badgeVariant = 'secondary'
        } else if (row.role === 'CALON_PENERIMA') {
          badgeVariant = 'outline'
        }
        return <Badge variant={badgeVariant}>{row.role}</Badge>
      },
    },
  ]

  const handleAddUser = () => {
    reset({
      username: '',
      email: '',
      password: '',
      role: 'ADMIN',
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditUser = user => {
    setValue('username', user.username)
    setValue('email', user.email)
    setValue('role', user.role)
    // Password tidak di-set karena opsional saat edit
    setEditingId(user.id)
    setIsModalOpen(true)
  }

  const handleDeleteUser = async id => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete user')

      setUserData(userData.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async data => {
    setIsLoading(true)

    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users'
      const method = editingId ? 'PUT' : 'POST'

      // Jika edit dan password kosong, hapus field password
      const payload = editingId && !data.password ? { ...data, password: undefined } : data

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(editingId ? 'Failed to update user' : 'Failed to create user')
      }

      const result = await response.json()

      if (editingId) {
        setUserData(userData.map(item => (item.id === editingId ? result : item)))
      } else {
        setUserData([...userData, result])
      }
      setIsModalOpen(false)
      reset()

    } catch (error) {
      console.error('Error submitting user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderActions = item => (
    <>
      <Button
        size="sm"
        variant="default"
        className="h-8 bg-amber-500 hover:bg-amber-600"
        onClick={() => handleEditUser(item)}
      >
        Edit
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="h-8"
        onClick={() => handleDeleteUser(item.id)}
      >
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
        title={editingId ? 'Edit User' : 'Tambah User Baru'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          label="Username"
          {...register('username', { required: 'Username wajib diisi' })}
          error={errors.username}
          placeholder="Masukkan username"
        />

        <FormField
          label="Email"
          type="email"
          {...register('email', {
            required: 'Email wajib diisi',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email tidak valid',
            },
          })}
          error={errors.email}
          placeholder="Masukkan email"
        />

        <FormField
          label={editingId ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
          type="password"
          {...register('password', {
            required: editingId ? false : 'Password wajib diisi',
            minLength: {
              value: 6,
              message: 'Password minimal 6 karakter',
            },
          })}
          error={errors.password}
          placeholder="Masukkan password"
        />

        <FormField
          label="Role"
          type="select"
          {...register('role', { required: 'Role wajib dipilih' })}
          error={errors.role}
          control={control}

          options={[
            { value: 'ADMIN', label: 'Admin' },
            { value: 'KEPALA_BIDANG', label: 'Kepala Bidang' },
            { value: 'CALON_PENERIMA', label: 'Calon Penerima' },
          ]}
        />
      </ModalForm>
    </>
  )
}
