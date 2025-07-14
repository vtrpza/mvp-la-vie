import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário de teste
  const hashedPassword = await hash('123456', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'teste@laviepet.com' },
    update: {},
    create: {
      email: 'teste@laviepet.com',
      name: 'Usuário Teste',
      phone: '(11) 99999-9999',
      password: hashedPassword,
    },
  })

  console.log('✅ Usuário de teste criado:', user.email)

  // Criar unidade Tambaú
  const location = await prisma.location.upsert({
    where: { id: 'tambau-01' },
    update: {},
    create: {
      id: 'tambau-01',
      name: 'Tambaú - Unidade 01',
      address: 'Rua Principal, 123',
      city: 'Tambaú',
      state: 'SP',
      zipCode: '13710-000',
      isActive: true,
      capacity: 1,
    },
  })

  console.log('✅ Unidade criada:', location.name)

  // Criar pets de teste
  const pet1 = await prisma.pet.upsert({
    where: { id: 'pet-test-1' },
    update: {},
    create: {
      id: 'pet-test-1',
      name: 'Rex',
      breed: 'Labrador',
      size: 'LARGE',
      notes: 'Muito dócil e adora banho',
      userId: user.id,
    },
  })

  const pet2 = await prisma.pet.upsert({
    where: { id: 'pet-test-2' },
    update: {},
    create: {
      id: 'pet-test-2',
      name: 'Mimi',
      breed: 'Poodle',
      size: 'SMALL',
      notes: 'Pode ficar nervosa com barulhos',
      userId: user.id,
    },
  })

  console.log('✅ Pets criados:', pet1.name, pet2.name)

  // Criar agendamento de exemplo (amanhã às 10:00)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const startTime = new Date(tomorrow)
  startTime.setHours(10, 0, 0, 0)
  
  const endTime = new Date(tomorrow)
  endTime.setHours(10, 30, 0, 0)

  const appointment = await prisma.appointment.upsert({
    where: { id: 'appointment-test-1' },
    update: {},
    create: {
      id: 'appointment-test-1',
      userId: user.id,
      petId: pet1.id,
      locationId: location.id,
      date: tomorrow,
      startTime: startTime,
      endTime: endTime,
      totalAmount: 30.00,
      status: 'CONFIRMED',
      qrCode: 'QR123456789',
    },
  })

  console.log('✅ Agendamento criado para:', appointment.date.toLocaleDateString())

  // Criar pagamento de exemplo
  const payment = await prisma.payment.upsert({
    where: { id: 'payment-test-1' },
    update: {},
    create: {
      id: 'payment-test-1',
      appointmentId: appointment.id,
      amount: 30.00,
      paymentMethod: 'PIX',
      status: 'APPROVED',
      mercadoPagoId: 'MP123456789',
    },
  })

  console.log('✅ Pagamento criado:', payment.status)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })