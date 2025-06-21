"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function MatriksKeputusan({ decisionMatrix, kriteria, periodeList }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-700">Matriks Keputusan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Alternatif</TableHead>
                  {kriteria.map((krit, index) => (
                    <TableHead key={krit.id} className="font-semibold">C{index + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(decisionMatrix).map((alt) => {
                  const periodeNama = periodeList.find((p) => p.id === alt.periodeId)?.nama_periode || '-'
                  return (
                    <TableRow key={alt.alternatifId} className="even:bg-muted/50">
                      <TableCell className="font-medium">
                        {alt.nama_alternatif} Periode : ({periodeNama})
                      </TableCell>
                      {kriteria.map((krit) => (
                        <TableCell key={krit.id}>
                          {alt.penilaian[krit.id] ?? "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
