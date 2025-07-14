'use client'

import React, { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LucideIcon, 
  ArrowLeft, 
  Plus,
  Calendar,
  CheckCircle,
  Activity,
  Heart,
  Sparkles,
  Users,
  Clock,
  MapPin,
  QrCode
} from 'lucide-react'

// Icon mapping for client-server compatibility
const iconMap = {
  plus: Plus,
  calendar: Calendar,
  'check-circle': CheckCircle,
  activity: Activity,
  heart: Heart,
  sparkles: Sparkles,
  users: Users,
  clock: Clock,
  'map-pin': MapPin,
  'qr-code': QrCode,
  'arrow-left': ArrowLeft
} as const

export type IconName = keyof typeof iconMap
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  description?: string
  icon?: IconName | LucideIcon
  iconClassName?: string
  backLink?: {
    href: string
    label: string
  }
  badge?: {
    text: string
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  }
  actions?: React.ReactNode
  className?: string
  centered?: boolean
  gradient?: boolean
}

const badgeVariants = {
  default: "bg-gray-100 text-gray-800 border-gray-300",
  success: "bg-green-100 text-green-800 border-green-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  error: "bg-red-100 text-red-800 border-red-300",
  info: "bg-blue-100 text-blue-800 border-blue-300"
}

export const PageHeader = memo<PageHeaderProps>(({
  title,
  description,
  icon,
  iconClassName,
  backLink,
  badge,
  actions,
  className,
  centered = false,
  gradient = false
}) => {
  // Get the icon component - support both string names and direct components
  const Icon = icon && (typeof icon === 'string' ? iconMap[icon as IconName] : icon)
  return (
    <header 
      className={cn("space-y-6", className)}
      role="banner"
    >
      {backLink && (
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-4 group"
          >
            <Link 
              href={backLink.href} 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label={`Voltar para ${backLink.label}`}
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              {backLink.label}
            </Link>
          </Button>
        </div>
      )}
      
      <div className={cn(
        "space-y-4",
        centered && "text-center",
        "md:text-left"
      )}>
        {Icon && (
          <div className={cn(
            "flex",
            centered ? "justify-center" : "justify-start"
          )}>
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden",
              gradient 
                ? "bg-gradient-to-br from-blue-400 to-purple-600" 
                : "bg-blue-100",
              "shadow-lg transition-spring hover:scale-105 micro-bounce element-3d morphing-shape glow-effect"
            )}>
              <Icon 
                className={cn(
                  "w-8 h-8 relative z-10 floating-element",
                  gradient ? "text-white" : "text-blue-600",
                  iconClassName
                )} 
                aria-hidden="true"
              />
              <div className="absolute inset-0 animated-gradient opacity-0 hover:opacity-30 transition-opacity duration-300" />
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Mobile-first stacked layout */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className={cn(
              "flex-1 min-w-0",
              centered && "text-center md:text-left"
            )}>
              <h1 
                className="text-fluid-xl font-heading text-gradient mb-2 text-shadow-soft text-balanced"
                id="page-title"
              >
                {title}
              </h1>
              {description && (
                <p 
                  className="text-body text-gray-600 max-w-2xl text-pretty"
                  aria-describedby="page-title"
                >
                  {description}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0">
              {badge && (
                <Badge 
                  className={cn(
                    "font-medium",
                    badgeVariants[badge.variant || 'default']
                  )}
                  aria-label={`Status: ${badge.text}`}
                >
                  {badge.text}
                </Badge>
              )}
              
              {actions && (
                <div className="flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
})

PageHeader.displayName = 'PageHeader'

// Specialized header variants for common use cases
export const DashboardHeader = memo<{
  title: string
  description?: string
  stats?: React.ReactNode
}>(({ title, description, stats }) => (
  <div className="space-y-6">
    <PageHeader 
      title={title}
      description={description}
    />
    {stats && (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats}
      </div>
    )}
  </div>
))

DashboardHeader.displayName = 'DashboardHeader'

export const FormHeader = memo<{
  title: string
  description?: string
  icon?: IconName | LucideIcon
  backLink: PageHeaderProps['backLink']
  progress?: {
    current: number
    total: number
  }
}>(({ title, description, icon, backLink, progress }) => (
  <div className="space-y-6">
    <PageHeader
      title={title}
      description={description}
      icon={icon}
      backLink={backLink}
      centered
      gradient
    />
    {progress && (
      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progresso</span>
          <span>{progress.current} de {progress.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
            role="progressbar"
            aria-valuenow={progress.current}
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-label={`Progresso: ${progress.current} de ${progress.total} etapas concluídas`}
          />
        </div>
      </div>
    )}
  </div>
))

FormHeader.displayName = 'FormHeader'

export const ListHeader = memo<{
  title: string
  description?: string
  itemCount?: number
  createAction?: {
    href: string
    label: string
    icon?: IconName | LucideIcon
  }
}>(({ title, description, itemCount, createAction }) => (
  <PageHeader
    title={title}
    description={description}
    badge={itemCount !== undefined ? {
      text: `${itemCount} item${itemCount !== 1 ? 's' : ''}`,
      variant: 'info'
    } : undefined}
    actions={createAction && (
      <Button 
        asChild 
        size="lg" 
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
      >
        <Link href={createAction.href}>
          {createAction.icon && (() => {
            const Icon = typeof createAction.icon === 'string' 
              ? iconMap[createAction.icon as IconName] 
              : createAction.icon
            return <Icon className="mr-2 h-5 w-5" />
          })()}
          {createAction.label}
        </Link>
      </Button>
    )}
  />
))

ListHeader.displayName = 'ListHeader'

export default PageHeader