import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getPaymentStatus } from '@/lib/mercadopago'
import { sendConfirmationNotifications } from '@/lib/notifications'
import { PaymentStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('[WEBHOOK_RECEIVED]:', body)

    // Webhook do Mercado Pago
    if (body.type === 'payment') {
      const paymentId = body.data?.id
      
      if (!paymentId) {
        console.log('[WEBHOOK_ERROR]: Payment ID not found in webhook')
        return NextResponse.json({ message: 'Payment ID not found' }, { status: 400 })
      }

      // Buscar detalhes do pagamento no Mercado Pago
      const mpPayment = await getPaymentStatus(paymentId.toString())
      
      console.log('[MP_PAYMENT_STATUS]:', mpPayment)

      // Buscar pagamento no banco pelo mercadoPagoId
      const payment = await prisma.payment.findFirst({
        where: { mercadoPagoId: paymentId.toString() },
        include: { appointment: true }
      })

      if (!payment) {
        console.log('[WEBHOOK_ERROR]: Payment not found in database')
        return NextResponse.json({ message: 'Payment not found' }, { status: 404 })
      }

      // Atualizar status do pagamento
      let newStatus: PaymentStatus = PaymentStatus.PENDING
      
      switch (mpPayment.status) {
        case 'approved':
          newStatus = PaymentStatus.APPROVED
          break
        case 'rejected':
          newStatus = PaymentStatus.REJECTED
          break
        case 'cancelled':
          newStatus = PaymentStatus.CANCELLED
          break
        default:
          newStatus = PaymentStatus.PENDING
      }

      // Atualizar pagamento no banco
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: newStatus }
      })

      // Se o pagamento foi aprovado, confirmar o agendamento e gerar QR Code
      if (newStatus === PaymentStatus.APPROVED) {
        const qrCode = `LAVIEPET_${payment.appointment.id}_${Date.now()}`
        
        await prisma.appointment.update({
          where: { id: payment.appointmentId },
          data: { 
            status: 'CONFIRMED',
            qrCode: qrCode
          }
        })

        console.log('[APPOINTMENT_CONFIRMED]:', payment.appointmentId)
        
        // Enviar notificações (WhatsApp/Email) com QR Code
        await sendConfirmationNotifications(payment.appointmentId)
      }

      return NextResponse.json({ message: 'Webhook processed successfully' })
    }

    return NextResponse.json({ message: 'Webhook type not supported' })
  } catch (error) {
    console.error('[WEBHOOK_ERROR]:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Endpoint para teste do webhook
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is working',
    timestamp: new Date().toISOString()
  })
}