import QRCode from 'qrcode'
import { prisma } from './db'

export interface QRCodeData {
  appointmentId: string
  userId: string
  petId: string
  locationId: string
  date: string
  startTime: string
  endTime: string
  timestamp: number
}

export async function generateQRCode(appointmentId: string): Promise<string> {
  try {
    // Buscar dados do agendamento
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: true,
        pet: true,
        location: true,
      }
    })

    if (!appointment) {
      throw new Error('Agendamento não encontrado')
    }

    // Dados para o QR Code
    const qrData: QRCodeData = {
      appointmentId: appointment.id,
      userId: appointment.userId,
      petId: appointment.petId,
      locationId: appointment.locationId,
      date: appointment.date.toISOString().split('T')[0],
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      timestamp: Date.now(),
    }

    // Converter para string JSON
    const qrString = JSON.stringify(qrData)

    // Gerar QR Code como base64
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256,
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('[QR_CODE_GENERATION_ERROR]:', error)
    throw new Error('Erro ao gerar QR Code')
  }
}

export async function validateQRCode(qrString: string, locationId: string): Promise<{
  valid: boolean
  message: string
  appointment?: any
}> {
  try {
    // Parse dos dados do QR Code
    const qrData: QRCodeData = JSON.parse(qrString)

    // Verificar se o QR Code é para esta unidade
    if (qrData.locationId !== locationId) {
      return {
        valid: false,
        message: 'QR Code não é válido para esta unidade'
      }
    }

    // Buscar agendamento
    const appointment = await prisma.appointment.findUnique({
      where: { id: qrData.appointmentId },
      include: {
        user: true,
        pet: true,
        location: true,
        payment: true,
      }
    })

    if (!appointment) {
      return {
        valid: false,
        message: 'Agendamento não encontrado'
      }
    }

    // Verificar se o agendamento foi pago e confirmado
    if (appointment.status !== 'CONFIRMED' || appointment.payment?.status !== 'APPROVED') {
      return {
        valid: false,
        message: 'Agendamento não confirmado ou não pago'
      }
    }

    // Verificar se é a data correta
    const appointmentDate = appointment.date.toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    if (appointmentDate !== today) {
      return {
        valid: false,
        message: 'QR Code não é válido para hoje'
      }
    }

    // Verificar se está dentro do horário válido (30 min antes até fim da sessão)
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM
    
    const [startHour, startMin] = appointment.startTime.toTimeString().slice(0, 5).split(':').map(Number)
    const [endHour, endMin] = appointment.endTime.toTimeString().slice(0, 5).split(':').map(Number)
    const [currentHour, currentMin] = currentTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    const currentMinutes = currentHour * 60 + currentMin
    
    // Permitir acesso 30 minutos antes
    const accessStartMinutes = startMinutes - 30
    
    if (currentMinutes < accessStartMinutes || currentMinutes > endMinutes) {
      return {
        valid: false,
        message: `Acesso permitido apenas entre ${Math.floor(accessStartMinutes/60).toString().padStart(2, '0')}:${(accessStartMinutes%60).toString().padStart(2, '0')} e ${appointment.endTime}`
      }
    }

    // Verificar se o QR Code já foi usado (opcional - poderia implementar um log de uso)
    
    return {
      valid: true,
      message: 'QR Code válido! Acesso liberado.',
      appointment: {
        id: appointment.id,
        petName: appointment.pet.name,
        petBreed: appointment.pet.breed,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        userName: appointment.user.name,
      }
    }
  } catch (error) {
    console.error('[QR_CODE_VALIDATION_ERROR]:', error)
    return {
      valid: false,
      message: 'QR Code inválido ou corrompido'
    }
  }
}

export async function generateQRCodeForAppointment(appointmentId: string): Promise<{
  qrCode: string
  qrCodeImage: string
}> {
  try {
    // Gerar código único para o QR
    const qrCode = `LAVIEPET_${appointmentId}_${Date.now()}`
    
    // Gerar imagem do QR Code
    const qrCodeImage = await generateQRCode(appointmentId)
    
    // Atualizar agendamento com o QR Code
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { qrCode }
    })
    
    return {
      qrCode,
      qrCodeImage
    }
  } catch (error) {
    console.error('[QR_CODE_FOR_APPOINTMENT_ERROR]:', error)
    throw new Error('Erro ao gerar QR Code para agendamento')
  }
}