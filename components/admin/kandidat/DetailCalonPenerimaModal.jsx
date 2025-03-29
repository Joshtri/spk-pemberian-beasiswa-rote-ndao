'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import api from '@/lib/axios'
import { toast } from 'sonner'

export default function DetailCalonPenerimaModal({ open, onClose, calonPenerimaId }) {
  const [isLoading, setIsLoading] = useState(true)
  const [calonPenerima, setCalonPenerima] = useState(null)

  useEffect(() => {
    if (open && calonPenerimaId) {
      fetchCalonPenerima()
    }
  }, [open, calonPenerimaId])
  
  const fetchCalonPenerima = async () => {
    setIsLoading(true)
    try {
      const res = await api.get(`/calon-penerima/${calonPenerimaId}`)
      setCalonPenerima(res.data.data)
    } catch (err) {
      console.error('Gagal fetch calon penerima:', err)
      toast.error('Gagal memuat data', {
        description: 'Terjadi kesalahan saat mengambil data calon penerima.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format tanggal untuk tampilan yang lebih baik
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Calon Penerima</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p>Memuat data calon penerima...</p>
          </div>
        ) : (
          calonPenerima && (
            <div className="space-y-6">
              {/* Informasi Pribadi */}
              <div>
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Informasi Pribadi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Nama Lengkap:</strong> {calonPenerima.nama_lengkap || '-'}
                  </div>
                  <div>
                    <strong>Tanggal Lahir:</strong> {formatDate(calonPenerima.tanggal_lahir) || '-'}
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <strong>Alamat:</strong> {calonPenerima.alamat || '-'}
                  </div>
                  <div>
                    <strong>RT/RW:</strong> {calonPenerima.rt_rw || '-'}
                  </div>
                  <div>
                    <strong>Kelurahan/Desa:</strong> {calonPenerima.kelurahan_desa || '-'}
                  </div>
                  <div>
                    <strong>Kecamatan:</strong> {calonPenerima.kecamatan || '-'}
                  </div>
                </div>
              </div>

              {/* Informasi Pendidikan */}
              <div>
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Informasi Pendidikan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Perguruan Tinggi:</strong> {calonPenerima.perguruan_Tinggi || '-'}
                  </div>
                  <div>
                    <strong>Fakultas/Prodi:</strong> {calonPenerima.fakultas_prodi || '-'}
                  </div>
                </div>
              </div>

              {/* Informasi User (jika ada) */}
              {calonPenerima.user && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Informasi Akun</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Nama:</strong> {calonPenerima.user.username || '-'}
                    </div>
                    <div>
                      <strong>Email:</strong> {calonPenerima.user.email || '-'}
                    </div>
                    <div>
                      <strong>Role:</strong> {calonPenerima.user.role || '-'}
                    </div>
 
                  </div>
                </div>
              )}

              {/* Informasi Tanggal */}
              <div>
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Informasi Tambahan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tanggal Dibuat:</strong> {formatDate(calonPenerima.createdAt) || '-'}
                  </div>
                  <div>
                    <strong>Terakhir Diperbarui:</strong> {formatDate(calonPenerima.updatedAt) || '-'}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}