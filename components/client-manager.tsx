"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Search,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive" | "prospect"
  createdDate: string
  totalProjects: number
  totalValue: number
  lastContact: string
  notes: string
  projects: ClientProject[]
  communications: Communication[]
}

interface ClientProject {
  id: string
  name: string
  value: number
  status: "active" | "completed" | "cancelled"
  startDate: string
  endDate?: string
  paymentStatus: "paid" | "pending" | "overdue"
}

interface Communication {
  id: string
  type: "email" | "phone" | "meeting" | "proposal"
  subject: string
  date: string
  notes: string
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "João Silva",
    company: "Empresa ABC Ltda",
    email: "joao@empresaabc.com",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123 - São Paulo, SP",
    status: "active",
    createdDate: "2024-01-15",
    totalProjects: 2,
    totalValue: 40000,
    lastContact: "2024-03-10",
    notes: "Cliente muito satisfeito com os serviços. Sempre pontual nos pagamentos.",
    projects: [
      {
        id: "p1",
        name: "Sistema de Gestão Comercial",
        value: 15000,
        status: "active",
        startDate: "2024-01-15",
        paymentStatus: "pending",
      },
      {
        id: "p2",
        name: "Portal do Cliente",
        value: 25000,
        status: "completed",
        startDate: "2023-10-01",
        endDate: "2023-12-15",
        paymentStatus: "paid",
      },
    ],
    communications: [
      {
        id: "c1",
        type: "email",
        subject: "Proposta Sistema de Gestão",
        date: "2024-01-10",
        notes: "Enviada proposta inicial para o sistema de gestão comercial",
      },
      {
        id: "c2",
        type: "meeting",
        subject: "Reunião de Kickoff",
        date: "2024-01-20",
        notes: "Reunião para definir escopo e cronograma do projeto",
      },
    ],
  },
  {
    id: "2",
    name: "Maria Santos",
    company: "Tech Solutions",
    email: "maria@techsolutions.com",
    phone: "(11) 88888-8888",
    address: "Av. Paulista, 456 - São Paulo, SP",
    status: "prospect",
    createdDate: "2024-02-20",
    totalProjects: 0,
    totalValue: 0,
    lastContact: "2024-03-05",
    notes: "Interessada em automação de processos. Aguardando aprovação interna.",
    projects: [],
    communications: [
      {
        id: "c3",
        type: "phone",
        subject: "Primeiro contato",
        date: "2024-02-20",
        notes: "Cliente interessada em soluções de automação",
      },
    ],
  },
]

export function ClientManager() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showClientDetails, setShowClientDetails] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "prospect":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: ClientProject["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const addClient = () => {
    if (!newClient.name || !newClient.email) return

    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      company: newClient.company,
      email: newClient.email,
      phone: newClient.phone,
      address: newClient.address,
      status: "prospect",
      createdDate: new Date().toISOString().split("T")[0],
      totalProjects: 0,
      totalValue: 0,
      lastContact: new Date().toISOString().split("T")[0],
      notes: newClient.notes,
      projects: [],
      communications: [],
    }

    setClients((prev) => [...prev, client])
    setNewClient({ name: "", company: "", email: "", phone: "", address: "", notes: "" })
    setShowAddClient(false)
  }

  const viewClientDetails = (client: Client) => {
    setSelectedClient(client)
    setShowClientDetails(true)
  }

  const getTotalActiveClients = () => clients.filter((c) => c.status === "active").length
  const getTotalProspects = () => clients.filter((c) => c.status === "prospect").length
  const getTotalRevenue = () => clients.reduce((sum, c) => sum + c.totalValue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Gestão de Clientes</h2>
          <p className="text-muted-foreground">Gerencie seus clientes e histórico de projetos</p>
        </div>
        <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
          <DialogTrigger asChild>
            <Button className="font-heading font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading">Adicionar Cliente</DialogTitle>
              <DialogDescription>Cadastre um novo cliente no sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Nome do Cliente</Label>
                  <Input
                    id="client-name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="João Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    placeholder="Empresa ABC Ltda"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="joao@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="Rua das Flores, 123 - São Paulo, SP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  placeholder="Informações adicionais sobre o cliente..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddClient(false)}>
                  Cancelar
                </Button>
                <Button onClick={addClient} disabled={!newClient.name || !newClient.email}>
                  Adicionar Cliente
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-heading font-bold text-green-600">{getTotalActiveClients()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Prospects</p>
                <p className="text-2xl font-heading font-bold text-blue-600">{getTotalProspects()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-heading font-bold text-accent">
                  R$ {getTotalRevenue().toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-heading font-bold text-purple-600">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="prospect">Prospects</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="font-heading font-bold text-accent text-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">{client.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {client.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {client.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Projetos</div>
                    <div className="font-semibold">{client.totalProjects}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Valor Total</div>
                    <div className="font-semibold">R$ {client.totalValue.toLocaleString("pt-BR")}</div>
                  </div>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status === "active" ? "Ativo" : client.status === "prospect" ? "Prospect" : "Inativo"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => viewClientDetails(client)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Details Dialog */}
      {selectedClient && (
        <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">{selectedClient.name}</DialogTitle>
              <DialogDescription>{selectedClient.company}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="info" className="space-y-4">
              <TabsList>
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="projects">Projetos</TabsTrigger>
                <TabsTrigger value="communications">Comunicações</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading text-lg">Dados de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedClient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedClient.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Cliente desde {new Date(selectedClient.createdDate).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading text-lg">Resumo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className={getStatusColor(selectedClient.status)}>
                          {selectedClient.status === "active"
                            ? "Ativo"
                            : selectedClient.status === "prospect"
                              ? "Prospect"
                              : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Total de Projetos:</span>
                        <span className="font-semibold">{selectedClient.totalProjects}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor Total:</span>
                        <span className="font-semibold">R$ {selectedClient.totalValue.toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Último Contato:</span>
                        <span>{new Date(selectedClient.lastContact).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedClient.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading text-lg">Observações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedClient.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                {selectedClient.projects.length > 0 ? (
                  selectedClient.projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-heading font-semibold">{project.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>Início: {new Date(project.startDate).toLocaleDateString("pt-BR")}</span>
                              {project.endDate && (
                                <span>Fim: {new Date(project.endDate).toLocaleDateString("pt-BR")}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-semibold">R$ {project.value.toLocaleString("pt-BR")}</div>
                              <div className="text-sm text-muted-foreground">
                                {project.status === "active"
                                  ? "Em Andamento"
                                  : project.status === "completed"
                                    ? "Concluído"
                                    : "Cancelado"}
                              </div>
                            </div>
                            {getStatusIcon(project.paymentStatus)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum projeto encontrado</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="communications" className="space-y-4">
                {selectedClient.communications.length > 0 ? (
                  selectedClient.communications.map((comm) => (
                    <Card key={comm.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-accent mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{comm.subject}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{comm.type}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(comm.date).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm">{comm.notes}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma comunicação registrada</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
