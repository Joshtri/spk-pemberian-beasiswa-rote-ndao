'use client'

import { useEffect, useState, forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Controller } from 'react-hook-form'

const FormField = forwardRef(
  (
    {
      label,
      type = 'text',
      name,
      placeholder,
      required = false,
      options = [],
      error,
      disabled = false,
      className = '',
      min,
      max,
      step,
      rows = 3,
      value,
      onChange,
      control,
      rules,
      ...rest
    },
    ref
  ) => {
    const [date, setDate] = useState(value ? new Date(value) : null)

    useEffect(() => {
      if (type === 'date') {
        setDate(value ? new Date(value) : null)
      }
    }, [value, type])

    const renderField = () => {
      if (type === 'date' && control) {
        return (
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !field.value && 'text-muted-foreground'
                    } ${className}`}
                    disabled={disabled}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? format(new Date(field.value), 'PPP', { locale: id })
                      : placeholder || 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={date => field.onChange(date?.toISOString())}
                    locale={id}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        )
      }

      switch (type) {
        case 'textarea':
          return (
            <Textarea
              id={name}
              name={name}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={className}
              rows={rows}
              value={value}
              onChange={onChange}
              ref={ref}
              {...rest}
            />
          )
        case 'select':
          if (control) {
            return (
              <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                    <SelectTrigger className={className}>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )
          }
          return null

        case 'checkbox':
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={name}
                name={name}
                checked={value}
                onCheckedChange={val =>
                  onChange ? onChange({ target: { name, value: val } }) : rest.onChange?.(val)
                }
                disabled={disabled}
                className={className}
                ref={ref}
                {...rest}
              />
              <label
                htmlFor={name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {placeholder}
              </label>
            </div>
          )

        case 'file':
          return (
            <Input
              type="file"
              id={name}
              name={name}
              required={required}
              disabled={disabled}
              className={className}
              onChange={onChange}
              accept="application/pdf"
              ref={ref}
              {...rest}
            />
          )

        case 'number':
          return (
            <Input
              type="number"
              id={name}
              name={name}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={className}
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={onChange}
              ref={ref}
              {...rest}
            />
          )
        default:
          return (
            <Input
              type={type}
              id={name}
              name={name}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={className}
              value={value}
              onChange={onChange}
              ref={ref}
              {...rest}
            />
          )
      }
    }

    return (
      <div className="space-y-2 mb-4">
        {label && (
          <Label htmlFor={name} className="text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        {renderField()}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {rest.children} {/* Tambahkan ini agar preview bisa tetap muncul */}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export default FormField
