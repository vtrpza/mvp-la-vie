import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { 
  Clock, 
  MapPin, 
  CreditCard, 
  QrCode, 
  Phone, 
  Mail, 
  AlertCircle,
  CheckCircle,
  MessageCircle,
  BookOpen,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  return (
    <div className="space-y-8">
      {/* Standardized Header */}
      <PageHeader
        title="Central de Ajuda"
        description="Encontre respostas para suas dúvidas sobre o La'vie Pet Banho Experience e aprenda como aproveitar ao máximo nosso serviço"
        icon="help-circle"
        centered
        gradient
      />

      {/* Quick Actions - Mobile Responsive */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-200 mobile-card touch-manipulation">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
            <p className="text-sm text-gray-600 mb-3">Fale conosco agora</p>
            <Button size="sm" className="bg-green-500 hover:bg-green-600 w-full sm:w-auto mobile-button">
              Conversar
            </Button>
          </CardContent>
        </Card>
        
        <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-200 mobile-card touch-manipulation">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <p className="text-sm text-gray-600 mb-3">Envie sua dúvida</p>
            <Button size="sm" variant="outline" className="w-full sm:w-auto mobile-button">
              Enviar Email
            </Button>
          </CardContent>
        </Card>
        
        <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-200 mobile-card touch-manipulation">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Tutorial</h3>
            <p className="text-sm text-gray-600 mb-3">Como usar o serviço</p>
            <Button size="sm" variant="outline" className="w-full sm:w-auto mobile-button">
              Ver Tutorial
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
            <CardTitle className="flex items-center text-blue-900">
              <Clock className="mr-2 h-5 w-5" />
              Como Funciona
            </CardTitle>
            <CardDescription className="text-blue-700">
              Entenda o processo de banho self-service em 4 passos simples
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Agende online</p>
                  <p className="text-sm text-gray-600">Escolha data, horário e local</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Pague online</p>
                  <p className="text-sm text-gray-600">PIX ou cartão - R$ 30,00</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Receba o QR Code</p>
                  <p className="text-sm text-gray-600">WhatsApp + Email</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">4</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Vá ao container</p>
                  <p className="text-sm text-gray-600">Use o QR Code para acessar</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="flex items-center text-green-900">
              <MapPin className="mr-2 h-5 w-5" />
              Unidade Tambaú
            </CardTitle>
            <CardDescription className="text-green-700">
              Nossa primeira unidade está localizada em Tambaú/SP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Endereço:</p>
              <p className="text-sm text-gray-600">Tambaú - SP</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Horário de Funcionamento:</p>
              <p className="text-sm text-gray-600">7:30 às 22:30, todos os dias</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Duração do Banho:</p>
              <p className="text-sm text-gray-600">30 minutos por sessão</p>
            </div>
            
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Operacional
            </Badge>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
            <CardTitle className="flex items-center text-purple-900">
              <CreditCard className="mr-2 h-5 w-5" />
              Pagamento
            </CardTitle>
            <CardDescription className="text-purple-700">
              Formas de pagamento aceitas e segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Valor por sessão:</span>
                <span className="text-sm text-gray-600">R$ 30,00</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">PIX:</span>
                <Badge className="bg-green-100 text-green-800">Aceito</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cartão de Crédito:</span>
                <Badge className="bg-green-100 text-green-800">Aceito</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cartão de Débito:</span>
                <Badge className="bg-green-100 text-green-800">Aceito</Badge>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">
                Pagamento processado pelo Mercado Pago
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
            <CardTitle className="flex items-center text-orange-900">
              <QrCode className="mr-2 h-5 w-5" />
              QR Code de Acesso
            </CardTitle>
            <CardDescription className="text-orange-700">
              Como usar o QR Code para acessar o container
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Validade:</p>
                  <p className="text-sm text-gray-600">
                    30 minutos antes até o fim da sessão
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Uso único:</p>
                  <p className="text-sm text-gray-600">
                    Cada QR Code é válido apenas para uma sessão
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Cancelamento:</p>
                  <p className="text-sm text-gray-600">
                    Até 2 horas antes do horário agendado
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Contact Section */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b">
          <CardTitle className="flex items-center text-indigo-900">
            <Sparkles className="mr-2 h-5 w-5" />
            Ainda tem dúvidas?
          </CardTitle>
          <CardDescription className="text-indigo-700">
            Nossa equipe está pronta para ajudar você!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                  <p className="text-sm text-gray-600">Resposta imediata</p>
                </div>
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600">
                <Phone className="mr-2 h-4 w-4" />
                (11) 99999-9999
              </Button>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-sm text-gray-600">Suporte técnico</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                suporte@laviepet.com.br
              </Button>
            </Card>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Horário de Atendimento</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Segunda a Domingo: 7:30 às 22:30
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Back to Dashboard */}
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard">
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}