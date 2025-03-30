'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Bell,
  Search,
  Plus,
  Trash2,
  Send,
  Users,
  Calendar,
  Filter,
  MoreHorizontal,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import axios from '@/lib/axios'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function NotifikasiPage() {
  const router = useRouter()

  // State
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0,
  })

  // Form state
  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSending, setIsSending] = useState(false)

  // Fetch notifications on mount and when dependencies change
  useEffect(() => {
    fetchNotifications()
  }, [currentPage, itemsPerPage, activeTab, searchQuery])

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true)
    try {
      // Build query params
      const params = new URLSearchParams()
      params.append('page', currentPage)
      params.append('limit', itemsPerPage)

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (activeTab !== 'all') {
        params.append('filter', activeTab)
      }

      const response = await axios.get(`/admin/notification?${params.toString()}`)

      setNotifications(response.data.data || [])
      setTotalPages(response.data.totalPages || 1)
      setTotalItems(response.data.totalItems || 0)

      // Update stats
      setStats({
        total: response.data.stats?.total || 0,
        unread: response.data.stats?.unread || 0,
        today: response.data.stats?.today || 0,
      })
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Gagal memuat data notifikasi')
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = e => {
    e.preventDefault()
    setCurrentPage(1)
    fetchNotifications()
  }

  // Handle tab change
  const handleTabChange = value => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  // Handle form input change
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    if (!formData.judul.trim()) {
      errors.judul = 'Judul notifikasi harus diisi'
    }

    if (!formData.isi.trim()) {
      errors.isi = 'Isi notifikasi harus diisi'
    } else if (formData.isi.length < 10) {
      errors.isi = 'Isi notifikasi minimal 10 karakter'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle create notification
  const handleCreateNotification = async () => {
    if (!validateForm()) return

    setIsSending(true)
    try {
      await axios.post('/admin/notification', {
        judul: formData.judul,
        isi: formData.isi,
        role: 'CALON_PENERIMA', // Send to all users with CALON_PENERIMA role
      })

      toast.success('Notifikasi berhasil dikirim')
      setCreateDialogOpen(false)
      setFormData({ judul: '', isi: '' })
      fetchNotifications()
    } catch (error) {
      console.error('Error creating notification:', error)
      toast.error('Gagal mengirim notifikasi')
    } finally {
      setIsSending(false)
    }
  }

  // Handle delete notification
  const handleDeleteNotification = async () => {
    if (!selectedNotification) return

    try {
      await axios.delete(`/admin/notification/${selectedNotification.id}`)

      toast.success('Notifikasi berhasil dihapus')
      setDeleteDialogOpen(false)
      setSelectedNotification(null)
      fetchNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Gagal menghapus notifikasi')
    }
  }

  // Show delete dialog
  const showDeleteDialog = notification => {
    setSelectedNotification(notification)
    setDeleteDialogOpen(true)
  }

  // Render skeleton loader
  const renderSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Stats cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notifikasi</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Semua notifikasi yang telah dikirim</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Dibaca</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unread}</div>
              <p className="text-xs text-muted-foreground">
                Notifikasi yang belum dibaca oleh pengguna
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">Notifikasi yang dikirim hari ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Penerima</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Calon Penerima</div>
              <p className="text-xs text-muted-foreground">Target penerima notifikasi</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold">Manajemen Notifikasi</CardTitle>
                  <CardDescription>
                    Kelola dan kirim notifikasi ke calon penerima beasiswa
                  </CardDescription>
                </div>

                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Kirim Notifikasi
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Search and filter */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Cari notifikasi..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button type="submit">Cari</Button>
                  </form>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={fetchNotifications}
                      title="Refresh"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                          <Filter className="mr-2 h-4 w-4" />
                          <span>Filter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter Notifikasi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleTabChange('all')}>
                          Semua Notifikasi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTabChange('unread')}>
                          Belum Dibaca
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTabChange('today')}>
                          Hari Ini
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
                  <TabsList>
                    <TabsTrigger value="all">Semua</TabsTrigger>
                    <TabsTrigger value="unread">Belum Dibaca</TabsTrigger>
                    <TabsTrigger value="today">Hari Ini</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Notifications table */}
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">No</TableHead>
                          <TableHead>Judul</TableHead>
                          <TableHead className="hidden md:table-cell">Isi</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              {renderSkeleton()}
                            </TableCell>
                          </TableRow>
                        ) : notifications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              Tidak ada data notifikasi
                            </TableCell>
                          </TableRow>
                        ) : (
                          notifications.map((notification, index) => (
                            <TableRow key={notification.id}>
                              <TableCell className="font-medium">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{notification.judul}</div>
                                <div className="text-sm text-muted-foreground md:hidden">
                                  {notification.isi.length > 50
                                    ? `${notification.isi.substring(0, 50)}...`
                                    : notification.isi}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {notification.isi.length > 100
                                  ? `${notification.isi.substring(0, 100)}...`
                                  : notification.isi}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge
                                  variant={notification.dibaca ? 'default' : 'outline'}
                                  className={
                                    notification.dibaca
                                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                      : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                  }
                                >
                                  {notification.dibaca ? 'Dibaca' : 'Belum Dibaca'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {format(new Date(notification.createdAt), 'dd MMM yyyy', {
                                  locale: id,
                                })}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => showDeleteDialog(notification)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Hapus
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                {!loading && notifications.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Menampilkan {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems}{' '}
                      notifikasi
                    </div>

                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1

                          // Show first page, last page, and pages around current page
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  isActive={page === currentPage}
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          }

                          // Show ellipsis
                          if (
                            (page === 2 && currentPage > 3) ||
                            (page === totalPages - 1 && currentPage < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )
                          }

                          return null
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Create Notification Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kirim Notifikasi</DialogTitle>
            <DialogDescription>Kirim notifikasi ke semua calon penerima beasiswa</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="judul" className="text-sm font-medium">
                Judul Notifikasi
              </label>
              <Input
                id="judul"
                name="judul"
                placeholder="Masukkan judul notifikasi"
                value={formData.judul}
                onChange={handleInputChange}
                className={formErrors.judul ? 'border-red-500' : ''}
              />
              {formErrors.judul && <p className="text-sm text-red-500">{formErrors.judul}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="isi" className="text-sm font-medium">
                Isi Notifikasi
              </label>
              <Textarea
                id="isi"
                name="isi"
                placeholder="Masukkan isi notifikasi"
                value={formData.isi}
                onChange={handleInputChange}
                className={formErrors.isi ? 'border-red-500' : ''}
                rows={5}
              />
              {formErrors.isi && <p className="text-sm text-red-500">{formErrors.isi}</p>}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Informasi</AlertTitle>
              <AlertDescription>
                Notifikasi akan dikirim ke semua pengguna dengan role Calon Penerima.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateNotification} disabled={isSending}>
              {isSending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Notifikasi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Notification Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Notifikasi</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus notifikasi ini?</DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="py-4">
              <div className="font-medium">{selectedNotification.judul}</div>
              <p className="text-sm text-muted-foreground mt-1">{selectedNotification.isi}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Dikirim pada:{' '}
                {format(new Date(selectedNotification.createdAt), 'dd MMMM yyyy, HH:mm', {
                  locale: id,
                })}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteNotification}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
