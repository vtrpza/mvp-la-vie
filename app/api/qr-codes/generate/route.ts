import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateQRCodeForAppointment } from '@/lib/qrcode'
import { PaymentStatus } from '@prisma/client'
import { z } from 'zod'

const generateQRCodeSchema = z.object({
  appointmentId: z.string().min(1, 'ID do agendamento é obrigatório'),
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
    const { appointmentId } = generateQRCodeSchema.parse(body)

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

    // Verificar se o agendamento foi pago
    if (appointment.payment?.status !== PaymentStatus.APPROVED) {
      return NextResponse.json(
        { message: 'Agendamento deve estar pago para gerar QR Code' },
        { status: 400 }
      )
    }

    // Verificar se já tem QR Code
    if (appointment.qrCode) {
      return NextResponse.json(
        { message: 'QR Code já foi gerado para este agendamento' },
        { status: 400 }
      )
    }

    // Gerar QR Code
    const { qrCode, qrCodeImage } = await generateQRCodeForAppointment(appointmentId)

    return NextResponse.json({
      appointmentId,
      qrCode,
      qrCodeImage,
      message: 'QR Code gerado com sucesso'
    })
  } catch (error) {
    console.error('[GENERATE_QR_CODE_ERROR]:', error)
    
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