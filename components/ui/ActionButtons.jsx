'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export default function ActionButtons({ item, onEdit, onDelete, onDetail, customActions = [] }) {
  const [open, setOpen] = useState(false)

  const handleConfirmDelete = () => {
    onDelete?.(item.id)
    setOpen(false)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {/* Primary Actions */}
        <div className="flex flex-wrap gap-2">
          {onEdit && (
            <Button
              size="sm"
              variant="default"
              className="h-8 bg-blue-500 hover:bg-blue-600 flex-shrink-0"
              onClick={() => onEdit(item)}
            >
              <span className="truncate">Edit</span>
            </Button>
          )}

          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              className="h-8 flex-shrink-0"
              onClick={() => setOpen(true)}
            >
              <span className="truncate">Hapus</span>
            </Button>
          )}

          {onDetail && (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 flex-shrink-0"
              onClick={() => onDetail(item)}
            >
              <span className="truncate">Detail</span>
            </Button>
          )}
        </div>

        {/* Custom Actions - will wrap if needed */}
        {customActions.length > 0 && (
          <div className="flex flex-wrap gap-2 border-l pl-2 ml-2">
            {customActions.map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={action.variant || 'outline'}
                className={`h-8 flex-shrink-0 ${action.className || ''}`}
                onClick={() => action.onClick?.(item)}
              >
                <span className="truncate">{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {onDelete && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            </DialogHeader>
            <p>Apakah Anda yakin ingin menghapus data ini?</p>
            <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button
                variant="secondary"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto"
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
