import QRCode from 'qrcode'

// Mock mode flag - set to true to use mocked payments
const IS_MOCK_MODE = process.env.PAYMENT_MOCK_MODE === 'true' || !process.env.MERCADOPAGO_ACCESS_TOKEN

// Conditional imports for MercadoPago
let preference: any = null
let payment: any = null

async function initializeMercadoPago() {
  if (!IS_MOCK_MODE && !preference && !payment) {
    try {
      const { MercadoPagoConfig, Preference, Payment } = await import('mercadopago')
      
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
        options: {
          timeout: 5000,
          idempotencyKey: 'abc'
        }
      })
      
      preference = new Preference(client)
      payment = new Payment(client)
    } catch (error) {
      console.error('[MERCADOPAGO_INIT_ERROR]:', error)
      throw new Error('Erro ao inicializar Mercado Pago')
    }
  }
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

// Mock QR Code generation with real QR code

function generateMockQrCode(amount: number): string {
  // Generate a realistic PIX BR Code following the standard format
  const payloadFormatIndicator = '00020101' // Payload Format Indicator
  const pointOfInitiation = '0102' // Point of initiation method (static)
  
  // Merchant account information (Tag 26 - PIX)
  const pixKey = Math.random().toString(36).substr(2, 32) // Mock PIX key
  const pixDomain = '0014br.gov.bcb.pix01' + (pixKey.length.toString().padStart(2, '0')) + pixKey
  const merchantAccountLength = pixDomain.length.toString().padStart(2, '0')
  const merchantAccount = '26' + merchantAccountLength + pixDomain
  
  // Transaction amount (if specified)
  const amountStr = amount.toFixed(2)
  const transactionAmount = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`
  
  // Transaction currency (BRL = 986)
  const currency = '5303986'
  
  // Country code (BR)
  const countryCode = '5802BR'
  
  // Merchant name
  const merchantName = `5911La'vie Pet`
  
  // Merchant city
  const merchantCity = '6009SAO PAULO'
  
  // Additional data field template (transaction ID)
  const txId = Math.random().toString(36).substr(2, 16)
  const additionalData = `62${(txId.length + 2).toString().padStart(2, '0')}05${txId.length.toString().padStart(2, '0')}${txId}`
  
  // Combine all fields (without CRC)
  const payload = payloadFormatIndicator + pointOfInitiation + merchantAccount + 
                 transactionAmount + currency + countryCode + merchantName + 
                 merchantCity + additionalData + '6304' // CRC placeholder
  
  // Calculate CRC16 (simplified - using mock)
  const crc = Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')
  
  return payload + crc
}

async function generateMockQrCodeBase64(pixCode: string): Promise<string> {
  try {
    // Generate real QR code image as base64
    const qrCodeDataURL = await QRCode.toDataURL(pixCode, {
      errorCorrectionLevel: 'M' as const,
      margin: 1,
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    // Remove data:image/png;base64, prefix to get just the base64 string
    return qrCodeDataURL.replace(/^data:image\/png;base64,/, '')
  } catch (error) {
    console.error('[MOCK_QR_GENERATION_ERROR]:', error)
    // Fallback to simple base64 image if QR generation fails
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  }
}

export async function createPixPayment(data: PaymentData): Promise<PixPaymentResponse> {
  if (IS_MOCK_MODE) {
    console.log('[MOCK_PIX_PAYMENT] Criando pagamento PIX mockado:', data)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockId = `mock_pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expirationDate = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    const pixCode = generateMockQrCode(data.amount)
    const qrCodeBase64 = await generateMockQrCodeBase64(pixCode)
    
    return {
      id: mockId,
      qrCode: pixCode,
      qrCodeBase64: qrCodeBase64,
      expirationDate: expirationDate.toISOString(),
    }
  }
  
  try {
    await initializeMercadoPago()
    
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
    await initializeMercadoPago()
    
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
    await initializeMercadoPago()
    
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