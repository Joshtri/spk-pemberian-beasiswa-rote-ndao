'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function AdminLayoutGuard({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true })
        const user = res.data.data
        if (user.role !== 'ADMIN') {
          router.replace('/unauthorized')
        } else {
          setAuthorized(true)
        }
      } catch (err) {
        router.replace('/auth/login?redirect=/admin/dashboard')
      }
    }

    checkAuth()
  }, [])

  if (!authorized) return null

  return <>{children}</>
}
