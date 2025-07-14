'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface TimeSlotSelectorProps {
  slots: string[]
  selectedSlot: string
  onSlotSelect: (slot: string) => void
  disabled?: boolean
  isLoading?: boolean
}

export function TimeSlotSelector({ slots, selectedSlot, onSlotSelect, disabled, isLoading }: TimeSlotSelectorProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <Clock className="mx-auto h-8 w-8 mb-2 animate-spin" />
            <p>Carregando horários disponíveis...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (slots.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <Clock className="mx-auto h-8 w-8 mb-2" />
            <p>Nenhum horário disponível para esta data</p>
            <p className="text-sm">Tente selecionar outra data ou unidade</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Horários disponíveis
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {slots.map((slot) => (
            <Button
              key={slot}
              variant={selectedSlot === slot ? "default" : "outline"}
              size="sm"
              className="h-10"
              onClick={() => onSlotSelect(slot)}
              disabled={disabled}
            >
              {slot}
            </Button>
          ))}
        </div>
        
        {selectedSlot && (
          <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-green-900 font-medium">
                Horário selecionado: {selectedSlot}
              </p>
            </div>
            <p className="text-xs text-green-700 mt-1 ml-4">
              Duração: 30 minutos (até {(() => {
                const [hours, minutes] = selectedSlot.split(':').map(Number);
                const endTime = new Date();
                endTime.setHours(hours, minutes + 30, 0, 0);
                return endTime.toTimeString().slice(0, 5);
              })()})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}