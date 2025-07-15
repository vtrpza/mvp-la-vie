'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

interface CalendarSelectorProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  disabled?: boolean
}

export function CalendarSelector({ selectedDate, onDateSelect, disabled }: CalendarSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const isoDate = date.toISOString().split('T')[0]
      onDateSelect(isoDate)
    }
  }

  const isDateDisabled = (date: Date) => {
    // If the component is disabled, disable all dates
    if (disabled) {
      return true
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Desabilitar datas passadas
    if (date < today) {
      return true
    }
    
    // Permitir apenas os próximos 30 dias
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    
    return date > maxDate
  }

  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)

  return (
    <Card className={disabled ? 'opacity-50' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            Selecione uma data
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newMonth = new Date(currentMonth)
                newMonth.setMonth(newMonth.getMonth() - 1)
                setCurrentMonth(newMonth)
              }}
              disabled={disabled}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center capitalize">
              {currentMonth.toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newMonth = new Date(currentMonth)
                newMonth.setMonth(newMonth.getMonth() + 1)
                setCurrentMonth(newMonth)
              }}
              disabled={disabled}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!disabled && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium">Dicas para agendamento:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Disponível de hoje até {maxDate.toLocaleDateString('pt-BR')}</li>
                  <li>• Funcionamento: 7:30 às 22:30, todos os dias</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <Calendar
          mode="single"
          selected={selectedDateObj}
          onSelect={handleDateSelect}
          disabled={isDateDisabled}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className={`rounded-md border w-full transition-all duration-300 ${
            selectedDate ? 'ring-2 ring-green-200' : ''
          }`}
        />
        
        {selectedDate && (
          <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-green-900 font-medium">
                <strong>Data selecionada:</strong> {' '}
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <p className="text-xs text-green-700 mt-1 ml-4">
              Agora selecione um horário disponível
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}