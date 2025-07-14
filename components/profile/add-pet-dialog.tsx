'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

const addPetSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  breed: z.string().min(2, 'Raça deve ter pelo menos 2 caracteres'),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE'], {
    message: 'Selecione um tamanho'
  }),
  notes: z.string().optional(),
})

type AddPetFormData = z.infer<typeof addPetSchema>

interface AddPetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPetDialog({ open, onOpenChange }: AddPetDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddPetFormData>({
    resolver: zodResolver(addPetSchema),
  })

  const selectedSize = watch('size')

  const onSubmit = async (data: AddPetFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao adicionar pet')
      }

      reset()
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('[ADD_PET_ERROR]:', error)
      setError(error instanceof Error ? error.message : 'Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Pet</DialogTitle>
          <DialogDescription>
            Cadastre um novo pet para agendar banhos
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome do pet</Label>
            <Input
              id="name"
              placeholder="Ex: Rex, Mimi, Bolinha"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Raça</Label>
            <Input
              id="breed"
              placeholder="Ex: Labrador, Poodle, SRD"
              {...register('breed')}
              disabled={isLoading}
            />
            {errors.breed && (
              <p className="text-sm text-red-600">{errors.breed.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Tamanho</Label>
            <Select onValueChange={(value) => setValue('size', value as any)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tamanho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMALL">Pequeno (até 10kg)</SelectItem>
                <SelectItem value="MEDIUM">Médio (10-25kg)</SelectItem>
                <SelectItem value="LARGE">Grande (acima de 25kg)</SelectItem>
              </SelectContent>
            </Select>
            {errors.size && (
              <p className="text-sm text-red-600">{errors.size.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais sobre o pet"
              {...register('notes')}
              disabled={isLoading}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Adicionar Pet'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}