'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { User, Mail, Calendar, MapPin, School } from 'lucide-react'

export default function DetailCalonPenerimaModal({ open, onClose, calonPenerima }) {
  if (!calonPenerima) return null

  const formatDate = dateString => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: id })
    } catch (error) {
      return dateString
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Calon Penerima</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Informasi Pribadi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                <p className="font-medium">{calonPenerima.nama_lengkap}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                <p className="font-medium">{formatDate(calonPenerima.tanggal_lahir)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-primary" />
                  {calonPenerima.user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              Alamat
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Alamat Lengkap</p>
                <p className="font-medium">{calonPenerima.alamat}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">RT/RW</p>
                  <p className="font-medium">{calonPenerima.rt_rw}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kelurahan/Desa</p>
                  <p className="font-medium">{calonPenerima.kelurahan_desa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kecamatan</p>
                  <p className="font-medium">{calonPenerima.kecamatan}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <School className="mr-2 h-5 w-5 text-primary" />
              Informasi Pendidikan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Perguruan Tinggi</p>
                <p className="font-medium">{calonPenerima.perguruan_Tinggi}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fakultas/Program Studi</p>
                <p className="font-medium">{calonPenerima.fakultas_prodi}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Informasi Bank Akun
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">No Rekening</p>
                <p className="font-medium">{calonPenerima.noRekening}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Informasi Tambahan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pendaftaran</p>
                <p className="font-medium">{formatDate(calonPenerima.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
                <p className="font-medium">{formatDate(calonPenerima.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
