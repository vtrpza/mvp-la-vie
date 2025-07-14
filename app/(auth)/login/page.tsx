import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Login | La\'vie Pet',
  description: 'Faça login para agendar seu banho self-service',
}

export default function LoginPage() {
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
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and title section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-lavie-yellow rounded-full flex items-center justify-center relative shadow-lg">
                <div className="w-10 h-10 bg-lavie-black rounded-full opacity-20"></div>
                <span className="absolute text-lavie-black font-bold text-xl">🐾</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-lavie-black">
                Bem-vindo de volta!
              </h1>
              <p className="text-lavie-black/70 mt-2">
                Entre na sua conta para agendar banhos
              </p>
            </div>
          </div>
          
          {/* Enhanced card with better mobile styling */}
          <Card className="border-0 shadow-xl bg-lavie-white/95 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <LoginForm />
              
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
                    Não tem uma conta?
                  </p>
                  <Link 
                    href="/register" 
                    className="block w-full py-3 px-4 bg-lavie-gray hover:bg-lavie-yellow/20 border border-lavie-gray hover:border-lavie-yellow transition-all duration-200 rounded-lg font-medium text-lavie-black text-center"
                  >
                    Criar conta gratuita
                  </Link>
                  
                  <Link 
                    href="/forgot-password" 
                    className="block text-sm text-lavie-black/70 hover:text-lavie-black transition-colors mt-4"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Trust indicators */}
          <div className="text-center space-y-2">
            <p className="text-xs text-lavie-black/50">
              🔒 Seus dados estão protegidos e seguros
            </p>
            <p className="text-xs text-lavie-black/50">
              💚 100% sustentável • 🐾 Pet friendly
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}