'use client'

import React, { memo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Base skeleton component with shimmer effect
const Skeleton = memo<{
  className?: string
  children?: React.ReactNode
}>(({ className, children }) => (
  <div 
    className={cn(
      "animate-pulse bg-gray-200 rounded",
      className
    )}
    role="status"
    aria-label="Carregando..."
  >
    {children}
  </div>
))

Skeleton.displayName = 'Skeleton'

// Shimmer effect overlay
const ShimmerOverlay = memo(() => (
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer pointer-events-none" />
))

ShimmerOverlay.displayName = 'ShimmerOverlay'

// Page header skeleton
export const PageHeaderSkeleton = memo<{
  showBackButton?: boolean
  showActions?: boolean
  centered?: boolean
}>(({ showBackButton = false, showActions = false, centered = false }) => (
  <div className="space-y-6">
    {showBackButton && (
      <Skeleton className="h-8 w-32 mb-4" />
    )}
    
    <div className={cn(
      "space-y-4",
      centered && "text-center"
    )}>
      {/* Icon placeholder */}
      <div className={cn(
        "flex",
        centered ? "justify-center" : "justify-start"
      )}>
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className={cn(
            "flex-1 min-w-0 space-y-2",
            centered && "text-center"
          )}>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          
          {showActions && (
            <Skeleton className="h-10 w-32" />
          )}
        </div>
      </div>
    </div>
  </div>
))

PageHeaderSkeleton.displayName = 'PageHeaderSkeleton'

// Stat card skeleton (already in EnhancedStatCard, but standalone version)
export const StatCardSkeleton = memo<{
  count?: number
  className?: string
}>(({ count = 1, className }) => (
  <div className={cn("grid gap-6 md:grid-cols-3", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="p-3 rounded-lg w-11 h-11" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-6 w-20" />
        </CardContent>
        <ShimmerOverlay />
      </Card>
    ))}
  </div>
))

StatCardSkeleton.displayName = 'StatCardSkeleton'

// List item skeleton for appointments, etc.
export const ListItemSkeleton = memo<{
  count?: number
  showImage?: boolean
  showActions?: boolean
}>(({ count = 3, showImage = true, showActions = true }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              {showImage && (
                <Skeleton className="w-14 h-14 rounded-xl" />
              )}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            
            {showActions && (
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            )}
          </div>
        </CardContent>
        <ShimmerOverlay />
      </Card>
    ))}
  </div>
))

ListItemSkeleton.displayName = 'ListItemSkeleton'

// Form skeleton
export const FormSkeleton = memo<{
  fieldCount?: number
  showSubmit?: boolean
}>(({ fieldCount = 4, showSubmit = true }) => (
  <Card className="relative overflow-hidden">
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent className="space-y-6">
      {Array.from({ length: fieldCount }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      
      {showSubmit && (
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}
    </CardContent>
    <ShimmerOverlay />
  </Card>
))

FormSkeleton.displayName = 'FormSkeleton'

// Table skeleton
export const TableSkeleton = memo<{
  rows?: number
  columns?: number
}>(({ rows = 5, columns = 4 }) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="p-4">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
    <ShimmerOverlay />
  </Card>
))

TableSkeleton.displayName = 'TableSkeleton'

// Full page skeleton
export const PageSkeleton = memo<{
  showHeader?: boolean
  showStats?: boolean
  showList?: boolean
  showForm?: boolean
}>(({ 
  showHeader = true, 
  showStats = false, 
  showList = false, 
  showForm = false 
}) => (
  <div className="space-y-8">
    {showHeader && <PageHeaderSkeleton showActions />}
    {showStats && <StatCardSkeleton count={3} />}
    {showList && <ListItemSkeleton count={3} />}
    {showForm && <FormSkeleton />}
  </div>
))

PageSkeleton.displayName = 'PageSkeleton'

// Grid skeleton for cards
export const GridSkeleton = memo<{
  items?: number
  columns?: number
}>(({ items = 6, columns = 3 }) => (
  <div className={cn(
    "grid gap-6",
    columns === 2 && "md:grid-cols-2",
    columns === 3 && "md:grid-cols-3",
    columns === 4 && "md:grid-cols-4"
  )}>
    {Array.from({ length: items }).map((_, i) => (
      <Card key={i} className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
        <ShimmerOverlay />
      </Card>
    ))}
  </div>
))

GridSkeleton.displayName = 'GridSkeleton'

// Text content skeleton
export const TextSkeleton = memo<{
  lines?: number
  className?: string
}>(({ lines = 3, className }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={cn(
          "h-4",
          i === lines - 1 ? "w-3/4" : "w-full"
        )} 
      />
    ))}
  </div>
))

TextSkeleton.displayName = 'TextSkeleton'

export { Skeleton }
export default Skeleton