'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function CalonPenerimaLayoutGuard({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true })
        const user = res.data.data
        if (user.role !== 'KEPALA_BIDANG') {
          router.replace('/unauthorized')
        } else {
          setAuthorized(true)
        }
      } catch (err) {
        router.replace('/auth/login?redirect=/kabid/dashboard')
      }
    }

    checkAuth()
  }, [])

  if (!authorized) return null

  return <>{children}</>
}
