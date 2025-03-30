import axios from '@/lib/axios'
import { cookies } from 'next/headers'

export async function getUserData() {
  const cookie = cookies().get('auth_token')?.value

  const res = await axios.get('/auth/me', {
    headers: {
      Cookie: `auth_token=${cookie}`,
    },
  })

  return res.data.data
}

export async function getAdminStats() {
  const cookie = cookies().get('auth_token')?.value

  const res = await axios.get('/admin/stats', {
    headers: {
      Cookie: `auth_token=${cookie}`,
    },
  })

  return res.data.data
}
