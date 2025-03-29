'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function JadwalTimeline() {
  const [jadwalPendaftaran, setJadwalPendaftaran] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const res = await api.get('/jadwal-pendaftaran')
        setJadwalPendaftaran(res.data)
      } catch (error) {
        console.error('Gagal mengambil data jadwal:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJadwal()
  }, [])

  // Format tanggal untuk ditampilkan
  const formatTanggal = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return format(date, 'd MMMM yyyy', { locale: id })
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Memuat jadwal pendaftaran...</p>
      </div>
    )
  }

  if (jadwalPendaftaran.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Jadwal pendaftaran belum tersedia</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        <TimelineItem
          title="Pembukaan Pendaftaran"
          date={formatTanggal(jadwalPendaftaran[0]?.pembukaan)}
          description="Pendaftaran dibuka untuk semua jenjang pendidikan."
          index={0}
        />
        <TimelineItem
          title="Batas Akhir Pendaftaran"
          date={formatTanggal(jadwalPendaftaran[0]?.batas_akhir)}
          description="Pastikan melengkapi semua dokumen yang diperlukan."
          index={1}
        />
        <TimelineItem
          title="Seleksi Administrasi"
          date={`${formatTanggal(jadwalPendaftaran[0]?.seleksi_mulai)} - ${formatTanggal(jadwalPendaftaran[0]?.seleksi_selesai)}`}
          description="Verifikasi dokumen dan kelengkapan persyaratan."
          index={2}
        />
        <TimelineItem
          title="Pengumuman Penerima"
          date={formatTanggal(jadwalPendaftaran[0]?.pengumuman_penerima)}
          description="Pengumuman resmi penerima beasiswa melalui website dan email."
          index={3}
          isLast={true}
        />
      </div>
    </div>
  )
}

function TimelineItem({ title, date, description, index, isLast = false }) {
  return (
    <motion.div
      className={`relative pl-8 ${
        isLast ? '' : 'pb-8 border-l border-primary/30'
      }`}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <motion.div
        className="absolute w-4 h-4 bg-primary rounded-full -left-2"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 10,
          delay: 0.1 + index * 0.1,
        }}
        viewport={{ once: true, margin: '-50px' }}
        whileHover={{ scale: 1.2 }}
      />
      <motion.h3
        className="text-xl font-bold"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
        viewport={{ once: true, margin: '-50px' }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-primary font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
        viewport={{ once: true, margin: '-50px' }}
      >
        {date}
      </motion.p>
      <motion.p
        className="mt-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
        viewport={{ once: true, margin: '-50px' }}
      >
        {description}
      </motion.p>
    </motion.div>
  )
}