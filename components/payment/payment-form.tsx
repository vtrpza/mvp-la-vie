'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { QrCode, CreditCard, Loader2, CheckCircle } from 'lucide-react'
import { type Appointment, type Pet, type Location, type Payment } from '@prisma/client'

interface AppointmentWithRelations extends Appointment {
  pet: Pet
  location: Location
  payment?: Payment | null
}

interface PaymentFormProps {
  appointment: AppointmentWithRelations
}

export function PaymentForm({ appointment }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pixQrCode, setPixQrCode] = useState<string | null>(null)
  const [pixCode, setPixCode] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handlePixPayment = async () => {
    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/payments/create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          amount: appointment.totalAmount,
          userEmail: appointment.pet.name, // Temp workaround
          description: `Banho ${appointment.pet.name} - ${new Date(appointment.date).toLocaleDateString()}`
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao processar pagamento PIX')
      }

      const data = await response.json()
      setPixQrCode(data.qrCodeBase64)
      setPixCode(data.qrCode)
      
      // Iniciar polling para verificar pagamento
      startPaymentPolling()
    } catch (error) {
      console.error('[PIX_PAYMENT_ERROR]:', error)
      setError(error instanceof Error ? error.message : 'Erro interno do servidor')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreditCardPayment = async () => {
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
          amount: appointment.totalAmount,
          userEmail: appointment.pet.name, // Temp workaround
          description: `Banho ${appointment.pet.name} - ${new Date(appointment.date).toLocaleDateString()}`
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao processar pagamento')
      }

      const data = await response.json()
      
      // Redirecionar para checkout do Mercado Pago
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

  const startPaymentPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/status/${appointment.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.status === 'APPROVED') {
            clearInterval(interval)
            setSuccess(true)
            setTimeout(() => {
              router.push('/dashboard/agendamentos')
            }, 3000)
          }
        }
      } catch (error) {
        console.error('[PAYMENT_POLLING_ERROR]:', error)
      }
    }, 3000) // Check every 3 seconds

    // Stop polling after 10 minutes
    setTimeout(() => clearInterval(interval), 600000)
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-green-900">Pagamento Confirmado!</h3>
        <p className="text-green-700">
          Seu agendamento foi confirmado. Você receberá o QR Code de acesso em breve.
        </p>
        <p className="text-sm text-gray-600">
          Redirecionando para seus agendamentos...
        </p>
      </div>
    )
  }

  if (pixQrCode && pixCode) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Pague com PIX</h3>
          <p className="text-sm text-gray-600 mb-4">
            Escaneie o QR Code ou copie o código PIX
          </p>
        </div>

        <div className="flex justify-center">
          <img 
            src={`data:image/png;base64,${pixQrCode}`}
            alt="QR Code PIX"
            className="w-48 h-48 border rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Código PIX:</label>
          <div className="flex">
            <input
              type="text"
              value={pixCode}
              readOnly
              className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50 text-sm"
            />
            <Button
              variant="outline"
              className="rounded-l-none"
              onClick={() => navigator.clipboard.writeText(pixCode)}
            >
              Copiar
            </Button>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Aguardando pagamento...</strong> O status será atualizado automaticamente quando o pagamento for processado.
          </AlertDescription>
        </Alert>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setPixQrCode(null)
            setPixCode(null)
            setPaymentMethod(null)
          }}
        >
          Escolher outra forma de pagamento
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Card 
          className={`cursor-pointer transition-colors ${
            paymentMethod === 'PIX' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => setPaymentMethod('PIX')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <QrCode className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium">PIX</p>
                  <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                </div>
              </div>
              <Badge variant="secondary">Recomendado</Badge>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-colors ${
            paymentMethod === 'CREDIT_CARD' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => setPaymentMethod('CREDIT_CARD')}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">Cartão de Crédito/Débito</p>
                <p className="text-sm text-gray-600">Visa, Mastercard, Elo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {paymentMethod && (
        <div className="pt-4 space-y-3">
          {paymentMethod === 'PIX' && (
            <Button
              className="w-full"
              onClick={handlePixPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Pagar com PIX - R$ {appointment.totalAmount.toFixed(2)}
                </>
              )}
            </Button>
          )}

          {paymentMethod === 'CREDIT_CARD' && (
            <Button
              className="w-full"
              onClick={handleCreditCardPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pagar com Cartão - R$ {appointment.totalAmount.toFixed(2)}
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/dashboard/agendamentos')}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  )
}