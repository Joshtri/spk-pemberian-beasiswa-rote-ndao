'use client'
import { Checkbox } from '@/components/ui/checkbox'

export default function StepConfirmation({ isConfirmed, onCheckedChange }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox id="confirm" checked={isConfirmed} onCheckedChange={onCheckedChange} required />
        <label htmlFor="confirm" className="text-sm text-gray-700">
          Saya menyatakan bahwa data yang saya masukkan adalah benar dan dapat dipertanggungjawabkan
        </label>
      </div>
    </div>
  )
}
