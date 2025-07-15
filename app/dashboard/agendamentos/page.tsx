import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ElevatedCard, InteractiveCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Plus, QrCode, CheckCircle, AlertCircle, Info, Timer, Navigation } from 'lucide-react'
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

  const getStatusInfo = (status: string, payment: Payment | null) => {
    switch (status) {
      case 'CONFIRMED':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          text: 'Confirmado',
          description: 'Container reservado'
        }
      case 'PENDING':
        return {
          color: payment?.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Timer,
          text: payment?.status === 'PENDING' ? 'Aguardando Pagamento' : 'Pendente',
          description: payment?.status === 'PENDING' ? 'Complete o pagamento' : 'Aguardando confirmação'
        }
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          text: 'Cancelado',
          description: 'Sessão cancelada'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Info,
          text: status,
          description: 'Status atualizado'
        }
    }
  }

  const getTimeUntilAppointment = (date: Date, startTime: Date) => {
    const appointmentDateTime = new Date(date)
    appointmentDateTime.setHours(startTime.getHours(), startTime.getMinutes())
    const now = new Date()
    const diff = appointmentDateTime.getTime() - now.getTime()
    
    if (diff <= 0) return null
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `Em ${days} dia${days > 1 ? 's' : ''}`
    if (hours > 0) return `Em ${hours}h`
    return 'Hoje'
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
            title="Próximas Sessões"
            value={upcomingAppointments.length}
            description="Self-service agendado"
            icon="calendar"
            variant="info"
            badge={upcomingAppointments.length > 0 ? {
              text: 'Container reservado',
              variant: 'success'
            } : undefined}
          />

          <EnhancedStatCard
            title="Sessões Realizadas"
            value={pastAppointments.length}
            description="Self-service concluído"
            icon="check-circle"
            variant="success"
            badge={pastAppointments.length > 0 ? {
              text: 'Você realizou',
              variant: 'success'
            } : undefined}
          />

          <EnhancedStatCard
            title="Total Investido"
            value={`R$ ${(appointments.length * 30).toFixed(2)}`}
            description="Sessões self-service"
            icon="sparkles"
            variant="default"
            badge={appointments.length > 0 ? {
              text: 'Cuidado próprio',
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
                  Próximas Sessões Self-Service
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Containers reservados para você dar banho no seu pet
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
                    {/* Enhanced Mobile Header with Status */}
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="relative flex-shrink-0">
                        <div className={cn(
                          "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300",
                          appointment.status === 'CONFIRMED' 
                            ? "bg-gradient-to-br from-green-400 to-green-600" 
                            : appointment.status === 'PENDING'
                            ? "bg-gradient-to-br from-amber-400 to-amber-600"
                            : "bg-gradient-to-br from-gray-400 to-gray-600"
                        )}>
                          <Calendar className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        {(() => {
                          const statusInfo = getStatusInfo(appointment.status, appointment.payment)
                          const StatusIcon = statusInfo.icon
                          return (
                            <div className={cn(
                              "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white",
                              appointment.status === 'CONFIRMED' ? "bg-green-500" :
                              appointment.status === 'PENDING' ? "bg-amber-500" : "bg-red-500"
                            )}>
                              <StatusIcon className="h-3 w-3 text-white" />
                            </div>
                          )
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg md:text-xl text-gray-900 truncate">{appointment.pet.name}</h3>
                          {(() => {
                            const timeUntil = getTimeUntilAppointment(appointment.date, appointment.startTime)
                            return timeUntil && (
                              <Badge variant="outline" className="text-xs font-medium border-blue-200 text-blue-700">
                                {timeUntil}
                              </Badge>
                            )
                          })()}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          {(() => {
                            const statusInfo = getStatusInfo(appointment.status, appointment.payment)
                            return (
                              <Badge className={cn(
                                "w-fit text-xs border flex items-center gap-1",
                                statusInfo.color
                              )}>
                                <statusInfo.icon className="h-3 w-3" />
                                {statusInfo.text}
                              </Badge>
                            )
                          })()}
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

                    {/* Enhanced Action Buttons with Better UX */}
                    <div className="pl-15 md:pl-18 flex flex-col sm:flex-row gap-2">
                      {appointment.status === 'CONFIRMED' && appointment.payment?.status === 'APPROVED' && (
                        <Button 
                          size="sm" 
                          className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 mobile-button touch-manipulation shadow-md hover:shadow-lg transition-all duration-200" 
                          asChild
                        >
                          <Link href={`/dashboard/agendamentos/${appointment.id}/qrcode`}>
                            <QrCode className="mr-2 h-4 w-4" />
                            Acessar Container
                          </Link>
                        </Button>
                      )}
                      
                      {appointment.status === 'PENDING' && appointment.payment?.status !== 'APPROVED' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 sm:flex-none border-amber-300 text-amber-700 hover:bg-amber-50 mobile-button touch-manipulation" 
                          asChild
                        >
                          <Link href={`/dashboard/pagamento/${appointment.id}`}>
                            <Timer className="mr-2 h-4 w-4" />
                            Finalizar Pagamento
                          </Link>
                        </Button>
                      )}
                      
                      {/* Navigation to location */}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 sm:flex-none text-blue-600 hover:text-blue-700 hover:bg-blue-50 mobile-button touch-manipulation"
                        asChild
                      >
                        <a 
                          href={`https://maps.google.com/maps?q=${encodeURIComponent(appointment.location.address || appointment.location.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="mr-2 h-4 w-4" />
                          Ver Local
                        </a>
                      </Button>
                    </div>
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
                  Histórico Self-Service
                </CardTitle>
                <CardDescription className="text-green-700">
                  Sessões que você realizou com seu pet
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
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="font-medium">
                              {new Date(appointment.date).toLocaleDateString('pt-BR', { 
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </span>
                            <span className="mx-2">às</span>
                            <span className="font-semibold text-gray-700">
                              {appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-green-500" />
                            <span className="font-medium">{appointment.location.name}</span>
                          </p>
                          {appointment.payment?.status && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <Info className="mr-1 h-3 w-3" />
                              Status: {appointment.payment.status === 'APPROVED' ? 'Pago' : 
                                      appointment.payment.status === 'PENDING' ? 'Pagamento pendente' : 
                                      'Aguardando pagamento'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:text-right space-y-2">
                      {(() => {
                        const statusInfo = getStatusInfo(appointment.status, appointment.payment)
                        return (
                          <Badge className={cn(
                            "w-fit border flex items-center gap-1",
                            statusInfo.color
                          )}>
                            <statusInfo.icon className="h-3 w-3" />
                            {statusInfo.text}
                          </Badge>
                        )
                      })()}
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-gray-900">
                          R$ {Number(appointment.totalAmount).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Sessão realizada
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {pastAppointments.length > 5 && (
                <div className="p-4 bg-gray-50 text-center">
                  <p className="text-sm text-gray-600">
                    E mais {pastAppointments.length - 5} sessão{pastAppointments.length - 5 !== 1 ? 'ões' : ''} realizada{pastAppointments.length - 5 !== 1 ? 's' : ''}...
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
          <Card className="text-center py-12 border-2 border-dashed border-gray-200 hover:border-blue-300 transition-all duration-300 card-stagger">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 floating-element morphing-shape element-3d pulse-glow animate-pulse">
                <Calendar className="w-8 h-8 text-white floating-element" />
              </div>
              <CardTitle className="text-2xl mb-3 text-gray-800">Nenhuma sessão agendada</CardTitle>
              <CardDescription className="text-base mb-6 text-gray-600">
                Você ainda não reservou nenhum container. Que tal agendar sua primeira sessão self-service?
              </CardDescription>
              <div className="space-y-3">
                <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <Link href="/dashboard/agendamentos/novo">
                    <Plus className="mr-2 h-5 w-5" />
                    Reservar Primeiro Container
                  </Link>
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  📱 R$ 30,00 por sessão • ⏱️ 30 minutos • 🚿 Self-service
                </p>
              </div>
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