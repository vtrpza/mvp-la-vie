import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { PixPaymentComponent } from '@/components/payment/pix-payment-component'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Calendar, MapPin, Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PixPaymentPageProps {
  params: Promise<{ id: string }>
}

export default async function PixPaymentPage({ params }: PixPaymentPageProps) {
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

  const isDevMode = process.env.PAYMENT_MOCK_MODE === 'true' || !process.env.MERCADOPAGO_ACCESS_TOKEN

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <QrCode className="mr-3 h-8 w-8 text-blue-600" />
            Pagamento PIX
          </h1>
          <p className="text-gray-600 mt-1">
            Escaneie o QR Code ou copie o código PIX para pagar
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/pagamento/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      {/* Dev Mode Alert */}
      {isDevMode && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">🧪</span>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Modo de Desenvolvimento</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Este é um ambiente de testes. O pagamento será simulado e aprovado automaticamente 
                  em 5-10 segundos após a criação do PIX. Nenhuma cobrança real será feita.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Appointment Details */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Detalhes do Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-lg">{appointment.pet.name}</p>
                <p className="text-sm text-gray-600">{appointment.pet.breed} • {appointment.pet.size}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium">
                    {new Date(appointment.date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                  <div className="text-xs">
                    {appointment.startTime.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {appointment.endTime.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium">{appointment.location.name}</div>
                  <div className="text-xs">{appointment.location.address}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium">Total a pagar:</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {Number(appointment.totalAmount).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pagamento via PIX • Aprovação instantânea
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PIX Payment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <QrCode className="mr-2 h-5 w-5" />
              Pagar com PIX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
              <PixPaymentComponent appointment={appointment} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* PIX Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como pagar com PIX</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">📱 Pelo aplicativo do seu banco:</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Abra o app do seu banco</li>
                <li>2. Vá na opção PIX</li>
                <li>3. Escolha "Ler QR Code"</li>
                <li>4. Escaneie o código ao lado</li>
                <li>5. Confirme o pagamento</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-3">💻 Copiando o código PIX:</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Copie o código PIX</li>
                <li>2. Abra o app do seu banco</li>
                <li>3. Vá na opção PIX</li>
                <li>4. Escolha "Colar código"</li>
                <li>5. Cole e confirme o pagamento</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> O pagamento PIX é processado na hora. Assim que você pagar, 
              seu agendamento será confirmado automaticamente e você receberá o QR Code de acesso.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}