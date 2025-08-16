"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Send, Eye, DollarSign, Award, Users, Zap, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface ProposalData {
  projectName: string
  clientName: string
  clientEmail: string
  serviceName: string
  serviceDescription: string
  complexity: string
  urgency: string
  totalPrice: number
  basePrice: number
  multiplier: number
  urgencyMultiplier: number
  timeline: string
  additionalNotes: string
  additionals?: Array<{
    name: string
    price: number
    category: string
  }>
  discountType?: string
  discountValue?: number
  originalPrice?: number
  customFinalPrice?: boolean
}

interface ProjectScope {
  stage: string
  description: string
  timeline: string
  price: number
}

interface ProposalGeneratorProps {
  proposalData: ProposalData | null
  onClose: () => void
}

const mockClients = [
  { id: "1", name: "João Silva", email: "joao@empresa.com", company: "Empresa ABC" },
  { id: "2", name: "Maria Santos", email: "maria@startup.com", company: "Startup XYZ" },
  { id: "3", name: "Pedro Costa", email: "pedro@tech.com", company: "Tech Solutions" },
  { id: "4", name: "Ana Oliveira", email: "ana@digital.com", company: "Digital Corp" },
]

export function ProposalGenerator({ proposalData, onClose }: ProposalGeneratorProps) {
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [selectedClientId, setSelectedClientId] = useState("")
  const [useExistingClient, setUseExistingClient] = useState(false)
  const [timeline, setTimeline] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [deliveryTerms, setDeliveryTerms] = useState("42 dias corridos após confirmação do pagamento inicial")
  const [validityDays, setValidityDays] = useState("30")
  const [paymentTerms, setPaymentTerms] = useState("50% na assinatura + 50% na entrega final")

  const [projectScope, setProjectScope] = useState<ProjectScope[]>([
    {
      stage: "Desenvolvimento Web",
      description: "Sistema sob medida com painel administrativo e controle de usuários",
      timeline: "30 dias",
      price: proposalData?.basePrice || 0,
    },
    {
      stage: "Integração de API",
      description: "Integração com gateway de pagamento e emissão automática de notas",
      timeline: "7 dias",
      price: 0,
    },
    {
      stage: "Automação de Processos",
      description: "Rotinas para atualização automática de relatórios e alertas por e-mail",
      timeline: "5 dias",
      price: 0,
    },
  ])

  if (!proposalData) return null

  const handleClientSelection = (clientId: string) => {
    setSelectedClientId(clientId)
    const client = mockClients.find((c) => c.id === clientId)
    if (client) {
      setClientName(client.name)
      setClientEmail(client.email)
    }
  }

  const toggleClientMode = (useExisting: boolean) => {
    setUseExistingClient(useExisting)
    if (!useExisting) {
      setSelectedClientId("")
      setClientName("")
      setClientEmail("")
    }
  }

  const entrancePayment = proposalData.totalPrice * 0.5
  const finalPayment = proposalData.totalPrice * 0.5

  const addScopeItem = () => {
    setProjectScope([
      ...projectScope,
      {
        stage: "",
        description: "",
        timeline: "",
        price: 0,
      },
    ])
  }

  const removeScopeItem = (index: number) => {
    setProjectScope(projectScope.filter((_, i) => i !== index))
  }

  const updateScopeItem = (index: number, field: keyof ProjectScope, value: string | number) => {
    const updated = [...projectScope]
    updated[index] = { ...updated[index], [field]: value }
    setProjectScope(updated)
  }

  const generateProposal = () => {
    setShowPreview(true)
  }

  const downloadProposal = () => {
    // Create a new window with the proposal content
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const proposalHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Proposta Comercial - ${clientName}</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #8b5cf6; 
              padding-bottom: 20px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 20px;
              margin-bottom: 20px;
            }
            .company-info h1 { 
              color: #1f2937; 
              margin: 0; 
              font-size: 2.5em;
            }
            .company-info p { 
              color: #8b5cf6; 
              margin: 5px 0;
            }
            .proposal-title {
              background: linear-gradient(135deg, #8b5cf6, #1f2937);
              color: white;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .section { 
              margin: 30px 0; 
            }
            .section h3 { 
              color: #1f2937; 
              border-bottom: 1px solid #e5e7eb; 
              padding-bottom: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
            }
            th, td { 
              border: 1px solid #e5e7eb; 
              padding: 12px; 
              text-align: left;
            }
            th { 
              background-color: #f9fafb; 
              font-weight: bold;
            }
            .total-row { 
              background-color: #8b5cf6; 
              color: white; 
              font-weight: bold;
            }
            .payment-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 20px 0;
            }
            .payment-box {
              border: 2px solid #8b5cf6;
              padding: 20px;
              text-align: center;
              border-radius: 8px;
            }
            .conditions {
              background-color: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .about-section {
              background-color: #f3f4f6;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .features-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin: 15px 0;
            }
            .feature-box {
              background: white;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              border: 1px solid #e5e7eb;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <div class="company-info">
                <h1>Nuntech</h1>
                <p><strong>Soluções em Desenvolvimento</strong></p>
                <p>Inovação • Qualidade • Resultados</p>
              </div>
            </div>
            <div class="proposal-title">
              <h2>Proposta Comercial</h2>
              <p>Proposta Nº ${Date.now().toString().slice(-6)} • ${new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

          <div class="about-section">
            <h3>Sobre a Nuntech</h3>
            <div class="features-grid">
              <div class="feature-box">
                <h4>Equipe Especializada</h4>
                <p>Desenvolvedores experientes em tecnologias modernas</p>
              </div>
              <div class="feature-box">
                <h4>Metodologia Ágil</h4>
                <p>Entregas rápidas e iterativas com qualidade</p>
              </div>
              <div class="feature-box">
                <h4>Cases de Sucesso</h4>
                <p>Projetos entregues com excelência e no prazo</p>
              </div>
            </div>
            <p>A Nuntech é especializada em desenvolvimento de software personalizado, com foco em soluções inovadoras que geram resultados reais para nossos clientes.</p>
          </div>

          <div class="section">
            <h3>Dados do Cliente</h3>
            <p><strong>Nome:</strong> ${clientName}</p>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <p><strong>Projeto:</strong> ${proposalData.projectName}</p>
            <p><strong>Validade:</strong> Válida até ${new Date(Date.now() + Number.parseInt(validityDays) * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")} (${validityDays} dias)</p>
          </div>

          <div class="section">
            <h3>Escopo do Projeto</h3>
            <table>
              <thead>
                <tr>
                  <th>Etapa / Serviço</th>
                  <th>Descrição</th>
                  <th>Prazo</th>
                </tr>
              </thead>
              <tbody>
                ${projectScope
                  .map(
                    (item) => `
                  <tr>
                    <td><strong>${item.stage}</strong></td>
                    <td>${item.description}</td>
                    <td>${item.timeline}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Investimento</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantidade</th>
                  <th>Valor Unitário</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${projectScope
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.stage}</td>
                    <td>1</td>
                    <td>R$ ${item.price.toLocaleString("pt-BR")}</td>
                    <td>R$ ${item.price.toLocaleString("pt-BR")}</td>
                  </tr>
                `,
                  )
                  .join("")}
                ${
                  proposalData.additionals && proposalData.additionals.length > 0
                    ? `
                  <tr><td colspan="4"><strong>Adicionais</strong></td></tr>
                  ${proposalData.additionals
                    .map(
                      (additional) => `
                    <tr>
                      <td>${additional.name}</td>
                      <td>1</td>
                      <td>R$ ${additional.price.toLocaleString("pt-BR")}</td>
                      <td>R$ ${additional.price.toLocaleString("pt-BR")}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                `
                    : ""
                }
                ${
                  proposalData.discountType && proposalData.discountType !== "none" && proposalData.discountValue
                    ? `
                  <tr>
                    <td colspan="3"><strong>Desconto ${proposalData.discountType === "percentage" ? `(${proposalData.discountValue}%)` : "Aplicado"}</strong></td>
                    <td style="color: green;">-R$ ${
                      proposalData.discountType === "percentage"
                        ? ((proposalData.originalPrice || 0) * (proposalData.discountValue / 100)).toLocaleString(
                            "pt-BR",
                          )
                        : proposalData.discountValue.toLocaleString("pt-BR")
                    }</td>
                  </tr>
                `
                    : ""
                }
                <tr class="total-row">
                  <td colspan="3"><strong>TOTAL FINAL</strong></td>
                  <td><strong>R$ ${proposalData.totalPrice.toLocaleString("pt-BR")}</strong></td>
                </tr>
              </tbody>
            </table>

            <div class="payment-grid">
              <div class="payment-box">
                <h4>50% na Assinatura</h4>
                <p><strong>R$ ${entrancePayment.toLocaleString("pt-BR")}</strong></p>
              </div>
              <div class="payment-box">
                <h4>50% na Entrega Final</h4>
                <p><strong>R$ ${finalPayment.toLocaleString("pt-BR")}</strong></p>
              </div>
            </div>
          </div>

          <div class="conditions">
            <h3>Condições Comerciais</h3>
            <p><strong>Forma de Pagamento:</strong> ${paymentTerms}</p>
            <p><strong>Prazo de Entrega:</strong> ${deliveryTerms}</p>
            <p><strong>Suporte:</strong> 30 dias de suporte técnico gratuito após a entrega</p>
            <p><strong>Alterações de Escopo:</strong> Tratadas como aditivo contratual</p>
            <p><strong>Garantia:</strong> 90 dias para correção de bugs</p>
            <p><strong>Impostos:</strong> Valores não incluem ISS (5%)</p>
          </div>

          ${
            additionalNotes
              ? `
            <div class="section">
              <h3>Observações</h3>
              <p>${additionalNotes.replace(/\n/g, "<br>")}</p>
            </div>
          `
              : ""
          }

          <div class="section">
            <p style="text-align: center; color: #8b5cf6; font-weight: bold;">
              💡 Dúvidas? Entre em contato: contato@nuntech.com | WhatsApp: (11) 99999-9999
            </p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(proposalHTML)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }

  const sendProposal = () => {
    // In a real app, this would send via email
    console.log("Sending proposal to:", clientEmail)
    alert(`Proposta enviada para ${clientEmail} com sucesso!`)
  }

  const complexityLabels = {
    simples: "Simples",
    medio: "Médio",
    complexo: "Complexo",
  }

  const urgencyLabels = {
    normal: "Normal",
    urgente: "Urgente",
    "muito-urgente": "Muito Urgente",
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Gerador de Propostas</DialogTitle>
          <DialogDescription>Complete os dados do cliente para gerar uma proposta profissional</DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">Dados do Cliente</h3>

                <div className="flex items-center space-x-4">
                  <Button
                    variant={!useExistingClient ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleClientMode(false)}
                  >
                    Novo Cliente
                  </Button>
                  <Button
                    variant={useExistingClient ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleClientMode(true)}
                  >
                    Cliente Existente
                  </Button>
                </div>

                {useExistingClient ? (
                  <div className="space-y-2">
                    <Label>Selecionar Cliente</Label>
                    <Select value={selectedClientId} onValueChange={handleClientSelection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um cliente cadastrado" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {client.company} • {client.email}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Nome do Cliente</Label>
                      <Input
                        id="client-name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: João Silva"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email do Cliente</Label>
                      <Input
                        id="client-email"
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="joao@empresa.com"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="delivery-terms">Prazo de Entrega</Label>
                  <Input
                    id="delivery-terms"
                    value={deliveryTerms}
                    onChange={(e) => setDeliveryTerms(e.target.value)}
                    placeholder="Ex: 42 dias corridos após confirmação"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validity-days">Validade da Proposta (dias)</Label>
                  <Input
                    id="validity-days"
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Forma de Pagamento</Label>
                  <Input
                    id="payment-terms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="Ex: 50% na assinatura + 50% na entrega"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">Resumo do Projeto</h3>
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Projeto:</span>
                      <span className="font-medium">{proposalData.projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Serviço:</span>
                      <span className="font-medium">{proposalData.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Complexidade:</span>
                      <Badge variant="secondary">
                        {complexityLabels[proposalData.complexity as keyof typeof complexityLabels]}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Urgência:</span>
                      <Badge variant="outline">
                        {urgencyLabels[proposalData.urgency as keyof typeof urgencyLabels]}
                      </Badge>
                    </div>
                    <Separator />
                    {proposalData.discountType &&
                      proposalData.discountType !== "none" &&
                      proposalData.discountValue && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Valor original:</span>
                            <span className="line-through">
                              R$ {(proposalData.originalPrice || 0).toLocaleString("pt-BR")}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Desconto aplicado:</span>
                            <span>
                              -
                              {proposalData.discountType === "percentage"
                                ? `${proposalData.discountValue}%`
                                : `R$ ${proposalData.discountValue.toLocaleString("pt-BR")}`}
                            </span>
                          </div>
                        </>
                      )}
                    {proposalData.customFinalPrice && (
                      <div className="flex justify-between text-sm text-blue-600">
                        <span>Valor personalizado:</span>
                        <span>Aplicado</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Valor Total:</span>
                      <span className="text-accent">R$ {proposalData.totalPrice.toLocaleString("pt-BR")}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* ... existing code for project scope ... */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-semibold text-lg">Escopo do Projeto</h3>
                <Button onClick={addScopeItem} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Etapa
                </Button>
              </div>

              <div className="space-y-3">
                {projectScope.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid md:grid-cols-4 gap-3">
                        <div>
                          <Label>Etapa/Serviço</Label>
                          <Input
                            value={item.stage}
                            onChange={(e) => updateScopeItem(index, "stage", e.target.value)}
                            placeholder="Ex: Desenvolvimento Web"
                          />
                        </div>
                        <div>
                          <Label>Descrição</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateScopeItem(index, "description", e.target.value)}
                            placeholder="Descrição do serviço"
                          />
                        </div>
                        <div>
                          <Label>Prazo</Label>
                          <Input
                            value={item.timeline}
                            onChange={(e) => updateScopeItem(index, "timeline", e.target.value)}
                            placeholder="Ex: 30 dias"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label>Valor (R$)</Label>
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) => updateScopeItem(index, "price", Number(e.target.value))}
                              placeholder="0"
                            />
                          </div>
                          {projectScope.length > 1 && (
                            <Button variant="outline" size="sm" onClick={() => removeScopeItem(index)} className="mt-6">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-notes">Observações Adicionais</Label>
              <Textarea
                id="additional-notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Inclua informações específicas sobre o projeto, requisitos especiais, ou outras observações..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="hover:bg-gray-100 hover:text-gray-900 bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                onClick={generateProposal}
                disabled={!clientName || !clientEmail}
                className="font-heading font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar Proposta
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ... existing preview code ... */}
            <div className="bg-card border rounded-lg p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg border">
                    <Image
                      src="/images/nuntech-logo.png"
                      alt="Nuntech Logo"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <h1 className="font-heading font-black text-3xl text-foreground">Nuntech</h1>
                    <p className="text-accent font-medium">Soluções em Desenvolvimento</p>
                    <p className="text-sm text-muted-foreground">Inovação • Qualidade • Resultados</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
                  <h2 className="font-heading font-bold text-2xl text-primary">Proposta Comercial</h2>
                  <p className="text-muted-foreground">
                    Proposta Nº {Date.now().toString().slice(-6)} • {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <Separator />

              {/* ... existing preview content ... */}
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Sobre a Nuntech
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-card rounded-lg">
                    <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                    <h4 className="font-semibold">Equipe Especializada</h4>
                    <p className="text-sm text-muted-foreground">Desenvolvedores experientes em tecnologias modernas</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                    <h4 className="font-semibold">Metodologia Ágil</h4>
                    <p className="text-sm text-muted-foreground">Entregas rápidas e iterativas com qualidade</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <Award className="w-8 h-8 text-accent mx-auto mb-2" />
                    <h4 className="font-semibold">Cases de Sucesso</h4>
                    <p className="text-sm text-muted-foreground">Projetos entregues com excelência e no prazo</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  A Nuntech é especializada em desenvolvimento de software personalizado, com foco em soluções
                  inovadoras que geram resultados reais para nossos clientes. Nossa abordagem combina tecnologia de
                  ponta com metodologias ágeis para entregar projetos de alta qualidade.
                </p>
              </div>

              <Separator />

              {/* Client Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-heading font-semibold mb-3">Cliente</h3>
                  <div className="space-y-1">
                    <p className="font-medium">{clientName}</p>
                    <p className="text-muted-foreground">{clientEmail}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-3">Validade</h3>
                  <p className="text-accent font-medium">
                    Válida até{" "}
                    {new Date(Date.now() + Number.parseInt(validityDays) * 24 * 60 * 60 * 1000).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">({validityDays} dias a partir da data de emissão)</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-heading font-semibold text-lg mb-4">Escopo do Projeto</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Etapa / Serviço</th>
                        <th className="text-left p-3 font-semibold">Descrição</th>
                        <th className="text-left p-3 font-semibold">Prazo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectScope.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-medium">{item.stage}</td>
                          <td className="p-3 text-muted-foreground">{item.description}</td>
                          <td className="p-3">{item.timeline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-accent" />
                  Investimento
                </h3>

                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left p-3 font-semibold">Item</th>
                          <th className="text-center p-3 font-semibold">Quantidade</th>
                          <th className="text-right p-3 font-semibold">Valor Unitário</th>
                          <th className="text-right p-3 font-semibold">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectScope.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 font-medium">{item.stage}</td>
                            <td className="p-3 text-center">1</td>
                            <td className="p-3 text-right">R$ {item.price.toLocaleString("pt-BR")}</td>
                            <td className="p-3 text-right">R$ {item.price.toLocaleString("pt-BR")}</td>
                          </tr>
                        ))}
                        {proposalData.additionals && proposalData.additionals.length > 0 && (
                          <>
                            <tr>
                              <td colSpan={4} className="p-3 font-semibold text-accent">
                                Adicionais
                              </td>
                            </tr>
                            {proposalData.additionals.map((additional, index) => (
                              <tr key={`additional-${index}`} className="border-b">
                                <td className="p-3 font-medium">{additional.name}</td>
                                <td className="p-3 text-center">1</td>
                                <td className="p-3 text-right">R$ {additional.price.toLocaleString("pt-BR")}</td>
                                <td className="p-3 text-right">R$ {additional.price.toLocaleString("pt-BR")}</td>
                              </tr>
                            ))}
                          </>
                        )}
                        {proposalData.discountType &&
                          proposalData.discountType !== "none" &&
                          proposalData.discountValue && (
                            <tr className="border-b">
                              <td colSpan={3} className="p-3 font-medium text-green-600">
                                Desconto{" "}
                                {proposalData.discountType === "percentage"
                                  ? `(${proposalData.discountValue}%)`
                                  : "Aplicado"}
                              </td>
                              <td className="p-3 text-right text-green-600">
                                -R${" "}
                                {proposalData.discountType === "percentage"
                                  ? (
                                      (proposalData.originalPrice || 0) *
                                      (proposalData.discountValue / 100)
                                    ).toLocaleString("pt-BR")
                                  : proposalData.discountValue.toLocaleString("pt-BR")}
                              </td>
                            </tr>
                          )}
                        <tr className="border-b-2 border-primary bg-primary/5">
                          <td colSpan={3} className="p-3 font-bold text-lg">
                            Total Final
                          </td>
                          <td className="p-3 text-right font-bold text-lg text-accent">
                            R$ {proposalData.totalPrice.toLocaleString("pt-BR")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Condições Comerciais</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">50% na Assinatura</div>
                        <div className="font-semibold text-xl">R$ {entrancePayment.toLocaleString("pt-BR")}</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">50% na Entrega Final</div>
                        <div className="font-semibold text-xl">R$ {finalPayment.toLocaleString("pt-BR")}</div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <p className="text-sm">
                        <strong>Forma de Pagamento:</strong> {paymentTerms}
                      </p>
                      <p className="text-sm">
                        <strong>Prazo de Entrega:</strong> {deliveryTerms}
                      </p>
                      <p className="text-sm">
                        <strong>Suporte:</strong> 30 dias de suporte técnico gratuito após a entrega
                      </p>
                      <p className="text-sm">
                        <strong>Alterações de Escopo:</strong> Tratadas como aditivo contratual
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {additionalNotes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-3">Observações</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{additionalNotes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Terms and Conditions */}
              <div className="text-sm text-muted-foreground space-y-3">
                <h4 className="font-medium text-foreground">Termos e Condições Comerciais</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Condições Gerais</h5>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Proposta válida por {validityDays} dias</li>
                      <li>Valores não incluem impostos (ISS 5%)</li>
                      <li>Início do projeto após assinatura do contrato</li>
                      <li>Reuniões de acompanhamento semanais</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Alterações e Garantias</h5>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Alterações no escopo geram custos adicionais</li>
                      <li>Garantia de 90 dias para correção de bugs</li>
                      <li>Suporte técnico por 30 dias incluído</li>
                      <li>Código fonte entregue ao final do projeto</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                  <p className="text-accent font-medium">
                    💡 Dúvidas? Entre em contato conosco pelo email contato@nuntech.com ou WhatsApp (11) 99999-9999
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="hover:bg-gray-100 hover:text-gray-900"
              >
                Voltar para Edição
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={downloadProposal}
                  className="hover:bg-gray-100 hover:text-gray-900 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
                <Button
                  onClick={sendProposal}
                  className="font-heading font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar por Email
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
