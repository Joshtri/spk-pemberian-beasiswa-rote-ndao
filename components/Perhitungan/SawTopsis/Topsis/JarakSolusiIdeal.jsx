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

export default function JarakSolusiIdeal({ distances }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-6"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Jarak ke Solusi Ideal Positif (D⁺) & Negatif (D⁻)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Alternatif</TableHead>
                  <TableHead className="font-semibold">D⁺</TableHead>
                  <TableHead className="font-semibold">D⁻</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(distances).map(alt => (
                  <TableRow key={alt.alternatifId} className="even:bg-muted/50">
                    <TableCell className="font-medium">{alt.nama_alternatif}</TableCell>
                    <TableCell>{alt.dPlus.toFixed(4)}</TableCell>
                    <TableCell>{alt.dMinus.toFixed(4)}</TableCell>
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
