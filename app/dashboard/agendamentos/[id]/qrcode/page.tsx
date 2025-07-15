import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { QRCodeDisplay } from '@/components/qrcode/qrcode-display'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Calendar, MapPin, Heart, AlertTriangle, Timer, Clock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface QRCodePageProps {
  params: Promise<{ id: string }>
}

export default async function QRCodePage({ params }: QRCodePageProps) {
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

  // Verificar se o agendamento foi pago e confirmado
  const isPaidAndConfirmed = appointment.payment?.status === 'APPROVED' && appointment.status === 'CONFIRMED'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Acesso ao Container
        </h1>
        <p className="text-gray-600">
          Use este QR Code para liberar o container e dar banho no seu pet
        </p>
      </div>

      {!isPaidAndConfirmed && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            O QR Code só estará disponível após a confirmação do pagamento.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Sua Reserva
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
                <QrCode className="mr-2 h-4 w-4" />
                {appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {appointment.endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status do Pagamento:</span>
                <span className={`text-sm font-medium ${
                  appointment.payment?.status === 'APPROVED' 
                    ? 'text-green-600' 
                    : appointment.payment?.status === 'PENDING'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {appointment.payment?.status === 'APPROVED' 
                    ? 'Pago' 
                    : appointment.payment?.status === 'PENDING'
                    ? 'Pendente'
                    : 'Não Pago'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              Código de Acesso
            </CardTitle>
            <CardDescription>
              Escaneie no leitor do container para liberar o acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPaidAndConfirmed ? (
              <div className="space-y-4">
                <QRCodeDisplay appointmentId={appointment.id} />
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Pronto para usar!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Escaneie no leitor do container
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <QrCode className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 font-medium mb-2">
                    QR Code não disponível
                  </p>
                  <p className="text-sm text-gray-500">
                    Complete o pagamento para liberar o acesso
                  </p>
                </div>
                {appointment.payment?.status === 'PENDING' && (
                  <Button asChild size="sm" className="mt-4">
                    <Link href={`/dashboard/pagamento/${appointment.id}`}>
                      Finalizar Pagamento
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isPaidAndConfirmed && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Instruções Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Horário de Acesso</p>
                  <p className="text-sm text-blue-700">30 minutos antes até o final da sessão</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Timer className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Tempo de Uso</p>
                  <p className="text-sm text-blue-700">30 minutos para banho completo</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Local</p>
                  <p className="text-sm text-blue-700">{appointment.location.name}</p>
                  {appointment.location.address && (
                    <p className="text-xs text-blue-600">{appointment.location.address}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
                <strong>Lembre-se:</strong> Traga toalha e produtos de banho se desejar usar os seus próprios
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}