'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Calendar, HelpCircle, Home, User, Plus } from 'lucide-react'
import { PawIcon } from '@/components/ui/paw-icon'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Agendamentos',
    href: '/dashboard/agendamentos',
    icon: Calendar,
  },
  {
    name: 'Perfil',
    href: '/dashboard/perfil',
    icon: User,
  },
  {
    name: 'Ajuda',
    href: '/dashboard/ajuda',
    icon: HelpCircle,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  const NavLink = ({ item, onClick }: { item: typeof navigation[0], onClick?: () => void }) => {
    const isActive = pathname === item.href || 
      (item.href !== '/dashboard' && pathname.startsWith(item.href))
    
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105',
          isActive
            ? 'bg-lavie-yellow/20 text-lavie-black border border-lavie-yellow shadow-sm'
            : 'text-lavie-black/70 hover:bg-lavie-gray/50 hover:text-lavie-black'
        )}
      >
        <item.icon
          className={cn(
            'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-300',
            isActive 
              ? 'text-lavie-black' 
              : 'text-lavie-black/50 group-hover:text-lavie-black'
          )}
        />
        <span className="font-medium">{item.name}</span>
        {isActive && (
          <div className="ml-auto w-2 h-2 bg-lavie-yellow rounded-full shadow-sm" />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-0 z-30">
        <div className="flex flex-col h-full bg-lavie-white border-r border-lavie-gray shadow-lg">
          {/* Enhanced Header */}
          <div className="h-16 flex items-center justify-center px-6 border-b border-lavie-gray bg-gradient-to-r from-lavie-yellow to-lavie-yellow/80">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative transition-transform duration-300 group-hover:scale-110">
                <PawIcon size={16} color="white" variant="filled" />
              </div>
              <div className="font-display">
                <span className="text-lg font-bold text-lavie-black">La'vie</span>
                <span className="text-lg font-bold text-lavie-black/80 ml-1">Pet</span>
              </div>
            </Link>
          </div>
          
          {/* Navigation content with enhanced styling */}
          <div className="flex-1 flex flex-col px-4 py-12 overflow-y-auto">
            {/* Quick Action Section */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-lavie-black/60 uppercase tracking-wider mb-3 px-2">
                Ação Rápida
              </div>
              <Link
                href="/dashboard/agendamentos/novo"
                className="flex items-center w-full px-4 py-3 bg-lavie-yellow hover:bg-lavie-black text-lavie-black hover:text-lavie-yellow rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5 mr-3" />
                <span>Agendar Banho</span>
              </Link>
            </div>
            
            {/* Main Navigation */}
            <div className="flex-1">
              <div className="text-xs font-semibold text-lavie-black/60 uppercase tracking-wider mb-3 px-2">
                Navegação
              </div>
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </nav>
            </div>
            
            {/* Enhanced Brand Footer */}
            <div className="mt-8 pt-6 border-t border-lavie-gray">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-lavie-yellow to-lavie-yellow/70 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-lavie-black font-bold text-lg">🐾</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-lavie-black/70">Banho Experience</div>
                  <div className="text-xs text-lavie-black/50">Vínculo • Cuidado • Respeito</div>
                </div>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-lavie-yellow rounded-full"></div>
                  <div className="w-2 h-2 bg-lavie-green rounded-full"></div>
                  <div className="w-2 h-2 bg-lavie-yellow rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}