import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { XCircle, ArrowLeft, CreditCard, RefreshCw } from 'lucide-react'

export default function PaymentErrorPage() {
  const isDevMode = process.env.PAYMENT_MOCK_MODE === 'true' || !process.env.MERCADOPAGO_ACCESS_TOKEN

  return (
    <div className="max-w-lg mx-auto mt-12 space-y-6">
      {isDevMode && (
        <Alert>
          <AlertDescription className="flex items-center space-x-2">
            <span className="text-blue-600">🧪</span>
            <span>
              <strong>Modo de Teste:</strong> Este erro foi simulado para demonstração (10% de falhas simuladas).
            </span>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">
            {isDevMode ? 'Pagamento Simulado Rejeitado' : 'Pagamento Não Processado'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <p className="text-gray-600 mb-4">
              {isDevMode 
                ? 'Este erro foi gerado automaticamente para demonstrar o fluxo de falha no pagamento.'
                : 'Houve um problema ao processar seu pagamento. Não se preocupe, seu agendamento foi mantido e você pode tentar novamente.'
              }
            </p>
            
            {!isDevMode && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-yellow-800 mb-2">Possíveis causas:</h3>
                <ul className="text-sm text-yellow-700 text-left space-y-1">
                  <li>• Saldo insuficiente no cartão</li>
                  <li>• Dados do cartão incorretos</li>
                  <li>• Cartão bloqueado ou vencido</li>
                  <li>• Problema de conexão</li>
                  <li>• Limite de transação excedido</li>
                </ul>
              </div>
            )}

            {isDevMode && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-blue-900 mb-2">Modo de Desenvolvimento:</h3>
                <p className="text-sm text-blue-800">
                  Nosso sistema simula 90% de aprovações e 10% de rejeições para demonstração. 
                  Você pode tentar novamente para experimentar uma aprovação simulada.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button asChild className="h-12">
              <Link href="/dashboard/agendamentos">
                <RefreshCw className="mr-2 h-5 w-5" />
                Tentar Pagamento Novamente
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </Button>

            {!isDevMode && (
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Problemas persistindo? Entre em contato com nosso suporte.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}