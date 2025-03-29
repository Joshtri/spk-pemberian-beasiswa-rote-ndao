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
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function SolusiIdeal({ idealSolutions, kriteria }) {
  if (!idealSolutions || !idealSolutions.idealPositif || !idealSolutions.idealNegatif) {
    return (
      <div className="mt-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Menghitung solusi ideal...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Solusi Ideal Positif (A⁺) & Negatif (A⁻)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Kriteria</TableHead>
                  <TableHead className="font-semibold">A⁺ (Ideal Positif)</TableHead>
                  <TableHead className="font-semibold">A⁻ (Ideal Negatif)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kriteria.map(krit => (
                  <TableRow key={krit.id_kriteria} className="even:bg-muted/50">
                    <TableCell className="font-medium">{krit.nama_kriteria}</TableCell>
                    <TableCell>
                      {idealSolutions?.idealPositif?.[krit.id_kriteria]?.toFixed(4) || '0.0000'}
                    </TableCell>
                    <TableCell>
                      {idealSolutions?.idealNegatif?.[krit.id_kriteria]?.toFixed(4) || '0.0000'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
