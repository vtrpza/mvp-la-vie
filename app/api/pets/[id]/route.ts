import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updatePetSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  breed: z.string().min(2, 'Raça deve ter pelo menos 2 caracteres'),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, breed, size, notes } = updatePetSchema.parse(body)

    // Verificar se o pet pertence ao usuário
    const existingPet = await prisma.pet.findUnique({
      where: { id }
    })

    if (!existingPet || existingPet.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Pet não encontrado' },
        { status: 404 }
      )
    }

    const pet = await prisma.pet.update({
      where: { id },
      data: {
        name,
        breed,
        size,
        notes,
      },
    })

    return NextResponse.json(
      { message: 'Pet atualizado com sucesso', pet },
      { status: 200 }
    )
  } catch (error) {
    console.error('[UPDATE_PET_ERROR]:', error)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o pet pertence ao usuário
    const existingPet = await prisma.pet.findUnique({
      where: { id }
    })

    if (!existingPet || existingPet.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Pet não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o pet tem agendamentos
    const appointmentsCount = await prisma.appointment.count({
      where: { petId: id }
    })

    if (appointmentsCount > 0) {
      return NextResponse.json(
        { message: 'Não é possível excluir um pet com agendamentos' },
        { status: 400 }
      )
    }

    await prisma.pet.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Pet excluído com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[DELETE_PET_ERROR]:', error)
    
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}