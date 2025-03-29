'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import axios from '@/lib/axios'
import ThreeLoading from '@/components/three-loading'

export default function SubkriteriaListModal({ open, onClose, kriteriaId }) {
  const [isLoading, setIsLoading] = useState(false)
  const [subkriteriaList, setSubkriteriaList] = useState([])

  useEffect(() => {
    if (open) fetchSubkriteria()
  }, [open])

  const fetchSubkriteria = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`/sub-kriteria/by-kriteria/${kriteriaId}`)
      setSubkriteriaList(res.data)
    } catch (err) {
      console.error('Gagal fetch subkriteria:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Daftar Subkriteria</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <ThreeLoading text="Memuat subkriteria..." />
        ) : subkriteriaList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada subkriteria</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {subkriteriaList.map((item, index) => (
              <div
                key={item.id}
                className="border rounded-md px-4 py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{index + 1}. {item.nama_sub_kriteria}</p>
                  <p className="text-sm text-muted-foreground">
                    Bobot: <Badge variant="secondary">{item.bobot_sub_kriteria}</Badge>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
