'use client'

import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            Beasiswa Rote Ndao
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors"
            >
              Tentang
            </Link>
            <Link
              href="/faq"
              className="text-foreground hover:text-primary transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              Kontak
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="pixel-border"
              >
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild size="sm" className="pixel-border">
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/about"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang
            </Link>
            <Link
              href="/faq"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontak
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Button asChild variant="outline" className="w-full pixel-border">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Masuk
                </Link>
              </Button>
              <Button asChild className="w-full pixel-border">
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  Daftar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
