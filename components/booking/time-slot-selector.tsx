'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface TimeSlotSelectorProps {
  slots: string[]
  selectedSlot: string
  onSlotSelect: (slot: string) => void
  disabled?: boolean
}

export function TimeSlotSelector({ slots, selectedSlot, onSlotSelect, disabled }: TimeSlotSelectorProps) {
  if (slots.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <Clock className="mx-auto h-8 w-8 mb-2" />
            <p>Nenhum horário disponível para esta data</p>
            <p className="text-sm">Tente selecionar outra data</p>
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
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
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
          <div className="mt-4 p-3 bg-green-50 rounded-md">
            <p className="text-sm text-green-900">
              <strong>Horário selecionado:</strong> {selectedSlot}
            </p>
            <p className="text-xs text-green-700 mt-1">
              Duração: 30 minutos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}