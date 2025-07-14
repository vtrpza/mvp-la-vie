'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { useHapticFeedback } from '@/lib/hooks/use-haptic-feedback'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  User, 
  Bell,
  HelpCircle,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Home,
  Plus,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

// Legacy interface for backward compatibility
interface DashboardHeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
  onMenuToggle?: () => void
  showMobileMenu?: boolean
}

// Enhanced interface with new features
export interface EnhancedDashboardHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    avatar?: string | null
  }
  onMenuToggle?: () => void
  showMobileMenu?: boolean
  notifications?: {
    count: number
    hasUnread: boolean
  }
  breadcrumbs?: Array<{
    label: string
    href?: string
    icon?: React.ComponentType<{ className?: string }>
  }>
  className?: string
}

// Optimized initials calculation with memoization
const useInitials = (name?: string | null, email?: string | null) => {
  return useMemo(() => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email?.[0]?.toUpperCase() || 'U'
  }, [name, email])
}

// Enhanced breadcrumb component
const Breadcrumbs = memo<{ 
  breadcrumbs?: EnhancedDashboardHeaderProps['breadcrumbs'] 
}>(({ breadcrumbs }) => {
  if (!breadcrumbs?.length) return null

  return (
    <nav 
      className="hidden lg:flex items-center space-x-2 text-sm"
      aria-label="Breadcrumb"
    >
      <Link 
        href="/dashboard" 
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
        aria-label="Ir para dashboard"
      >
        <Home className="w-4 h-4" />
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {crumb.href ? (
            <Link 
              href={crumb.href}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {crumb.icon && <crumb.icon className="w-4 h-4 mr-1" />}
              {crumb.label}
            </Link>
          ) : (
            <span className="flex items-center text-gray-900 font-medium">
              {crumb.icon && <crumb.icon className="w-4 h-4 mr-1" />}
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
})

Breadcrumbs.displayName = 'Breadcrumbs'

// Enhanced notification bell
const NotificationBell = memo<{
  notifications?: EnhancedDashboardHeaderProps['notifications']
}>(({ notifications }) => {
  if (!notifications) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative p-2 hover:bg-gray-100 transition-colors duration-200 group min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center"
      aria-label={`${notifications.count} notificações${notifications.hasUnread ? ' não lidas' : ''}`}
    >
      <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
      {notifications.count > 0 && (
        <Badge 
          className={cn(
            "absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs flex items-center justify-center p-0 rounded-full",
            notifications.hasUnread 
              ? "bg-red-500 text-white" 
              : "bg-gray-400 text-white"
          )}
          aria-hidden="true"
        >
          {notifications.count > 99 ? '99+' : notifications.count}
        </Badge>
      )}
    </Button>
  )
})

NotificationBell.displayName = 'NotificationBell'

// Enhanced avatar with loading and error states
const EnhancedAvatar = memo<{
  user: EnhancedDashboardHeaderProps['user']
  initials: string
  isLoading?: boolean
}>(({ user, initials, isLoading }) => {
  return (
    <div className="relative group">
      <Avatar 
        className={cn(
          "h-8 w-8 transition-colors duration-200 cursor-pointer",
          "group-hover:ring-2 group-hover:ring-blue-200 group-hover:ring-offset-2",
          "group-data-[state=open]:ring-2 group-data-[state=open]:ring-blue-300 group-data-[state=open]:ring-offset-2",
          "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2",
          isLoading && "opacity-75"
        )}
      >
        <AvatarFallback 
          className={cn(
            "bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold",
            "group-hover:from-blue-500 group-hover:to-blue-700 transition-colors duration-200"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            initials
          )}
        </AvatarFallback>
      </Avatar>
      
      {/* Simple status indicator */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
    </div>
  )
})

EnhancedAvatar.displayName = 'EnhancedAvatar'

// Main enhanced component
const EnhancedDashboardHeaderComponent = memo<EnhancedDashboardHeaderProps>(({
  user,
  onMenuToggle,
  showMobileMenu = false,
  notifications,
  breadcrumbs,
  className
}) => {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const pathname = usePathname()
  const initials = useInitials(user.name, user.email)
  const { triggerHaptic } = useHapticFeedback()

  // Optimized sign out handler
  const handleSignOut = useCallback(async () => {
    try {
      setIsSigningOut(true)
      setSignOutError(null)
      
      await signOut({ 
        callbackUrl: '/login',
        redirect: true
      })
    } catch (error) {
      console.error('Sign out error:', error)
      setSignOutError('Erro ao fazer logout. Tente novamente.')
      setIsSigningOut(false)
    }
  }, [])

  // Retry sign out
  const handleRetrySignOut = useCallback(() => {
    setSignOutError(null)
    handleSignOut()
  }, [handleSignOut])

  // Mobile menu toggle
  const handleMobileMenuToggle = useCallback(() => {
    triggerHaptic('light')
    onMenuToggle?.()
  }, [onMenuToggle, triggerHaptic])

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b z-40",
        "transition-colors duration-200",
        className
      )}
      role="banner"
    >
      <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            {/* Mobile menu button */}
            {onMenuToggle && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 hover:bg-gray-100 transition-colors duration-200 rounded-lg"
                onClick={handleMobileMenuToggle}
                aria-label={showMobileMenu ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={showMobileMenu}
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            )}

            {/* Logo */}
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-3 group transition-colors duration-200 hover:opacity-90"
              aria-label="Ir para dashboard - La'vie Pet"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900 font-display">
                    La&apos;vie Pet
                  </span>
                  <div className="hidden sm:block">
                    <span className="text-xs text-gray-500 font-medium">
                      Banho Experience
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Breadcrumbs */}
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Quick Schedule Button - Mobile First */}

            {/* Notifications */}
            <NotificationBell notifications={notifications} />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-auto p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group min-w-[44px] min-h-[44px] flex items-center justify-center"
                  disabled={isSigningOut}
                  aria-label={`Menu do usuário - ${user.name || user.email}`}
                >
                  <EnhancedAvatar 
                    user={user} 
                    initials={initials} 
                    isLoading={isSigningOut}
                  />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                className="w-64 mr-2 mt-2 shadow-lg border-gray-200 animate-in slide-in-from-top-2" 
                align="end" 
                forceMount
                sideOffset={8}
              >
                {/* User info */}
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex items-start space-x-3">
                    <EnhancedAvatar user={user} initials={initials} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <Badge 
                        variant="outline" 
                        className="mt-2 text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        ✓ Verificado
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />

                {/* Quick Actions */}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/dashboard/agendamentos/novo"
                    className="flex items-center px-4 py-2 transition-colors duration-200 text-yellow-700 font-medium"
                  >
                    <Calendar className="mr-3 h-4 w-4" />
                    <span>Novo Agendamento</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link 
                    href="/dashboard/agendamentos"
                    className={cn(
                      "flex items-center px-4 py-2 transition-colors duration-200",
                      pathname === '/dashboard/agendamentos' && "bg-blue-50 text-blue-700"
                    )}
                  >
                    <Calendar className="mr-3 h-4 w-4" />
                    <span>Meus Agendamentos</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Navigation items */}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/dashboard/perfil"
                    className={cn(
                      "flex items-center px-4 py-2 transition-colors duration-200",
                      pathname === '/dashboard/perfil' && "bg-blue-50 text-blue-700"
                    )}
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link 
                    href="/dashboard/ajuda"
                    className={cn(
                      "flex items-center px-4 py-2 transition-colors duration-200",
                      pathname === '/dashboard/ajuda' && "bg-blue-50 text-blue-700"
                    )}
                  >
                    <HelpCircle className="mr-3 h-4 w-4" />
                    <span>Central de Ajuda</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sign out */}
                {signOutError ? (
                  <div className="px-4 py-2">
                    <p className="text-xs text-red-600 mb-2">{signOutError}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleRetrySignOut}
                      className="w-full"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                ) : (
                  <DropdownMenuItem
                    className="flex items-center px-4 py-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer transition-colors duration-200"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>{isSigningOut ? 'Saindo...' : 'Sair da Conta'}</span>
                    {isSigningOut && (
                      <div className="ml-auto w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                    )}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Loading overlay when signing out */}
      {isSigningOut && (
        <div 
          className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center"
          role="status"
          aria-label="Fazendo logout..."
        >
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm text-gray-700">Fazendo logout...</span>
          </div>
        </div>
      )}
    </header>
  )
})

EnhancedDashboardHeaderComponent.displayName = 'EnhancedDashboardHeader'

// Mobile Navigation Menu Component
export const MobileNavMenu = memo<{
  isOpen: boolean
  onClose: () => void
  user: {
    name?: string | null
    email?: string | null
  }
}>(({ isOpen, onClose, user }) => {
  const pathname = usePathname()
  const { triggerHaptic } = useHapticFeedback()

  // Enhanced close handler with haptic feedback
  const handleClose = useCallback(() => {
    triggerHaptic('light')
    onClose()
  }, [onClose, triggerHaptic])

  // Enhanced link click handler with haptic feedback
  const handleLinkClick = useCallback((href: string) => {
    triggerHaptic('medium')
    onClose()
  }, [onClose, triggerHaptic])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">La&apos;vie Pet</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2 rounded-lg"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-gray-50">
            <p className="font-semibold text-gray-900">{user.name || 'Usuário'}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {/* Quick Actions */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ações Rápidas
              </div>
              
              <Link
                href="/dashboard/agendamentos/novo"
                onClick={onClose}
                className="flex items-center w-full px-3 py-3 text-left rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-3" />
                <span>Novo Agendamento</span>
              </Link>

              <Link
                href="/dashboard/agendamentos"
                onClick={onClose}
                className={cn(
                  "flex items-center w-full px-3 py-3 text-left rounded-lg transition-colors duration-200",
                  pathname === '/dashboard/agendamentos'
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Calendar className="w-5 h-5 mr-3" />
                <span>Meus Agendamentos</span>
              </Link>

              {/* Main Navigation */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6">
                Navegação
              </div>

              <Link
                href="/dashboard"
                onClick={onClose}
                className={cn(
                  "flex items-center w-full px-3 py-3 text-left rounded-lg transition-colors duration-200",
                  pathname === '/dashboard'
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Home className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/dashboard/perfil"
                onClick={onClose}
                className={cn(
                  "flex items-center w-full px-3 py-3 text-left rounded-lg transition-colors duration-200",
                  pathname === '/dashboard/perfil'
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <User className="w-5 h-5 mr-3" />
                <span>Meu Perfil</span>
              </Link>

              <Link
                href="/dashboard/ajuda"
                onClick={onClose}
                className={cn(
                  "flex items-center w-full px-3 py-3 text-left rounded-lg transition-colors duration-200",
                  pathname === '/dashboard/ajuda'
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <HelpCircle className="w-5 h-5 mr-3" />
                <span>Central de Ajuda</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

MobileNavMenu.displayName = 'MobileNavMenu'

// Legacy component for backward compatibility
export function DashboardHeader({ user }: DashboardHeaderProps) {
  return <EnhancedDashboardHeaderComponent user={user} />
}

// Enhanced component export
export const EnhancedDashboardHeader = EnhancedDashboardHeaderComponent

// Default export for enhanced version
export default EnhancedDashboardHeaderComponent