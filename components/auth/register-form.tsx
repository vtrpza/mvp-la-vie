'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao criar conta')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      console.error('[REGISTER_ERROR]:', error)
      setError(error instanceof Error ? error.message : 'Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-lavie-green rounded-full flex items-center justify-center mx-auto shadow-lg">
          <span className="text-2xl text-white">✓</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-lavie-black mb-2">Conta criada com sucesso!</h3>
          <p className="text-lavie-black/70">Redirecionando para o login...</p>
        </div>
        <div className="w-8 h-1 bg-lavie-yellow rounded-full mx-auto animate-pulse"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 md:col-span-2">
          <Label htmlFor="name" className="text-lavie-black font-medium">
            Nome completo
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            {...register('name')}
            disabled={isLoading}
            className="h-12 border-lavie-gray focus:border-lavie-yellow focus:ring-lavie-yellow/20 bg-lavie-white"
          />
          {errors.name && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">!</span>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-3 md:col-span-2">
          <Label htmlFor="email" className="text-lavie-black font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register('email')}
            disabled={isLoading}
            className="h-12 border-lavie-gray focus:border-lavie-yellow focus:ring-lavie-yellow/20 bg-lavie-white"
          />
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">!</span>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-3 md:col-span-2">
          <Label htmlFor="phone" className="text-lavie-black font-medium">
            Telefone <span className="text-lavie-black/50 font-normal">(opcional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            {...register('phone')}
            disabled={isLoading}
            className="h-12 border-lavie-gray focus:border-lavie-yellow focus:ring-lavie-yellow/20 bg-lavie-white"
          />
          {errors.phone && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">!</span>
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-lavie-black font-medium">
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
              className="h-12 pr-12 border-lavie-gray focus:border-lavie-yellow focus:ring-lavie-yellow/20 bg-lavie-white"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lavie-black/50 hover:text-lavie-black transition-colors p-1"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">!</span>
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="confirmPassword" className="text-lavie-black font-medium">
            Confirmar senha
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword')}
              disabled={isLoading}
              className="h-12 pr-12 border-lavie-gray focus:border-lavie-yellow focus:ring-lavie-yellow/20 bg-lavie-white"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lavie-black/50 hover:text-lavie-black transition-colors p-1"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">!</span>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full h-12 bg-lavie-yellow hover:bg-lavie-black text-lavie-black hover:text-lavie-yellow font-display font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Criando sua conta...
            </>
          ) : (
            'Criar minha conta gratuita'
          )}
        </Button>
      </div>
    </form>
  )
}