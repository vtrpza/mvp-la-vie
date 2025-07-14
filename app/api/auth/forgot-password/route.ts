import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Por segurança, não informamos que o email não existe
      return NextResponse.json(
        { message: 'Se o email existir, você receberá instruções para redefinir sua senha' },
        { status: 200 }
      )
    }

    // TODO: Implementar envio de email de recuperação
    // Por enquanto, apenas simulamos o sucesso
    console.log(`[FORGOT_PASSWORD] Email de recuperação deveria ser enviado para: ${email}`)

    return NextResponse.json(
      { message: 'Se o email existir, você receberá instruções para redefinir sua senha' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[FORGOT_PASSWORD_ERROR]:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}