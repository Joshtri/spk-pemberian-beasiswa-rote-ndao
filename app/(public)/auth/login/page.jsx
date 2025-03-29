'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { ArrowLeft } from 'lucide-react'

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
import { Loader2 } from 'lucide-react'

// Schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(1, { message: 'Password harus diisi' }),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  // Check if device is mobile on client side
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typical md breakpoint
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data) {
    setIsLoading(true)

    toast.promise(
      api.post('/auth/login', data, {
        withCredentials: true, // Important for cookies
      }),
      {
        loading: 'Sedang memproses login...',
        success: response => {
          // Redirect based on role
          const role = response.data.data?.role
          const redirectPath =
            role === 'ADMIN'
              ? '/admin/dashboard'
              : role === 'CALON_PENERIMA'
                ? '/kandidat/dashboard'
                : '/kabid/dashboard'
          router.push(redirectPath)
          return 'Login berhasil!'
        },
        error: err => {
          let errorMessage = 'Gagal login. Silakan coba lagi.'

          if (err.response) {
            // Handle specific error cases
            if (err.response.status === 400) {
              errorMessage = err.response.data.message || 'Data tidak valid'
            } else if (err.response.status === 401) {
              errorMessage = err.response.data.message || 'Email atau password salah'
            } else if (err.response.status === 403) {
              errorMessage = err.response.data.message || 'Akun dinonaktifkan'
            }
          }

          return errorMessage
        },
        finally: () => {
          setIsLoading(false)
        },
      }
    )
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
          Kembali ke Dashboard
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
                      <Input placeholder="nama@email.com" {...field} autoComplete="email" />
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
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
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
