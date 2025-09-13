"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Eye,
  Send,
  Download,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"

interface Quote {
  id: string
  opportunity: string
  company: string
  contact: string
  value: string
  status: string
  validUntil: string
  createdBy: string
  createdAt: string
  lastViewed?: string
}

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  minUsers: number
  maxUsers?: number
}

interface Feature {
  id: string
  name: string
  description: string
  isAddon: boolean
  unitType: string
  monthlyPrice: number
  yearlyPrice: number
}

const mockQuotes: Quote[] = [
  {
    id: "1",
    opportunity: "Freight Management System",
    company: "ABC Logistics",
    contact: "John Smith",
    value: "₹2,40,000",
    status: "sent",
    validUntil: "2024-02-15",
    createdBy: "John Doe",
    createdAt: "2024-01-15",
    lastViewed: "2 hours ago"
  },
  {
    id: "2",
    opportunity: "Document Automation",
    company: "XYZ Exports",
    contact: "Sarah Johnson",
    value: "₹1,80,000",
    status: "viewed",
    validUntil: "2024-02-20",
    createdBy: "Jane Smith",
    createdAt: "2024-01-14",
    lastViewed: "1 day ago"
  },
  {
    id: "3",
    opportunity: "Tracking Integration",
    company: "Global Shipping Co.",
    contact: "Mike Wilson",
    value: "₹3,20,000",
    status: "approved",
    validUntil: "2024-02-25",
    createdBy: "Mike Johnson",
    createdAt: "2024-01-13",
    lastViewed: "3 hours ago"
  }
]

const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Freightnaut Starter",
    description: "Perfect for small businesses getting started",
    monthlyPrice: 5000,
    yearlyPrice: 50000,
    minUsers: 1,
    maxUsers: 5
  },
  {
    id: "2",
    name: "Freightnaut Professional",
    description: "Advanced features for growing businesses",
    monthlyPrice: 10000,
    yearlyPrice: 100000,
    minUsers: 5,
    maxUsers: 25
  },
  {
    id: "3",
    name: "Freightnaut Enterprise",
    description: "Complete solution for large enterprises",
    monthlyPrice: 20000,
    yearlyPrice: 200000,
    minUsers: 25
  }
]

const mockFeatures: Feature[] = [
  {
    id: "1",
    name: "AI Document Assistant",
    description: "Automated document processing and validation",
    isAddon: true,
    unitType: "seat",
    monthlyPrice: 500,
    yearlyPrice: 5000
  },
  {
    id: "2",
    name: "Advanced Tracking",
    description: "Real-time shipment tracking and notifications",
    isAddon: true,
    unitType: "flat",
    monthlyPrice: 2000,
    yearlyPrice: 20000
  },
  {
    id: "3",
    name: "API Integration",
    description: "Connect with your existing systems",
    isAddon: true,
    unitType: "flat",
    monthlyPrice: 5000,
    yearlyPrice: 50000
  }
]

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  viewed: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800"
}

const statusIcons = {
  draft: <Clock className="h-4 w-4" />,
  sent: <Send className="h-4 w-4" />,
  viewed: <Eye className="h-4 w-4" />,
  approved: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  expired: <Clock className="h-4 w-4" />
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([])
  const [numUsers, setNumUsers] = useState(1)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.opportunity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.contact.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status: string) => {
    return quotes.filter(quote => quote.status === status).length
  }

  const calculateTotal = () => {
    let total = 0
    
    if (selectedPlan) {
      const planPrice = billingCycle === "yearly" ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice
      total += planPrice
    }
    
    selectedFeatures.forEach(feature => {
      const featurePrice = billingCycle === "yearly" ? feature.yearlyPrice : feature.monthlyPrice
      if (feature.unitType === "seat") {
        total += featurePrice * numUsers
      } else {
        total += featurePrice
      }
    })
    
    return total
  }

  const QuoteBuilder = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quote</CardTitle>
          <CardDescription>Build a professional quote for your opportunity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Select Plan */}
          <div>
            <h3 className="text-lg font-medium mb-4">1. Select Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockPlans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer hover:border-blue-300 ${
                    selectedPlan?.id === plan.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{billingCycle === "yearly" ? plan.yearlyPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {plan.minUsers}-{plan.maxUsers || "∞"} users
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Step 2: Configure Users */}
          {selectedPlan && (
            <div>
              <h3 className="text-lg font-medium mb-4">2. Configure Users</h3>
              <div className="flex items-center space-x-4">
                <Label htmlFor="numUsers">Number of Users:</Label>
                <Input
                  id="numUsers"
                  type="number"
                  min={selectedPlan.minUsers}
                  max={selectedPlan.maxUsers}
                  value={numUsers}
                  onChange={(e) => setNumUsers(parseInt(e.target.value))}
                  className="w-20"
                />
                <div className="flex space-x-2">
                  <Button
                    variant={billingCycle === "monthly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBillingCycle("monthly")}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={billingCycle === "yearly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBillingCycle("yearly")}
                  >
                    Yearly
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Add Features */}
          {selectedPlan && (
            <div>
              <h3 className="text-lg font-medium mb-4">3. Add Features</h3>
              <div className="space-y-3">
                {mockFeatures.map((feature) => (
                  <Card 
                    key={feature.id}
                    className={`cursor-pointer hover:border-blue-300 ${
                      selectedFeatures.some(f => f.id === feature.id) ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      if (selectedFeatures.some(f => f.id === feature.id)) {
                        setSelectedFeatures(selectedFeatures.filter(f => f.id !== feature.id))
                      } else {
                        setSelectedFeatures([...selectedFeatures, feature])
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{feature.name}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ₹{billingCycle === "yearly" ? feature.yearlyPrice.toLocaleString() : feature.monthlyPrice.toLocaleString()}
                            <span className="text-sm font-normal text-gray-500">
                              /{billingCycle === "yearly" ? "year" : "month"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {feature.unitType === "seat" ? `per user` : "flat rate"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review & Generate */}
          {selectedPlan && (
            <div>
              <h3 className="text-lg font-medium mb-4">4. Review & Generate</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{selectedPlan.name} ({numUsers} users)</span>
                      <span>₹{billingCycle === "yearly" ? (selectedPlan.yearlyPrice * numUsers).toLocaleString() : (selectedPlan.monthlyPrice * numUsers).toLocaleString()}</span>
                    </div>
                    {selectedFeatures.map((feature) => (
                      <div key={feature.id} className="flex justify-between text-sm text-gray-600">
                        <span>{feature.name}</span>
                        <span>₹{billingCycle === "yearly" ? (feature.yearlyPrice * (feature.unitType === "seat" ? numUsers : 1)).toLocaleString() : (feature.monthlyPrice * (feature.unitType === "seat" ? numUsers : 1)).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex space-x-3 mt-4">
                <Button onClick={() => setShowQuoteBuilder(false)}>
                  Generate Quote
                </Button>
                <Button variant="outline" onClick={() => setShowQuoteBuilder(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  if (showQuoteBuilder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quote Builder</h1>
            <p className="text-gray-600">Create professional quotes for your opportunities</p>
          </div>
          <Button variant="outline" onClick={() => setShowQuoteBuilder(false)}>
            Back to Quotes
          </Button>
        </div>
        <QuoteBuilder />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600">Manage and track your sales quotes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowQuoteBuilder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quote
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount("sent")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Send className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Viewed</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount("viewed")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Eye className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount("approved")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount("rejected")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search quotes by opportunity, company, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="viewed">Viewed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
          <CardDescription>
            {filteredQuotes.length} of {quotes.length} quotes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {quote.opportunity}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{quote.company}</span>
                      <span>•</span>
                      <span>{quote.contact}</span>
                      <span>•</span>
                      <span>Valid until: {quote.validUntil}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {quote.value}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created by {quote.createdBy}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={statusColors[quote.status as keyof typeof statusColors]}>
                      <div className="flex items-center space-x-1">
                        {statusIcons[quote.status as keyof typeof statusIcons]}
                        <span>{quote.status}</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
