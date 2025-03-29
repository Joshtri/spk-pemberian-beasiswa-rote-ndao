import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export function formatDate(dateStr, dateFormat = 'dd MMMM yyyy') {
  if (!dateStr) return '-'
  try {
    return format(parseISO(dateStr), dateFormat, { locale: id })
  } catch (error) {
    console.error('Format date error:', error)
    return dateStr
  }
}
