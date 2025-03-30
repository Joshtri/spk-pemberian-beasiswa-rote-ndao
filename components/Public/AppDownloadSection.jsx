"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Smartphone, Check } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
 import scanQRCode from '@/public/qrcodea-pp.png'

export default function AppDownloadSection() {
  const [isHovered, setIsHovered] = useState(false)

  const appFeatures = [
    "Akses informasi beasiswa kapan saja",
    "Notifikasi status pendaftaran",
    "Unggah dokumen langsung dari ponsel",
    "Pantau proses seleksi secara real-time",
    "Pengingat jadwal penting",
  ]

  const downloadUrl = "/downloads/beasiswa-rote-ndao.apk" // Update with your actual download URL

  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary/5 border-t border-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
              <Smartphone className="h-4 w-4 mr-2" />
              Tersedia di Android
            </div>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Akses Beasiswa Rote Ndao <span className="text-primary">di Genggaman Anda</span>
            </h2>

            <p className="text-lg text-muted-foreground">
              Unduh aplikasi Beasiswa Rote Ndao untuk pengalaman yang lebih baik. Pantau status pendaftaran, unggah
              dokumen, dan dapatkan notifikasi penting langsung dari ponsel Android Anda.
            </p>

            <motion.div
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative"
            >
              <Button asChild size="lg" className="px-6 py-6 text-lg shadow-lg group">
                <Link href={downloadUrl} download>
                  <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Download Aplikasi
                </Link>
              </Button>

              {isHovered && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                >
                  Gratis!
                </motion.div>
              )}
            </motion.div>

            <Accordion type="single" collapsible className="w-full mt-6">
              <AccordionItem value="features">
                <AccordionTrigger className="text-primary font-medium">Fitur Aplikasi</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 mt-2">
                    {appFeatures.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

          {/* Right side - Phone mockup */}
          <motion.div
            className="relative mx-auto lg:mx-0 lg:ml-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative w-[280px] h-[560px] mx-auto">
              {/* Phone frame */}
              <div className="absolute inset-0 bg-gray-900 rounded-[40px] shadow-xl overflow-hidden border-4 border-gray-800">
                {/* Status bar */}
                <div className="absolute top-0 inset-x-0 h-6 bg-black z-10">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-700 rounded-full"></div>
                </div>

                {/* App screenshot */}
                <div className="absolute inset-0 pt-6">
                  <Image
                    src="/placeholder.svg?height=560&width=280"
                    alt="Aplikasi Beasiswa Rote Ndao"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-primary/20 z-[-1]"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-primary/10 z-[-1]"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
              />

              {/* Android logo */}
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full shadow-lg"
                whileHover={{ y: -5 }}
              >
                {/* Android Robot Logo */}
                <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <g fill="#3DDC84">
                    {/* Head */}
                    <path d="M6,10c0,0.55,0.45,1,1,1h1v2H6c-0.55,0-1,0.45-1,1s0.45,1,1,1h1v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2h1v2 c0,0.55,0.45,1,1,1s1-0.45,1-1v-2h1v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2h1c0.55,0,1-0.45,1-1 s-0.45-1-1-1h-1v-2h1c0.55,0,1-0.45,1-1s-0.45-1-1-1H7C6.45,9,6,9.45,6,10z M8,12h8v2H8V12z" />
                    {/* Antennae */}
                    <path d="M12,5.5c0.83,0,1.5-0.67,1.5-1.5S12.83,2.5,12,2.5s-1.5,0.67-1.5,1.5S11.17,5.5,12,5.5z" />
                    {/* Body */}
                    <path d="M19.5,5.5c0.83,0,1.5-0.67,1.5-1.5S20.33,2.5,19.5,2.5S18,3.17,18,4S18.67,5.5,19.5,5.5z" />
                    <path d="M4.5,5.5C5.33,5.5,6,4,6,4S5.33,2.5,4.5,2.5S3,3.17,3,4S3.67,5.5,4.5,5.5z" />
                    {/* Arms */}
                    <path d="M15.53,6.11l-1.85-2.76c-0.16-0.24-0.48-0.3-0.72-0.14c-0.24,0.16-0.3,0.48-0.14,0.72l1.85,2.76 c0.16,0.24,0.48,0.3,0.72,0.14C15.63,6.67,15.69,6.35,15.53,6.11z" />
                    <path d="M11.03,6.7c0.24,0.16,0.56,0.1,0.72-0.14l1.85-2.76c0.16-0.24,0.1-0.56-0.14-0.72c-0.24-0.16-0.56-0.1-0.72,0.14 L10.9,5.98C10.74,6.22,10.79,6.54,11.03,6.7z" />
                    {/* Legs */}
                    <path d="M20,10c-0.55,0-1,0.45-1,1v7c0,0.55,0.45,1,1,1s1-0.45,1-1v-7C21,10.45,20.55,10,20,10z" />
                    <path d="M4,10c-0.55,0-1,0.45-1,1v7c0,0.55,0.45,1,1,1s1-0.45,1-1v-7C5,10.45,4.55,10,4,10z" />
                  </g>
                </svg>
              </motion.div>

              {/* Floating Android Robot */}
              <motion.div
                className="absolute -top-10 -right-6 bg-white p-2 rounded-full shadow-lg hidden md:block"
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <g fill="#3DDC84">
                    <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
                  </g>
                </svg>
              </motion.div>
            </div>

            {/* QR Code */}
            <motion.div
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-xs font-medium text-center mb-2">Scan</div>
              <div className="w-24 h-24 relative flex items-center justify-center bg-white">
                {/* Replace this Image component with your actual QR code image */}
                <Image
                  src={scanQRCode}
                  alt="QR Code untuk download aplikasi"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* System requirements */}
        <motion.div
          className="mt-16 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-primary/10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Smartphone className="h-5 w-5 text-primary mr-2" />
            Persyaratan Sistem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Sistem Operasi</p>
              <p className="text-sm text-muted-foreground">Android 6.0 atau lebih tinggi</p>
            </div>
            <div>
              <p className="text-sm font-medium">Ruang Penyimpanan</p>
              <p className="text-sm text-muted-foreground">Minimal 50MB tersedia</p>
            </div>
            <div>
              <p className="text-sm font-medium">Koneksi</p>
              <p className="text-sm text-muted-foreground">Internet diperlukan</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

