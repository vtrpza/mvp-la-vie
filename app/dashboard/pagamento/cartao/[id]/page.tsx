import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { CardPaymentComponent } from '@/components/payment/card-payment-component'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Calendar, MapPin, Heart, ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CardPaymentPageProps {
  params: Promise<{ id: string }>
}

export default async function CardPaymentPage({ params }: CardPaymentPageProps) {
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
            <CreditCard className="mr-3 h-8 w-8 text-green-600" />
            Pagamento com Cartão
          </h1>
          <p className="text-gray-600 mt-1">
            Pague com segurança usando cartão de crédito ou débito
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
                  Este é um ambiente de testes. O checkout será simulado e você será redirecionado 
                  para uma página de resultado mockada. Nenhuma cobrança real será feita.
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
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-medium">Total a pagar:</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {appointment.totalAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Pagamento via cartão • Processamento seguro
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card Payment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="mr-2 h-5 w-5" />
              Pagar com Cartão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
              <CardPaymentComponent appointment={appointment} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Security and Payment Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="mr-2 h-5 w-5 text-green-600" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Conexão Segura (SSL)</h4>
                  <p className="text-sm text-gray-600">Seus dados são criptografados</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Processamento via Mercado Pago</h4>
                  <p className="text-sm text-gray-600">Parceiro líder em pagamentos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Dados não armazenados</h4>
                  <p className="text-sm text-gray-600">Não guardamos informações do cartão</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cartões Aceitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">MASTER</span>
                  </div>
                  <div className="w-12 h-8 bg-yellow-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">ELO</span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Parcelamento:</h4>
                <ul className="space-y-1">
                  <li>• À vista no débito</li>
                  <li>• Até 12x no crédito</li>
                  <li>• Sem juros até 3x</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}