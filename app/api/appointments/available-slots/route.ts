import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const locationId = searchParams.get('locationId')

    if (!date || !locationId) {
      return NextResponse.json(
        { message: 'Data e unidade são obrigatórias' },
        { status: 400 }
      )
    }

    // Verificar se a data é válida
    const selectedDate = new Date(date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      return NextResponse.json(
        { message: 'Data deve ser hoje ou futura' },
        { status: 400 }
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

    // Buscar agendamentos existentes para a data
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        locationId,
        date: selectedDate,
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      select: {
        startTime: true,
        endTime: true,
      }
    })

    // Gerar todos os slots possíveis (8:00 às 17:30, intervalos de 30 minutos)
    const allSlots: string[] = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        allSlots.push(timeString)
      }
    }

    // Filtrar slots ocupados
    const availableSlots = allSlots.filter(slot => {
      const [hours, minutes] = slot.split(':').map(Number)
      
      // Criar objetos DateTime para o slot
      const slotStartDateTime = new Date(selectedDate)
      slotStartDateTime.setHours(hours, minutes, 0, 0)
      
      const slotEndDateTime = new Date(slotStartDateTime.getTime() + 30 * 60 * 1000)

      // Verificar se há conflito com algum agendamento existente
      const hasConflict = existingAppointments.some(appointment => {
        return (
          (slotStartDateTime >= appointment.startTime && slotStartDateTime < appointment.endTime) ||
          (slotEndDateTime > appointment.startTime && slotEndDateTime <= appointment.endTime) ||
          (slotStartDateTime <= appointment.startTime && slotEndDateTime >= appointment.endTime)
        )
      })

      return !hasConflict
    })

    // Se for hoje, filtrar horários que já passaram
    const now = new Date()
    const finalSlots = selectedDate.toDateString() === now.toDateString()
      ? availableSlots.filter(slot => {
          const [hours, minutes] = slot.split(':').map(Number)
          const slotTime = new Date()
          slotTime.setHours(hours, minutes, 0, 0)
          return slotTime > now
        })
      : availableSlots

    return NextResponse.json(
      { slots: finalSlots },
      { status: 200 }
    )
  } catch (error) {
    console.error('[GET_AVAILABLE_SLOTS_ERROR]:', error)
    
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}