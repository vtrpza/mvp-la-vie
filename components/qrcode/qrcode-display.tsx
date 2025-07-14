'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, RefreshCw, Loader2 } from 'lucide-react'

interface QRCodeDisplayProps {
  appointmentId: string
}

export function QRCodeDisplay({ appointmentId }: QRCodeDisplayProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const generateQRCode = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/qr-codes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao gerar QR Code')
      }

      const data = await response.json()
      setQrCodeImage(data.qrCodeImage)
    } catch (error) {
      console.error('[QR_CODE_DISPLAY_ERROR]:', error)
      setError(error instanceof Error ? error.message : 'Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeImage) return

    const link = document.createElement('a')
    link.href = qrCodeImage
    link.download = `qrcode-agendamento-${appointmentId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    generateQRCode()
  }, [appointmentId])

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Gerando QR Code...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="w-full"
          onClick={generateQRCode}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
      </div>
    )
  }

  if (!qrCodeImage) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          QR Code não disponível
        </p>
        <Button
          variant="outline"
          onClick={generateQRCode}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Gerar QR Code
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <img 
            src={qrCodeImage}
            alt="QR Code de Acesso"
            className="w-48 h-48"
          />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Escaneie este código no container para liberar o acesso
        </p>
        
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadQRCode}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar QR Code
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={generateQRCode}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          <strong>Importante:</strong> Este QR Code é válido apenas no dia e horário do seu agendamento.
          O acesso é liberado 30 minutos antes do horário marcado.
        </AlertDescription>
      </Alert>
    </div>
  )
}