'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import MainImage from '@/public/randomImg.jpeg'
import LogoRoteNdao from '@/public/logo-rote-ndao.png'
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background border-b border-primary/10">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-10 -top-10 h-[500px] w-[500px] rounded-full bg-primary/5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute -left-10 bottom-0 h-[300px] w-[300px] rounded-full bg-primary/5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              Program Beasiswa 2025
            </motion.div>

            {/* ⬇️ Tambahkan logo di sini */}
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Image
                src={LogoRoteNdao}
                alt="Logo Kabupaten Rote Ndao"
                width={80}
                height={80}
                className="mt-2"
              />
            </motion.div>
            {/* ⬆️ Logo ditampilkan di antara label dan heading */}

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Beasiswa Pemerintah Daerah Kabupaten Rote Ndao
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Wujudkan impian pendidikan Anda dengan dukungan beasiswa dari Pemerintah Daerah
              Kabupaten Rote Ndao.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/auth/register" className="group">
                  Daftar Sekarang
                  <motion.span
                    className="inline-block ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 hover:bg-primary/5">
                <Link href="#">Pelajari Lebih Lanjut</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative h-[300px] md:h-[400px] lg:h-[500px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <motion.div
                className="w-full h-full"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                <Image
                  src={MainImage}
                  alt="Beasiswa Rote Ndao"
                  fill
                  className="object-cover rounded-lg shadow-xl"
                  priority
                />
              </motion.div>
            </div>
            <motion.div
              className="absolute -bottom-4 -right-4 h-full w-full border-2 border-primary/20 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
