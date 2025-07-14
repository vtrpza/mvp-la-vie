'use client'

import React, { memo, useState, useEffect } from 'react'

// Hook to detect touch devices for performance optimization
const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  
  useEffect(() => {
    const checkTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0
    }
    
    setIsTouchDevice(checkTouchDevice())
  }, [])
  
  return isTouchDevice
}
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  LucideIcon, 
  TrendingUp, 
  AlertCircle, 
  RefreshCw,
  Calendar,
  CheckCircle,
  Activity,
  Heart,
  Sparkles,
  Users,
  Clock,
  Plus,
  MapPin,
  QrCode
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Icon mapping for better client-server compatibility
const iconMap = {
  calendar: Calendar,
  'check-circle': CheckCircle,
  activity: Activity,
  heart: Heart,
  sparkles: Sparkles,
  users: Users,
  clock: Clock,
  plus: Plus,
  'map-pin': MapPin,
  'qr-code': QrCode,
  'trending-up': TrendingUp,
  'alert-circle': AlertCircle,
  'refresh-cw': RefreshCw
} as const

export type IconName = keyof typeof iconMap

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: IconName | LucideIcon
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  badge?: {
    text: string
    variant?: 'default' | 'success' | 'warning' | 'error'
  }
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
  onClick?: () => void
}

const variantStyles = {
  default: {
    bg: 'bg-gray-100',
    icon: 'text-gray-600',
    hover: 'hover:bg-gray-200'
  },
  success: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    hover: 'hover:bg-green-200'
  },
  warning: {
    bg: 'bg-yellow-100',
    icon: 'text-yellow-600',
    hover: 'hover:bg-yellow-200'
  },
  error: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
    hover: 'hover:bg-red-200'
  },
  info: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    hover: 'hover:bg-blue-200'
  }
}

const LoadingSkeleton = memo(() => (
  <Card className="relative overflow-hidden modern-card">
    <CardContent className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 rounded-lg shimmer-effect">
          <div className="w-5 h-5 bg-gray-300 rounded" />
        </div>
        <div className="flex-1">
          <div className="h-4 shimmer-effect rounded mb-2" />
          <div className="h-3 shimmer-effect rounded w-2/3" />
        </div>
      </div>
      <div className="h-8 shimmer-effect rounded mb-2" />
      <div className="h-6 shimmer-effect rounded w-1/2" />
    </CardContent>
    <div className="absolute inset-0 glow-effect" />
  </Card>
))

LoadingSkeleton.displayName = 'LoadingSkeleton'

const ErrorState = memo(({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <Card className="border-red-200 bg-red-50">
    <CardContent className="p-6 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <p className="text-sm text-red-700 mb-3">{error}</p>
      {onRetry && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onRetry}
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      )}
    </CardContent>
  </Card>
))

ErrorState.displayName = 'ErrorState'

export const EnhancedStatCard = memo<StatCardProps>(({
  title,
  value,
  description,
  icon,
  variant = 'default',
  trend,
  badge,
  isLoading = false,
  error,
  onRetry,
  className,
  onClick
}) => {
  const isTouchDevice = useIsTouchDevice()
  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />
  }

  // Get the icon component - support both string names and direct components
  const Icon = typeof icon === 'string' ? iconMap[icon as IconName] : icon
  
  const styles = variantStyles[variant]
  
  const cardContent = (
    <Card 
      className={cn(
        "relative group cursor-pointer modern-card transition-modern",
        // Apply complex animations only on non-touch devices for better performance
        !isTouchDevice && "micro-bounce element-3d glow-effect hover:modern-card-hover",
        "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
        "container-adaptive", // Container query support
        // Mobile-first touch optimization
        isTouchDevice && "touch-manipulation",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={onClick ? `${title}: ${value}. ${description || ''}` : undefined}
    >
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className={cn(
            "p-3 rounded-lg transition-modern relative overflow-hidden",
            // Reduce complex animations on touch devices
            !isTouchDevice && "transition-spring morphing-shape",
            isTouchDevice && "touch-manipulation",
            styles.bg,
            styles.hover
          )}>
            <Icon className={cn("w-5 h-5 relative z-10", styles.icon)} aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-600 truncate text-shadow-soft" id={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 truncate">{description}</p>
            )}
          </div>
          {badge && (
            <Badge 
              className={cn(
                "glass-morphism transition-spring micro-bounce",
                badge.variant === 'success' && "bg-green-100 text-green-800 border-green-300",
                badge.variant === 'warning' && "bg-yellow-100 text-yellow-800 border-yellow-300",
                badge.variant === 'error' && "bg-red-100 text-red-800 border-red-300"
              )}
            >
              {badge.text}
            </Badge>
          )}
        </div>
        
        <div 
          className="text-3xl font-bold text-gradient mb-2 text-shadow-soft"
          aria-describedby={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
          {value}
        </div>
        
        {trend && (
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-spring micro-bounce",
              trend.direction === 'up' && "bg-green-100 text-green-700",
              trend.direction === 'down' && "bg-red-100 text-red-700",
              trend.direction === 'neutral' && "bg-gray-100 text-gray-700"
            )}>
              {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend.direction === 'down' && <TrendingUp className="w-3 h-3 rotate-180" />}
              <span>{trend.label}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Enhanced dynamic light effects - only on non-touch devices */}
      {!isTouchDevice && (
        <>
          <div className="absolute inset-0 progressive-blur pointer-events-none" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 animated-gradient opacity-10" />
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-60 floating-element" />
          <div className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-gradient-to-br from-green-400 to-green-600 opacity-40 floating-element" style={{animationDelay: '2s'}} />
        </>
      )}
    </Card>
  )

  return cardContent
})

EnhancedStatCard.displayName = 'EnhancedStatCard'

// Quick stat card variant for simple use cases
export const QuickStatCard = memo<{
  title: string
  value: string | number
  icon: IconName | LucideIcon
  variant?: StatCardProps['variant']
  isLoading?: boolean
}>(({ title, value, icon, variant, isLoading }) => (
  <EnhancedStatCard
    title={title}
    value={value}
    icon={icon}
    variant={variant}
    isLoading={isLoading}
  />
))

QuickStatCard.displayName = 'QuickStatCard'

export default EnhancedStatCard