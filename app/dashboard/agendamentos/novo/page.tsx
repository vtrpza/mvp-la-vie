import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { BookingForm } from '@/components/booking/booking-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormHeader } from '@/components/ui/page-header'
import { Sparkles, Clock, CreditCard, CalendarDays } from 'lucide-react'

export default async function NewAppointmentPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      pets: true,
    },
  })

  const locations = await prisma.location.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Standardized Header */}
      <FormHeader
        title="Reservar Container"
        description="Reserve seu horário para dar banho no seu pet no container self-service"
        icon="calendar"
        backLink={{
          href: "/dashboard/agendamentos",
          label: "Voltar às Sessões"
        }}
      />

      {/* Enhanced Service Info Cards with Better Visual Hierarchy */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="text-center p-4 hover:shadow-lg transition-all duration-200 border-green-200 bg-green-50/30">
          <CardContent className="p-0">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Valor Fixo</h3>
            <p className="text-lg font-bold text-green-700 mb-1">R$ 30,00</p>
            <p className="text-xs text-gray-600">por sessão completa</p>
          </CardContent>
        </Card>
        
        <Card className="text-center p-4 hover:shadow-lg transition-all duration-200 border-blue-200 bg-blue-50/30">
          <CardContent className="p-0">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tempo Disponível</h3>
            <p className="text-lg font-bold text-blue-700 mb-1">30 minutos</p>
            <p className="text-xs text-gray-600">para dar banho no seu pet</p>
          </CardContent>
        </Card>
        
        <Card className="text-center p-4 hover:shadow-lg transition-all duration-200 border-purple-200 bg-purple-50/30">
          <CardContent className="p-0">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Self-Service</h3>
            <p className="text-lg font-bold text-purple-700 mb-1">Você faz</p>
            <p className="text-xs text-gray-600">container equipado</p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Form Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center text-gray-900">
            <CalendarDays className="mr-2 h-5 w-5 text-blue-600" />
            Reserva do Container
          </CardTitle>
          <CardDescription className="text-gray-700">
            Escolha quando você quer usar o container para dar banho no seu pet
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <BookingForm pets={user.pets} locations={locations} />
        </CardContent>
      </Card>
    </div>
  )
}