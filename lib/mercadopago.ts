// Mock mode flag - set to true to use mocked payments
const IS_MOCK_MODE = process.env.PAYMENT_MOCK_MODE === 'true' || !process.env.MERCADOPAGO_ACCESS_TOKEN

// Only import and configure MercadoPago if not in mock mode
let preference: any = null
let payment: any = null

if (!IS_MOCK_MODE) {
  const { MercadoPagoConfig, Preference, Payment } = require('mercadopago')
  
  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    options: {
      timeout: 5000,
      idempotencyKey: 'abc'
    }
  })
  
  preference = new Preference(client)
  payment = new Payment(client)
}

export interface PaymentData {
  appointmentId: string
  amount: number
  userEmail: string
  description: string
}

export interface PixPaymentResponse {
  id: string
  qrCode: string
  qrCodeBase64: string
  expirationDate: string
}

export interface CardPaymentResponse {
  id: string
  initPoint: string
  sandboxInitPoint: string
}

// Mock QR Code generation
function generateMockQrCode(): string {
  return `00020101021243650016COM.MERCADOLIVRE02013063204${Math.random().toString().substring(2, 10)}520400005303986540530.005802BR5909Test User6009SAO PAULO62070503***63041D3D`
}

function generateMockQrCodeBase64(): string {
  // A simple base64 encoded 1x1 pixel PNG - in real app, you'd generate actual QR code image
  return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
}

export async function createPixPayment(data: PaymentData): Promise<PixPaymentResponse> {
  if (IS_MOCK_MODE) {
    console.log('[MOCK_PIX_PAYMENT] Criando pagamento PIX mockado:', data)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockId = `mock_pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expirationDate = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    
    return {
      id: mockId,
      qrCode: generateMockQrCode(),
      qrCodeBase64: generateMockQrCodeBase64(),
      expirationDate: expirationDate.toISOString(),
    }
  }
  
  try {
    const paymentData = {
      transaction_amount: data.amount,
      description: data.description,
      payment_method_id: 'pix',
      payer: {
        email: data.userEmail,
      },
      metadata: {
        appointment_id: data.appointmentId,
      },
    }

    const result = await payment.create({
      body: paymentData
    })

    if (!result.point_of_interaction?.transaction_data) {
      throw new Error('Erro ao gerar PIX')
    }

    return {
      id: result.id!.toString(),
      qrCode: result.point_of_interaction.transaction_data.qr_code!,
      qrCodeBase64: result.point_of_interaction.transaction_data.qr_code_base64!,
      expirationDate: result.date_of_expiration!,
    }
  } catch (error) {
    console.error('[MERCADOPAGO_PIX_ERROR]:', error)
    throw new Error('Erro ao processar pagamento PIX')
  }
}

export async function createCardPayment(data: PaymentData): Promise<CardPaymentResponse> {
  if (IS_MOCK_MODE) {
    console.log('[MOCK_CARD_PAYMENT] Criando pagamento com cartão mockado:', data)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockId = `mock_card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    return {
      id: mockId,
      initPoint: `${baseUrl}/api/payments/mock-checkout?payment_id=${mockId}&appointment_id=${data.appointmentId}`,
      sandboxInitPoint: `${baseUrl}/api/payments/mock-checkout?payment_id=${mockId}&appointment_id=${data.appointmentId}&sandbox=true`,
    }
  }
  
  try {
    const preferenceData = {
      items: [
        {
          id: 'lavie-pet-banho',
          title: data.description,
          unit_price: data.amount,
          quantity: 1,
        }
      ],
      payer: {
        email: data.userEmail,
      },
      payment_methods: {
        excluded_payment_types: [
          { id: 'ticket' },
          { id: 'bank_transfer' },
          { id: 'atm' }
        ],
        installments: 12,
      },
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/dashboard/pagamento/sucesso`,
        failure: `${process.env.NEXTAUTH_URL}/dashboard/pagamento/erro`,
        pending: `${process.env.NEXTAUTH_URL}/dashboard/pagamento/pendente`,
      },
      auto_return: 'approved',
      external_reference: data.appointmentId,
      metadata: {
        appointment_id: data.appointmentId,
      },
    }

    const result = await preference.create({
      body: preferenceData
    })

    return {
      id: result.id!,
      initPoint: result.init_point!,
      sandboxInitPoint: result.sandbox_init_point!,
    }
  } catch (error) {
    console.error('[MERCADOPAGO_CARD_ERROR]:', error)
    throw new Error('Erro ao processar pagamento com cartão')
  }
}

// Mock payment status simulation - simulates approval after 5-10 seconds
const mockPaymentStatuses: { [key: string]: { status: string; createdAt: number } } = {}

export async function getPaymentStatus(paymentId: string) {
  if (IS_MOCK_MODE) {
    console.log('[MOCK_PAYMENT_STATUS] Verificando status do pagamento mockado:', paymentId)
    
    // Initialize mock payment if not exists
    if (!mockPaymentStatuses[paymentId]) {
      mockPaymentStatuses[paymentId] = {
        status: 'pending',
        createdAt: Date.now()
      }
    }
    
    const mockPayment = mockPaymentStatuses[paymentId]
    const elapsedTime = Date.now() - mockPayment.createdAt
    
    // Auto-approve after 5-10 seconds (simulate real payment time)
    if (elapsedTime > 5000 && mockPayment.status === 'pending') {
      // 90% success rate simulation
      mockPayment.status = Math.random() > 0.1 ? 'approved' : 'rejected'
    }
    
    return {
      id: paymentId,
      status: mockPayment.status,
      statusDetail: mockPayment.status === 'approved' ? 'accredited' : 
                   mockPayment.status === 'rejected' ? 'cc_rejected_other_reason' : 'pending',
      transactionAmount: 30.00,
      metadata: {
        appointment_id: paymentId.split('_')[2] || 'unknown'
      },
    }
  }
  
  try {
    const result = await payment.get({ id: paymentId })
    return {
      id: result.id!.toString(),
      status: result.status!,
      statusDetail: result.status_detail!,
      transactionAmount: result.transaction_amount!,
      metadata: result.metadata,
    }
  } catch (error) {
    console.error('[MERCADOPAGO_STATUS_ERROR]:', error)
    throw new Error('Erro ao verificar status do pagamento')
  }
}

// Export mock mode flag for other modules
export { IS_MOCK_MODE }