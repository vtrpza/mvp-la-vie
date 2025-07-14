import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react'

export default function PaymentErrorPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Pagamento Não Processado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Houve um problema ao processar seu pagamento. Não se preocupe, seu agendamento foi mantido e você pode tentar novamente.
          </p>
          
          <div className="bg-yellow-50 p-3 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Possíveis causas:</strong>
            </p>
            <ul className="text-sm text-yellow-700 mt-1 text-left">
              <li>• Saldo insuficiente</li>
              <li>• Dados do cartão incorretos</li>
              <li>• Problema de conexão</li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/dashboard/agendamentos">
                <CreditCard className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}