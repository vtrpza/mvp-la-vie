import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createPetSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  breed: z.string().min(2, 'Raça deve ter pelo menos 2 caracteres'),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
  notes: z.string().optional(),
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
    const { name, breed, size, notes } = createPetSchema.parse(body)

    const pet = await prisma.pet.create({
      data: {
        name,
        breed,
        size,
        notes,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      { message: 'Pet criado com sucesso', pet },
      { status: 201 }
    )
  } catch (error) {
    console.error('[CREATE_PET_ERROR]:', error)
    
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