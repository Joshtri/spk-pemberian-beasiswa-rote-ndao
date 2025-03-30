import { Suspense } from "react"
import HasilPerhitunganClient from "./HasilPerhitunganClient"


export default function HasilPerhitunganPage() {
  return (
    <Suspense fallback={<div className="p-6">Memuat hasil perhitungan...</div>}>
      <HasilPerhitunganClient />
    </Suspense>
  )
}
