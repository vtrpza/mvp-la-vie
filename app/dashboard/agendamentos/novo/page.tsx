import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { BookingForm } from '@/components/booking/booking-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, ArrowLeft, Sparkles, Clock, CreditCard } from 'lucide-react'
import Link from 'next/link'

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
      {/* Enhanced Header */}
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/agendamentos" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Agendamentos
          </Link>
        </Button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Novo Agendamento
          </h1>
          <p className="text-gray-600">
            Agende o banho self-service para seu pet de forma rápida e segura
          </p>
        </div>
      </div>

      {/* Service Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="text-center p-4">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Valor Fixo</h3>
            <p className="text-sm text-gray-600">R$ 30,00 por sessão</p>
          </CardContent>
        </Card>
        
        <Card className="text-center p-4">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Duração</h3>
            <p className="text-sm text-gray-600">30 minutos</p>
          </CardContent>
        </Card>
        
        <Card className="text-center p-4">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Self-Service</h3>
            <p className="text-sm text-gray-600">Container exclusivo</p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Form Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center text-gray-900">
            <CalendarDays className="mr-2 h-5 w-5 text-blue-600" />
            Detalhes do Agendamento
          </CardTitle>
          <CardDescription className="text-gray-700">
            Preencha os dados abaixo para agendar o banho do seu pet
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <BookingForm pets={user.pets} locations={locations} />
        </CardContent>
      </Card>
    </div>
  )
}