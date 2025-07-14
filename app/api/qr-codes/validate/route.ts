import { NextRequest, NextResponse } from 'next/server'
import { validateQRCode } from '@/lib/qrcode'
import { z } from 'zod'

const validateQRCodeSchema = z.object({
  qrString: z.string().min(1, 'Dados do QR Code são obrigatórios'),
  locationId: z.string().min(1, 'ID da unidade é obrigatório'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrString, locationId } = validateQRCodeSchema.parse(body)

    // Validar QR Code
    const validation = await validateQRCode(qrString, locationId)

    // Log da validação para auditoria
    console.log('[QR_CODE_VALIDATION]:', {
      locationId,
      valid: validation.valid,
      message: validation.message,
      timestamp: new Date().toISOString(),
    })

    if (validation.valid) {
      return NextResponse.json({
        valid: true,
        message: validation.message,
        appointment: validation.appointment,
      })
    } else {
      return NextResponse.json({
        valid: false,
        message: validation.message,
      }, { status: 400 })
    }
  } catch (error) {
    console.error('[VALIDATE_QR_CODE_ERROR]:', error)
    
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

// Endpoint público para validação (para uso nos containers)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const qrString = searchParams.get('qr')
  const locationId = searchParams.get('location')

  if (!qrString || !locationId) {
    return NextResponse.json(
      { message: 'Parâmetros qr e location são obrigatórios' },
      { status: 400 }
    )
  }

  try {
    const validation = await validateQRCode(qrString, locationId)

    return NextResponse.json({
      valid: validation.valid,
      message: validation.message,
      appointment: validation.appointment,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[VALIDATE_QR_CODE_GET_ERROR]:', error)
    
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}