'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function HasilPerhitunganPage() {
  const [matriksKeputusan, setMatriksKeputusan] = useState([
    {
      alternatif: 'Setron Dalia - 3',
      c1: 2,
      c2: 3,
      c3: 1,
      c4: 3,
      c5: 3,
      c6: 3,
      c7: 1,
      c8: 2,
      c9: 3,
    },
    {
      alternatif: 'Jermias Poy - 3',
      c1: 1,
      c2: 1,
      c3: 3,
      c4: 2,
      c5: 2,
      c6: 3,
      c7: 1,
      c8: 2,
      c9: 3,
    },
  ])

  const [normalisasiSAW, setNormalisasiSAW] = useState([
    {
      alternatif: 'Setron Dalia',
      c1: 1.0,
      c2: 1.0,
      c3: 0.3333,
      c4: 1.0,
      c5: 1.0,
      c6: 1.0,
      c7: 1.0,
      c8: 1.0,
      c9: 1.0,
    },
    {
      alternatif: 'Jermias Poy',
      c1: 0.5,
      c2: 0.3333,
      c3: 1.0,
      c4: 0.6667,
      c5: 0.6667,
      c6: 1.0,
      c7: 1.0,
      c8: 1.0,
      c9: 1.0,
    },
  ])

  const [normalisasiTOPSIS, setNormalisasiTOPSIS] = useState([
    {
      alternatif: 'Setron Dalia',
      c1: 0.1,
      c2: 0.1,
      c3: 0.0333,
      c4: 0.1,
      c5: 0.1,
      c6: 0.1,
      c7: 0.1,
      c8: 0.15,
      c9: 0.15,
    },
    {
      alternatif: 'Jermias Poy',
      c1: 0.05,
      c2: 0.0333,
      c3: 0.1,
      c4: 0.0667,
      c5: 0.0667,
      c6: 0.1,
      c7: 0.1,
      c8: 0.15,
      c9: 0.15,
    },
  ])

  const [solusiIdeal, setSolusiIdeal] = useState([
    { kriteria: 'Jenis Dinding', aPlus: 0.1, aMinus: 0.05 },
    { kriteria: 'Kondisi Dinding', aPlus: 0.1, aMinus: 0.0333 },
    { kriteria: 'Jenis Atap', aPlus: 0.1, aMinus: 0.0333 },
    { kriteria: 'Kondisi Atap', aPlus: 0.1, aMinus: 0.0667 },
    { kriteria: 'Jenis Lantai', aPlus: 0.1, aMinus: 0.0667 },
    { kriteria: 'Kondisi Lantai', aPlus: 0.1, aMinus: 0.1 },
    { kriteria: 'Kamar Mandi / Toilet', aPlus: 0.1, aMinus: 0.1 },
    { kriteria: 'Pendapatan Keluarga', aPlus: 0.15, aMinus: 0.15 },
    { kriteria: 'Jumlah Tanggungan', aPlus: 0.15, aMinus: 0.15 },
  ])

  const [jarakSolusi, setJarakSolusi] = useState([
    { alternatif: 'Setron Dalia', dPlus: 0.0667, dMinus: 0.0957 },
    { alternatif: 'Jermias Poy', dPlus: 0.0957, dMinus: 0.0667 },
  ])

  const [nilaiPreferensi, setNilaiPreferensi] = useState([
    { ranking: 1, alternatif: 'Setron Dalia', nilai: 0.5895 },
    { ranking: 2, alternatif: 'Jermias Poy', nilai: 0.4105 },
  ])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Perhitungan SAW & TOPSIS</h2>
          <p className="text-muted-foreground">Hasil perhitungan metode SAW dan TOPSIS</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Select defaultValue="2025">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold mb-4">Matriks Keputusan</h3>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ALTERNATIF</TableHead>
                <TableHead>C1</TableHead>
                <TableHead>C2</TableHead>
                <TableHead>C3</TableHead>
                <TableHead>C4</TableHead>
                <TableHead>C5</TableHead>
                <TableHead>C6</TableHead>
                <TableHead>C7</TableHead>
                <TableHead>C8</TableHead>
                <TableHead>C9</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matriksKeputusan.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.alternatif}</TableCell>
                  <TableCell>{item.c1}</TableCell>
                  <TableCell>{item.c2}</TableCell>
                  <TableCell>{item.c3}</TableCell>
                  <TableCell>{item.c4}</TableCell>
                  <TableCell>{item.c5}</TableCell>
                  <TableCell>{item.c6}</TableCell>
                  <TableCell>{item.c7}</TableCell>
                  <TableCell>{item.c8}</TableCell>
                  <TableCell>{item.c9}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-4">Normalisasi Matriks Keputusan (SAW)</h3>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ALTERNATIF</TableHead>
                <TableHead>C1</TableHead>
                <TableHead>C2</TableHead>
                <TableHead>C3</TableHead>
                <TableHead>C4</TableHead>
                <TableHead>C5</TableHead>
                <TableHead>C6</TableHead>
                <TableHead>C7</TableHead>
                <TableHead>C8</TableHead>
                <TableHead>C9</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {normalisasiSAW.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.alternatif}</TableCell>
                  <TableCell>{item.c1.toFixed(4)}</TableCell>
                  <TableCell>{item.c2.toFixed(4)}</TableCell>
                  <TableCell>{item.c3.toFixed(4)}</TableCell>
                  <TableCell>{item.c4.toFixed(4)}</TableCell>
                  <TableCell>{item.c5.toFixed(4)}</TableCell>
                  <TableCell>{item.c6.toFixed(4)}</TableCell>
                  <TableCell>{item.c7.toFixed(4)}</TableCell>
                  <TableCell>{item.c8.toFixed(4)}</TableCell>
                  <TableCell>{item.c9.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-4">Nilai Preferensi & Urutan Alternatif</h3>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RANKING</TableHead>
                <TableHead>ALTERNATIF</TableHead>
                <TableHead>NILAI PREFERENSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nilaiPreferensi.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.ranking}</TableCell>
                  <TableCell>{item.alternatif}</TableCell>
                  <TableCell>{item.nilai.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-center"
      >
        <Button className="bg-green-600 hover:bg-green-700">Simpan Hasil Perhitungan</Button>
      </motion.div>
    </div>
  )
}
