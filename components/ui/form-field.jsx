"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export default function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  error,
  disabled = false,
  className = "",
  min,
  max,
  step,
  rows = 3,
}) {
  const [date, setDate] = useState(value ? new Date(value) : null)

  const handleDateChange = (newDate) => {
    setDate(newDate)
    // Format date to ISO string for form submission
    onChange({ target: { name, value: newDate ? newDate.toISOString() : null } })
  }

  const handleCheckboxChange = (checked) => {
    onChange({ target: { name, value: checked } })
  }

  const handleSelectChange = (newValue) => {
    onChange({ target: { name, value: newValue } })
  }

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            id={name}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={className}
            rows={rows}
          />
        )
      case "select":
        return (
          <Select value={value || ""} onValueChange={(val) => handleSelectChange(val)} disabled={disabled}>
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              name={name}
              checked={value || false}
              onCheckedChange={handleCheckboxChange}
              disabled={disabled}
              className={className}
            />
            <label
              htmlFor={name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {placeholder}
            </label>
          </div>
        )
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"} ${className}`}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: id }) : placeholder || "Pilih tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus locale={id} />
            </PopoverContent>
          </Popover>
        )
      case "number":
        return (
          <Input
            type="number"
            id={name}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={className}
            min={min}
            max={max}
            step={step}
          />
        )
      default:
        return (
          <Input
            type={type}
            id={name}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={className}
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
    </div>
  )
}

