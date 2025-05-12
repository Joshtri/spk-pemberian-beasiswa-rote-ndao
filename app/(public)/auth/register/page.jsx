'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react'

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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

// Zod schema
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Username minimal 3 karakter' })
      .max(20, { message: 'Username maksimal 20 karakter' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username hanya boleh mengandung huruf, angka, dan underscore',
      }),
    email: z.string().email({ message: 'Email tidak valid' }),
    password: z
      .string()
      .min(8, { message: 'Password minimal 8 karakter' })
      .regex(/[A-Z]/, { message: 'Harus mengandung minimal 1 huruf besar' })
      .regex(/[0-9]/, { message: 'Harus mengandung minimal 1 angka' })
      .regex(/[^A-Za-z0-9]/, { message: 'Harus mengandung minimal 1 karakter khusus' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  })

// Password requirement checklist
const passwordRequirements = [
  { id: 'length', label: 'Minimal 8 karakter', regex: /^.{8,}$/ },
  { id: 'uppercase', label: 'Minimal 1 huruf besar', regex: /[A-Z]/ },
  { id: 'number', label: 'Minimal 1 angka', regex: /[0-9]/ },
  { id: 'special', label: 'Minimal 1 karakter khusus', regex: /[^A-Za-z0-9]/ },
]

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)

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
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = form.watch('password')

  // Check password requirements
  const checkPasswordRequirements = () => {
    return passwordRequirements.map(req => ({
      ...req,
      valid: req.regex.test(passwordValue),
    }))
  }

  async function onSubmit(data) {
    setIsLoading(true)

    toast.promise(
      api.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
      }),
      {
        loading: 'Sedang memproses pendaftaran...',
        success: response => {
          setSuccess(true)
          return 'Pendaftaran berhasil! Silakan login'
        },
        error: err => {
          let errorMessage = 'Gagal mendaftar. Silakan coba lagi nanti.'

          if (err.response) {
            // Handle specific error messages from API
            if (err.response.status === 400) {
              errorMessage = err.response.data.error || 'Data tidak valid'
            } else if (err.response.status === 409) {
              errorMessage = err.response.data.error || 'Username/email sudah terdaftar'
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

  if (success) {
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
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500 h-8 w-8"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Pendaftaran Berhasil!</CardTitle>
            <CardDescription className="text-center">
              Akun Anda telah berhasil dibuat. Silakan login menggunakan akun Anda.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/auth/login">Masuk ke Akun</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
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
          <CardTitle className="text-2xl font-bold text-center">Daftar Akun Baru</CardTitle>
          <CardDescription className="text-center">
            Masukkan data untuk mendaftar sebagai calon penerima beasiswa
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} autoComplete="username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} autoComplete="email" />
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
                          autoComplete="new-password"
                          onFocus={() => setPasswordFocus(true)}
                          onBlur={() => setPasswordFocus(false)}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {passwordFocus && passwordValue && (
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-muted-foreground">Password harus memenuhi:</p>
                        <ul className="space-y-1">
                          {checkPasswordRequirements().map(req => (
                            <li key={req.id} className="flex items-center gap-2">
                              {req.valid ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span
                                className={req.valid ? 'text-green-500' : 'text-muted-foreground'}
                              >
                                {req.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="********"
                          {...field}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {field.value && passwordValue && (
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        {field.value === passwordValue ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">Password cocok</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-red-500">Password tidak cocok</span>
                          </>
                        )}
                      </div>
                    )}
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
                  'Daftar'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className="text-center text-sm w-full">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Masuk
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
