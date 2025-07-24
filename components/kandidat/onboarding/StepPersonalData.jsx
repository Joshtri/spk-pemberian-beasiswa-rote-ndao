'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import FormField from '@/components/ui/form-field'
import { useFormContext } from 'react-hook-form'
import { useState } from 'react'

export default function StepPersonalData({ errors }) {
  const { register, setValue, watch } = useFormContext()
  const [open, setOpen] = useState(false)

  const kecamatanList = [
    'Rote Barat Daya',
    'Rote Barat Laut',
    'Lobalain',
    'Rote Tengah',
    'Pantai Baru',
    'Rote Timur',
    'Rote Barat',
    'Rote Selatan',
    'Ndao Nuse',
    'Landu Leko',
  ]

  const selectedKecamatan = watch('kecamatan')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Nama Lengkap"
          name="nama_lengkap"
          error={errors.nama_lengkap?.message}
          {...register('nama_lengkap', { required: 'Nama wajib diisi' })}
        />
        <FormField
          label="Tanggal Lahir"
          type="date"
          name="tanggal_lahir"
          error={errors.tanggal_lahir?.message}
          {...register('tanggal_lahir', { required: 'Tanggal lahir wajib diisi' })}
        />
      </div>

      <FormField
        label="Alamat"
        type="textarea"
        name="alamat"
        error={errors.alamat?.message}
        {...register('alamat', { required: 'Alamat wajib diisi' })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="RT/RW"
          name="rt_rw"
          error={errors.rt_rw?.message}
          {...register('rt_rw', { required: 'RT/RW wajib diisi' })}
        />
        <FormField
          label="Kelurahan/Desa"
          name="kelurahan_desa"
          error={errors.kelurahan_desa?.message}
          {...register('kelurahan_desa', { required: 'Kelurahan/Desa wajib diisi' })}
        />

        {/* Combobox Kecamatan */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Kecamatan</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedKecamatan || 'Pilih kecamatan...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Cari kecamatan..." />
                <CommandList>
                  <CommandEmpty>Kecamatan tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {kecamatanList.map(item => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={() => {
                          setValue('kecamatan', item, { shouldValidate: true })
                          setOpen(false)
                        }}
                      >
                        {item}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedKecamatan === item ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.kecamatan?.message && (
            <p className="text-sm text-red-500">{errors.kecamatan.message}</p>
          )}
        </div>

        <FormField
          label="Kabupaten"
          name="kabupaten"
          disabled
          value="Rote Ndao"
          {...register('kabupaten')}
        />
      </div>
    </div>
  )
}
