import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Calendar, Smartphone, Mail } from 'lucide-react'

export default function PaymentSuccessPage() {
  const isDevMode = process.env.PAYMENT_MOCK_MODE === 'true' || !process.env.MERCADOPAGO_ACCESS_TOKEN

  return (
    <div className="max-w-lg mx-auto mt-12 space-y-6">
      {isDevMode && (
        <Alert>
          <AlertDescription className="flex items-center space-x-2">
            <span className="text-blue-600">🧪</span>
            <span>
              <strong>Modo de Teste:</strong> Este é um pagamento simulado utilizado para demonstração.
            </span>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-900">Pagamento Aprovado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <p className="text-gray-600 mb-4">
              Seu agendamento foi confirmado com sucesso!
            </p>
            
            {!isDevMode && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-blue-900 mb-2">Próximos passos:</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center justify-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>QR Code enviado por WhatsApp</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Confirmação enviada por email</span>
                  </div>
                </div>
              </div>
            )}

            {isDevMode && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-yellow-900 mb-2">Modo de Desenvolvimento:</h3>
                <p className="text-sm text-yellow-800">
                  Em produção, você receberia o QR Code de acesso por WhatsApp e email. 
                  Para testar, vá até seus agendamentos para ver o QR Code gerado.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button asChild className="h-12">
              <Link href="/dashboard/agendamentos">
                <Calendar className="mr-2 h-5 w-5" />
                Ver Meus Agendamentos
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}