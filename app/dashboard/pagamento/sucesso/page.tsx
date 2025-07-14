import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Calendar } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-green-900">Pagamento Aprovado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Seu agendamento foi confirmado com sucesso. Você receberá o QR Code de acesso por WhatsApp e email.
          </p>
          
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