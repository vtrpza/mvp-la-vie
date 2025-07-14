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
  ChevronRight
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
    { name: 'Novo Agendamento', icon: Calendar, color: 'blue' as const, href: '/dashboard/agendamentos/novo', isPrimary: true },
    { name: 'Ver Histórico', icon: Clock, color: 'green' as const, href: '/dashboard/agendamentos', isPrimary: true }
  ];

  const secondaryActions = [
    { name: 'Meu Perfil', icon: Users, color: 'purple' as const, href: '/dashboard/perfil', isPrimary: false },
    { name: 'Ajuda', icon: Heart, color: 'pink' as const, href: '/dashboard/ajuda', isPrimary: false }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
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
                      {action.name === 'Novo Agendamento' ? 'Agende o banho do seu pet' : 'Veja seus agendamentos'}
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-orange-600 bg-orange-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Seus agendamentos mais recentes</CardDescription>
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
              <div className={cn(
                "p-2 rounded-lg",
                getStatusColor(appointment.status)
              )}>
                <Calendar className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Banho para {appointment.pet.name}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(appointment.date).toLocaleDateString('pt-BR')} às{' '}
                  {appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{appointment.location.name}</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium capitalize",
                    getStatusColor(appointment.status)
                  )}>
                    {appointment.status === 'CONFIRMED' ? 'Confirmado' : appointment.status}
                  </span>
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
  
  // Calculate growth percentages (mock data for demo)
  const upcomingGrowth = upcomingCount > 0 ? Math.round(Math.random() * 20 + 5) : 0;
  const completedGrowth = completedCount > 0 ? Math.round(Math.random() * 15 + 3) : 0;
  const revenueGrowth = totalRevenue > 0 ? Math.round(Math.random() * 25 + 8) : 0;

  return (
    <PageErrorBoundary>
      <div className="space-y-8">
      {/* Enhanced Header */}
      <PageHeader
        title={`Olá, ${session.user.name}! 👋`}
        description="Bem-vindo ao La'vie Pet Banho Experience"
      />

      {/* Enhanced Stats Grid */}
      <SectionErrorBoundary>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EnhancedStatCard
            title="Próximos Banhos"
            value={upcomingCount}
            description="Agendamentos confirmados"
            icon="calendar"
            variant="info"
            trend={upcomingGrowth > 0 ? {
              value: upcomingGrowth,
              label: `+${upcomingGrowth}% este mês`,
              direction: 'up'
            } : undefined}
            badge={upcomingCount > 0 ? {
              text: 'Ativo',
              variant: 'success'
            } : undefined}
          />

          <EnhancedStatCard
            title="Banhos Realizados"
            value={completedCount}
            description="Histórico de banhos"
            icon="check-circle"
            variant="success"
            trend={completedGrowth > 0 ? {
              value: completedGrowth,
              label: `+${completedGrowth}% este mês`,
              direction: 'up'
            } : undefined}
            badge={{
              text: 'Concluído',
              variant: 'success'
            }}
          />

          <EnhancedStatCard
            title="Receita Total"
            value={`R$ ${totalRevenue.toFixed(2)}`}
            description="Valor total dos banhos"
            icon="trending-up"
            variant="default"
            trend={revenueGrowth > 0 ? {
              value: revenueGrowth,
              label: `+${revenueGrowth}% este mês`,
              direction: 'up'
            } : undefined}
          />

          <EnhancedStatCard
            title="Unidade Tambaú"
            value="Disponível"
            description="Container self-service"
            icon="sparkles"
            variant="success"
            badge={{
              text: 'Operacional',
              variant: 'success'
            }}
          />

          <EnhancedStatCard
            title="Satisfação"
            value="98%"
            description="Avaliação média"
            icon="heart"
            variant="default"
            trend={{
              value: 2,
              label: '+2% este mês',
              direction: 'up'
            }}
            badge={{
              text: 'Excelente',
              variant: 'success'
            }}
          />

          <EnhancedStatCard
            title="Atividade"
            value={appointments.length}
            description="Total de agendamentos"
            icon="activity"
            variant="info"
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
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>
                    Nenhum agendamento encontrado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      Que tal agendar o primeiro banho para seu pet?
                    </p>
                    <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <Link href="/dashboard/agendamentos/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Agendar Primeiro Banho
                      </Link>
                    </Button>
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