'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, Loader2, ExternalLink, RefreshCw, Shield } from 'lucide-react'
import { type Appointment, type Pet, type Location, type Payment } from '@prisma/client'

interface AppointmentWithRelations extends Appointment {
  pet: Pet
  location: Location
  payment?: Payment | null
}

interface CardPaymentComponentProps {
  appointment: AppointmentWithRelations
}

interface CardPaymentData {
  paymentId: string
  preferenceId: string
  initPoint: string
  sandboxInitPoint: string
  isMockMode?: boolean
}

export function CardPaymentComponent({ appointment }: CardPaymentComponentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [paymentData, setPaymentData] = useState<CardPaymentData | null>(null)
  const router = useRouter()

  const createCardPayment = async () => {
    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/payments/create-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          amount: Number(appointment.totalAmount),
          userEmail: 'test@example.com', // Will be replaced by session email in API
          description: `Banho ${appointment.pet.name} - ${new Date(appointment.date).toLocaleDateString()}`
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao processar pagamento')
      }

      const data = await response.json()
      setPaymentData(data)
      
      // Redirect to payment page
      if (data.initPoint) {
        window.location.href = data.initPoint
      }
    } catch (error) {
      console.error('[CARD_PAYMENT_ERROR]:', error)
      setError(error instanceof Error ? error.message : 'Erro interno do servidor')
    } finally {
      setIsProcessing(false)
    }
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={createCardPayment} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/dashboard/pagamento/${appointment.id}`)}
        >
          Voltar às opções de pagamento
        </Button>
      </div>
    )
  }

  const isMockMode = process.env.NODE_ENV !== 'production' || 
                     process.env.PAYMENT_MOCK_MODE === 'true' || 
                     !process.env.MERCADOPAGO_ACCESS_TOKEN

  return (
    <div className="space-y-6">
      {/* Mock Mode Alert */}
      {isMockMode && (
        <Alert>
          <AlertDescription className="flex items-start space-x-2">
            <span className="text-blue-600">🧪</span>
            <div>
              <strong>Modo de Teste Ativo:</strong> Você será redirecionado para uma página de checkout simulada. 
              O resultado do pagamento será aleatório (90% aprovação) para demonstração.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">Você está pagando:</span>
          <span className="text-2xl font-bold text-green-600">
            R$ {appointment.totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <div>Banho para {appointment.pet.name}</div>
          <div>{new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="space-y-4">
        <Button
          onClick={createCardPayment}
          disabled={isProcessing}
          className="w-full h-14 text-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Preparando checkout...
            </>
          ) : (
            <>
              <CreditCard className="mr-3 h-5 w-5" />
              Pagar com Cartão
              <ExternalLink className="ml-3 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Você será redirecionado para o checkout seguro
          </p>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 mb-2">Pagamento 100% seguro</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Processado via Mercado Pago</li>
              <li>• Conexão criptografada (SSL)</li>
              <li>• Não armazenamos dados do cartão</li>
              <li>• Proteção contra fraude</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Process Steps */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-3">Como funciona:</h4>
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </div>
            <div className="text-sm text-blue-800">
              Clique em "Pagar com Cartão" para ser redirecionado
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </div>
            <div className="text-sm text-blue-800">
              Insira os dados do seu cartão no checkout seguro
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              3
            </div>
            <div className="text-sm text-blue-800">
              Confirme o pagamento e aguarde a aprovação
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              4
            </div>
            <div className="text-sm text-blue-800">
              Receba a confirmação e o QR Code de acesso
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Payment */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600 mb-3">Prefere outra forma de pagamento?</p>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/pagamento/pix/${appointment.id}`)}
          className="mr-3"
        >
          Pagar com PIX
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/pagamento/${appointment.id}`)}
        >
          Ver todas as opções
        </Button>
      </div>
    </div>
  )
}