"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function NormalisasiTerbobot({ weightedMatrix, kriteria }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-6"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-700">Normalisasi Terbobot (TOPSIS)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Alternatif</TableHead>
                  {kriteria.map((krit, index) => (
                    <TableHead key={krit.id_kriteria} className="font-semibold">
                      C{index + 1}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(weightedMatrix).map((alt) => (
                  <TableRow key={alt.nama_alternatif} className="even:bg-muted/50">
                    <TableCell className="font-medium">{alt.nama_alternatif}</TableCell>
                    {kriteria.map((krit) => (
                      <TableCell key={krit.id_kriteria}>
                        {alt.penilaian?.[krit.id_kriteria]?.toFixed(4) || "-"}
                      </TableCell>
                    ))}
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

