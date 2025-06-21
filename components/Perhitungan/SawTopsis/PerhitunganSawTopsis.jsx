'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from '@/lib/axios'

// Import components
import MatriksKeputusan from './Saw/MatriksKeputusan'
import NormalisasiSAW from './Saw/NormalisasiSaw'
import NormalisasiTerbobot from './Topsis/NormalisasiTerbobot'
import SolusiIdeal from './Topsis/SolusiIdeal'
import JarakSolusiIdeal from './Topsis/JarakSolusiIdeal'
import NilaiPreferensi from './Topsis/NilaiPreferensi'

export default function PerhitunganSawTopsis() {
  const [penilaian, setPenilaian] = useState([])
  const [kriteria, setKriteria] = useState([])
  const [periode, setPeriode] = useState([])
  const [loading, setLoading] = useState(false)

  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [decisionMatrix, setDecisionMatrix] = useState({})
  const [normalizedMatrix, setNormalizedMatrix] = useState({})
  const [weightedMatrix, setWeightedMatrix] = useState({})
  const [idealSolutions, setIdealSolutions] = useState({})
  const [distances, setDistances] = useState({})
  const [finalScores, setFinalScores] = useState([])

  useEffect(() => {
    const fetchPeriode = async () => {
      try {
        const res = await axios.get('/periode')
        setPeriode(res.data)
      } catch (err) {
        console.error('Gagal fetch periode:', err)
      }
    }

    fetchPeriode()
  }, [])

  useEffect(() => {
    const fetchPerhitunganData = async () => {
      if (!selectedPeriod || selectedPeriod === 'default') {
        setPenilaian([])
        setKriteria([])
        return
      }

      setLoading(true)
      try {
        const res = await axios.get('/penilaian/admin/perhitungan', {
          params: { periodeId: selectedPeriod },
        })

        setPenilaian(res.data.penilaian)
        setKriteria(res.data.kriteria)
      } catch (error) {
        console.error('Gagal fetch data perhitungan:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerhitunganData()
  }, [selectedPeriod])

  useEffect(() => {
    if (penilaian.length > 0 && kriteria.length > 0) {
      const maxValues = {}
      const minValues = {}

      // 🔹 Matriks Keputusan
      const grouped = {}
      penilaian.forEach(item => {
        const penerimaId = item.calonPenerimaId
        if (!grouped[penerimaId]) {
          grouped[penerimaId] = {
            nama_alternatif: item.nama_lengkap,
            alternatifId: penerimaId,
            periodeId: item.periodeId,
            penilaian: {},
          }
        }
        grouped[penerimaId].penilaian[item.kriteriaId] = item.bobot_sub_kriteria || 0
      })
      setDecisionMatrix(grouped)

      // 🔹 Normalisasi SAW
      kriteria.forEach(krit => {
        const values = Object.values(grouped).map(alt => alt.penilaian[krit.id] || 0)
        maxValues[krit.id] = Math.max(...values)
        minValues[krit.id] = Math.min(...values)
      })

      const normMatrix = {}
      Object.entries(grouped).forEach(([altId, alt]) => {
        normMatrix[altId] = {
          nama_alternatif: alt.nama_alternatif,
          alternatifId: alt.alternatifId,
          penilaian: {},
        }
        kriteria.forEach(krit => {
          const raw = alt.penilaian[krit.id] || 0
          const norm =
            krit.tipe_kriteria === 'BENEFIT' ? raw / maxValues[krit.id] : minValues[krit.id] / raw
          normMatrix[altId].penilaian[krit.id] = norm
        })
      })
      setNormalizedMatrix(normMatrix)

      // 🔹 Normalisasi Terbobot (TOPSIS)
      const weightMatrix = {}
      Object.entries(normMatrix).forEach(([altId, alt]) => {
        weightMatrix[altId] = {
          nama_alternatif: alt.nama_alternatif,
          alternatifId: alt.alternatifId,
          penilaian: {},
        }
        kriteria.forEach(krit => {
          const bobot = krit.bobot_kriteria > 1 ? krit.bobot_kriteria / 100 : krit.bobot_kriteria
          const nilai = alt.penilaian[krit.id] * bobot
          weightMatrix[altId].penilaian[krit.id] = nilai
        })
      })
      setWeightedMatrix(weightMatrix)

      // 🔹 Solusi Ideal
      const idealPositif = {}
      const idealNegatif = {}
      kriteria.forEach(krit => {
        const values = Object.values(weightMatrix).map(alt => alt.penilaian[krit.id] || 0)
        idealPositif[krit.id] = Math.max(...values)
        idealNegatif[krit.id] = Math.min(...values)
      })
      setIdealSolutions({ idealPositif, idealNegatif })

      // 🔹 Jarak ke Solusi Ideal
      const distanceMatrix = {}
      Object.entries(weightMatrix).forEach(([altId, alt]) => {
        const dPlus = Math.sqrt(
          kriteria.reduce(
            (sum, krit) => sum + Math.pow(idealPositif[krit.id] - alt.penilaian[krit.id], 2),
            0
          )
        )
        const dMinus = Math.sqrt(
          kriteria.reduce(
            (sum, krit) => sum + Math.pow(alt.penilaian[krit.id] - idealNegatif[krit.id], 2),
            0
          )
        )
        distanceMatrix[altId] = {
          nama_alternatif: alt.nama_alternatif,
          alternatifId: alt.alternatifId,
          dPlus,
          dMinus,
        }
      })
      setDistances(distanceMatrix)

      // 🔹 Nilai Preferensi
      const scores = Object.entries(distanceMatrix).map(([altId, alt]) => {
        const preference = alt.dMinus / (alt.dPlus + alt.dMinus)
        return {
          nama_alternatif: alt.nama_alternatif,
          alternatifId: alt.alternatifId,
          preference: preference.toFixed(4),
        }
      })

      scores.sort((a, b) => b.preference - a.preference)
      setFinalScores(scores)
    } else {
      setDecisionMatrix({})
      setNormalizedMatrix({})
      setWeightedMatrix({})
      setIdealSolutions({})
      setDistances({})
      setFinalScores([])
    }
  }, [penilaian, kriteria])

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Perhitungan SAW & TOPSIS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Pilih Periode</SelectItem>
                  {periode.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nama_periode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Memuat data...</span>
        </div>
      ) : (
        <>
          <MatriksKeputusan
            decisionMatrix={decisionMatrix}
            kriteria={kriteria}
            periodeList={periode}
          />
          <NormalisasiSAW normalizedMatrix={normalizedMatrix} kriteria={kriteria} />
          <NormalisasiTerbobot weightedMatrix={weightedMatrix} kriteria={kriteria} />
          <SolusiIdeal idealSolutions={idealSolutions} kriteria={kriteria} />
          <JarakSolusiIdeal distances={distances} />
          <NilaiPreferensi
            finalScores={finalScores}
            selectedPeriod={selectedPeriod}
            selectedPeriodName={periode.find(p => p.id === selectedPeriod)?.nama_periode || '-'}
          />
        </>
      )}
    </div>
  )
}
