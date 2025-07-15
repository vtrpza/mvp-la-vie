'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CalendarSelector } from './calendar-selector'
import { TimeSlotSelector } from './time-slot-selector'
import { Heart, MapPin, Clock, CreditCard, Loader2, CheckCircle2, ArrowRight, CalendarDays } from 'lucide-react'
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
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const router = useRouter()

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  const selectedPetId = watch('petId')
  const selectedTimeSlot = watch('startTime')

  // Calculate form progress
  const formProgress = (() => {
    let progress = 0
    if (selectedPetId) progress += 25
    if (selectedLocationId) progress += 25
    if (selectedDate) progress += 25
    if (selectedTimeSlot) progress += 25
    return progress
  })()

  // Update current step based on selections
  useEffect(() => {
    const newCompletedSteps: number[] = []
    let newCurrentStep = 1

    if (selectedPetId) {
      newCompletedSteps.push(1)
      newCurrentStep = Math.max(newCurrentStep, 2)
    }
    if (selectedLocationId) {
      newCompletedSteps.push(2)
      newCurrentStep = Math.max(newCurrentStep, 3)
    }
    if (selectedDate) {
      newCompletedSteps.push(3)
      newCurrentStep = Math.max(newCurrentStep, 4)
    }
    if (selectedTimeSlot) {
      newCompletedSteps.push(4)
    }

    setCompletedSteps(newCompletedSteps)
    setCurrentStep(newCurrentStep)
  }, [selectedPetId, selectedLocationId, selectedDate, selectedTimeSlot])

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
    setIsLoadingSlots(true)
    setError('')
    try {
      const response = await fetch(
        `/api/appointments/available-slots?date=${date}&locationId=${locationId}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.slots || [])
        if (data.slots?.length === 0) {
          setError('Nenhum horário disponível para esta data. Tente outra data ou unidade.')
        }
      } else {
        setAvailableSlots([])
        const errorData = await response.json()
        setError(errorData.message || 'Erro ao carregar horários disponíveis')
      }
    } catch (error) {
      console.error('[FETCH_SLOTS_ERROR]:', error)
      setAvailableSlots([])
      setError('Erro ao carregar horários disponíveis. Verifique sua conexão.')
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const onSubmit = async (data: BookingFormData) => {
    if (!showConfirmation) {
      setShowConfirmation(true)
      return
    }

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
      setShowConfirmation(false) // Reset confirmation on error
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

  const steps = [
    { number: 1, title: 'Pet', icon: Heart, completed: completedSteps.includes(1) },
    { number: 2, title: 'Local', icon: MapPin, completed: completedSteps.includes(2) },
    { number: 3, title: 'Data', icon: CalendarDays, completed: completedSteps.includes(3) },
    { number: 4, title: 'Horário', icon: Clock, completed: completedSteps.includes(4) },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress Indicator */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso do agendamento</span>
              <span className="text-sm text-gray-600">{formProgress}% completo</span>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = step.completed
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className={`text-xs font-medium ${
                      isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-300 mx-2 hidden sm:block" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showConfirmation && (
        <Alert className="bg-green-50 border-green-200 animate-in slide-in-from-top-2 duration-300">
          <AlertDescription className="text-green-800">
            <strong>Atenção:</strong> Verifique os detalhes do agendamento abaixo. Ao confirmar, você será direcionado para o pagamento.
          </AlertDescription>
        </Alert>
      )}

      <div className={`grid gap-6 sm:grid-cols-1 md:grid-cols-2 transition-opacity duration-300 ${
        showConfirmation ? 'opacity-60 pointer-events-none' : ''
      }`}>
        <Card className={`transition-all duration-300 ${
          currentStep === 1 ? 'ring-2 ring-blue-200 bg-blue-50/30' : completedSteps.includes(1) ? 'bg-green-50/30' : ''
        }`}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label htmlFor="petId" className="flex items-center gap-2">
                <Heart className={`h-4 w-4 ${
                  completedSteps.includes(1) ? 'text-green-600' : currentStep === 1 ? 'text-blue-600' : 'text-gray-400'
                }`} />
                Passo 1: Selecione o pet
                {completedSteps.includes(1) && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              <Select onValueChange={(value) => setValue('petId', value)} disabled={isLoading || showConfirmation}>
                <SelectTrigger className={completedSteps.includes(1) ? 'border-green-300' : ''}>
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
                <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{errors.petId.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={`transition-all duration-300 ${
          currentStep === 2 ? 'ring-2 ring-blue-200 bg-blue-50/30' : completedSteps.includes(2) ? 'bg-green-50/30' : !selectedPetId ? 'opacity-50' : ''
        }`}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label htmlFor="locationId" className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${
                  completedSteps.includes(2) ? 'text-green-600' : currentStep === 2 ? 'text-blue-600' : 'text-gray-400'
                }`} />
                Passo 2: Escolha a unidade
                {completedSteps.includes(2) && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              <Select 
                onValueChange={handleLocationChange} 
                disabled={isLoading || showConfirmation || !selectedPetId}
              >
                <SelectTrigger className={completedSteps.includes(2) ? 'border-green-300' : ''}>
                  <SelectValue placeholder={!selectedPetId ? "Primeiro selecione um pet" : "Escolha uma unidade"} />
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
                <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{errors.locationId.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={`space-y-4 transition-opacity duration-300 ${
        showConfirmation ? 'opacity-60 pointer-events-none' : ''
      }`}>
        <div className="space-y-2">
          <Label>Data do banho</Label>
          <CalendarSelector
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            disabled={isLoading || showConfirmation}
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
              disabled={isLoading || showConfirmation}
              isLoading={isLoadingSlots}
            />
            {errors.startTime && (
              <p className="text-sm text-red-600">{errors.startTime.message}</p>
            )}
          </div>
        )}
      </div>

      <Card className={`transition-all duration-300 ${
        selectedPetId && selectedLocationId && selectedDate && selectedTimeSlot 
          ? 'bg-green-50 ring-2 ring-green-200' 
          : 'bg-blue-50'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${
            selectedPetId && selectedLocationId && selectedDate && selectedTimeSlot 
              ? 'text-green-900' 
              : 'text-blue-900'
          }`}>
            <CreditCard className="mr-2 h-5 w-5" />
            Resumo do Agendamento
            {selectedPetId && selectedLocationId && selectedDate && selectedTimeSlot && (
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Pronto para confirmar
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Selected Details */}
          {selectedPetId && (
            <div className="flex justify-between">
              <span>Pet:</span>
              <span className="font-medium">{pets.find(p => p.id === selectedPetId)?.name}</span>
            </div>
          )}
          
          {selectedLocationId && (
            <div className="flex justify-between">
              <span>Unidade:</span>
              <span className="font-medium">{locations.find(l => l.id === selectedLocationId)?.name}</span>
            </div>
          )}
          
          {selectedDate && (
            <div className="flex justify-between">
              <span>Data:</span>
              <span className="font-medium">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
          )}
          
          {selectedTimeSlot && (
            <div className="flex justify-between">
              <span>Horário:</span>
              <span className="font-medium">{selectedTimeSlot}</span>
            </div>
          )}
          
          <div className="border-t border-blue-200 pt-2">
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
          disabled={isLoading || !selectedPetId || !selectedLocationId || !selectedDate || !selectedTimeSlot}
          className={`w-full sm:w-auto transition-all duration-300 ${
            showConfirmation 
              ? 'bg-green-600 hover:bg-green-700 ring-2 ring-green-300' 
              : ''
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando agendamento...
            </>
          ) : showConfirmation ? (
            'Confirmar e Prosseguir para Pagamento'
          ) : (
            'Revisar Agendamento'
          )}
        </Button>
        
        {showConfirmation && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowConfirmation(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Editar Detalhes
          </Button>
        )}
      </div>
    </form>
  )
}