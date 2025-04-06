'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, GraduationCap, Users, Award, BookOpen } from 'lucide-react'
import HeroSection from '@/components/Public/HeroSection'
import FeatureCard from '@/components/ui/feature-card'
import Footer from '@/components/Public/Partials/Footer'
import { motion } from 'framer-motion'
import JadwalTimeline from '@/components/Public/JadwalTimeline'
import AppDownloadSection from '@/components/Public/AppDownloadSection'
import InstallPromptDialog from '@/components/InstallPromptDialog'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <InstallPromptDialog/>

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
              Mendukung pendidikan dan pengembangan sumber daya manusia berkualitas untuk membangun
              masa depan Kabupaten Rote Ndao yang lebih baik.
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

        {/* App Download Section */}
        <AppDownloadSection />
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
              Daftarkan diri Anda sekarang untuk mendapatkan kesempatan beasiswa pendidikan dari
              Pemerintah Daerah Kabupaten Rote Ndao.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
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
              <Button asChild variant="outline" size="lg" className="border-2 hover:bg-primary/5">
                <Link href="/auth/login">Masuk ke Akun</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Timeline Section */}
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
          <JadwalTimeline /> {/* Gunakan komponen baru di sini */}
        </section>
      </main>

      <Footer />
    </div>
  )
}
