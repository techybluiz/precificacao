"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreditCard, CheckCircle, Clock, AlertTriangle, Plus, TrendingUp } from "lucide-react"

interface PaymentStage {
  id: string
  name: string
  percentage: number
  amount: number
  status: "pending" | "paid" | "overdue"
  dueDate?: string
  paidDate?: string
  invoiceNumber?: string
}

interface Project {
  id: string
  name: string
  client: string
  totalValue: number
  startDate: string
  stages: PaymentStage[]
  status: "active" | "completed" | "cancelled"
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Sistema de Gestão Comercial",
    client: "Empresa ABC Ltda",
    totalValue: 15000,
    startDate: "2024-01-15",
    status: "active",
    stages: [
      {
        id: "1-1",
        name: "Entrada (30%)",
        percentage: 30,
        amount: 4500,
        status: "paid",
        dueDate: "2024-01-20",
        paidDate: "2024-01-18",
        invoiceNumber: "NF-001",
      },
      {
        id: "1-2",
        name: "MVP (40%)",
        percentage: 40,
        amount: 6000,
        status: "pending",
        dueDate: "2024-03-15",
      },
      {
        id: "1-3",
        name: "Finalização (30%)",
        percentage: 30,
        amount: 4500,
        status: "pending",
        dueDate: "2024-04-30",
      },
    ],
  },
  {
    id: "2",
    name: "Portal do Cliente",
    client: "Tech Solutions",
    totalValue: 25000,
    startDate: "2024-02-01",
    status: "active",
    stages: [
      {
        id: "2-1",
        name: "Entrada (30%)",
        percentage: 30,
        amount: 7500,
        status: "paid",
        dueDate: "2024-02-05",
        paidDate: "2024-02-03",
        invoiceNumber: "NF-002",
      },
      {
        id: "2-2",
        name: "MVP (40%)",
        percentage: 40,
        amount: 10000,
        status: "overdue",
        dueDate: "2024-03-01",
      },
      {
        id: "2-3",
        name: "Finalização (30%)",
        percentage: 30,
        amount: 7500,
        status: "pending",
        dueDate: "2024-05-15",
      },
    ],
  },
]

export function PaymentTracker() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    totalValue: 0,
    startDate: "",
  })

  const getStatusColor = (status: PaymentStage["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "overdue":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: PaymentStage["status"]) => {
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

  const calculateProjectProgress = (project: Project) => {
    const paidStages = project.stages.filter((stage) => stage.status === "paid")
    const totalPaidPercentage = paidStages.reduce((sum, stage) => sum + stage.percentage, 0)
    return totalPaidPercentage
  }

  const getTotalReceived = () => {
    return projects.reduce((total, project) => {
      const paidAmount = project.stages
        .filter((stage) => stage.status === "paid")
        .reduce((sum, stage) => sum + stage.amount, 0)
      return total + paidAmount
    }, 0)
  }

  const getTotalPending = () => {
    return projects.reduce((total, project) => {
      const pendingAmount = project.stages
        .filter((stage) => stage.status === "pending")
        .reduce((sum, stage) => sum + stage.amount, 0)
      return total + pendingAmount
    }, 0)
  }

  const getTotalOverdue = () => {
    return projects.reduce((total, project) => {
      const overdueAmount = project.stages
        .filter((stage) => stage.status === "overdue")
        .reduce((sum, stage) => sum + stage.amount, 0)
      return total + overdueAmount
    }, 0)
  }

  const markAsPaid = (projectId: string, stageId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            stages: project.stages.map((stage) => {
              if (stage.id === stageId) {
                return {
                  ...stage,
                  status: "paid" as const,
                  paidDate: new Date().toISOString().split("T")[0],
                  invoiceNumber: `NF-${Date.now().toString().slice(-3)}`,
                }
              }
              return stage
            }),
          }
        }
        return project
      }),
    )
  }

  const addProject = () => {
    if (!newProject.name || !newProject.client || !newProject.totalValue) return

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      client: newProject.client,
      totalValue: newProject.totalValue,
      startDate: newProject.startDate || new Date().toISOString().split("T")[0],
      status: "active",
      stages: [
        {
          id: `${Date.now()}-1`,
          name: "Entrada (30%)",
          percentage: 30,
          amount: newProject.totalValue * 0.3,
          status: "pending",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
        {
          id: `${Date.now()}-2`,
          name: "MVP (40%)",
          percentage: 40,
          amount: newProject.totalValue * 0.4,
          status: "pending",
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
        {
          id: `${Date.now()}-3`,
          name: "Finalização (30%)",
          percentage: 30,
          amount: newProject.totalValue * 0.3,
          status: "pending",
          dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
      ],
    }

    setProjects((prev) => [...prev, project])
    setNewProject({ name: "", client: "", totalValue: 0, startDate: "" })
    setShowAddProject(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Controle de Pagamentos</h2>
          <p className="text-muted-foreground">Acompanhe os pagamentos dos seus projetos</p>
        </div>
        <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
          <DialogTrigger asChild>
            <Button className="font-heading font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Adicionar Projeto</DialogTitle>
              <DialogDescription>Crie um novo projeto para controle de pagamentos</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Nome do Projeto</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Ex: Sistema de Gestão"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-name">Cliente</Label>
                <Input
                  id="client-name"
                  value={newProject.client}
                  onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-value">Valor Total (R$)</Label>
                <Input
                  id="total-value"
                  type="number"
                  value={newProject.totalValue}
                  onChange={(e) => setNewProject({ ...newProject, totalValue: Number(e.target.value) })}
                  placeholder="15000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Data de Início</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddProject(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={addProject}
                  disabled={!newProject.name || !newProject.client || !newProject.totalValue}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Recebido</p>
                <p className="text-2xl font-heading font-bold text-green-600">
                  R$ {getTotalReceived().toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pendente</p>
                <p className="text-2xl font-heading font-bold text-yellow-600">
                  R$ {getTotalPending().toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Em Atraso</p>
                <p className="text-2xl font-heading font-bold text-red-600">
                  R$ {getTotalOverdue().toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Total Projetos</p>
                <p className="text-2xl font-heading font-bold text-accent">
                  R$ {projects.reduce((sum, p) => sum + p.totalValue, 0).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading">{project.name}</CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">R$ {project.totalValue.toLocaleString("pt-BR")}</div>
                  <div className="text-sm text-muted-foreground">{calculateProjectProgress(project)}% recebido</div>
                </div>
              </div>
              <Progress value={calculateProjectProgress(project)} className="mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.stages.map((stage) => (
                  <div key={stage.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(stage.status)}
                      <div>
                        <div className="font-medium">{stage.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {stage.status === "paid" && stage.paidDate && (
                            <>Pago em {new Date(stage.paidDate).toLocaleDateString("pt-BR")}</>
                          )}
                          {stage.status !== "paid" && stage.dueDate && (
                            <>Vencimento: {new Date(stage.dueDate).toLocaleDateString("pt-BR")}</>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold">R$ {stage.amount.toLocaleString("pt-BR")}</div>
                        {stage.invoiceNumber && (
                          <div className="text-xs text-muted-foreground">{stage.invoiceNumber}</div>
                        )}
                      </div>
                      {stage.status !== "paid" && (
                        <Button size="sm" onClick={() => markAsPaid(project.id, stage.id)} className="font-heading">
                          <CreditCard className="w-4 h-4 mr-1" />
                          Marcar como Pago
                        </Button>
                      )}
                      {stage.status === "paid" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Pago
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
