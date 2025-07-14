import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Cadastro | La\'vie Pet',
  description: 'Crie sua conta para agendar banho self-service',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavie-yellow/20 via-lavie-white to-lavie-gray/30 flex flex-col">
      {/* Mobile-first header with back navigation */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-lavie-black hover:text-lavie-black/80 transition-colors"
        >
          <div className="w-8 h-8 bg-lavie-yellow rounded-full flex items-center justify-center relative">
            <div className="w-5 h-5 bg-lavie-black rounded-full opacity-20"></div>
            <span className="absolute text-lavie-black font-bold text-xs">L</span>
          </div>
          <span className="font-display font-bold text-xl">La'vie Pet</span>
        </Link>
      </div>

      {/* Main content - centered with proper mobile spacing */}
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and title section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-lavie-yellow rounded-full flex items-center justify-center relative shadow-lg">
                <div className="w-10 h-10 bg-lavie-black rounded-full opacity-20"></div>
                <span className="absolute text-lavie-black font-bold text-xl">🎆</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-lavie-black">
                Junte-se ao La'vie Pet!
              </h1>
              <p className="text-lavie-black/70 mt-2">
                Crie sua conta gratuita e revolucione o banho do seu pet
              </p>
            </div>
          </div>
          
          {/* Enhanced card with better mobile styling */}
          <Card className="border-0 shadow-xl bg-lavie-white/95 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <RegisterForm />
              
              {/* Enhanced navigation links */}
              <div className="mt-8 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-lavie-gray"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-lavie-white px-3 text-lavie-black/60">Ou</span>
                  </div>
                </div>
                
                <div className="text-center space-y-3">
                  <p className="text-sm text-lavie-black/70">
                    Já tem uma conta?
                  </p>
                  <Link 
                    href="/login" 
                    className="block w-full py-3 px-4 bg-lavie-gray hover:bg-lavie-yellow/20 border border-lavie-gray hover:border-lavie-yellow transition-all duration-200 rounded-lg font-medium text-lavie-black text-center"
                  >
                    Fazer login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Benefits and trust indicators */}
          <div className="text-center space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs text-lavie-black/60">
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">🔒</span>
                <span>Seguro</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">🌱</span>
                <span>Sustentável</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">❤️</span>
                <span>Pet Friendly</span>
              </div>
            </div>
            <p className="text-xs text-lavie-black/50">
              Ao se cadastrar, você concorda com nossos termos de uso
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}