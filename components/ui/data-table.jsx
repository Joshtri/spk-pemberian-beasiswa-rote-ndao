'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SkeletonTable from './skeleton-table'

export default function DataTable({
  title,
  description,
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Cari...',
  addButtonText = 'Tambah',
  addButtonAction,
  secondaryButtonText,
  secondaryButtonAction,
  secondaryButtonIcon = <Eye className="mr-2 h-4 w-4" />,
  renderActions,
  renderCustomFilters,
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter data based on search term
  const filteredData = data.filter(item => {
    if (!searchTerm) return true
    return item[searchKey]?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center gap-2 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <a href="/admin/dashboard" className="text-muted-foreground hover:text-foreground">
          Home
        </a>
        <span className="text-muted-foreground">/</span>
        <span>{title}</span>
      </motion.div>

      <motion.h1
        className="text-2xl font-bold mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {title}
      </motion.h1>

      {description && (
        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {description}
        </motion.p>
      )}

      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-6 justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {renderCustomFilters && renderCustomFilters()}
        </div>

        <div className="flex gap-2">
          {addButtonText && (
            <Button className="bg-primary hover:bg-primary/90" onClick={addButtonAction}>
              <Plus className="mr-2 h-4 w-4" />
              {addButtonText}
            </Button>
          )}
          {secondaryButtonText && (
            <Button
              variant="outline"
              className="bg-green-500 hover:bg-green-600 text-white border-0"
              onClick={secondaryButtonAction}
            >
              {secondaryButtonIcon}
              {secondaryButtonText}
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        className="bg-white rounded-md border shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {isLoading || !data ? (
          <SkeletonTable rows={10} cols={columns.length + (renderActions ? 1 : 0)} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index} className={column.className || ''}>
                    {column.header}
                  </TableHead>
                ))}
                {renderActions && <TableHead className="text-center">AKSI</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (renderActions ? 1 : 0)}
                    className="text-center py-8"
                  >
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-muted/50">
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={column.cellClassName || ''}>
                        {column.cell ? column.cell(item) : item[column.accessorKey]}
                      </TableCell>
                    ))}
                    {renderActions && (
                      <TableCell>
                        <div className="flex justify-center gap-2">{renderActions(item)}</div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant="outline"
                size="icon"
                className={`h-8 w-8 ${currentPage === page ? 'bg-primary text-white' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
