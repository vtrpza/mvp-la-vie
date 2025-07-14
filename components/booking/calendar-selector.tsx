'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

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

  return (
    <Card>
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
            <span className="text-sm font-medium min-w-[120px] text-center">
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
        
        <Calendar
          mode="single"
          selected={selectedDateObj}
          onSelect={handleDateSelect}
          disabled={isDateDisabled}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border"
        />
        
        {selectedDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-900">
              <strong>Data selecionada:</strong> {' '}
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}