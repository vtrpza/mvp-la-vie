'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { QrCode, Copy, CheckCircle, Loader2, Clock, RefreshCw } from 'lucide-react'
import { type Appointment, type Pet, type Location, type Payment } from '@prisma/client'
import Image from 'next/image'

interface AppointmentWithRelations extends Appointment {
  pet: Pet
  location: Location
  payment?: Payment | null
}

interface PixPaymentComponentProps {
  appointment: AppointmentWithRelations
}

interface PixPaymentData {
  paymentId: string
  qrCode: string
  qrCodeBase64: string
  expirationDate: string
  isMockMode?: boolean
}

export function PixPaymentComponent({ appointment }: PixPaymentComponentProps) {
  const [pixData, setPixData] = useState<PixPaymentData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    createPixPayment()
  }, [])

  useEffect(() => {
    if (pixData?.expirationDate) {
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const expiration = new Date(pixData.expirationDate).getTime()
        const remaining = Math.max(0, Math.floor((expiration - now) / 1000))
        
        setTimeRemaining(remaining)
        
        if (remaining === 0) {
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [pixData])

  const createPixPayment = async () => {
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
          amount: Number(appointment.totalAmount),
          userEmail: 'test@example.com', // Will be replaced by session email in API
          description: `Banho ${appointment.pet.name} - ${new Date(appointment.date).toLocaleDateString()}`
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao processar pagamento PIX')
      }

      const data = await response.json()
      setPixData(data)
      
      // Start payment polling
      if (data.paymentId) {
        startPaymentPolling()
      }
    } catch (error) {
      console.error('[PIX_PAYMENT_ERROR]:', error)
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
              router.push('/dashboard/pagamento/sucesso')
            }, 3000)
          }
        }
      } catch (error) {
        console.error('[PAYMENT_POLLING_ERROR]:', error)
      }
    }, 3000)

    // Stop polling after 15 minutes
    setTimeout(() => clearInterval(interval), 900000)
  }

  const copyPixCode = async () => {
    if (pixData?.qrCode) {
      try {
        await navigator.clipboard.writeText(pixData.qrCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (success) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">Pagamento Confirmado!</h3>
          <p className="text-green-700 mb-4">
            Seu pagamento PIX foi processado com sucesso.<br />
            Seu agendamento foi confirmado!
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full text-sm text-green-700">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecionando em alguns segundos...
          </div>
        </div>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="text-center space-y-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <div>
          <h3 className="text-lg font-medium mb-2">Gerando PIX...</h3>
          <p className="text-gray-600">Aguarde enquanto preparamos seu código PIX</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={createPixPayment} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
      </div>
    )
  }

  if (!pixData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando dados do pagamento...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mock Mode Alert */}
      {pixData.isMockMode && (
        <Alert>
          <AlertDescription className="flex items-start space-x-2">
            <span className="text-blue-600">🧪</span>
            <div>
              <strong>Modo de Teste Ativo:</strong> Este é um pagamento simulado. 
              O status será atualizado automaticamente em 5-10 segundos para demonstração.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Timer */}
      {timeRemaining !== null && timeRemaining > 0 && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Clock className="h-4 w-4" />
          <span>PIX válido por: <strong>{formatTime(timeRemaining)}</strong></span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="text-center space-y-4">
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 inline-block">
            <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              {pixData.qrCodeBase64 ? (
                <Image
                  src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                  alt="QR Code PIX"
                  width={240}
                  height={240}
                  className="rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">QR Code será gerado em breve</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Escaneie com o aplicativo do seu banco
          </p>
        </div>

        {/* PIX Code */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código PIX (Copia e Cola):
            </label>
            <div className="flex">
              <input
                type="text"
                value={pixData.qrCode}
                readOnly
                className="flex-1 px-3 py-3 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                placeholder="Código PIX será gerado..."
              />
              <Button
                variant="outline"
                className="rounded-l-none border-l-0"
                onClick={copyPixCode}
                disabled={!pixData.qrCode}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="ml-1 text-green-600">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="ml-1">Copiar</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <strong>Aguardando pagamento...</strong>
                </div>
                <p className="text-sm">
                  O status será atualizado automaticamente quando o pagamento for processado.
                  {pixData.isMockMode && (
                    <span className="block mt-2 text-blue-600">
                      ⏱️ <strong>Modo de Teste:</strong> Aprovação automática em 5-10 segundos.
                    </span>
                  )}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Dicas importantes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• O PIX é processado instantaneamente</li>
              <li>• Mantenha esta tela aberta</li>
              <li>• Você será notificado quando o pagamento for confirmado</li>
              {!pixData.isMockMode && (
                <li>• Em caso de problema, entre em contato conosco</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/pagamento/${appointment.id}`)}
        >
          Escolher outra forma de pagamento
        </Button>
      </div>
    </div>
  )
}