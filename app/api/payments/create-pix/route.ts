import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createPixPayment } from '@/lib/mercadopago'
import { z } from 'zod'

const createPixPaymentSchema = z.object({
  appointmentId: z.string().min(1, 'ID do agendamento é obrigatório'),
  amount: z.number().min(0, 'Valor deve ser positivo'),
  userEmail: z.string().email('Email inválido'),
  description: z.string().min(1, 'Descrição é obrigatória'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { appointmentId, amount, userEmail, description } = createPixPaymentSchema.parse(body)

    // Verificar se o agendamento pertence ao usuário
    const appointment = await prisma.appointment.findUnique({
      where: { 
        id: appointmentId,
        userId: session.user.id 
      },
      include: { payment: true }
    })

    if (!appointment) {
      return NextResponse.json(
        { message: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já não foi pago
    if (appointment.payment?.status === 'APPROVED') {
      return NextResponse.json(
        { message: 'Agendamento já foi pago' },
        { status: 400 }
      )
    }

    // Criar pagamento PIX no Mercado Pago
    const pixPayment = await createPixPayment({
      appointmentId,
      amount,
      userEmail: session.user.email!,
      description,
    })

    // Salvar ou atualizar pagamento no banco
    const payment = await prisma.payment.upsert({
      where: { appointmentId },
      update: {
        amount,
        paymentMethod: 'PIX',
        status: 'PENDING',
        mercadoPagoId: pixPayment.id,
      },
      create: {
        appointmentId,
        amount,
        paymentMethod: 'PIX',
        status: 'PENDING',
        mercadoPagoId: pixPayment.id,
      },
    })

    return NextResponse.json({
      paymentId: payment.id,
      qrCode: pixPayment.qrCode,
      qrCodeBase64: pixPayment.qrCodeBase64,
      expirationDate: pixPayment.expirationDate,
    })
  } catch (error) {
    console.error('[CREATE_PIX_PAYMENT_ERROR]:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}