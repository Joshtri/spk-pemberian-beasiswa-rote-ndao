'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'

export default function NilaiPreferensi({
  finalScores = [],
  selectedPeriod,
  selectedPeriodName,
  kuotaKelulusan,
}) {
  const [existingData, setExistingData] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (selectedPeriod) {
      checkExistingData(selectedPeriod)
    }
  }, [selectedPeriod])

  const checkExistingData = async periodeId => {
    try {
      const response = await axios.get(`/hasil-perhitungan/${periodeId}`)
      setExistingData(response.data.length > 0)
    } catch (error) {
      console.error('❌ Gagal mengecek hasil perhitungan:', error)
      setExistingData(false)
    }
  }

  const saveResults = async () => {
    if (isSaving) return
    if (!selectedPeriod) {
      toast.error('❌ Periode tidak tersedia.')
      return
    }

    if (existingData) {
      toast.error(
        'Hasil perhitungan sudah ada untuk periode ini. Harap hapus data sebelum menyimpan ulang.'
      )
      return
    }

    try {
      setIsSaving(true)

      const formattedResults = finalScores.map((alt, index) => {
        const isAccepted = index + 1 <= kuotaKelulusan
        return {
          calonPenerimaId: alt.alternatifId,
          rangking: index + 1,
          nilai_akhir: Number.parseFloat(alt.preference),
          periodeId: selectedPeriod,
          status: isAccepted ? 'DITERIMA' : 'DITOLAK', // ✅ Fix added here
        }
      })

      await axios.post('/hasil-perhitungan', {
        results: formattedResults,
      })

      toast.success(`✅ ${finalScores.length} hasil perhitungan berhasil disimpan!`)
      checkExistingData(selectedPeriod)
    } catch (error) {
      const errorMessage = error?.response?.data?.message || '❌ Gagal menyimpan hasil perhitungan.'

      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteResults = async () => {
    try {
      await axios.delete(`/hasil-perhitungan/${selectedPeriod}`)
      toast.success('Hasil perhitungan berhasil dihapus.')
      setExistingData(false)
    } catch (error) {
      console.error('❌ Error deleting results:', error)
      toast.error('Gagal menghapus hasil perhitungan.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-6"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Nilai Preferensi & Urutan Alternatif
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Informasi periode */}
          <p className="mb-4 text-sm text-muted-foreground">
            Simpan hasil perhitungan untuk periode:{' '}
            <span className="font-semibold">{selectedPeriodName}</span> | Kuota Kelulusan:{' '}
            <span className="font-semibold">{kuotaKelulusan}</span> | Total Alternatif:{' '}
            <span className="font-semibold">{finalScores.length}</span>
          </p>

          {/* Tabel atau pesan kosong */}
          {finalScores.length === 0 ? (
            <p className="text-red-500 py-4">❌ Tidak ada hasil perhitungan tersedia.</p>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Ranking</TableHead>
                      <TableHead className="font-semibold">Alternatif</TableHead>
                      <TableHead className="font-semibold">Nilai Preferensi</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {finalScores.map((alt, index) => {
                      const isAccepted = index + 1 <= kuotaKelulusan
                      return (
                        <TableRow
                          key={alt.alternatifId}
                          className={isAccepted ? 'bg-green-100' : 'bg-red-100'}
                        >
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{alt.nama_alternatif}</TableCell>
                          <TableCell>{alt.preference}</TableCell>
                          <TableCell>
                            <span
                              className={
                                isAccepted
                                  ? 'text-green-700 font-semibold'
                                  : 'text-red-700 font-semibold'
                              }
                            >
                              {isAccepted ? 'Lolos' : 'Tidak Lolos'}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={saveResults}
                  disabled={isSaving || existingData}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                  Simpan Hasil
                </Button>
                {existingData && (
                  <Button
                    onClick={deleteResults}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Hapus Hasil
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
