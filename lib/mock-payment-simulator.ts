/**
 * Mock Payment Simulator
 * Simulates automatic payment approval after a delay for PIX payments
 */

import { prisma } from '@/lib/db'

interface MockPaymentSimulation {
  paymentId: string
  appointmentId: string
  timeoutId?: NodeJS.Timeout
}

// Store active simulations
const activeSimulations = new Map<string, MockPaymentSimulation>()

export function startPixPaymentSimulation(paymentId: string, appointmentId: string) {
  console.log('[MOCK_PAYMENT_SIM] Iniciando simulação de pagamento PIX:', { paymentId, appointmentId })

  // Clear existing simulation if any
  stopPaymentSimulation(paymentId)

  // Random delay between 5-10 seconds to simulate real PIX processing
  const delay = Math.random() * 5000 + 5000

  const timeoutId = setTimeout(async () => {
    try {
      console.log('[MOCK_PAYMENT_SIM] Processando aprovação automática para:', paymentId)

      // 90% success rate simulation
      const isApproved = Math.random() > 0.1
      const status = isApproved ? 'APPROVED' : 'REJECTED'

      // Update payment in database
      await prisma.payment.update({
        where: { appointmentId },
        data: {
          status,
          mercadoPagoData: {
            mock: true,
            status: isApproved ? 'approved' : 'rejected',
            payment_method_id: 'pix',
            transaction_amount: 30.00,
            processed_at: new Date().toISOString(),
            auto_approved: true
          }
        }
      })

      if (isApproved) {
        // Update appointment status to confirmed
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CONFIRMED' }
        })

        console.log('[MOCK_PAYMENT_SIM] ✅ Pagamento PIX aprovado automaticamente:', paymentId)
      } else {
        console.log('[MOCK_PAYMENT_SIM] ❌ Pagamento PIX rejeitado automaticamente:', paymentId)
      }

      // Remove from active simulations
      activeSimulations.delete(paymentId)
    } catch (error) {
      console.error('[MOCK_PAYMENT_SIM] Erro na simulação:', error)
      activeSimulations.delete(paymentId)
    }
  }, delay)

  // Store simulation reference
  activeSimulations.set(paymentId, {
    paymentId,
    appointmentId,
    timeoutId
  })

  console.log(`[MOCK_PAYMENT_SIM] Simulação agendada para ${Math.round(delay / 1000)}s`)
}

export function stopPaymentSimulation(paymentId: string) {
  const simulation = activeSimulations.get(paymentId)
  if (simulation?.timeoutId) {
    clearTimeout(simulation.timeoutId)
    activeSimulations.delete(paymentId)
    console.log('[MOCK_PAYMENT_SIM] Simulação cancelada para:', paymentId)
  }
}

export function getActiveSimulations(): MockPaymentSimulation[] {
  return Array.from(activeSimulations.values())
}

// Manual trigger for testing
export async function manuallyApprovePayment(appointmentId: string, approve: boolean = true) {
  try {
    const status = approve ? 'APPROVED' : 'REJECTED'
    
    await prisma.payment.update({
      where: { appointmentId },
      data: {
        status,
        mercadoPagoData: {
          mock: true,
          status: approve ? 'approved' : 'rejected',
          payment_method_id: 'pix',
          transaction_amount: 30.00,
          processed_at: new Date().toISOString(),
          manually_triggered: true
        }
      }
    })

    if (approve) {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' }
      })
    }

    console.log(`[MOCK_PAYMENT_SIM] Pagamento ${approve ? 'aprovado' : 'rejeitado'} manualmente:`, appointmentId)
    
    return { success: true, status }
  } catch (error) {
    console.error('[MOCK_PAYMENT_SIM] Erro na aprovação manual:', error)
    return { success: false, error }
  }
}