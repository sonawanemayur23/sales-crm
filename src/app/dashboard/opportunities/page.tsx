"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner, LoadingTable } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/ui/error-boundary"
import { HelpText, HelpCard, QuickActions } from "@/components/ui/help-text"
import { 
  Plus, 
  Phone, 
  MessageSquare, 
  Mail,
  Calendar,
  FileText,
  User,
  Building,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Download,
  Search,
  Filter
} from "lucide-react"
import { useOpportunities, useUpdateOpportunity, useDeleteOpportunity } from "@/lib/hooks/useOpportunities"
import { integrationsApi } from "@/lib/services/api"
import { Opportunity } from "@/lib/types"
import { downloadQuotePDF } from "@/lib/utils/pdf-generator"

const STAGE_COLORS = {
  new: "bg-blue-100 text-blue-800",
  qualified: "bg-yellow-100 text-yellow-800", 
  proposal: "bg-purple-100 text-purple-800",
  negotiation: "bg-orange-100 text-orange-800",
  closed_won: "bg-green-100 text-green-800",
  closed_lost: "bg-red-100 text-red-800"
}

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
}

export default function OpportunitiesPage() {
  const [selectedStage, setSelectedStage] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Data fetching
  const { 
    data: opportunities, 
    isLoading: opportunitiesLoading, 
    error: opportunitiesError,
    refetch 
  } = useOpportunities({ 
    stage: selectedStage || undefined,
    limit: 50 
  })

  const updateOpportunity = useUpdateOpportunity()
  const deleteOpportunity = useDeleteOpportunity()

  // Filter opportunities based on search term
  const filteredOpportunities = opportunities?.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.account?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.contact?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.contact?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Integration handlers
  const handleCall = async (phone: string) => {
    setIsLoading(true)
    try {
      await integrationsApi.makeCall(phone)
      // Show success message
    } catch (error) {
      console.error('Call failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWhatsApp = async (phone: string, name: string) => {
    setIsLoading(true)
    try {
      await integrationsApi.sendWhatsApp(phone, `Hi ${name}, following up on your opportunity.`)
    } catch (error) {
      console.error('WhatsApp failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmail = async (email: string, name: string, title: string) => {
    setIsLoading(true)
    try {
      await integrationsApi.sendEmail(
        email, 
        `Follow-up on ${title}`, 
        `Hi ${name}, I wanted to follow up on our discussion about ${title}.`
      )
    } catch (error) {
      console.error('Email failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleDemo = async (title: string) => {
    setIsLoading(true)
    try {
      const startTime = new Date()
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour later
      await integrationsApi.createCalendarEvent(
        `Demo: ${title}`,
        startTime.toISOString(),
        endTime.toISOString()
      )
    } catch (error) {
      console.error('Calendar event failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateQuote = (opportunity: Opportunity) => {
    // Mock quote data for PDF generation
    const mockQuote = {
      id: `Q-${opportunity.id}`,
      title: `Quote for ${opportunity.title}`,
      description: opportunity.description || '',
      status: 'draft' as const,
      subtotal: opportunity.value * 0.9,
      taxRate: 10,
      taxAmount: opportunity.value * 0.09,
      discountRate: 10,
      discountAmount: opportunity.value * 0.1,
      total: opportunity.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockItems = [
      {
        id: '1',
        quoteId: mockQuote.id,
        name: 'Freightnaut Pro Plan',
        description: 'Complete freight management solution',
        quantity: 1,
        unitPrice: mockQuote.subtotal,
        total: mockQuote.subtotal,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]

    const companyInfo = {
      name: 'Freightnaut',
      address: '123 Business St, City, State 12345',
      phone: '+1 (555) 123-4567'
    }

    downloadQuotePDF(mockQuote, mockItems, companyInfo)
  }

  const handleStageChange = async (opportunityId: string, newStage: string) => {
    try {
      await updateOpportunity.mutateAsync({
        id: opportunityId,
        data: { stage: newStage as any }
      })
    } catch (error) {
      console.error('Failed to update stage:', error)
    }
  }

  const handleDelete = async (opportunityId: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await deleteOpportunity.mutateAsync(opportunityId)
      } catch (error) {
        console.error('Failed to delete opportunity:', error)
      }
    }
  }

  if (opportunitiesError) {
    return (
      <div className="p-6">
        <ErrorMessage 
          error={opportunitiesError} 
          onRetry={() => refetch()} 
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-gray-600">Manage your sales pipeline and track deal progress</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Opportunity
        </Button>
      </div>

      {/* Help Card */}
      <HelpCard
        title="Getting Started with Opportunities"
        content="Create opportunities to track potential deals. Use the pipeline view to move deals through stages. Click on any opportunity to see details and take actions like calling, emailing, or creating quotes."
        type="tip"
      />

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities, companies, contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Stages</option>
                <option value="new">New</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Opportunities ({filteredOpportunities.length})</span>
                <HelpText content="Click on any opportunity to view details and take actions. Use the stage badges to quickly see deal progress." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opportunitiesLoading ? (
                <LoadingTable rows={5} columns={4} />
              ) : (
                <div className="space-y-4">
                  {filteredOpportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedOpportunity(opportunity)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
                            <Badge className={STAGE_COLORS[opportunity.stage]}>
                              {opportunity.stage.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge className={PRIORITY_COLORS[opportunity.priority]}>
                              {opportunity.priority.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            {opportunity.account && (
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {opportunity.account.name}
                              </div>
                            )}
                            {opportunity.contact && (
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {opportunity.contact.firstName} {opportunity.contact.lastName}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              ${opportunity.value.toLocaleString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCall(opportunity.contact?.phone || '')
                              }}
                              disabled={isLoading}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleWhatsApp(
                                  opportunity.contact?.phone || '',
                                  opportunity.contact?.firstName || 'there'
                                )
                              }}
                              disabled={isLoading}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEmail(
                                  opportunity.contact?.email || '',
                                  opportunity.contact?.firstName || 'there',
                                  opportunity.title
                                )
                              }}
                              disabled={isLoading}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleGenerateQuote(opportunity)
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Quote
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedOpportunity(opportunity)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle edit
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(opportunity.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredOpportunities.length === 0 && !opportunitiesLoading && (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || selectedStage 
                          ? 'Try adjusting your search or filters'
                          : 'Get started by creating your first opportunity'
                        }
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Opportunity
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActions
                actions={[
                  {
                    label: "Create New Opportunity",
                    description: "Add a new deal to your pipeline",
                    onClick: () => console.log('Create opportunity'),
                    icon: <Plus className="h-4 w-4" />
                  },
                  {
                    label: "Schedule Demo",
                    description: "Book a demo with a prospect",
                    onClick: () => console.log('Schedule demo'),
                    icon: <Calendar className="h-4 w-4" />
                  },
                  {
                    label: "Generate Quote",
                    description: "Create a professional quote",
                    onClick: () => console.log('Generate quote'),
                    icon: <FileText className="h-4 w-4" />
                  },
                  {
                    label: "View Reports",
                    description: "Check your sales performance",
                    onClick: () => console.log('View reports'),
                    icon: <Eye className="h-4 w-4" />
                  }
                ]}
              />
            </CardContent>
          </Card>

          {/* Pipeline Stages */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(STAGE_COLORS).map(([stage, colorClass]) => {
                  const count = filteredOpportunities.filter(opp => opp.stage === stage).length
                  const value = filteredOpportunities
                    .filter(opp => opp.stage === stage)
                    .reduce((sum, opp) => sum + opp.value, 0)
                  
                  return (
                    <div key={stage} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colorClass.split(' ')[0]}`} />
                        <span className="text-sm font-medium capitalize">
                          {stage.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{count}</div>
                        <div className="text-xs text-gray-500">${value.toLocaleString()}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedOpportunity.title}</h2>
                  <p className="text-gray-600">{selectedOpportunity.description}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedOpportunity(null)}
                >
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Stage</label>
                  <select
                    value={selectedOpportunity.stage}
                    onChange={(e) => handleStageChange(selectedOpportunity.id, e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed_won">Closed Won</option>
                    <option value="closed_lost">Closed Lost</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Value</label>
                  <input
                    type="number"
                    value={selectedOpportunity.value}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleCall(selectedOpportunity.contact?.phone || '')}
                  disabled={isLoading}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleWhatsApp(
                    selectedOpportunity.contact?.phone || '',
                    selectedOpportunity.contact?.firstName || 'there'
                  )}
                  disabled={isLoading}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleEmail(
                    selectedOpportunity.contact?.email || '',
                    selectedOpportunity.contact?.firstName || 'there',
                    selectedOpportunity.title
                  )}
                  disabled={isLoading}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleScheduleDemo(selectedOpportunity.title)}
                  disabled={isLoading}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Demo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleGenerateQuote(selectedOpportunity)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Quote PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}