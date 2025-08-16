"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, FileText, Users, Settings, TrendingUp, Package, CreditCard, Clock, Box, Plus } from "lucide-react"
import { ServiceCatalogManager } from "@/components/service-catalog-manager"
import { ProposalGenerator } from "@/components/proposal-generator"
import { PaymentTracker } from "@/components/payment-tracker"
import { ClientManager } from "@/components/client-manager"
import { LoginScreen } from "@/components/login-screen"

const initialServicePricing = {
  desenvolvimento: {
    id: "desenvolvimento",
    name: "Desenvolvimento de Funcionalidades",
    basePrice: 2500,
    description: "Cadastros, relatórios, funcionalidades simples",
    complexity: {
      simples: 1,
      medio: 1.5,
      complexo: 2.2,
    },
  },
  integracoes: {
    id: "integracoes",
    name: "Integrações entre Sistemas",
    basePrice: 3500,
    description: "APIs, webhooks, sincronização de dados",
    complexity: {
      simples: 1,
      medio: 1.8,
      complexo: 2.5,
    },
  },
  portais: {
    id: "portais",
    name: "Portais e Áreas de Cliente",
    basePrice: 8500,
    description: "Dashboards, painéis administrativos",
    complexity: {
      simples: 1,
      medio: 1.6,
      complexo: 2.3,
    },
  },
  automacao: {
    id: "automacao",
    name: "Automação de Processos",
    basePrice: 4200,
    description: "Workflows, processos automatizados",
    complexity: {
      simples: 1,
      medio: 1.7,
      complexo: 2.4,
    },
  },
}

const additionalServices = {
  development: [
    {
      id: "external-integration",
      name: "Integração com sistemas externos",
      description: "ERP, gateways de pagamento, APIs de terceiros",
      minPrice: 500,
      maxPrice: 2500,
      category: "Desenvolvimento",
    },
    {
      id: "custom-reports",
      name: "Relatórios personalizados ou dashboards avançados",
      description: "Relatórios complexos com visualizações avançadas",
      minPrice: 300,
      maxPrice: 1200,
      category: "Desenvolvimento",
    },
    {
      id: "multiuser-system",
      name: "Sistema multiusuário com permissões avançadas",
      description: "Controle de acesso com hierarquia de usuários",
      minPrice: 1000,
      maxPrice: 2000,
      category: "Desenvolvimento",
    },
  ],
  design: [
    {
      id: "extra-screen",
      name: "Tela extra / módulo extra",
      description: "Além do escopo inicial",
      minPrice: 200,
      maxPrice: 800,
      category: "Design / UX",
    },
    {
      id: "responsive-design",
      name: "Design responsivo avançado ou animações interativas",
      description: "Interações complexas e animações personalizadas",
      minPrice: 300,
      maxPrice: 1000,
      category: "Design / UX",
    },
    {
      id: "mockups",
      name: "Mockups ou protótipos interativos",
      description: "Para aprovação do cliente",
      minPrice: 150,
      maxPrice: 500,
      category: "Design / UX",
    },
  ],
  support: [
    {
      id: "extended-support",
      name: "Suporte extra pós-entrega",
      description: "Além dos 30 dias incluídos",
      minPrice: 200,
      maxPrice: 1000,
      category: "Suporte e Manutenção",
    },
    {
      id: "system-updates",
      name: "Atualizações de sistema / novas versões",
      description: "Pacote mensal ou por atualização única",
      minPrice: 300,
      maxPrice: 1500,
      category: "Suporte e Manutenção",
    },
  ],
  training: [
    {
      id: "team-training",
      name: "Treinamento presencial ou remoto",
      description: "Da equipe do cliente",
      minPrice: 300,
      maxPrice: 1000,
      category: "Treinamento e Documentação",
    },
    {
      id: "technical-documentation",
      name: "Documentação técnica detalhada",
      description: "Manual de uso, fluxo, código comentado",
      minPrice: 200,
      maxPrice: 800,
      category: "Treinamento e Documentação",
    },
  ],
  extras: [
    {
      id: "bi-integration",
      name: "Integração com sistemas de BI",
      description: "Power BI, Google Data Studio",
      minPrice: 500,
      maxPrice: 1500,
      category: "Extras de entrega",
    },
    {
      id: "hosting-setup",
      name: "Hospedagem e configuração de servidor",
      description: "Dependendo da infraestrutura",
      minPrice: 200,
      maxPrice: 700,
      category: "Extras de entrega",
    },
  ],
}

export default function PricingCalculator() {
  const [servicePricing, setServicePricing] = useState(initialServicePricing)
  const [selectedService, setSelectedService] = useState("")
  const [complexity, setComplexity] = useState("")
  const [urgency, setUrgency] = useState("normal")
  const [projectName, setProjectName] = useState("")
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [activeTab, setActiveTab] = useState("calculator")
  const [showProposalGenerator, setShowProposalGenerator] = useState(false)
  const [proposalData, setProposalData] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [pricingType, setPricingType] = useState("fixed") // "fixed" or "hourly"
  const [hourlyRate, setHourlyRate] = useState(150)
  const [estimatedHours, setEstimatedHours] = useState(0)
  const [developerCount, setDeveloperCount] = useState(1)

  const [selectedAdditionals, setSelectedAdditionals] = useState<
    Array<{
      id: string
      name: string
      price: number
      category: string
    }>
  >([])

  const [discountType, setDiscountType] = useState("none") // "none", "percentage", "fixed"
  const [discountValue, setDiscountValue] = useState(0)
  const [finalPrice, setFinalPrice] = useState(0)
  const [customFinalPrice, setCustomFinalPrice] = useState(false)

  const handleAdditionalToggle = (additional: any, checked: boolean) => {
    if (checked) {
      // Add with minimum price as default
      setSelectedAdditionals((prev) => [
        ...prev,
        {
          id: additional.id,
          name: additional.name,
          price: additional.minPrice,
          category: additional.category,
        },
      ])
    } else {
      // Remove
      setSelectedAdditionals((prev) => prev.filter((item) => item.id !== additional.id))
    }
  }

  const updateAdditionalPrice = (id: string, price: number) => {
    setSelectedAdditionals((prev) => prev.map((item) => (item.id === id ? { ...item, price } : item)))
  }

  const calculatePrice = () => {
    let basePrice = 0

    if (pricingType === "hourly") {
      if (!estimatedHours || estimatedHours <= 0) return
      basePrice = hourlyRate * estimatedHours * developerCount
    } else {
      if (!selectedService || !complexity) return
      const service = servicePricing[selectedService]
      basePrice = service.basePrice * service.complexity[complexity]
    }

    // Apply urgency multiplier
    const urgencyMultiplier = urgency === "urgente" ? 1.3 : urgency === "muito-urgente" ? 1.6 : 1
    basePrice *= urgencyMultiplier

    // Add additionals
    const additionalsTotal = selectedAdditionals.reduce((sum, additional) => sum + additional.price, 0)
    let totalPrice = basePrice + additionalsTotal

    if (discountType === "percentage" && discountValue > 0) {
      totalPrice = totalPrice * (1 - discountValue / 100)
    } else if (discountType === "fixed" && discountValue > 0) {
      totalPrice = Math.max(0, totalPrice - discountValue)
    }

    setCalculatedPrice(totalPrice)

    if (!customFinalPrice) {
      setFinalPrice(totalPrice)
    }
  }

  const toggleCustomFinalPrice = (enabled: boolean) => {
    setCustomFinalPrice(enabled)
    if (!enabled) {
      setFinalPrice(calculatedPrice)
    }
  }

  const generateProposal = () => {
    const priceToUse = customFinalPrice ? finalPrice : calculatedPrice

    if (pricingType === "hourly") {
      if (!estimatedHours || !priceToUse || !projectName) return

      const urgencyMultiplier = urgency === "urgente" ? 1.3 : urgency === "muito-urgente" ? 1.6 : 1

      setProposalData({
        projectName,
        clientName: "",
        clientEmail: "",
        serviceName: "Desenvolvimento por Horas",
        serviceDescription: `Desenvolvimento baseado em ${estimatedHours}h de trabalho com ${developerCount} desenvolvedor${developerCount > 1 ? "es" : ""}`,
        complexity: "personalizado",
        urgency,
        totalPrice: priceToUse,
        basePrice: hourlyRate * estimatedHours * developerCount,
        multiplier: 1,
        urgencyMultiplier,
        timeline: "",
        additionalNotes: `Valor da hora: R$ ${hourlyRate} | Estimativa: ${estimatedHours} horas | ${developerCount} desenvolvedor${developerCount > 1 ? "es" : ""}`,
        pricingType: "hourly",
        hourlyRate,
        estimatedHours,
        developerCount,
        additionals: selectedAdditionals,
        discountType,
        discountValue,
        originalPrice: calculatedPrice,
        customFinalPrice,
      })
    } else {
      if (!selectedService || !complexity || !priceToUse || !projectName) return

      const service = servicePricing[selectedService]
      const complexityMultiplier = service.complexity[complexity]
      const urgencyMultiplier = urgency === "urgente" ? 1.3 : urgency === "muito-urgente" ? 1.6 : 1

      setProposalData({
        projectName,
        clientName: "",
        clientEmail: "",
        serviceName: service.name,
        serviceDescription: service.description,
        complexity,
        urgency,
        totalPrice: priceToUse,
        basePrice: service.basePrice,
        multiplier: complexityMultiplier,
        urgencyMultiplier,
        timeline: "",
        additionalNotes: "",
        pricingType: "fixed",
        additionals: selectedAdditionals,
        discountType,
        discountValue,
        originalPrice: calculatedPrice,
        customFinalPrice,
      })
    }
    setShowProposalGenerator(true)
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoggingIn(true)
    setLoginError("")

    // Simulate API call
    setTimeout(() => {
      if (email === "admin@nuntech.com" && password === "nuntech2024") {
        setIsAuthenticated(true)
        setLoginError("")
      } else {
        setLoginError("Email ou senha incorretos. Tente novamente.")
      }
      setIsLoggingIn(false)
    }, 1000)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setActiveTab("calculator")
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} isLoading={isLoggingIn} error={loginError} />
  }

  const additionalsTotal = selectedAdditionals.reduce((sum, additional) => sum + additional.price, 0)

  const displayPrice = customFinalPrice ? finalPrice : calculatedPrice

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-black text-lg">N</span>
              </div>
              <div>
                <h1 className="font-heading font-black text-xl text-foreground">Nuntech</h1>
                <p className="text-sm text-muted-foreground">Modelo de Precificação</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Button
                variant={activeTab === "calculator" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("calculator")}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculadora
              </Button>
              <Button
                variant={activeTab === "catalog" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("catalog")}
              >
                <Package className="w-4 h-4 mr-2" />
                Catálogo
              </Button>
              <Button
                variant={activeTab === "payments" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("payments")}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pagamentos
              </Button>
              <Button
                variant={activeTab === "clients" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("clients")}
              >
                <Users className="w-4 h-4 mr-2" />
                Clientes
              </Button>
              <Button
                variant={activeTab === "proposals" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("proposals")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Propostas
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <Settings className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="calculator">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Calculator */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Calculadora de Preços</h2>
                  <p className="text-muted-foreground">Utilize nossa tabela base para orçamentos rápidos e precisos</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Configuração do Projeto</CardTitle>
                    <CardDescription>Defina os parâmetros do seu projeto para calcular o preço</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Nome do Projeto</Label>
                      <Input
                        id="project-name"
                        placeholder="Ex: Sistema de Gestão Comercial"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Orçamento</Label>
                      <Select value={pricingType} onValueChange={setPricingType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">
                            <div className="flex items-center gap-2">
                              <Box className="w-4 h-4" />
                              <div>
                                <div className="font-medium">Produto Pronto</div>
                                <div className="text-sm text-muted-foreground">Preço fixo por funcionalidade</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="hourly">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <div>
                                <div className="font-medium">Por Horas</div>
                                <div className="text-sm text-muted-foreground">Baseado em valor/hora</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {pricingType === "fixed" ? (
                      <div className="space-y-2">
                        <Label>Tipo de Serviço</Label>
                        <Select value={selectedService} onValueChange={setSelectedService}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(servicePricing).map(([key, service]) => (
                              <SelectItem key={key} value={key}>
                                <div>
                                  <div className="font-medium">{service.name}</div>
                                  <div className="text-sm text-muted-foreground">{service.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="hourly-rate">Valor da Hora (R$)</Label>
                            <Input
                              id="hourly-rate"
                              type="number"
                              placeholder="150"
                              value={hourlyRate}
                              onChange={(e) => setHourlyRate(Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="estimated-hours">Horas Estimadas</Label>
                            <Input
                              id="estimated-hours"
                              type="number"
                              placeholder="40"
                              value={estimatedHours}
                              onChange={(e) => setEstimatedHours(Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="developer-count">Qtd. Desenvolvedores</Label>
                            <Input
                              id="developer-count"
                              type="number"
                              min="1"
                              placeholder="1"
                              value={developerCount}
                              onChange={(e) => setDeveloperCount(Math.max(1, Number(e.target.value)))}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {pricingType === "fixed" && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Complexidade Técnica</Label>
                          <Select value={complexity} onValueChange={setComplexity}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a complexidade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="simples">
                                <div>
                                  <div className="font-medium">Simples</div>
                                  <div className="text-sm text-muted-foreground">Funcionalidades básicas</div>
                                </div>
                              </SelectItem>
                              <SelectItem value="medio">
                                <div>
                                  <div className="font-medium">Médio</div>
                                  <div className="text-sm text-muted-foreground">Integrações moderadas</div>
                                </div>
                              </SelectItem>
                              <SelectItem value="complexo">
                                <div>
                                  <div className="font-medium">Complexo</div>
                                  <div className="text-sm text-muted-foreground">Arquitetura avançada</div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Urgência do Projeto</Label>
                          <Select value={urgency} onValueChange={setUrgency}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">
                                <div>
                                  <div className="font-medium">Normal</div>
                                  <div className="text-sm text-muted-foreground">Prazo padrão</div>
                                </div>
                              </SelectItem>
                              <SelectItem value="urgente">
                                <div>
                                  <div className="font-medium">Urgente</div>
                                  <div className="text-sm text-muted-foreground">+30% no valor</div>
                                </div>
                              </SelectItem>
                              <SelectItem value="muito-urgente">
                                <div>
                                  <div className="font-medium">Muito Urgente</div>
                                  <div className="text-sm text-muted-foreground">+60% no valor</div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {pricingType === "hourly" && (
                      <div className="space-y-2">
                        <Label>Urgência do Projeto</Label>
                        <Select value={urgency} onValueChange={setUrgency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">
                              <div>
                                <div className="font-medium">Normal</div>
                                <div className="text-sm text-muted-foreground">Prazo padrão</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="urgente">
                              <div>
                                <div className="font-medium">Urgente</div>
                                <div className="text-sm text-muted-foreground">+30% no valor</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="muito-urgente">
                              <div>
                                <div className="font-medium">Muito Urgente</div>
                                <div className="text-sm text-muted-foreground">+60% no valor</div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button
                      onClick={calculatePrice}
                      className="w-full font-heading font-semibold"
                      disabled={
                        pricingType === "fixed"
                          ? !selectedService || !complexity
                          : !estimatedHours ||
                            estimatedHours <= 0 ||
                            !hourlyRate ||
                            hourlyRate <= 0 ||
                            !developerCount ||
                            developerCount <= 0
                      }
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calcular Preço
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Adicionais do Projeto
                    </CardTitle>
                    <CardDescription>Selecione serviços extras para incluir no orçamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(additionalServices).map(([categoryKey, services]) => (
                      <div key={categoryKey} className="space-y-3">
                        <h4 className="font-semibold text-sm text-accent">{services[0]?.category}</h4>
                        <div className="grid gap-3">
                          {services.map((additional) => {
                            const isSelected = selectedAdditionals.some((item) => item.id === additional.id)
                            const selectedItem = selectedAdditionals.find((item) => item.id === additional.id)

                            return (
                              <div key={additional.id} className="relative">
                                <div
                                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                                    isSelected ? "border-accent bg-accent/5" : "border-border"
                                  }`}
                                  onClick={() => handleAdditionalToggle(additional, !isSelected)}
                                >
                                  <div className="flex items-start gap-3">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) =>
                                        handleAdditionalToggle(additional, checked as boolean)
                                      }
                                      className="mt-0.5"
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">{additional.name}</div>
                                      <div className="text-sm text-muted-foreground mt-1">{additional.description}</div>
                                      <div className="text-sm text-accent mt-2">
                                        R$ {additional.minPrice.toLocaleString("pt-BR")} - R${" "}
                                        {additional.maxPrice.toLocaleString("pt-BR")}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="mt-2 ml-7 flex items-center gap-2">
                                    <Label className="text-sm font-medium">Valor personalizado:</Label>
                                    <Input
                                      type="number"
                                      min={additional.minPrice}
                                      max={additional.maxPrice}
                                      value={selectedItem?.price || additional.minPrice}
                                      onChange={(e) => updateAdditionalPrice(additional.id, Number(e.target.value))}
                                      className="w-32 h-9"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                      (R$ {additional.minPrice.toLocaleString("pt-BR")} - R${" "}
                                      {additional.maxPrice.toLocaleString("pt-BR")})
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}

                    {selectedAdditionals.length > 0 && (
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            Total de Adicionais ({selectedAdditionals.length} item
                            {selectedAdditionals.length > 1 ? "s" : ""}):
                          </span>
                          <span className="font-semibold text-accent text-lg">
                            R$ {additionalsTotal.toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {calculatedPrice > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading">Ajustes de Preço</CardTitle>
                      <CardDescription>Configure descontos ou defina um valor final personalizado</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo de Desconto</Label>
                          <Select value={discountType} onValueChange={setDiscountType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sem desconto</SelectItem>
                              <SelectItem value="percentage">Desconto em %</SelectItem>
                              <SelectItem value="fixed">Desconto fixo (R$)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {discountType !== "none" && (
                          <div className="space-y-2">
                            <Label>Valor do Desconto {discountType === "percentage" ? "(%)" : "(R$)"}</Label>
                            <Input
                              type="number"
                              min="0"
                              max={discountType === "percentage" ? "100" : undefined}
                              value={discountValue}
                              onChange={(e) => setDiscountValue(Number(e.target.value))}
                              placeholder={discountType === "percentage" ? "10" : "500"}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id="custom-final-price"
                          checked={customFinalPrice}
                          onCheckedChange={toggleCustomFinalPrice}
                        />
                        <Label htmlFor="custom-final-price" className="text-sm font-medium">
                          Definir valor final personalizado
                        </Label>
                      </div>

                      {customFinalPrice && (
                        <div className="space-y-2">
                          <Label>Valor Final Personalizado (R$)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={finalPrice}
                            onChange={(e) => setFinalPrice(Number(e.target.value))}
                            placeholder="Digite o valor final"
                          />
                        </div>
                      )}

                      <Button onClick={calculatePrice} variant="outline" className="w-full bg-transparent">
                        Recalcular com Ajustes
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Results */}
                {calculatedPrice > 0 && (
                  <Card className="border-accent/20 bg-accent/5">
                    <CardHeader>
                      <CardTitle className="font-heading flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        Resultado do Orçamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium">Valor Total Estimado:</span>
                          <span className="text-3xl font-heading font-black text-accent">
                            R$ {displayPrice.toLocaleString("pt-BR")}
                          </span>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                          <div className="text-sm text-muted-foreground mb-2">Detalhamento:</div>
                          <div className="space-y-1">
                            {pricingType === "hourly" ? (
                              <div className="flex justify-between">
                                <span>
                                  Valor base ({estimatedHours}h × R$ {hourlyRate} × {developerCount} dev
                                  {developerCount > 1 ? "s" : ""}):
                                </span>
                                <span>
                                  R${" "}
                                  {(
                                    hourlyRate *
                                    estimatedHours *
                                    developerCount *
                                    (urgency === "urgente" ? 1.3 : urgency === "muito-urgente" ? 1.6 : 1)
                                  ).toLocaleString("pt-BR")}
                                </span>
                              </div>
                            ) : (
                              selectedService &&
                              complexity && (
                                <div className="flex justify-between">
                                  <span>Valor base do serviço:</span>
                                  <span>
                                    R${" "}
                                    {(
                                      servicePricing[selectedService].basePrice *
                                      servicePricing[selectedService].complexity[complexity] *
                                      (urgency === "urgente" ? 1.3 : urgency === "muito-urgente" ? 1.6 : 1)
                                    ).toLocaleString("pt-BR")}
                                  </span>
                                </div>
                              )
                            )}
                            {additionalsTotal > 0 && (
                              <div className="flex justify-between">
                                <span>
                                  Adicionais ({selectedAdditionals.length} item
                                  {selectedAdditionals.length > 1 ? "s" : ""}):
                                </span>
                                <span>R$ {additionalsTotal.toLocaleString("pt-BR")}</span>
                              </div>
                            )}
                            {urgency !== "normal" && (
                              <div className="flex justify-between text-accent">
                                <span>Multiplicador de urgência:</span>
                                <span>+{urgency === "urgente" ? "30%" : "60%"}</span>
                              </div>
                            )}
                            {discountType !== "none" && discountValue > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>
                                  Desconto {discountType === "percentage" ? `(${discountValue}%)` : "aplicado"}:
                                </span>
                                <span>
                                  -
                                  {discountType === "percentage"
                                    ? `R$ ${((calculatedPrice + additionalsTotal) * (discountValue / 100)).toLocaleString("pt-BR")}`
                                    : `R$ ${discountValue.toLocaleString("pt-BR")}`}
                                </span>
                              </div>
                            )}
                            {customFinalPrice && (
                              <div className="flex justify-between text-blue-600 font-medium">
                                <span>Valor final personalizado:</span>
                                <span>R$ {finalPrice.toLocaleString("pt-BR")}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">30% Entrada</div>
                            <div className="font-semibold">R$ {(displayPrice * 0.3).toLocaleString("pt-BR")}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">40% MVP</div>
                            <div className="font-semibold">R$ {(displayPrice * 0.4).toLocaleString("pt-BR")}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">30% Final</div>
                            <div className="font-semibold">R$ {(displayPrice * 0.3).toLocaleString("pt-BR")}</div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            className="flex-1"
                            onClick={generateProposal}
                            disabled={
                              !projectName ||
                              (pricingType === "fixed" && (!selectedService || !complexity)) ||
                              (pricingType === "hourly" && (!estimatedHours || !hourlyRate || !developerCount))
                            }
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Gerar Proposta
                          </Button>
                          <Button variant="outline">Salvar Orçamento</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Tabela de Preços Base</CardTitle>
                    <CardDescription>Valores de referência para orçamentos rápidos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(servicePricing).map(([key, service]) => (
                      <div key={key} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{service.name}</h4>
                          <Badge variant="secondary">R$ {service.basePrice.toLocaleString("pt-BR")}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Modelo Híbrido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div>
                        <div className="font-medium text-sm">Preço Fixo</div>
                        <div className="text-xs text-muted-foreground">Projetos com escopo fechado</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                      <div>
                        <div className="font-medium text-sm">Valor/Hora</div>
                        <div className="text-xs text-muted-foreground">Manutenção e melhorias</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Valores por Hora</CardTitle>
                    <CardDescription>Referência para trabalhos por hora</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Desenvolvedor Júnior</span>
                      <Badge variant="outline">R$ 80-120/h</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Desenvolvedor Pleno</span>
                      <Badge variant="outline">R$ 120-180/h</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Desenvolvedor Sênior</span>
                      <Badge variant="outline">R$ 180-250/h</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="catalog">
            <ServiceCatalogManager services={servicePricing} onServicesUpdate={setServicePricing} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentTracker />
          </TabsContent>

          <TabsContent value="clients">
            <ClientManager />
          </TabsContent>

          <TabsContent value="proposals">
            <div className="space-y-6">
              <div>
                <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Gerenciar Propostas</h2>
                <p className="text-muted-foreground">Visualize e gerencie todas as propostas criadas</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Propostas Recentes</CardTitle>
                  <CardDescription>Lista de propostas geradas pelo sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading font-semibold text-lg mb-2">Nenhuma proposta encontrada</h3>
                    <p className="text-muted-foreground mb-4">Use a calculadora para gerar sua primeira proposta</p>
                    <Button onClick={() => setActiveTab("calculator")}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Ir para Calculadora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Proposal Generator Dialog */}
      {showProposalGenerator && (
        <ProposalGenerator proposalData={proposalData} onClose={() => setShowProposalGenerator(false)} />
      )}
    </div>
  )
}
