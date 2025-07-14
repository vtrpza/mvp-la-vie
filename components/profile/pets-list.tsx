'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AddPetDialog } from './add-pet-dialog'
import { EditPetDialog } from './edit-pet-dialog'
import { Heart, Plus, Edit, Trash2 } from 'lucide-react'
import { type Pet } from '@prisma/client'

interface PetsListProps {
  pets: Pet[]
}

export function PetsList({ pets }: PetsListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'SMALL':
        return 'Pequeno'
      case 'MEDIUM':
        return 'Médio'
      case 'LARGE':
        return 'Grande'
      default:
        return size
    }
  }

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'SMALL':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LARGE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pet?')) {
      return
    }

    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir pet')
      }

      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error('[DELETE_PET_ERROR]:', error)
      alert('Erro ao excluir pet')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {pets.length} pet{pets.length !== 1 ? 's' : ''} cadastrado{pets.length !== 1 ? 's' : ''}
        </p>
        <Button 
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Nenhum pet cadastrado
          </p>
          <p className="text-sm text-gray-500">
            Adicione um pet para começar a agendar banhos
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pets.map((pet) => (
            <Card key={pet.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{pet.name}</p>
                      <p className="text-sm text-gray-600">{pet.breed}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSizeColor(pet.size)}>
                      {getSizeLabel(pet.size)}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingPet(pet)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePet(pet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {pet.notes && (
                  <p className="text-sm text-gray-600 mt-2">{pet.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddPetDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {editingPet && (
        <EditPetDialog
          pet={editingPet}
          open={!!editingPet}
          onOpenChange={(open) => !open && setEditingPet(null)}
        />
      )}
    </div>
  )
}