import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from '@/components/profile/profile-form'
import { PetsList } from '@/components/profile/pets-list'
import { PageHeader } from '@/components/ui/page-header'
import { User, Heart, Settings, Shield, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      pets: true,
      appointments: true,
    },
  })

  if (!user) {
    return null
  }

  const totalAppointments = user.appointments?.length || 0;
  
  // Create a clean user object without appointments for ProfileForm
  const cleanUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Header with PageHeader component */}
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais e pets cadastrados"
        icon="heart"
        badge={{
          text: `${totalAppointments} banho${totalAppointments !== 1 ? 's' : ''}`,
          variant: 'info'
        }}
        centered={false}
        gradient={true}
      />

      {/* Profile Stats - Mobile Responsive Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="text-center p-3 md:p-4">
          <CardContent className="p-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Membro desde</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-tight">{memberSince}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center p-3 md:p-4">
          <CardContent className="p-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Pets</h3>
            <p className="text-xs md:text-sm text-gray-600">{user.pets.length} pet{user.pets.length !== 1 ? 's' : ''}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center p-3 md:p-4">
          <CardContent className="p-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Banhos</h3>
            <p className="text-xs md:text-sm text-gray-600">{totalAppointments}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center p-3 md:p-4">
          <CardContent className="p-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Status</h3>
            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Ativo</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Mobile-First Responsive */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
            <CardTitle className="flex items-center text-blue-900">
              <User className="mr-2 h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription className="text-blue-700">
              Mantenha seus dados de contato sempre atualizados
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ProfileForm user={cleanUser} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="flex items-center text-green-900">
              <Heart className="mr-2 h-5 w-5" />
              Meus Pets
            </CardTitle>
            <CardDescription className="text-green-700">
              Adicione e gerencie as informações dos seus pets
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <PetsList pets={user.pets} />
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
          <CardTitle className="flex items-center text-purple-900">
            <Settings className="mr-2 h-5 w-5" />
            Configurações da Conta
          </CardTitle>
          <CardDescription className="text-purple-700">
            Preferências e configurações de segurança
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h4 className="font-medium text-gray-900">Notificações via WhatsApp</h4>
                <p className="text-sm text-gray-600">Receba confirmações e lembretes</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h4 className="font-medium text-gray-900">Notificações via Email</h4>
                <p className="text-sm text-gray-600">Receba QR Codes e comprovantes</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Pagamentos Salvos</h4>
                <p className="text-sm text-gray-600">Gerencie métodos de pagamento</p>
              </div>
              <Badge className="bg-gray-100 text-gray-800">Mercado Pago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}