'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao enviar email')
      }

      setSuccess(true)
    } catch (error) {
      console.error('[FORGOT_PASSWORD_ERROR]:', error)
      setError(error instanceof Error ? error.message : 'Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-lavie-green rounded-full flex items-center justify-center mx-auto shadow-lg">
          <span className="text-2xl text-white">📮</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-lavie-black mb-2">Email enviado com sucesso!</h3>
          <p className="text-lavie-black/70 mb-4">
            Instruções de recuperação foram enviadas para seu email.
          </p>
          <div className="bg-lavie-yellow/20 border border-lavie-yellow/30 rounded-lg p-4 text-sm text-lavie-black/80">
            🔍 Verifique sua caixa de entrada e a pasta de spam
          </div>
        </div>
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

      <div className="space-y-3">
        <Label htmlFor="email" className="text-lavie-black font-medium">
          Email cadastrado
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Digite o email da sua conta"
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
        <p className="text-xs text-lavie-black/60">
          Enviaremos instruções para redefinir sua senha
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-lavie-yellow hover:bg-lavie-black text-lavie-black hover:text-lavie-yellow font-display font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Enviando instruções...
          </>
        ) : (
          '📧 Enviar instruções de recuperação'
        )}
      </Button>
    </form>
  )
}