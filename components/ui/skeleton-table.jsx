import React from 'react'
import clsx from 'clsx'

/**
 * Reusable Skeleton Table Component
 *
 * @param {number} rows - Jumlah baris
 * @param {number} cols - Jumlah kolom
 * @param {string} className - Optional tambahan kelas Tailwind
 */
export default function SkeletonTable({ rows = 5, cols = 5, className = '' }) {
  return (
    <div className={clsx('animate-pulse space-y-4', className)}>
      {/* Header Skeleton */}
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {Array.from({ length: cols }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
