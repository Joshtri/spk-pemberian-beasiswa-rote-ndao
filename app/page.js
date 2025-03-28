'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  GraduationCap,
  Users,
  Award,
  BookOpen,
} from 'lucide-react'
import HeroSection from '@/components/Public/HeroSection'
import FeatureCard from '@/components/ui/feature-card'
import Footer from '@/components/Public/partials/Footer'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />

      <main className="flex-1">
        {/* About Section */}
        <section className="py-12 md:py-16 lg:py-20 px-4 container mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              Program Beasiswa Pemerintah Daerah Kabupaten Rote Ndao
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              Mendukung pendidikan dan pengembangan sumber daya manusia
              berkualitas untuk membangun masa depan Kabupaten Rote Ndao yang
              lebih baik.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <FeatureCard
              icon={<GraduationCap className="h-10 w-10" />}
              title="Pendidikan Tinggi"
              description="Beasiswa untuk jenjang S1, S2, dan S3 di perguruan tinggi terkemuka."
              index={0}
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Inklusif"
              description="Terbuka untuk seluruh putra-putri daerah Kabupaten Rote Ndao."
              index={1}
            />
            <FeatureCard
              icon={<Award className="h-10 w-10" />}
              title="Prestasi"
              description="Mendukung siswa dan mahasiswa berprestasi akademik dan non-akademik."
              index={2}
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10" />}
              title="Pembinaan"
              description="Program pendampingan dan pengembangan untuk penerima beasiswa."
              index={3}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/10">
          <motion.div
            className="container mx-auto px-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              Siap untuk Mendaftar?
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              Daftarkan diri Anda sekarang untuk mendapatkan kesempatan beasiswa
              pendidikan dari Pemerintah Daerah Kabupaten Rote Ndao.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <Button
                asChild
                size="lg"
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link href="/auth/register" className="group">
                  Daftar Sekarang
                  <motion.span
                    className="inline-block ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 hover:bg-primary/5"
              >
                <Link href="/auth/login">Masuk ke Akun</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Timeline Section */}
        <section className="py-12 md:py-16 container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            Jadwal Pendaftaran
          </motion.h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <TimelineItem
                title="Pembukaan Pendaftaran"
                date="1 Januari 2025"
                description="Pendaftaran dibuka untuk semua jenjang pendidikan."
                index={0}
              />
              <TimelineItem
                title="Batas Akhir Pendaftaran"
                date="28 Februari 2025"
                description="Pastikan melengkapi semua dokumen yang diperlukan."
                index={1}
              />
              <TimelineItem
                title="Seleksi Administrasi"
                date="1-15 Maret 2025"
                description="Verifikasi dokumen dan kelengkapan persyaratan."
                index={2}
              />
              <TimelineItem
                title="Pengumuman Penerima"
                date="1 April 2025"
                description="Pengumuman resmi penerima beasiswa melalui website dan email."
                index={3}
                isLast={true}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
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
