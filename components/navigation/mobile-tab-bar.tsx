'use client'

import React, { useState, useEffect, memo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useHapticFeedback } from '@/lib/hooks/use-haptic-feedback'
import { 
  Home, 
  Calendar, 
  User, 
  HelpCircle, 
  Plus,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TabItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  activeIcon?: React.ComponentType<{ className?: string }>
  badge?: {
    count?: number
    dot?: boolean
    variant?: 'default' | 'success' | 'warning' | 'error'
  }
  isSpecial?: boolean // For the main action button
}

interface MobileTabBarProps {
  className?: string
  onTabChange?: (tabId: string) => void
}

const tabItems: TabItem[] = [
  {
    id: 'dashboard',
    label: 'Início',
    href: '/dashboard',
    icon: Home,
    activeIcon: Home
  },
  {
    id: 'agendamentos',
    label: 'Agendamentos',
    href: '/dashboard/agendamentos',
    icon: Calendar,
    activeIcon: Calendar,
    badge: {
      dot: true,
      variant: 'success'
    }
  },
  {
    id: 'novo-agendamento',
    label: 'Agendar',
    href: '/dashboard/agendamentos/novo',
    icon: Plus,
    activeIcon: Plus,
    isSpecial: true
  },
  {
    id: 'perfil',
    label: 'Perfil',
    href: '/dashboard/perfil',
    icon: User,
    activeIcon: User
  },
  {
    id: 'ajuda',
    label: 'Ajuda',
    href: '/dashboard/ajuda',
    icon: HelpCircle,
    activeIcon: HelpCircle
  }
]

const TabBarItem = memo<{
  item: TabItem
  isActive: boolean
  onPress: () => void
}>(({ item, isActive, onPress }) => {
  const [isPressed, setIsPressed] = useState(false)
  const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon

  const handleTouchStart = useCallback(() => {
    setIsPressed(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
    onPress()
  }, [onPress])

  if (item.isSpecial) {
    return (
      <Link href={item.href} className="flex justify-center">
        <button
          className={cn(
            "relative flex flex-col items-center justify-center",
            "w-14 h-14 rounded-full transition-all duration-200",
            "bg-lavie-yellow hover:bg-lavie-black text-lavie-black hover:text-lavie-yellow shadow-lg",
            "transform hover:scale-110 active:scale-95 touch-manipulation",
            "focus:outline-none focus:ring-2 focus:ring-lavie-yellow/50 focus:ring-offset-2",
            "border-2 border-lavie-black/10",
            isPressed && "scale-95"
          )}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onMouseLeave={() => setIsPressed(false)}
          aria-label={item.label}
        >
          <Icon className="w-6 h-6" />
          
          {/* Enhanced ripple effect */}
          <div className="absolute inset-0 rounded-full bg-lavie-white opacity-0 hover:opacity-20 transition-opacity duration-200" />
          
          {/* Pulse when pressed */}
          {isPressed && (
            <div className="absolute inset-0 rounded-full bg-lavie-white opacity-30 animate-ping" />
          )}
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lavie-yellow to-lavie-yellow opacity-20 blur-lg" />
        </button>
      </Link>
    )
  }

  return (
    <Link href={item.href} className="flex-1">
      <button
        className={cn(
          "relative w-full flex flex-col items-center justify-center py-2 px-1",
          "transition-all duration-200 touch-manipulation group",
          "focus:outline-none focus:bg-lavie-yellow/10 rounded-lg",
          isActive && "text-lavie-black",
          !isActive && "text-lavie-black/60 hover:text-lavie-black",
          isPressed && "bg-lavie-yellow/10"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => setIsPressed(false)}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Icon with badge */}
        <div className="relative mb-1">
          <Icon 
            className={cn(
              "w-6 h-6 transition-all duration-200",
              isActive && "scale-110",
              isPressed && "scale-95"
            )} 
          />
          
          {/* Badge */}
          {item.badge && (
            <div className="absolute -top-2 -right-2">
              {item.badge.dot ? (
                <div 
                  className={cn(
                    "w-3 h-3 rounded-full",
                    item.badge.variant === 'success' && "bg-green-500",
                    item.badge.variant === 'warning' && "bg-yellow-500", 
                    item.badge.variant === 'error' && "bg-red-500",
                    !item.badge.variant && "bg-blue-500"
                  )}
                />
              ) : item.badge.count && item.badge.count > 0 ? (
                <Badge 
                  className={cn(
                    "min-w-[18px] h-[18px] text-xs flex items-center justify-center p-0 rounded-full",
                    item.badge.variant === 'success' && "bg-green-500 text-white",
                    item.badge.variant === 'warning' && "bg-yellow-500 text-black",
                    item.badge.variant === 'error' && "bg-red-500 text-white",
                    !item.badge.variant && "bg-blue-500 text-white"
                  )}
                >
                  {item.badge.count > 99 ? '99+' : item.badge.count}
                </Badge>
              ) : null}
            </div>
          )}
        </div>

        {/* Label */}
        <span 
          className={cn(
            "text-xs font-medium transition-all duration-200 truncate max-w-full",
            isActive && "text-lavie-black font-semibold",
            !isActive && "text-lavie-black/60"
          )}
        >
          {item.label}
        </span>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-lavie-yellow rounded-full animate-pulse" />
        )}

        {/* Tap feedback */}
        {isPressed && (
          <div className="absolute inset-0 bg-lavie-yellow/30 rounded-lg" />
        )}
      </button>
    </Link>
  )
})

TabBarItem.displayName = 'TabBarItem'

export const MobileTabBar = memo<MobileTabBarProps>(({ 
  className, 
  onTabChange 
}) => {
  const pathname = usePathname()
  const { triggerHaptic } = useHapticFeedback()
  const [previousTab, setPreviousTab] = useState<string>('')

  // Determine active tab based on pathname
  const activeTabId = React.useMemo(() => {
    const tab = tabItems.find(item => {
      if (item.href === '/dashboard' && pathname === '/dashboard') {
        return true
      }
      if (item.href !== '/dashboard' && pathname.startsWith(item.href)) {
        return true
      }
      return false
    })
    return tab?.id || 'dashboard'
  }, [pathname])

  // Handle tab press with haptic feedback
  const handleTabPress = useCallback((tabId: string) => {
    if (tabId !== activeTabId) {
      triggerHaptic('light')
      setPreviousTab(activeTabId)
      onTabChange?.(tabId)
    }
  }, [activeTabId, triggerHaptic, onTabChange])

  // Swipe gesture detection
  useEffect(() => {
    let startX = 0
    let startY = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches[0]) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaX = endX - startX
      const deltaY = endY - startY

      // Only process horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        const currentIndex = tabItems.findIndex(item => item.id === activeTabId)
        
        if (deltaX > 0 && currentIndex > 0) {
          // Swipe right - go to previous tab
          const prevTab = tabItems[currentIndex - 1]
          if (!prevTab.isSpecial) {
            triggerHaptic('medium')
            window.location.href = prevTab.href
          }
        } else if (deltaX < 0 && currentIndex < tabItems.length - 1) {
          // Swipe left - go to next tab
          const nextTab = tabItems[currentIndex + 1]
          if (!nextTab.isSpecial) {
            triggerHaptic('medium')
            window.location.href = nextTab.href
          }
        }
      }
    }

    const tabBar = document.getElementById('mobile-tab-bar')
    if (tabBar) {
      tabBar.addEventListener('touchstart', handleTouchStart, { passive: true })
      tabBar.addEventListener('touchend', handleTouchEnd, { passive: true })
    }

    return () => {
      if (tabBar) {
        tabBar.removeEventListener('touchstart', handleTouchStart)
        tabBar.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [activeTabId, triggerHaptic])

  return (
    <nav
      id="mobile-tab-bar"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "mobile-tab-bar",
        "safe-area-inset-bottom", // For devices with notches
        className
      )}
      role="tablist"
      aria-label="Navegação principal"
      onKeyDown={(e) => {
        // Keyboard navigation support
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault()
          const currentIndex = tabItems.findIndex(item => item.id === activeTabId)
          const direction = e.key === 'ArrowLeft' ? -1 : 1
          const nextIndex = (currentIndex + direction + tabItems.length) % tabItems.length
          const nextTab = tabItems[nextIndex]
          
          if (!nextTab.isSpecial) {
            window.location.href = nextTab.href
          }
        }
      }}
    >
      {/* Tab bar background with enhanced styling */}
      <div className="absolute inset-0 bg-lavie-white/95 backdrop-blur-md border-t border-lavie-gray/30 shadow-lg" />
      
      {/* Main tab container */}
      <div className="relative flex items-center justify-around px-2 py-2 pb-safe">
        {tabItems.map((item) => (
          <TabBarItem
            key={item.id}
            item={item}
            isActive={activeTabId === item.id}
            onPress={() => handleTabPress(item.id)}
          />
        ))}
      </div>

      {/* Animated background indicator */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-lavie-yellow to-lavie-yellow/80 rounded-t-full",
          "transition-all duration-300 ease-out shadow-sm"
        )}
        style={{
          width: `${100 / tabItems.length}%`,
          transform: `translateX(${tabItems.findIndex(item => item.id === activeTabId) * 100}%)`
        }}
      />
    </nav>
  )
})

MobileTabBar.displayName = 'MobileTabBar'

export default MobileTabBar