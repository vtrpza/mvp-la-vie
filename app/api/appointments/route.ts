import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createAppointmentSchema = z.object({
  petId: z.string().min(1, 'Pet é obrigatório'),
  locationId: z.string().min(1, 'Unidade é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
  startTime: z.string().min(1, 'Horário é obrigatório'),
  totalAmount: z.number().min(0, 'Valor deve ser positivo'),
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
    const { petId, locationId, date, startTime, totalAmount } = createAppointmentSchema.parse(body)

    // Verificar se o pet pertence ao usuário
    const pet = await prisma.pet.findUnique({
      where: { id: petId }
    })

    if (!pet || pet.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Pet não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a unidade existe e está ativa
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    })

    if (!location || !location.isActive) {
      return NextResponse.json(
        { message: 'Unidade não disponível' },
        { status: 404 }
      )
    }

    // Criar objetos DateTime para início e fim
    const startDateTime = new Date(date + 'T' + startTime + ':00')
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000)

    // Verificar se o horário está disponível
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        locationId,
        date: new Date(date + 'T00:00:00'),
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            AND: [
              { startTime: { lte: startDateTime } },
              { endTime: { gt: startDateTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endDateTime } },
              { endTime: { gte: endDateTime } }
            ]
          }
        ]
      }
    })

    if (conflictingAppointment) {
      return NextResponse.json(
        { message: 'Horário não disponível' },
        { status: 400 }
      )
    }

    // Criar agendamento
    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        petId,
        locationId,
        date: new Date(date + 'T00:00:00'),
        startTime: startDateTime,
        endTime: endDateTime,
        totalAmount,
        status: 'PENDING',
      },
      include: {
        pet: true,
        location: true,
      }
    })

    return NextResponse.json(
      { message: 'Agendamento criado com sucesso', appointment },
      { status: 201 }
    )
  } catch (error) {
    console.error('[CREATE_APPOINTMENT_ERROR]:', error)
    
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