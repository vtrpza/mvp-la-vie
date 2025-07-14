import twilio from 'twilio'
import { Resend } from 'resend'
import { prisma } from './db'

// Configurar Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Adicione uma variável para armazenar o cliente Twilio
let twilioClient: twilio.Twilio | null = null

// Função para inicializar o cliente Twilio
const initializeTwilioClient = () => {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    if (accountSid && authToken) {
      twilioClient = twilio(accountSid, authToken)
    } else {
      console.error('[TWILIO_ERROR]: Account SID or Auth Token not configured.')
    }
  }
  return twilioClient
}

export interface NotificationData {
  appointmentId: string
  type: 'CONFIRMATION' | 'REMINDER' | 'CANCELLATION'
  recipient: {
    name: string
    email: string
    phone?: string
  }
  appointment: {
    petName: string
    date: string
    startTime: string
    endTime: string
    locationName: string
    locationAddress: string
    qrCode?: string
  }
}

export async function sendWhatsAppNotification(data: NotificationData): Promise<boolean> {
  try {
    const twilioClient = initializeTwilioClient()

    if (!twilioClient || !data.recipient.phone || !process.env.TWILIO_WHATSAPP_NUMBER) {
      console.log('[WHATSAPP]: Twilio client, phone, or WhatsApp number not configured')
      return false
    }

    const message = buildWhatsAppMessage(data)
    
    const result = await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${data.recipient.phone}`,
      body: message
    })

    console.log('[WHATSAPP_SENT]:', result.sid)

    // Log da notificação
    await prisma.notificationLog.create({
      data: {
        type: 'WHATSAPP',
        recipient: data.recipient.phone,
        message,
        status: 'SENT',
      }
    })

    return true
  } catch (error) {
    console.error('[WHATSAPP_ERROR]:', error)
    
    // Log do erro
    await prisma.notificationLog.create({
      data: {
        type: 'WHATSAPP',
        recipient: data.recipient.phone || 'unknown',
        message: buildWhatsAppMessage(data),
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    })

    return false
  }
}

export async function sendEmailNotification(data: NotificationData): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('[EMAIL]: Resend API key not configured')
      return false
    }

    const { subject, html } = buildEmailContent(data)
    
    const result = await resend.emails.send({
      from: 'La\'vie Pet <noreply@laviepet.com>',
      to: [data.recipient.email],
      subject,
      html,
    })

    console.log('[EMAIL_SENT]:', result.data?.id)

    // Log da notificação
    await prisma.notificationLog.create({
      data: {
        type: 'EMAIL',
        recipient: data.recipient.email,
        message: subject,
        status: 'SENT',
      }
    })

    return true
  } catch (error) {
    console.error('[EMAIL_ERROR]:', error)
    
    // Log do erro
    await prisma.notificationLog.create({
      data: {
        type: 'EMAIL',
        recipient: data.recipient.email,
        message: buildEmailContent(data).subject,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    })

    return false
  }
}

export async function sendConfirmationNotifications(appointmentId: string): Promise<void> {
  try {
    // Buscar dados do agendamento
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: true,
        pet: true,
        location: true,
        payment: true,
      }
    })

    if (!appointment || !appointment.user) {
      console.error('[NOTIFICATION_ERROR]: Appointment or user not found')
      return
    }

    const notificationData: NotificationData = {
      appointmentId,
      type: 'CONFIRMATION',
      recipient: {
        name: appointment.user.name,
        email: appointment.user.email,
        phone: appointment.user.phone || undefined,
      },
      appointment: {
        petName: appointment.pet.name,
        date: appointment.date.toLocaleDateString('pt-BR'),
        startTime: appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        endTime: appointment.endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        locationName: appointment.location.name,
        locationAddress: appointment.location.address,
        qrCode: appointment.qrCode || undefined,
      }
    }

    // Enviar notificações em paralelo
    const [whatsappSent, emailSent] = await Promise.all([
      sendWhatsAppNotification(notificationData),
      sendEmailNotification(notificationData)
    ])

    console.log('[NOTIFICATIONS_SENT]:', { whatsappSent, emailSent })
  } catch (error) {
    console.error('[CONFIRMATION_NOTIFICATIONS_ERROR]:', error)
  }
}

function buildWhatsAppMessage(data: NotificationData): string {
  const { appointment, recipient } = data

  switch (data.type) {
    case 'CONFIRMATION':
      return `🐾 *La'vie Pet - Agendamento Confirmado!*

Olá ${recipient.name}! 

Seu agendamento para ${appointment.petName} foi confirmado com sucesso! 🎉

📅 *Detalhes:*
• Data: ${appointment.date}
• Horário: ${appointment.startTime} - ${appointment.endTime}
• Local: ${appointment.locationName}
• Endereço: ${appointment.locationAddress}

🎫 *QR Code de Acesso:*
${appointment.qrCode ? `Seu código: ${appointment.qrCode}` : 'Será enviado em breve'}

⏰ *Lembre-se:*
• Chegue 10 min antes do horário
• O acesso é liberado 30 min antes
• Duração: 30 minutos

Dúvidas? Entre em contato conosco!
Obrigado por escolher a La'vie Pet! 🚿🐕`

    case 'REMINDER':
      return `🔔 *Lembrete - La'vie Pet*

Olá ${recipient.name}!

Seu agendamento para ${appointment.petName} é hoje!

📅 ${appointment.date} às ${appointment.startTime}
📍 ${appointment.locationName}

Não esqueça de levar:
• Toalha para secar seu pet
• Shampoo (se preferir o seu)

Nos vemos em breve! 🐾`

    case 'CANCELLATION':
      return `❌ *La'vie Pet - Agendamento Cancelado*

Olá ${recipient.name},

Seu agendamento para ${appointment.petName} foi cancelado:

📅 ${appointment.date} às ${appointment.startTime}
📍 ${appointment.locationName}

Se você cancelou, tudo bem! Se não foi você, entre em contato urgente.

Para reagendar, acesse nosso app.
Obrigado! 🐾`

    default:
      return `La'vie Pet - Atualização sobre seu agendamento para ${appointment.petName}.`
  }
}

function buildEmailContent(data: NotificationData): { subject: string; html: string } {
  const { appointment, recipient } = data

  switch (data.type) {
    case 'CONFIRMATION':
      return {
        subject: `🐾 Agendamento Confirmado - ${appointment.petName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Agendamento Confirmado</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6; }
        .qr-section { background: #e3f2fd; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
        .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐾 La'vie Pet</h1>
            <h2>Agendamento Confirmado!</h2>
        </div>
        
        <div class="content">
            <p>Olá <strong>${recipient.name}</strong>!</p>
            
            <p>Ficamos felizes em confirmar o agendamento do banho para <strong>${appointment.petName}</strong>! 🎉</p>
            
            <div class="card">
                <h3>📅 Detalhes do Agendamento</h3>
                <ul>
                    <li><strong>Pet:</strong> ${appointment.petName}</li>
                    <li><strong>Data:</strong> ${appointment.date}</li>
                    <li><strong>Horário:</strong> ${appointment.startTime} - ${appointment.endTime}</li>
                    <li><strong>Local:</strong> ${appointment.locationName}</li>
                    <li><strong>Endereço:</strong> ${appointment.locationAddress}</li>
                </ul>
            </div>

            ${appointment.qrCode ? `
            <div class="qr-section">
                <h3>🎫 QR Code de Acesso</h3>
                <p>Use este código para acessar o container:</p>
                <p style="font-family: monospace; font-size: 18px; font-weight: bold;">${appointment.qrCode}</p>
                <p><small>O acesso é liberado 30 minutos antes do horário agendado.</small></p>
            </div>
            ` : ''}

            <div class="card">
                <h3>⏰ Informações Importantes</h3>
                <ul>
                    <li>Chegue 10 minutos antes do horário</li>
                    <li>O acesso é liberado 30 minutos antes</li>
                    <li>Duração da sessão: 30 minutos</li>
                    <li>Leve toalha para secar seu pet</li>
                </ul>
            </div>

            <p>Dúvidas? Entre em contato conosco pelo WhatsApp ou email.</p>
            
            <div class="footer">
                <p>Obrigado por escolher a La'vie Pet! 🚿🐕</p>
                <p><small>Este é um email automático, não responda.</small></p>
            </div>
        </div>
    </div>
</body>
</html>`
      }

    case 'REMINDER':
      return {
        subject: `🔔 Lembrete: Banho do ${appointment.petName} hoje!`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Lembrete de Agendamento</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Lembrete</h1>
            <h2>Banho do ${appointment.petName} hoje!</h2>
        </div>
        
        <div class="content">
            <p>Olá <strong>${recipient.name}</strong>!</p>
            
            <p>Só para lembrar que o banho do <strong>${appointment.petName}</strong> é hoje!</p>
            
            <div class="card">
                <h3>📅 Detalhes</h3>
                <ul>
                    <li><strong>Hoje:</strong> ${appointment.date}</li>
                    <li><strong>Horário:</strong> ${appointment.startTime}</li>
                    <li><strong>Local:</strong> ${appointment.locationName}</li>
                </ul>
            </div>

            <p>Não esqueça de levar toalha para secar seu pet!</p>
            <p>Nos vemos em breve! 🐾</p>
        </div>
    </div>
</body>
</html>`
      }

    case 'CANCELLATION':
      return {
        subject: `❌ Agendamento Cancelado - ${appointment.petName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Agendamento Cancelado</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❌ Cancelamento</h1>
            <h2>Agendamento Cancelado</h2>
        </div>
        
        <div class="content">
            <p>Olá <strong>${recipient.name}</strong>,</p>
            
            <p>Seu agendamento para <strong>${appointment.petName}</strong> foi cancelado.</p>
            
            <div class="card">
                <h3>📅 Agendamento Cancelado</h3>
                <ul>
                    <li><strong>Data:</strong> ${appointment.date}</li>
                    <li><strong>Horário:</strong> ${appointment.startTime}</li>
                    <li><strong>Local:</strong> ${appointment.locationName}</li>
                </ul>
            </div>

            <p>Se você não solicitou este cancelamento, entre em contato conosco imediatamente.</p>
            <p>Para reagendar, acesse nosso aplicativo.</p>
            
            <p>Obrigado! 🐾</p>
        </div>
    </div>
</body>
</html>`
      }

    default:
      return {
        subject: `La'vie Pet - Atualização do Agendamento`,
        html: `<p>Atualização sobre seu agendamento para ${appointment.petName}.</p>`
      }
  }
}