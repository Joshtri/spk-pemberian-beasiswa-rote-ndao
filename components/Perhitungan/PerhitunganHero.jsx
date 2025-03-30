"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PerhitunganHero() {
  const router = useRouter()

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl px-4"
      >
        <Card className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-lg"></div>
          
          <CardContent className="p-8 text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-extrabold text-gray-800 mb-4 relative z-10"
            >
              Perhitungan Penentuan Penerima Beasiswa
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-700 mb-6 text-lg leading-relaxed relative z-10"
            >
              Sistem ini menggunakan metode{" "}
              <span className="font-semibold">SAW (Simple Additive Weighting)</span>{" "}
              dan{" "}
              <span className="font-semibold">
                TOPSIS (Technique for Order Preference by Similarity to Ideal
                Solution)
              </span>{" "}
              untuk menentukan penerima bantuan secara{" "}
              <span className="text-blue-600 font-bold">objektif dan transparan</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push("/admin/perhitungan/saw-topsis")}
              >
                Mulai Perhitungan 🚀
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
