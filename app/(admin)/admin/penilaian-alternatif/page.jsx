'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { FileText, Download, Eye } from 'lucide-react'
import ThreeLoading from '@/components/three-loading'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import SkeletonTable from '@/components/ui/skeleton-table'

export default function PenilaianPage() {
  const [penilaianData, setPenilaianData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [periodes, setPeriodes] = useState([])
  const [selectedPeriode, setSelectedPeriode] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  })

  // Group penilaian by calon penerima
  const [groupedData, setGroupedData] = useState([])
  // Store all unique kriteria for columns
  const [kriteriaColumns, setKriteriaColumns] = useState([])

  useEffect(() => {
    fetchPenilaian()
    fetchPeriodes()
  }, [page, limit, selectedPeriode])

  const fetchPeriodes = async () => {
    try {
      const res = await api.get('/periode')
      setPeriodes(res.data)
    } catch (err) {
      console.error('Gagal fetch periode:', err)
    }
  }

  const fetchPenilaian = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      if (selectedPeriode) {
        params.append('periodeId', selectedPeriode)
      }

      const res = await api.get(`/penilaian/admin/list`)

      if (res.data.success) {
        setPenilaianData(res.data.data)
        setPagination(res.data.pagination)

        // Process data for table display
        processDataForTable(res.data.data)
      }
    } catch (err) {
      console.error('Gagal fetch penilaian:', err)
      toast.error('Gagal memuat data', {
        description: 'Terjadi kesalahan saat mengambil data penilaian.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const processDataForTable = data => {
    // Extract all unique kriteria for columns
    const allKriteria = [...new Set(data.map(item => item.kriteria.nama_kriteria))]
      .map(nama => {
        const kriteria = data.find(item => item.kriteria.nama_kriteria === nama).kriteria
        return {
          id: kriteria.id,
          nama: nama,
          bobot: kriteria.bobot_kriteria,
          tipe: kriteria.tipe_kriteria,
        }
      })
      .sort((a, b) => b.bobot - a.bobot) // Sort by bobot (weight)

    setKriteriaColumns(allKriteria)

    // Group by calon penerima
    const grouped = {}

    data.forEach(item => {
      const calonId = item.calonPenerimaId

      if (!grouped[calonId]) {
        grouped[calonId] = {
          calonPenerima: item.calonPenerima,
          periode: item.periode,
          penilaian: {},
          dokumen: [],
          verifikasiStatus: item.verifikasiStatus,
        }
      }

      // Add penilaian data
      grouped[calonId].penilaian[item.kriteria.nama_kriteria] = {
        subKriteria: item.subKriteria.nama_sub_kriteria,
        bobot: item.subKriteria.bobot_sub_kriteria,
        kriteriaId: item.kriteriaId,
        subKriteriaId: item.sub_kriteriaId,
        penilaianId: item.id,
      }

      // Add dokumen if any
      if (item.dokumen && item.dokumen.length > 0) {
        item.dokumen.forEach(doc => {
          if (!grouped[calonId].dokumen.some(d => d.id === doc.id)) {
            grouped[calonId].dokumen.push(doc)
          }
        })
      }
    })

    // Convert to array
    const groupedArray = Object.values(grouped)
    setGroupedData(groupedArray)
  }

  const handlePeriodeChange = value => {
    setSelectedPeriode(value)
    setPage(1) // Reset to first page
  }

  const handleSearch = e => {
    setSearchTerm(e.target.value)
    // Implement search logic here
  }

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const filteredData = groupedData.filter(item =>
    item.calonPenerima.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderDokumenBadge = dokumen => {
    if (!dokumen || dokumen.length === 0) return null

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {dokumen.map(doc => (
          <Badge key={doc.id} variant="outline" className="text-xs">
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              {doc.tipe_dokumen}
            </a>
          </Badge>
        ))}
      </div>
    )
  }

  const handleToggleStatus = async (calonPenerimaId, currentStatus) => {
    const newStatus = currentStatus === 'DITERIMA' ? 'DITOLAK' : 'DITERIMA'

    try {
      await api.patch('/penilaian/admin/verifikasi-status', {
        calonPenerimaId,
        verifikasiStatus: newStatus,
      })

      toast.success('Status verifikasi diperbarui')

      // Refresh data
      fetchPenilaian()
    } catch (error) {
      console.error('❌ Gagal mengubah status verifikasi:', error)
      toast.error('Gagal mengubah status verifikasi')
    }
  }

  return (
    <>
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Data Penilaian</CardTitle>
                <CardDescription>Daftar penilaian calon penerima beasiswa</CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="flex-1">
                  <Select value={selectedPeriode} onValueChange={handlePeriodeChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Pilih Periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Periode</SelectItem>
                      {periodes.map(periode => (
                        <SelectItem key={periode.id} value={periode.id}>
                          {periode.nama_periode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Input
                    placeholder="Cari nama calon..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full"
                  />
                </div>

                <Button variant="outline" className="flex-shrink-0">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-4">
                    <SkeletonTable
                      rows={limit}
                      cols={kriteriaColumns.length + 3} // Nama calon + kriteria + verifikasi + aksi
                    />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px] text-center">No</TableHead>
                        <TableHead className="min-w-[200px]">Nama Calon</TableHead>
                        {kriteriaColumns.map(kriteria => (
                          <TableHead key={kriteria.id} className="min-w-[150px]">
                            <div className="flex flex-col">
                              <span>{kriteria.nama}</span>
                              <span className="text-xs text-muted-foreground">
                                Bobot: {kriteria.bobot}
                                {kriteria.tipe === 'BENEFIT' ? (
                                  <Badge variant="default" className="ml-1 text-[10px]">
                                    Benefit
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="ml-1 text-[10px]">
                                    Cost
                                  </Badge>
                                )}
                              </span>
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className="w-[50px] text-center">Verifikasi</TableHead>
                        <TableHead className="w-[100px] text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                          <TableRow key={item.calonPenerima.id}>
                            <TableCell className="text-center font-medium">
                              {(page - 1) * limit + index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{item.calonPenerima.nama_lengkap}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.calonPenerima.perguruan_Tinggi}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.calonPenerima.fakultas_prodi}
                              </div>
                            </TableCell>

                            {kriteriaColumns.map(kriteria => (
                              <TableCell key={kriteria.id}>
                                {item.penilaian[kriteria.nama] ? (
                                  <>
                                    <div className="font-medium">
                                      {item.penilaian[kriteria.nama].subKriteria}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Bobot: {item.penilaian[kriteria.nama].bobot}
                                    </div>

                                    {/* Dokumen hanya di kolom pertama */}
                                    {kriteria.id === kriteriaColumns[0].id &&
                                      item.dokumen.length > 0 &&
                                      renderDokumenBadge(item.dokumen)}
                                  </>
                                ) : (
                                  <span className="text-muted-foreground text-sm">-</span>
                                )}
                              </TableCell>
                            ))}

                            <TableCell className="text-center capitalize">
                              <div className="flex flex-col items-center gap-1">
                                <Switch
                                  checked={item.verifikasiStatus === 'DITERIMA'}
                                  onCheckedChange={() =>
                                    handleToggleStatus(item.calonPenerima.id, item.verifikasiStatus)
                                  }
                                />
                                <span className="text-xs text-muted-foreground capitalize">
                                  {item.verifikasiStatus}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={kriteriaColumns.length + 3}
                            className="text-center py-8"
                          >
                            Tidak ada data penilaian
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, pagination.total)}{' '}
                  dari {pagination.total} data
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Sebelumnya
                  </Button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - page) < 2 || p === 1 || p === pagination.totalPages)
                    .map((p, i, arr) => {
                      // Add ellipsis
                      if (i > 0 && p > arr[i - 1] + 1) {
                        return (
                          <span key={`ellipsis-${p}`} className="flex items-center px-2">
                            ...
                          </span>
                        )
                      }

                      return (
                        <Button
                          key={p}
                          variant={p === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </Button>
                      )
                    })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
