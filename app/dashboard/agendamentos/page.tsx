import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ElevatedCard, InteractiveCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Plus, QrCode, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { EnhancedStatCard } from '@/components/ui/enhanced-stat-card'
import { ListHeader } from '@/components/ui/page-header'
import { PageErrorBoundary, SectionErrorBoundary } from '@/components/ui/error-boundary'

async function AppointmentsContent() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const appointments = await prisma.appointment.findMany({
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
  })

  const upcomingAppointments = appointments.filter(
    (appointment) => new Date(appointment.date) >= new Date()
  )

  const pastAppointments = appointments.filter(
    (appointment) => new Date(appointment.date) < new Date()
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmado'
      case 'PENDING':
        return 'Pendente'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  return (
    <PageErrorBoundary>
      <div className="space-y-8">
      {/* Enhanced Header - Fixed spacing to prevent overlap */}
      <div className="mb-8">
        <ListHeader
          title="Meus Agendamentos"
          description="Gerencie e acompanhe seus banhos agendados"
          itemCount={appointments.length}
          createAction={{
            href: "/dashboard/agendamentos/novo",
            label: "Novo Agendamento",
            icon: "plus"
          }}
        />
      </div>

      {/* Enhanced Stats Cards */}
      <SectionErrorBoundary>
        <div className="grid gap-6 md:grid-cols-3">
          <EnhancedStatCard
            title="Próximos Banhos"
            value={upcomingAppointments.length}
            description="Agendamentos confirmados"
            icon="calendar"
            variant="info"
            badge={upcomingAppointments.length > 0 ? {
              text: 'Ativo',
              variant: 'success'
            } : undefined}
          />

          <EnhancedStatCard
            title="Banhos Realizados"
            value={pastAppointments.length}
            description="Histórico completo"
            icon="check-circle"
            variant="success"
            badge={pastAppointments.length > 0 ? {
              text: 'Concluído',
              variant: 'success'
            } : undefined}
          />

          <EnhancedStatCard
            title="Total Investido"
            value={`R$ ${(appointments.length * 30).toFixed(2)}`}
            description="Valor total dos banhos"
            icon="sparkles"
            variant="default"
            badge={appointments.length > 0 ? {
              text: 'Bem-estar pet',
              variant: 'default'
            } : undefined}
          />
        </div>
      </SectionErrorBoundary>

      {upcomingAppointments.length > 0 && (
        <SectionErrorBoundary>
          <ElevatedCard className="card-enhanced card-glow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b bg-gradient">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-blue-900">
                  <Calendar className="mr-2 h-5 w-5" />
                  Próximos Banhos
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Agendamentos confirmados para os próximos dias
                </CardDescription>
              </div>
              <Badge className="bg-blue-200 text-blue-800 border-blue-300">
                {upcomingAppointments.length} ativo{upcomingAppointments.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 card-stagger">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-6 hover:bg-blue-50/50 transition-modern group sophisticated-hover stagger-animation"
                >
                  {/* Mobile-First Responsive Layout */}
                  <div className="space-y-4">
                    {/* Mobile Header */}
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-modern">
                          <Calendar className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-1 truncate">{appointment.pet.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <Badge className={cn(
                            "w-fit text-xs",
                            getStatusColor(appointment.status)
                          )}>
                            {getStatusText(appointment.status)}
                          </Badge>
                          <div className="text-lg font-bold text-gray-900 sm:ml-auto">
                            R$ {Number(appointment.totalAmount).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Details Section */}
                    <div className="space-y-2 pl-15 md:pl-18">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(appointment.date).toLocaleDateString('pt-BR', { 
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })} às{' '}
                          {appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="truncate">{appointment.location.name}</span>
                      </p>
                    </div>

                    {/* Action Button - Full width on mobile */}
                    {appointment.status === 'CONFIRMED' && appointment.payment?.status === 'APPROVED' && (
                      <div className="pl-15 md:pl-18">
                        <Button 
                          size="sm" 
                          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 mobile-button touch-manipulation" 
                          asChild
                        >
                          <Link href={`/dashboard/agendamentos/${appointment.id}/qrcode`}>
                            <QrCode className="mr-2 h-4 w-4" />
                            Ver QR Code
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          </ElevatedCard>
        </SectionErrorBoundary>
      )}

      {pastAppointments.length > 0 && (
        <SectionErrorBoundary>
          <InteractiveCard className="card-enhanced border-animated">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b bg-gradient">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-green-900">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Histórico de Banhos
                </CardTitle>
                <CardDescription className="text-green-700">
                  Banhos realizados com sucesso
                </CardDescription>
              </div>
              <Badge className="bg-green-200 text-green-800 border-green-300">
                {pastAppointments.length} concluído{pastAppointments.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {pastAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-6 hover:bg-green-50/50 transition-modern group sophisticated-hover reveal-animation"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg opacity-80 transition-spring micro-bounce morphing-shape">
                          <CheckCircle className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900 mb-1">{appointment.pet.name}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                            {new Date(appointment.date).toLocaleDateString('pt-BR', { 
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })} às{' '}
                            {appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                            {appointment.location.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:text-right space-y-2">
                      <Badge className={cn(
                        "w-fit",
                        getStatusColor(appointment.status)
                      )}>
                        {getStatusText(appointment.status)}
                      </Badge>
                      <div className="text-lg font-bold text-gray-900">
                        R$ {Number(appointment.totalAmount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {pastAppointments.length > 5 && (
                <div className="p-4 bg-gray-50 text-center">
                  <p className="text-sm text-gray-600">
                    E mais {pastAppointments.length - 5} banho{pastAppointments.length - 5 !== 1 ? 's' : ''} realizado{pastAppointments.length - 5 !== 1 ? 's' : ''}...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          </InteractiveCard>
        </SectionErrorBoundary>
      )}

      {appointments.length === 0 && (
        <SectionErrorBoundary>
          <Card className="text-center py-12 border-2 border-dashed border-gray-200 hover:border-blue-300 transition-modern card-stagger">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 floating-element morphing-shape element-3d pulse-glow">
                <Calendar className="w-8 h-8 text-white floating-element" />
              </div>
              <CardTitle className="text-2xl mb-3">Nenhum agendamento encontrado</CardTitle>
              <CardDescription className="text-base mb-6">
                Você ainda não tem agendamentos. Que tal agendar o primeiro banho para seu pet?
              </CardDescription>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Link href="/dashboard/agendamentos/novo">
                  <Plus className="mr-2 h-5 w-5" />
                  Fazer Primeiro Agendamento
                </Link>
              </Button>
            </div>
          </CardContent>
          </Card>
        </SectionErrorBoundary>
      )}
      </div>
    </PageErrorBoundary>
  )
}

export default function AppointmentsPage() {
  return <AppointmentsContent />
}