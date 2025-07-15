'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Loader2, AlertTriangle } from 'lucide-react'

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
            <div className="flex items-center justify-center mb-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <Clock className="h-6 w-6 ml-2 text-blue-500" />
            </div>
            <p className="font-medium">Carregando horários disponíveis...</p>
            <p className="text-xs text-gray-400 mt-1">Verificando disponibilidade na unidade selecionada</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (slots.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="text-center text-amber-700">
            <div className="flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <Clock className="h-6 w-6 ml-2 text-amber-500" />
            </div>
            <p className="font-medium">Nenhum horário disponível</p>
            <p className="text-sm mt-1">Tente selecionar outra data ou unidade</p>
            <div className="mt-3 p-2 bg-amber-100 rounded text-xs">
              <p><strong>Dica:</strong> Horários disponíveis das 7:30 às 22:30</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Horários disponíveis
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {slots.length} {slots.length === 1 ? 'horário' : 'horários'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {slots.map((slot) => (
            <Button
              key={slot}
              variant={selectedSlot === slot ? "default" : "outline"}
              size="sm"
              className={`h-10 transition-all duration-200 ${
                selectedSlot === slot 
                  ? 'bg-green-600 hover:bg-green-700 ring-2 ring-green-300' 
                  : 'hover:bg-blue-50 hover:border-blue-300'
              }`}
              onClick={() => onSlotSelect(slot)}
              disabled={disabled}
            >
              {slot}
            </Button>
          ))}
        </div>
        
        {!selectedSlot && slots.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <Clock className="inline h-3 w-3 mr-1" />
            Clique em um horário para selecioná-lo
          </div>
        )}
        
        {selectedSlot && (
          <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-900 font-medium">
                Horário selecionado: {selectedSlot}
              </p>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-green-700">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Duração: 30 minutos
              </div>
              <div>
                Término: {(() => {
                  const [hours, minutes] = selectedSlot.split(':').map(Number);
                  const endTime = new Date();
                  endTime.setHours(hours, minutes + 30, 0, 0);
                  return endTime.toTimeString().slice(0, 5);
                })()}
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2 font-medium">
              ✓ Horário confirmado! Você pode prosseguir.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}