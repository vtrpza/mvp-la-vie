'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarSelector } from './calendar-selector'
import { TimeSlotSelector } from './time-slot-selector'
import { Heart, MapPin, Clock, CreditCard, Loader2 } from 'lucide-react'
import { type Pet, type Location } from '@prisma/client'

const bookingSchema = z.object({
  petId: z.string().min(1, 'Selecione um pet'),
  locationId: z.string().min(1, 'Selecione uma unidade'),
  date: z.string().min(1, 'Selecione uma data'),
  startTime: z.string().min(1, 'Selecione um horário'),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingFormProps {
  pets: Pet[]
  locations: Location[]
}

export function BookingForm({ pets, locations }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedLocationId, setSelectedLocationId] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  const selectedPetId = watch('petId')
  const selectedTimeSlot = watch('startTime')

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date)
    setValue('date', date)
    setValue('startTime', '') // Clear selected time when date changes
    setError('') // Clear any previous errors
    
    if (selectedLocationId) {
      await fetchAvailableSlots(date, selectedLocationId)
    }
  }

  const handleLocationChange = async (locationId: string) => {
    setSelectedLocationId(locationId)
    setValue('locationId', locationId)
    setValue('startTime', '') // Clear selected time when location changes
    setError('') // Clear any previous errors
    
    if (selectedDate) {
      await fetchAvailableSlots(selectedDate, locationId)
    }
  }

  const fetchAvailableSlots = async (date: string, locationId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/appointments/available-slots?date=${date}&locationId=${locationId}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.slots || [])
      } else {
        setAvailableSlots([])
        const errorData = await response.json()
        setError(errorData.message || 'Erro ao carregar horários disponíveis')
      }
    } catch (error) {
      console.error('[FETCH_SLOTS_ERROR]:', error)
      setAvailableSlots([])
      setError('Erro ao carregar horários disponíveis')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          totalAmount: 30.00,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao criar agendamento')
      }

      const appointment = await response.json()
      
      // Redirecionar para página de pagamento
      router.push(`/dashboard/pagamento/${appointment.appointment.id}`)
    } catch (error) {
      console.error('[CREATE_APPOINTMENT_ERROR]:', error)
      setError(error instanceof Error ? error.message : 'Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  if (pets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum pet cadastrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Você precisa cadastrar um pet antes de agendar um banho.
          </p>
          <Button onClick={() => router.push('/dashboard/perfil')}>
            Cadastrar Pet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="petId">Selecione o pet</Label>
          <Select onValueChange={(value) => setValue('petId', value)} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha um pet" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>{pet.name} - {pet.breed}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.petId && (
            <p className="text-sm text-red-600">{errors.petId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="locationId">Unidade</Label>
          <Select onValueChange={handleLocationChange} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha uma unidade" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{location.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.locationId && (
            <p className="text-sm text-red-600">{errors.locationId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Data do banho</Label>
          <CalendarSelector
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            disabled={isLoading}
          />
          {errors.date && (
            <p className="text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        {selectedDate && selectedLocationId && (
          <div className="space-y-2">
            <Label>Horário disponível</Label>
            <TimeSlotSelector
              slots={availableSlots}
              selectedSlot={selectedTimeSlot}
              onSlotSelect={(slot) => setValue('startTime', slot)}
              disabled={isLoading}
              isLoading={isLoading && selectedDate && selectedLocationId ? true : false}
            />
            {errors.startTime && (
              <p className="text-sm text-red-600">{errors.startTime.message}</p>
            )}
          </div>
        )}
      </div>

      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <CreditCard className="mr-2 h-5 w-5" />
            Resumo do Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Duração:</span>
            <span>30 minutos</span>
          </div>
          <div className="flex justify-between">
            <span>Valor:</span>
            <span className="font-bold">R$ 30,00</span>
          </div>
          <div className="flex justify-between">
            <span>Formas de pagamento:</span>
            <span>PIX ou Cartão</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/agendamentos')}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando agendamento...
            </>
          ) : (
            'Prosseguir para Pagamento'
          )}
        </Button>
      </div>
    </form>
  )
}