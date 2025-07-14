import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

// Configurar cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
})

export const preference = new Preference(client)
export const payment = new Payment(client)

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

export async function createPixPayment(data: PaymentData): Promise<PixPaymentResponse> {
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

export async function getPaymentStatus(paymentId: string) {
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