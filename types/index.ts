import { type User, type Pet, type Appointment, type Payment, type Location } from '@prisma/client'

export type { User, Pet, Appointment, Payment, Location }

export interface AppointmentWithRelations extends Appointment {
  user: User
  pet: Pet
  location: Location
  payment?: Payment | null
}

export interface UserWithPets extends User {
  pets: Pet[]
}

export interface BookingData {
  date: string
  startTime: string
  endTime: string
  petId: string
  locationId: string
  totalAmount: number
}

export interface PaymentData {
  appointmentId: string
  amount: number
  userEmail: string
  description: string
}

export interface NotificationData {
  recipient: string
  message: string
  type: 'WHATSAPP' | 'EMAIL' | 'SMS'
  appointmentId?: string
}