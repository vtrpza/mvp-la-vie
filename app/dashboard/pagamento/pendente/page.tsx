import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Calendar, CreditCard } from 'lucide-react'

export default function PaymentPendingPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-yellow-900">Pagamento Pendente</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Seu pagamento está sendo processado. Aguarde a confirmação para que seu agendamento seja liberado.
          </p>
          
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>O que acontece agora:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-1 text-left">
              <li>• Aguardamos a confirmação do pagamento</li>
              <li>• Você receberá uma notificação quando aprovado</li>
              <li>• O QR Code será enviado por WhatsApp/Email</li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/dashboard/agendamentos">
                <Calendar className="mr-2 h-4 w-4" />
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