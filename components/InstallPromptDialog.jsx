'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function InstallPromptDialog() {
  const [open, setOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = e => {
      console.log('[PWA] ✨ Event beforeinstallprompt triggered')
      e.preventDefault()
      setDeferredPrompt(e)
      setOpen(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    console.log('[PWA] 🔍 Listening for beforeinstallprompt...')

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice

    if (choice.outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setOpen(false)
    setDeferredPrompt(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install Aplikasi</DialogTitle>
          <DialogDescription>
            Tambahkan aplikasi ini ke layar utama untuk pengalaman lebih baik dan akses cepat.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Nanti Saja
          </Button>
          <Button onClick={handleInstall}>Pasang</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
