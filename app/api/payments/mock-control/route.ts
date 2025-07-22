import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { manuallyApprovePayment, getActiveSimulations } from '@/lib/mock-payment-simulator'
import { z } from 'zod'

const controlSchema = z.object({
  action: z.enum(['approve', 'reject', 'status']),
  appointmentId: z.string().min(1),
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
    const { action, appointmentId } = controlSchema.parse(body)

    if (action === 'approve') {
      const result = await manuallyApprovePayment(appointmentId, true)
      return NextResponse.json({
        message: 'Pagamento aprovado manualmente',
        result
      })
    }

    if (action === 'reject') {
      const result = await manuallyApprovePayment(appointmentId, false)
      return NextResponse.json({
        message: 'Pagamento rejeitado manualmente',
        result
      })
    }

    if (action === 'status') {
      const activeSimulations = getActiveSimulations()
      return NextResponse.json({
        message: 'Status das simulações ativas',
        activeSimulations
      })
    }

    return NextResponse.json(
      { message: 'Ação inválida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[MOCK_CONTROL_ERROR]:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET endpoint for easy testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')
  const appointmentId = searchParams.get('appointmentId')

  if (action === 'status') {
    const activeSimulations = getActiveSimulations()
    return NextResponse.json({
      message: 'Status das simulações ativas',
      activeSimulations,
      mockMode: process.env.PAYMENT_MOCK_MODE === 'true' || !process.env.MERCADOPAGO_ACCESS_TOKEN
    })
  }

  if (!appointmentId) {
    return NextResponse.json(
      { message: 'appointmentId é obrigatório' },
      { status: 400 }
    )
  }

  // Call the POST method
  const mockRequest = new Request(request.url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action, appointmentId })
  })

  return POST(mockRequest as NextRequest)
}