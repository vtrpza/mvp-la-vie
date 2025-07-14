import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sendConfirmationNotifications } from '@/lib/notifications'
import { z } from 'zod'

const sendNotificationSchema = z.object({
  appointmentId: z.string().min(1, 'ID do agendamento é obrigatório'),
  type: z.enum(['CONFIRMATION', 'REMINDER', 'CANCELLATION']).optional().default('CONFIRMATION'),
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
    const { appointmentId } = sendNotificationSchema.parse(body)

    // Enviar notificações
    await sendConfirmationNotifications(appointmentId)

    return NextResponse.json({
      message: 'Notificações enviadas com sucesso',
      appointmentId,
    })
  } catch (error) {
    console.error('[SEND_NOTIFICATION_ERROR]:', error)
    
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