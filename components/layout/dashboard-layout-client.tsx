'use client'

import { useState } from 'react'
import { DashboardNav } from '@/components/layout/dashboard-nav'
import { DashboardHeader, MobileNavMenu } from '@/components/layout/dashboard-header'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { MobileTabBar } from '@/components/navigation/mobile-tab-bar'

interface DashboardLayoutClientProps {
  user: {
    name?: string | null
    email?: string | null
  }
  children: React.ReactNode
}

export function DashboardLayoutClient({ user, children }: DashboardLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavie-white via-lavie-gray/10 to-lavie-yellow/5">
      <DashboardHeader 
        user={user} 
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        showMobileMenu={isMobileMenuOpen}
      />
      <MobileNavMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
      />
      <DashboardNav />
      <main className="md:ml-64 min-h-screen pt-16 pb-24 md:pb-6">
        {/* Enhanced container with better spacing - increased bottom padding for mobile tab bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Content wrapper with improved mobile spacing */}
          <div className="space-y-8">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile Tab Bar - enhanced for better UX */}
      <MobileTabBar />
    </div>
  )
}