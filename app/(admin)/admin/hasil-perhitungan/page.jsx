"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Search,
  FileDown,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Check,
  X,
  Trophy,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useReactToPrint } from "react-to-print"
import axios from "@/lib/axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function HasilPerhitunganPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const printRef = useRef(null)

  // State
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [periods, setPeriods] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: "rangking", direction: "asc" })
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [periodName, setPeriodName] = useState("")
  const [isDisplayed, setIsDisplayed] = useState(false)
  const [isTogglingDisplay, setIsTogglingDisplay] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [displayAction, setDisplayAction] = useState(null)

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchPeriods()

    // Check if period is in URL
    const periodFromUrl = searchParams.get("period")
    if (periodFromUrl) {
      setSelectedPeriod(periodFromUrl)
    }
  }, [searchParams])

  // Fetch results when period changes
  useEffect(() => {
    if (selectedPeriod) {
      fetchResults()
    } else {
      setResults([])
      setLoading(false)
    }
  }, [selectedPeriod, currentPage, itemsPerPage, sortConfig])

  // Fetch periods
  const fetchPeriods = async () => {
    try {
      const response = await axios.get("/periode")
      setPeriods(response.data)
    } catch (error) {
      console.error("Error fetching periods:", error)
      toast.error("Gagal memuat data periode")
    }
  }

  // Fetch results
  const fetchResults = async () => {
    setLoading(true)
    try {
      // Build query params
      const params = new URLSearchParams()
      params.append("page", currentPage)
      params.append("limit", itemsPerPage)
      params.append("sort", sortConfig.key)
      params.append("order", sortConfig.direction)

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      const response = await axios.get(`/hasil-perhitungan/${selectedPeriod}?${params.toString()}`)

      setResults(response.data.data || [])
      setTotalPages(response.data.totalPages || 1)
      setTotalItems(response.data.totalItems || 0)

      // Get period name
      if (response.data.data && response.data.data.length > 0) {
        const periodData = periods.find((p) => p.id === selectedPeriod)
        setPeriodName(periodData?.nama_periode || "")

        // Check if results are displayed to users
        if (response.data.data.length > 0) {
          setIsDisplayed(response.data.data[0].ditampilkanKeUser || false)
        }
      }
    } catch (error) {
      console.error("Error fetching results:", error)
      toast.error("Gagal memuat data hasil perhitungan")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Handle period change
  const handlePeriodChange = (value) => {
    setSelectedPeriod(value)
    setCurrentPage(1)

    // Update URL
    const params = new URLSearchParams(searchParams)
    params.set("period", value)
    router.push(`?${params.toString()}`)
  }

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    fetchResults()
  }

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Handle print
  const handlePrint = useReactToPrint({
    content: useCallback(() => printRef.current, []),
    documentTitle: `Hasil Perhitungan Beasiswa - ${periodName}`,
    onAfterPrint: () => toast.success("Dokumen berhasil dicetak"),
  })

  // Handle export to PDF
  const handleExportPDF = async () => {
    if (!selectedPeriod || selectedPeriod === "default") {
      toast.error("Pilih periode terlebih dahulu!")
      return
    }

    try {
      toast.loading("Mengunduh PDF...")

      const response = await axios.get(`/hasil-perhitungan/${selectedPeriod}/export`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `Hasil-Perhitungan-${periodName}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.dismiss()
      toast.success("PDF berhasil diunduh")
    } catch (error) {
      console.error("❌ Gagal mengunduh PDF:", error)
      toast.dismiss()
      toast.error("Gagal mengunduh PDF")
    }
  }

  // Show detail dialog
  const showDetailDialog = (result) => {
    setSelectedResult(result)
    setDetailDialogOpen(true)
  }

  // Toggle display confirmation
  const confirmToggleDisplay = (action) => {
    if (!selectedPeriod) {
      toast.error("Pilih periode terlebih dahulu!")
      return
    }

    setDisplayAction(action)
    setConfirmDialogOpen(true)
  }

  // Toggle display to users
  const toggleDisplayToUsers = async () => {
    if (!selectedPeriod || !displayAction) return

    setIsTogglingDisplay(true)
    try {
      const response = await axios.patch("/hasil-perhitungan/toggle-display", {
        periodeId: selectedPeriod,
        tampilkan: displayAction === "show",
      })

      setIsDisplayed(displayAction === "show")
      toast.success(response.data.message || "Status tampilan berhasil diperbarui")
      fetchResults() // Refresh data
    } catch (error) {
      console.error("Error toggling display:", error)
      toast.error("Gagal memperbarui status tampilan")
    } finally {
      setIsTogglingDisplay(false)
      setConfirmDialogOpen(false)
      setDisplayAction(null)
    }
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">Hasil Perhitungan</CardTitle>
                <CardDescription>Daftar hasil perhitungan penerima beasiswa</CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.nama_periode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <FileDown className="mr-2 h-4 w-4" />
                      <span>Export</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportPDF} disabled={!selectedPeriod || results.length === 0}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Export PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePrint} disabled={!selectedPeriod || results.length === 0}>
                      <Printer className="mr-2 h-4 w-4" />
                      <span>Print</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Search and visibility controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari nama calon penerima..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={!selectedPeriod}>
                  Cari
                </Button>
              </form>

              {selectedPeriod && results.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isDisplayed ? "success" : "outline"}
                    className={
                      isDisplayed
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {isDisplayed ? (
                      <>
                        <Eye className="mr-1 h-3 w-3" />
                        Ditampilkan ke User
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-1 h-3 w-3" />
                        Disembunyikan
                      </>
                    )}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmToggleDisplay(isDisplayed ? "hide" : "show")}
                  >
                    {isDisplayed ? (
                      <>
                        <EyeOff className="mr-1 h-4 w-4" />
                        Sembunyikan
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1 h-4 w-4" />
                        Tampilkan
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Period info */}
            {selectedPeriod && periodName && (
              <div className="mb-4">
                <Badge variant="outline" className="text-sm font-normal">
                  Periode: {periodName}
                </Badge>
              </div>
            )}

            {/* No period selected message */}
            {!selectedPeriod && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pilih periode</AlertTitle>
                <AlertDescription>Silakan pilih periode untuk melihat hasil perhitungan.</AlertDescription>
              </Alert>
            )}

            {/* Results table */}
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <div ref={printRef} className="print:p-4">
                  {/* Print header - only visible when printing */}
                  <div className="hidden print:block mb-4 text-center">
                    <h1 className="text-xl font-bold">Hasil Perhitungan Beasiswa</h1>
                    <p className="text-sm">Periode: {periodName}</p>
                    <p className="text-sm">Tanggal: {format(new Date(), "dd MMMM yyyy", { locale: id })}</p>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("rangking")}>
                            Rank
                            {sortConfig.key === "rangking" &&
                              (sortConfig.direction === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead>
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort("calonPenerima.nama_lengkap")}
                          >
                            Nama
                            {sortConfig.key === "calonPenerima.nama_lengkap" &&
                              (sortConfig.direction === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead>Perguruan Tinggi</TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("nilai_akhir")}>
                            Nilai
                            {sortConfig.key === "nilai_akhir" &&
                              (sortConfig.direction === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right print:hidden">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            {renderSkeleton()}
                          </TableCell>
                        </TableRow>
                      ) : results.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            {selectedPeriod ? "Tidak ada data hasil perhitungan" : "Pilih periode untuk melihat data"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        results.map((result) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">
                              {result.rangking <= 3 ? (
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800">
                                  <Trophy className="h-4 w-4" />
                                </div>
                              ) : (
                                result.rangking
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{result.calonPenerima?.nama_lengkap || "-"}</div>
                              <div className="text-sm text-muted-foreground">
                                {result.calonPenerima?.fakultas_prodi || "-"}
                              </div>
                            </TableCell>
                            <TableCell>{result.calonPenerima?.perguruan_Tinggi || "-"}</TableCell>
                            <TableCell className="font-medium">
                              {Number.parseFloat(result.nilai_akhir).toFixed(4)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={result.status === "LOLOS" ? "success" : "destructive"}
                                className={
                                  result.status === "LOLOS"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                              >
                                {result.status === "LOLOS" ? (
                                  <Check className="mr-1 h-3 w-3" />
                                ) : (
                                  <X className="mr-1 h-3 w-3" />
                                )}
                                {result.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right print:hidden">
                              <Button variant="ghost" size="sm" onClick={() => showDetailDialog(result)}>
                                Detail
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            {!loading && results.length > 0 && (
              <div className="flex items-center justify-between mt-4 print:hidden">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}{" "}
                  dari {totalItems} hasil
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1

                      // Show first page, last page, and pages around current page
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink isActive={page === currentPage} onClick={() => setCurrentPage(page)}>
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
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Hasil Perhitungan</DialogTitle>
            <DialogDescription>Informasi lengkap hasil perhitungan beasiswa</DialogDescription>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  {selectedResult.rangking <= 3 ? (
                    <Trophy className="h-8 w-8 text-primary" />
                  ) : (
                    <span className="text-2xl font-bold text-primary">{selectedResult.rangking}</span>
                  )}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold">{selectedResult.calonPenerima?.nama_lengkap || "-"}</h3>
                <p className="text-sm text-muted-foreground">{selectedResult.calonPenerima?.perguruan_Tinggi || "-"}</p>
                <p className="text-sm text-muted-foreground">{selectedResult.calonPenerima?.fakultas_prodi || "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Nilai Akhir</p>
                  <p className="font-semibold">{Number.parseFloat(selectedResult.nilai_akhir).toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={selectedResult.status === "LOLOS" ? "success" : "destructive"}
                    className={
                      selectedResult.status === "LOLOS"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {selectedResult.status === "LOLOS" ? (
                      <Check className="mr-1 h-3 w-3" />
                    ) : (
                      <X className="mr-1 h-3 w-3" />
                    )}
                    {selectedResult.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Periode</p>
                  <p className="font-semibold">{periodName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Perhitungan</p>
                  <p className="font-semibold">
                    {format(new Date(selectedResult.createdAt), "dd MMM yyyy", { locale: id })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ditampilkan ke User</p>
                  <Badge
                    variant={selectedResult.ditampilkanKeUser ? "success" : "outline"}
                    className={
                      selectedResult.ditampilkanKeUser
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {selectedResult.ditampilkanKeUser ? "Ya" : "Tidak"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Toggle Display Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {displayAction === "show" ? "Tampilkan Hasil Perhitungan" : "Sembunyikan Hasil Perhitungan"}
            </DialogTitle>
            <DialogDescription>
              {displayAction === "show"
                ? "Hasil perhitungan akan ditampilkan kepada semua calon penerima beasiswa."
                : "Hasil perhitungan akan disembunyikan dari calon penerima beasiswa."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <Alert variant={displayAction === "show" ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{displayAction === "show" ? "Konfirmasi Tampilkan" : "Konfirmasi Sembunyikan"}</AlertTitle>
              <AlertDescription>
                {displayAction === "show"
                  ? `Apakah Anda yakin ingin menampilkan hasil perhitungan periode "${periodName}" kepada semua calon penerima beasiswa?`
                  : `Apakah Anda yakin ingin menyembunyikan hasil perhitungan periode "${periodName}" dari calon penerima beasiswa?`}
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} disabled={isTogglingDisplay}>
              Batal
            </Button>
            <Button
              onClick={toggleDisplayToUsers}
              disabled={isTogglingDisplay}
              variant={displayAction === "show" ? "default" : "destructive"}
            >
              {isTogglingDisplay ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : displayAction === "show" ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Tampilkan
                </>
              ) : (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Sembunyikan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

