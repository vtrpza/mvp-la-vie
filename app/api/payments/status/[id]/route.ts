import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar pagamento do agendamento
    const appointment = await prisma.appointment.findUnique({
      where: { 
        id: id,
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

    if (!appointment.payment) {
      return NextResponse.json(
        { message: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      paymentId: appointment.payment.id,
      status: appointment.payment.status,
      amount: appointment.payment.amount,
      paymentMethod: appointment.payment.paymentMethod,
      createdAt: appointment.payment.createdAt,
      updatedAt: appointment.payment.updatedAt,
    })
  } catch (error) {
    console.error('[GET_PAYMENT_STATUS_ERROR]:', error)
    
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}