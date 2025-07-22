import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { paymentId, appointmentId, status } = await request.json()

    console.log('[MOCK_WEBHOOK] Webhook mockado recebido:', { paymentId, appointmentId, status })

    if (!paymentId || !appointmentId) {
      return NextResponse.json(
        { message: 'Parâmetros obrigatórios ausentes' },
        { status: 400 }
      )
    }

    // Update payment status in database
    const paymentStatus = status === 'approved' ? 'APPROVED' : 
                         status === 'rejected' ? 'REJECTED' : 'PENDING'

    await prisma.payment.update({
      where: { appointmentId },
      data: {
        status: paymentStatus,
        mercadoPagoId: paymentId,
        mercadoPagoData: {
          mock: true,
          status,
          payment_method_id: 'pix',
          transaction_amount: 30.00,
          processed_at: new Date().toISOString()
        }
      }
    })

    // Update appointment status if payment approved
    if (status === 'approved') {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' }
      })

      console.log('[MOCK_WEBHOOK] Pagamento PIX aprovado:', paymentId)
    } else if (status === 'rejected') {
      console.log('[MOCK_WEBHOOK] Pagamento PIX rejeitado:', paymentId)
    }

    return NextResponse.json({ message: 'Webhook processado com sucesso' })
  } catch (error) {
    console.error('[MOCK_WEBHOOK_ERROR]:', error)
    
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Simulate webhook for testing - this endpoint can be called manually to trigger payment approval
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const paymentId = searchParams.get('payment_id')
  const appointmentId = searchParams.get('appointment_id')
  const status = searchParams.get('status') || 'approved'

  if (!paymentId || !appointmentId) {
    return NextResponse.json(
      { message: 'payment_id e appointment_id são obrigatórios' },
      { status: 400 }
    )
  }

  // Call the POST method to simulate webhook
  const mockWebhookRequest = new Request(request.url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ paymentId, appointmentId, status })
  })

  return POST(mockWebhookRequest as NextRequest)
}