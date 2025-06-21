'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { ArrowLeft, Loader2, Eye, EyeOff, Check, X } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(1, { message: 'Password harus diisi' }),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Check if device is mobile on client side
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Handle account lock countdown
  useEffect(() => {
    let timer
    if (isLocked && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0 && isLocked) {
      setIsLocked(false)
    }
    return () => clearTimeout(timer)
  }, [countdown, isLocked])

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data) {
    if (isLocked) {
      toast.error(`Akun terkunci sementara. Coba lagi dalam ${countdown} detik.`)
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', data, {
        withCredentials: true,
      })

      // Show success notification with checkmark
      toast.success('Login berhasil!', {
        icon: <Check className="h-5 w-5 text-green-500" />,
        description: 'Anda akan diarahkan ke dashboard',
      })

      // Redirect based on role with slight delay for UX
      setTimeout(() => {
        const role = response.data.data?.role
        const redirectPath =
          role === 'ADMIN'
            ? '/admin/dashboard'
            : role === 'CALON_PENERIMA'
              ? '/kandidat/dashboard'
              : '/kabid/dashboard'
        router.replace(redirectPath)
      }, 1000)
    } catch (err) {
      let errorMessage = 'Gagal login. Silakan coba lagi.'
      let shouldLock = false

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Data tidak valid'
        } else if (err.response.status === 401) {
          errorMessage = err.response.data.message || 'Email atau password salah'
          setLoginAttempts(prev => prev + 1)
        } else if (err.response.status === 403) {
          errorMessage = err.response.data.message || 'Akun dinonaktifkan'
        } else if (err.response.status === 429) {
          errorMessage = 'Terlalu banyak percobaan. Coba lagi nanti.'
          shouldLock = true
        }
      }

      

      // Show error notification with X icon
      toast.error(errorMessage, {
        icon: <X className="h-5 w-5 text-red-500" />,
      })

      // Lock account after 3 failed attempts
      if (loginAttempts >= 2 || shouldLock) {
        setIsLocked(true)
        setCountdown(30) // 30 seconds lock
        toast.warning('Akun terkunci sementara selama 30 detik', {
          description: 'Terlalu banyak percobaan login yang gagal',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4 relative">
      {/* Back to Dashboard button - only visible on desktop */}
      {!isMobile && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 left-4 hidden md:flex items-center gap-1"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Button>
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <Link href="/" className="text-primary font-bold text-2xl">
              Beasiswa Rote Ndao
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Masuk ke Akun</CardTitle>
          <CardDescription className="text-center">
            Masukkan email dan password Anda untuk mengakses akun
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nama@email.com"
                        {...field}
                        autoComplete="email"
                        disabled={isLocked}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          {...field}
                          autoComplete="current-password"
                          className="pr-10"
                          disabled={isLocked}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLocked}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Eye className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    {isLocked && (
                      <p className="text-sm text-red-500 mt-1">Coba lagi dalam {countdown} detik</p>
                    )}
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading || isLocked}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/forgot-password" className="hover:text-primary">
              Lupa password?
            </Link>
          </div>
          <div className="text-center text-sm">
            Belum memiliki akun?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
