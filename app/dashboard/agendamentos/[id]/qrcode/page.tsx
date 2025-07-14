import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { QRCodeDisplay } from '@/components/qrcode/qrcode-display'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Calendar, MapPin, Heart, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
          QR Code de Acesso
        </h1>
        <p className="text-gray-600">
          Use este código para acessar o container de banho
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
              Escaneie ou mostre este código no container
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPaidAndConfirmed ? (
              <QRCodeDisplay appointmentId={appointment.id} />
            ) : (
              <div className="text-center py-8">
                <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">
                  QR Code será gerado após confirmação do pagamento
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isPaidAndConfirmed && (
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Instruções de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-blue-800">
            <p>• <strong>Acesso liberado:</strong> 30 minutos antes do horário até o final da sessão</p>
            <p>• <strong>Duração:</strong> 30 minutos para o banho</p>
            <p>• <strong>Localização:</strong> {appointment.location.name}</p>
            <p>• <strong>Endereço:</strong> {appointment.location.address}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}