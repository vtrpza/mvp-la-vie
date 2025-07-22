import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { PaymentForm } from '@/components/payment/payment-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Calendar, MapPin, Heart } from 'lucide-react'

interface PaymentPageProps {
  params: Promise<{ id: string }>
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { id } = await params
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const appointment = await prisma.appointment.findUnique({
    where: { 
      id: id,
      userId: session.user.id 
    },
    include: {
      pet: true,
      location: true,
      payment: true,
    },
  })

  if (!appointment) {
    redirect('/dashboard/agendamentos')
  }

  // Se já foi pago, redirecionar
  if (appointment.payment?.status === 'APPROVED') {
    redirect('/dashboard/agendamentos')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Pagamento do Agendamento
        </h1>
        <p className="text-gray-600">
          Complete o pagamento para confirmar seu agendamento
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Detalhes do Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{appointment.pet.name}</p>
                <p className="text-sm text-gray-600">{appointment.pet.breed}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(appointment.date).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4" />
                {appointment.location.name}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <CreditCard className="mr-2 h-4 w-4" />
                {appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {appointment.endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {Number(appointment.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Forma de Pagamento
            </CardTitle>
            <CardDescription>
              Escolha como deseja pagar seu agendamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentForm appointment={appointment} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}