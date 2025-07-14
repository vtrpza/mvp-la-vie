'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Clock, Users, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  className?: string
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPressing, setIsPressing] = useState(false)
  const fabRef = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-collapse after inactivity
  useEffect(() => {
    if (isExpanded) {
      timeoutRef.current = setTimeout(() => {
        setIsExpanded(false)
      }, 5000) // Auto-collapse after 5 seconds
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isExpanded])

  // Handle touch interactions for haptic feedback
  const handleTouchStart = () => {
    setIsPressing(true)
    // Trigger haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10) // Short vibration
    }
  }

  const handleTouchEnd = () => {
    setIsPressing(false)
    setIsExpanded(!isExpanded)
  }

  const quickActions = [
    {
      icon: Calendar,
      label: 'Agendar',
      href: '/dashboard/agendamentos/novo',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Clock,
      label: 'Histórico',
      href: '/dashboard/agendamentos',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Users,
      label: 'Perfil',
      href: '/dashboard/perfil',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end space-y-reverse space-y-3",
        "md:hidden", // Only show on mobile
        className
      )}
    >
      {/* Quick Actions */}
      {isExpanded && (
        <div className="flex flex-col space-y-3 animate-in fade-in-0 zoom-in-95 duration-200">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}>
                <Button
                  size="lg"
                  className={cn(
                    "w-14 h-14 rounded-full shadow-lg transition-all duration-200",
                    "hover:scale-110 active:scale-95 touch-manipulation",
                    action.color,
                    "group relative overflow-hidden"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  aria-label={action.label}
                  onTouchStart={() => {
                    if ('vibrate' in navigator) {
                      navigator.vibrate(5)
                    }
                  }}
                >
                  <Icon className="w-6 h-6 text-white transition-transform duration-200 group-hover:scale-110" />
                  
                  {/* Label tooltip */}
                  <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                      {action.label}
                    </div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        ref={fabRef}
        size="lg"
        className={cn(
          "w-16 h-16 rounded-full shadow-xl transition-all duration-300",
          "bg-yellow-500 hover:bg-yellow-600 text-black touch-manipulation",
          "hover:scale-110 active:scale-95 relative overflow-hidden",
          "focus:ring-4 focus:ring-yellow-300 focus:ring-offset-2",
          isPressing && "scale-90",
          isExpanded && "rotate-45"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => setIsPressing(false)}
        aria-label={isExpanded ? "Fechar menu rápido" : "Abrir menu rápido"}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <X className="w-8 h-8 transition-transform duration-200" />
        ) : (
          <Plus className="w-8 h-8 transition-transform duration-200" />
        )}
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-200" />
        
        {/* Pulse animation when pressed */}
        {isPressing && (
          <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping" />
        )}
      </Button>

      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/10 -z-10"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default FloatingActionButton