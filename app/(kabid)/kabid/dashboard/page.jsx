"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calculator, Users, Award, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function KabidDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCalonPenerima: 0,
    totalPeriode: 0,
    totalHasilPerhitungan: 0,
    totalLolos: 0,
  })
  const [chartData, setChartData] = useState([])
  const [pieData, setPieData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setStats({
          totalCalonPenerima: 120,
          totalPeriode: 3,
          totalHasilPerhitungan: 350,
          totalLolos: 45,
        })

        setChartData([
          { name: "Periode 1", lolos: 15, tidakLolos: 25 },
          { name: "Periode 2", lolos: 12, tidakLolos: 28 },
          { name: "Periode 3", lolos: 18, tidakLolos: 22 },
        ])

        setPieData([
          { name: "Lolos", value: 45, color: "#4ade80" },
          { name: "Tidak Lolos", value: 75, color: "#f87171" },
        ])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold">Dashboard Kabid</h1>
        <p className="text-muted-foreground">Ringkasan data dan statistik program beasiswa</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calon Penerima</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalCalonPenerima}</div>
            )}
            <p className="text-xs text-muted-foreground">Jumlah pendaftar beasiswa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periode Aktif</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalPeriode}</div>
            )}
            <p className="text-xs text-muted-foreground">Jumlah periode beasiswa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Perhitungan</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalHasilPerhitungan}</div>
            )}
            <p className="text-xs text-muted-foreground">Jumlah hasil perhitungan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penerima Beasiswa</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats.totalLolos}</div>}
            <p className="text-xs text-muted-foreground">Jumlah penerima beasiswa</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Statistik Per Periode</CardTitle>
              <CardDescription>Jumlah calon penerima yang lolos dan tidak lolos per periode</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="w-full h-[300px] flex items-center justify-center">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="lolos" name="Lolos" fill="#4ade80" />
                    <Bar dataKey="tidakLolos" name="Tidak Lolos" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Persentase Kelulusan</CardTitle>
              <CardDescription>Perbandingan jumlah yang lolos dan tidak lolos</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="w-full h-[300px] flex items-center justify-center">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

