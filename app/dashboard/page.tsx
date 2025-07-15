import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  Plus, 
  TrendingUp,
  CheckCircle,
  Activity,
  Heart,
  Sparkles,
  Users,
  ChevronRight,
  Container,
  MapPin,
  Timer,
  Droplets
} from 'lucide-react'
import Link from 'next/link'
import { Appointment, Pet, Location, Payment } from '@prisma/client'
import { cn } from '@/lib/utils'
import { EnhancedStatCard } from '@/components/ui/enhanced-stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { PageErrorBoundary, SectionErrorBoundary } from '@/components/ui/error-boundary'

type AppointmentWithRelations = Appointment & {
  pet: Pet;
  location: Location;
  payment: Payment | null;
};

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
    border: 'border-blue-200',
    glow: 'shadow-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    text: 'text-green-600',
    border: 'border-green-200',
    glow: 'shadow-green-100'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
    border: 'border-purple-200',
    glow: 'shadow-purple-100'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-500',
    text: 'text-orange-600',
    border: 'border-orange-200',
    glow: 'shadow-orange-100'
  },
  pink: {
    bg: 'bg-pink-50',
    icon: 'bg-pink-500',
    text: 'text-pink-600',
    border: 'border-pink-200',
    glow: 'shadow-pink-100'
  }
};

function QuickActions() {
  const primaryActions = [
    { 
      name: 'Reservar Container', 
      description: 'Agende seu horário para dar banho no seu pet',
      icon: Container, 
      color: 'blue' as const, 
      href: '/dashboard/agendamentos/novo', 
      isPrimary: true 
    },
    { 
      name: 'Minhas Sessões', 
      description: 'Veja seus containers reservados e histórico',
      icon: Clock, 
      color: 'green' as const, 
      href: '/dashboard/agendamentos', 
      isPrimary: true 
    }
  ];

  const secondaryActions = [
    { name: 'Meu Perfil', icon: Users, color: 'purple' as const, href: '/dashboard/perfil', isPrimary: false },
    { name: 'Central de Ajuda', icon: Heart, color: 'pink' as const, href: '/dashboard/ajuda', isPrimary: false }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Droplets className="mr-2 h-5 w-5 text-blue-600" />
          Self-Service La'vie Pet
        </CardTitle>
        <CardDescription>Reserve seu container e cuide do seu pet com autonomia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Actions - Full width on mobile, prominent */}
        <div className="space-y-3">
          {primaryActions.map((action) => {
            const colorScheme = colorVariants[action.color];
            return (
              <Link key={action.name} href={action.href} className="block">
                <button
                  className={cn(
                    "w-full p-4 rounded-lg border-2 border-solid transition-all duration-200",
                    "hover:shadow-md hover:-translate-y-1 touch-manipulation",
                    "flex items-center space-x-3 text-left min-h-[60px]", // Better touch target
                    colorScheme.border,
                    colorScheme.bg
                  )}
                  aria-label={`${action.name} - Ação principal`}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    colorScheme.icon
                  )}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className={cn("text-base font-semibold block", colorScheme.text)}>
                      {action.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {action.description}
                    </span>
                  </div>
                  <ChevronRight className={cn("w-5 h-5", colorScheme.text)} />
                </button>
              </Link>
            );
          })}
        </div>

        {/* Secondary Actions - Grid layout */}
        <div className="pt-2 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            {secondaryActions.map((action) => {
              const colorScheme = colorVariants[action.color];
              return (
                <Link key={action.name} href={action.href}>
                  <button
                    className={cn(
                      "w-full p-3 rounded-lg border border-dashed transition-all duration-200",
                      "hover:border-solid hover:shadow-sm touch-manipulation",
                      "min-h-[80px] flex flex-col items-center justify-center text-center",
                      colorScheme.border,
                      colorScheme.bg
                    )}
                    aria-label={action.name}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                      colorScheme.icon
                    )}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={cn("text-sm font-medium", colorScheme.text)}>
                      {action.name}
                    </span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivity({ appointments }: { appointments: AppointmentWithRelations[] }) {
  const getStatusInfo = (status: string, appointment: AppointmentWithRelations) => {
    const isUpcoming = new Date(appointment.date) >= new Date()
    
    switch (status) {
      case 'CONFIRMED':
        return {
          color: 'text-green-600 bg-green-100',
          text: isUpcoming ? 'Container Reservado' : 'Sessão Realizada',
          icon: isUpcoming ? Container : CheckCircle
        };
      case 'PENDING':
        return {
          color: 'text-orange-600 bg-orange-100',
          text: 'Pagamento Pendente',
          icon: Timer
        };
      case 'CANCELLED':
        return {
          color: 'text-red-600 bg-red-100',
          text: 'Cancelado',
          icon: Calendar
        };
      default:
        return {
          color: 'text-blue-600 bg-blue-100',
          text: 'Em Processamento',
          icon: Calendar
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Suas sessões self-service mais recentes</CardDescription>
          </div>
          <Link href="/dashboard/agendamentos" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver Todos
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.slice(0, 4).map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {(() => {
                const statusInfo = getStatusInfo(appointment.status, appointment)
                const StatusIcon = statusInfo.icon
                return (
                  <div className={cn(
                    "p-2 rounded-lg",
                    statusInfo.color
                  )}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                )
              })()}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Self-service: {appointment.pet.name}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(appointment.date).toLocaleDateString('pt-BR')} às{' '}
                  {appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{appointment.location.name}</span>
                  {(() => {
                    const statusInfo = getStatusInfo(appointment.status, appointment)
                    return (
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                        statusInfo.color
                      )}>
                        <statusInfo.icon className="w-3 h-3" />
                        {statusInfo.text}
                      </span>
                    )
                  })()}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  R$ {Number(appointment.totalAmount).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function DashboardContent() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  let appointments: AppointmentWithRelations[] = []
  try {
    appointments = await prisma.appointment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        pet: true,
        location: true,
        payment: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 3,
    })
  } catch (error) {
    console.error('[DASHBOARD_ERROR]:', error)
    // Handle the error gracefully, maybe show a message to the user
  }

  const upcomingAppointments = appointments.filter(
    (appointment) => new Date(appointment.date) >= new Date()
  )

  const pastAppointments = appointments.filter(
    (appointment) => new Date(appointment.date) < new Date()
  )

  const totalRevenue = appointments.reduce((total, apt) => total + Number(apt.totalAmount), 0);
  const completedCount = pastAppointments.length;
  const upcomingCount = upcomingAppointments.length;
  
  // Calculate meaningful metrics instead of mock data
  const totalSessions = appointments.length
  const averageMonthlyUsage = totalSessions > 0 ? Math.round(totalSessions / Math.max(1, Math.floor((Date.now() - new Date(appointments[appointments.length - 1]?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 30)))) : 0
  const nextSessionTime = upcomingAppointments.length > 0 ? upcomingAppointments[0].date : null
  
  // Calculate actual savings compared to traditional pet grooming
  const traditionalGroomingPrice = 80 // R$ 80 average
  const totalSavings = totalSessions * (traditionalGroomingPrice - 30)

  return (
    <PageErrorBoundary>
      <div className="space-y-8">
      {/* Enhanced Header */}
      <PageHeader
        title={`Olá, ${session.user.name}! 👋`}
        description="Gerencie suas sessões self-service no La'vie Pet. Você cuida, seu pet fica feliz!"
        icon="heart"
        gradient
      />

      {/* Enhanced Stats Grid */}
      <SectionErrorBoundary>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EnhancedStatCard
            title="Containers Reservados"
            value={upcomingCount}
            description={upcomingCount > 0 ? `Próxima sessão: ${nextSessionTime ? new Date(nextSessionTime).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) : ''}` : "Nenhuma reserva ativa"}
            icon="calendar"
            variant="info"
            badge={upcomingCount > 0 ? {
              text: `${upcomingCount} ativo${upcomingCount > 1 ? 's' : ''}`,
              variant: 'success'
            } : {
              text: 'Disponível',
              variant: 'default'
            }}
          />

          <EnhancedStatCard
            title="Sessões Realizadas"
            value={completedCount}
            description={`Você já cuidou do seu pet ${completedCount} vez${completedCount !== 1 ? 'es' : ''}`}
            icon="check-circle"
            variant="success"
            trend={averageMonthlyUsage > 0 ? {
              value: averageMonthlyUsage,
              label: `${averageMonthlyUsage} sessões/mês em média`,
              direction: 'up'
            } : undefined}
            badge={completedCount > 0 ? {
              text: 'Você fez!',
              variant: 'success'
            } : undefined}
          />

          <EnhancedStatCard
            title="Economia Total"
            value={totalSavings > 0 ? `R$ ${totalSavings.toFixed(2)}` : "R$ 0,00"}
            description={`Vs. pet shop tradicional (R$ ${traditionalGroomingPrice}/banho)`}
            icon="trending-up"
            variant="default"
            trend={totalSessions > 0 ? {
              value: Math.round(((traditionalGroomingPrice - 30) / traditionalGroomingPrice) * 100),
              label: `${Math.round(((traditionalGroomingPrice - 30) / traditionalGroomingPrice) * 100)}% de economia por sessão`,
              direction: 'up'
            } : undefined}
            badge={totalSavings > 100 ? {
              text: 'Economizando!',
              variant: 'success'
            } : undefined}
          />

          <EnhancedStatCard
            title="Unidade Tambaú"
            value="Aberto Hoje"
            description="Container equipado • 8h às 18h"
            icon="map-pin"
            variant="success"
            badge={{
              text: '100% Self-Service',
              variant: 'success'
            }}
          />

          <EnhancedStatCard
            title="Sua Autonomia"
            value="100%"
            description="Você é o responsável pelo cuidado"
            icon="heart"
            variant="default"
            badge={{
              text: 'Independente',
              variant: 'success'
            }}
          />

          <EnhancedStatCard
            title="Experiência Total"
            value={`${totalSessions * 30} min`}
            description={`${totalSessions} sessões de cuidado com seu pet`}
            icon="activity"
            variant="info"
            badge={totalSessions >= 5 ? {
              text: 'Expert!',
              variant: 'success'
            } : totalSessions >= 2 ? {
              text: 'Experiente',
              variant: 'default'
            } : undefined}
          />
        </div>
      </SectionErrorBoundary>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <SectionErrorBoundary>
            {appointments.length > 0 ? (
              <RecentActivity appointments={appointments} />
            ) : (
              <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Container className="mr-2 h-5 w-5 text-blue-600" />
                    Primeira Sessão Self-Service
                  </CardTitle>
                  <CardDescription>
                    Ainda não há sessões registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Droplets className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pronto para começar?
                      </h3>
                      <p className="text-gray-600 max-w-sm mx-auto">
                        Reserve seu primeiro container e tenha a liberdade de cuidar do seu pet do seu jeito!
                      </p>
                    </div>
                    <div className="grid gap-2 max-w-xs mx-auto">
                      <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <Link href="/dashboard/agendamentos/novo">
                          <Container className="mr-2 h-4 w-4" />
                          Reservar Primeiro Container
                        </Link>
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        R$ 30,00 • 30 minutos • Equipamentos incluídos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </SectionErrorBoundary>
        </div>
        
        {/* Quick Actions */}
        <div>
          <SectionErrorBoundary>
            <QuickActions />
          </SectionErrorBoundary>
        </div>
      </div>

      </div>
    </PageErrorBoundary>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}