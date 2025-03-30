"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "@/lib/axios"
import { useState, useEffect } from "react"

export default function NilaiPreferensi({ finalScores = [], selectedPeriod, selectedPeriodName }) {
  const [existingData, setExistingData] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (selectedPeriod) {
      checkExistingData(selectedPeriod)
    }
  }, [selectedPeriod])

  const checkExistingData = async (periodeId) => {
    try {
      const response = await axios.get(`/hasil-perhitungan/${periodeId}`)
      setExistingData(response.data.length > 0)
    } catch (error) {
      console.error("❌ Gagal mengecek hasil perhitungan:", error)
      setExistingData(false)
    }
  }

  const saveResults = async () => {
    if (isSaving) return
    if (!selectedPeriod) {
      toast.error("❌ Periode tidak tersedia.")
      return
    }

    if (existingData) {
      toast.error("Hasil perhitungan sudah ada untuk periode ini. Harap hapus data sebelum menyimpan ulang.")
      return
    }

    try {
      setIsSaving(true)

      const formattedResults = finalScores.map((alt, index) => ({
        calonPenerimaId: alt.alternatifId,
        rangking: index + 1,
        nilai_akhir: Number.parseFloat(alt.preference),
        status: index + 1 <= 10 ? "LOLOS" : "TIDAK LOLOS",
        periodeId: selectedPeriod,
      }))

      await axios.post("/hasil-perhitungan", {
        results: formattedResults,
      })

      toast.success("✅ Hasil perhitungan berhasil disimpan!")
      checkExistingData(selectedPeriod)
    } catch (error) {
      console.error("❌ Error saving results:", error)
      toast.error("❌ Gagal menyimpan hasil perhitungan.")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteResults = async () => {
    try {
      await axios.delete(`/hasil-perhitungan/${selectedPeriod}`)
      toast.success("Hasil perhitungan berhasil dihapus.")
      setExistingData(false)
    } catch (error) {
      console.error("❌ Error deleting results:", error)
      toast.error("Gagal menghapus hasil perhitungan.")
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
          <CardTitle className="text-lg font-semibold text-gray-700">Nilai Preferensi & Urutan Alternatif</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Simpan hasil perhitungan untuk periode: <span className="font-semibold">{selectedPeriodName}</span>
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            {existingData ? (
              <Button onClick={deleteResults} variant="destructive" className="w-full sm:w-auto">
                Hapus Hasil Perhitungan
              </Button>
            ) : (
              <Button
                onClick={saveResults}
                disabled={!selectedPeriod || isSaving}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Hasil Perhitungan"
                )}
              </Button>
            )}
          </div>

          {finalScores.length === 0 ? (
            <p className="text-red-500 py-4">❌ Tidak ada hasil perhitungan tersedia.</p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Ranking</TableHead>
                    <TableHead className="font-semibold">Alternatif</TableHead>
                    <TableHead className="font-semibold">Nilai Preferensi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalScores.map((alt, index) => (
                    <TableRow key={alt.alternatifId} className={index + 1 <= 10 ? "bg-green-100" : "bg-red-100"}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{alt.nama_alternatif}</TableCell>
                      <TableCell>{alt.preference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
