"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  MoreHorizontal, 
  Phone, 
  MessageSquare, 
  Calendar,
  FileText,
  User,
  Building
} from "lucide-react"

interface Opportunity {
  id: string
  title: string
  company: string
  contact: string
  value: string
  stage: string
  lastActivity: string
  owner: string
}

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Freight Management System",
    company: "ABC Logistics",
    contact: "John Smith",
    value: "₹2,40,000",
    stage: "new",
    lastActivity: "2 hours ago",
    owner: "John Doe"
  },
  {
    id: "2", 
    title: "Document Automation",
    company: "XYZ Exports",
    contact: "Sarah Johnson",
    value: "₹1,80,000",
    stage: "contacted",
    lastActivity: "1 day ago",
    owner: "Jane Smith"
  },
  {
    id: "3",
    title: "Tracking Integration",
    company: "Global Shipping Co.",
    contact: "Mike Wilson",
    value: "₹3,20,000",
    stage: "qualified",
    lastActivity: "3 hours ago",
    owner: "Mike Johnson"
  },
  {
    id: "4",
    title: "Custom Workflow",
    company: "DEF Freight",
    contact: "Lisa Brown",
    value: "₹1,50,000",
    stage: "demo_scheduled",
    lastActivity: "5 hours ago",
    owner: "Sarah Wilson"
  },
  {
    id: "5",
    title: "API Integration",
    company: "Premium Logistics",
    contact: "David Lee",
    value: "₹2,80,000",
    stage: "quote_sent",
    lastActivity: "1 day ago",
    owner: "John Doe"
  }
]

const stages = [
  { key: "new", name: "New", color: "bg-gray-100" },
  { key: "contacted", name: "Contacted", color: "bg-blue-100" },
  { key: "qualified", name: "Qualified", color: "bg-yellow-100" },
  { key: "demo_scheduled", name: "Demo Scheduled", color: "bg-purple-100" },
  { key: "demo_done", name: "Demo Done", color: "bg-indigo-100" },
  { key: "quote_sent", name: "Quote Sent", color: "bg-green-100" },
  { key: "negotiation", name: "Negotiation", color: "bg-orange-100" },
  { key: "approval_pending", name: "Approval Pending", color: "bg-red-100" },
  { key: "won", name: "Won", color: "bg-emerald-100" },
  { key: "lost", name: "Lost", color: "bg-gray-100" }
]

export default function PipelinePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities)

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter(opp => opp.stage === stage)
  }

  const getStageValue = (stage: string) => {
    const stageOpportunities = getOpportunitiesByStage(stage)
    return stageOpportunities.reduce((total, opp) => {
      const value = parseInt(opp.value.replace(/[₹,]/g, ''))
      return total + value
    }, 0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600">Manage your opportunities across all stages</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Opportunity
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Import Leads
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(opportunities.reduce((total, opp) => {
                    const value = parseInt(opp.value.replace(/[₹,]/g, ''))
                    return total + value
                  }, 0))}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">24%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {stages.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.key)
          const stageValue = getStageValue(stage.key)
          
          return (
            <div key={stage.key} className="flex-shrink-0 w-80">
              <div className={`${stage.color} rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <Badge variant="secondary">{stageOpportunities.length}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {formatCurrency(stageValue)}
                </p>
              </div>
              
              <div className="space-y-3">
                {stageOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {opportunity.title}
                        </h4>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="h-3 w-3 mr-2" />
                          {opportunity.company}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-3 w-3 mr-2" />
                          {opportunity.contact}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">
                            {opportunity.value}
                          </span>
                          <span className="text-xs text-gray-500">
                            {opportunity.lastActivity}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs text-gray-500">
                            {opportunity.owner}
                          </span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Calendar className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Opportunity
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
