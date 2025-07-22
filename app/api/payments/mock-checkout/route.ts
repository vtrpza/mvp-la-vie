import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get('payment_id')
    const appointmentId = searchParams.get('appointment_id')
    const sandbox = searchParams.get('sandbox')

    if (!paymentId || !appointmentId) {
      return NextResponse.redirect(new URL('/dashboard/pagamento/erro?error=missing_params', request.url))
    }

    console.log('[MOCK_CHECKOUT] Processando pagamento mockado:', { paymentId, appointmentId, sandbox })

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      // Update payment status in database
      await prisma.payment.update({
        where: { appointmentId },
        data: {
          status: 'APPROVED',
          mercadoPagoId: paymentId,
          mercadoPagoData: {
            mock: true,
            status: 'approved',
            payment_method_id: 'visa',
            transaction_amount: 30.00,
            processed_at: new Date().toISOString()
          }
        }
      })

      // Update appointment status
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' }
      })

      console.log('[MOCK_CHECKOUT] Pagamento aprovado:', paymentId)

      return NextResponse.redirect(
        new URL(`/dashboard/pagamento/sucesso?payment_id=${paymentId}`, request.url)
      )
    } else {
      // Update payment status as rejected
      await prisma.payment.update({
        where: { appointmentId },
        data: {
          status: 'REJECTED',
          mercadoPagoId: paymentId,
          mercadoPagoData: {
            mock: true,
            status: 'rejected',
            status_detail: 'cc_rejected_insufficient_amount',
            processed_at: new Date().toISOString()
          }
        }
      })

      console.log('[MOCK_CHECKOUT] Pagamento rejeitado:', paymentId)

      return NextResponse.redirect(
        new URL(`/dashboard/pagamento/erro?payment_id=${paymentId}&error=payment_rejected`, request.url)
      )
    }
  } catch (error) {
    console.error('[MOCK_CHECKOUT_ERROR]:', error)
    
    return NextResponse.redirect(
      new URL('/dashboard/pagamento/erro?error=internal_error', request.url)
    )
  }
}