"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

interface ServiceConfig {
  id: string
  name: string
  basePrice: number
  description: string
  complexity: {
    simples: number
    medio: number
    complexo: number
  }
}

interface ServiceCatalogManagerProps {
  services: Record<string, ServiceConfig>
  onServicesUpdate: (services: Record<string, ServiceConfig>) => void
}

export function ServiceCatalogManager({ services, onServicesUpdate }: ServiceCatalogManagerProps) {
  const [editingService, setEditingService] = useState<ServiceConfig | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ServiceConfig>({
    id: "",
    name: "",
    basePrice: 0,
    description: "",
    complexity: { simples: 1, medio: 1.5, complexo: 2 },
  })

  const handleEdit = (serviceKey: string) => {
    const service = { ...services[serviceKey], id: serviceKey }
    setEditingService(service)
    setFormData(service)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingService(null)
    setFormData({
      id: "",
      name: "",
      basePrice: 0,
      description: "",
      complexity: { simples: 1, medio: 1.5, complexo: 2 },
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const serviceId = editingService?.id || formData.name.toLowerCase().replace(/\s+/g, "-")
    const updatedServices = { ...services }

    if (editingService && editingService.id !== serviceId) {
      // Remove old key if ID changed
      delete updatedServices[editingService.id]
    }

    updatedServices[serviceId] = {
      id: serviceId,
      name: formData.name,
      basePrice: formData.basePrice,
      description: formData.description,
      complexity: formData.complexity,
    }

    onServicesUpdate(updatedServices)
    setIsDialogOpen(false)
    setEditingService(null)
  }

  const handleDelete = (serviceKey: string) => {
    const updatedServices = { ...services }
    delete updatedServices[serviceKey]
    onServicesUpdate(updatedServices)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Catálogo de Serviços</h2>
          <p className="text-muted-foreground">Gerencie os serviços e preços base da sua empresa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="font-heading font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingService ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
              <DialogDescription>Configure os detalhes e preços do serviço</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Nome do Serviço</Label>
                  <Input
                    id="service-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Desenvolvimento de APIs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base-price">Preço Base (R$)</Label>
                  <Input
                    id="base-price"
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    placeholder="2500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o que está incluído neste serviço..."
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>Multiplicadores de Complexidade</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="simples" className="text-sm">
                      Simples
                    </Label>
                    <Input
                      id="simples"
                      type="number"
                      step="0.1"
                      value={formData.complexity.simples}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          complexity: { ...formData.complexity, simples: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medio" className="text-sm">
                      Médio
                    </Label>
                    <Input
                      id="medio"
                      type="number"
                      step="0.1"
                      value={formData.complexity.medio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          complexity: { ...formData.complexity, medio: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complexo" className="text-sm">
                      Complexo
                    </Label>
                    <Input
                      id="complexo"
                      type="number"
                      step="0.1"
                      value={formData.complexity.complexo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          complexity: { ...formData.complexity, complexo: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={!formData.name || !formData.basePrice}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {Object.entries(services).map(([key, service]) => (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-semibold">
                    R$ {service.basePrice.toLocaleString("pt-BR")}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(key)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(key)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-sm">
                  <span className="text-muted-foreground">Multiplicadores:</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Simples:</span>
                    <span className="ml-1 font-medium">{service.complexity.simples}x</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Médio:</span>
                    <span className="ml-1 font-medium">{service.complexity.medio}x</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Complexo:</span>
                    <span className="ml-1 font-medium">{service.complexity.complexo}x</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
