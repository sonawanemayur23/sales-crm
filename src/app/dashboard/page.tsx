"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  FileText, 
  Phone, 
  MessageSquare,
  DollarSign,
  Target,
  AlertCircle,
  Plus
} from "lucide-react"
import { useOpportunities } from "@/lib/hooks/useOpportunities"
import { useLeads } from "@/lib/hooks/useLeads"
import { useAccounts } from "@/lib/hooks/useAccounts"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ErrorBoundary } from "@/components/error-boundary"
import { useErrorHandler } from "@/lib/hooks/use-error-handler"
import { useEffect } from "react"

function DashboardContent() {
  const { data: opportunities, isLoading: opportunitiesLoading, error: opportunitiesError } = useOpportunities()
  const { data: leads, isLoading: leadsLoading, error: leadsError } = useLeads()
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts()
  const { handleError } = useErrorHandler()

  // Handle errors with user-friendly messages
  useEffect(() => {
    if (opportunitiesError) {
      handleError(opportunitiesError, 'loading opportunities')
    }
    if (leadsError) {
      handleError(leadsError, 'loading leads')
    }
    if (accountsError) {
      handleError(accountsError, 'loading accounts')
    }
  }, [opportunitiesError, leadsError, accountsError, handleError])

  // Calculate stats from real data
  const totalOpportunities = opportunities?.length || 0
  const totalLeads = leads?.length || 0
  const totalAccounts = accounts?.length || 0
  const totalRevenue = opportunities?.reduce((sum, opp) => sum + (opp.value || 0), 0) || 0

  const stats = [
    {
      name: "Total Opportunities",
      value: totalOpportunities.toString(),
      change: "+12%",
      changeType: "positive",
      icon: Target,
    },
    {
      name: "This Month's Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+8%",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      name: "Total Leads",
      value: totalLeads.toString(),
      change: "+23%",
      changeType: "positive",
      icon: Users,
    },
    {
      name: "Total Accounts",
      value: totalAccounts.toString(),
      change: "+4%",
      changeType: "positive",
      icon: Calendar,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "call",
      description: "Called ABC Logistics about their shipping needs",
      time: "2 hours ago",
      user: "John Doe",
    },
    {
      id: 2,
      type: "demo",
      description: "Demo scheduled with XYZ Exports for tomorrow",
      time: "4 hours ago",
      user: "Jane Smith",
    },
    {
      id: 3,
      type: "quote",
      description: "Quote sent to Global Shipping Co.",
      time: "6 hours ago",
      user: "Mike Johnson",
    },
    {
      id: 4,
      type: "whatsapp",
      description: "WhatsApp message sent to DEF Freight",
      time: "8 hours ago",
      user: "Sarah Wilson",
    },
  ]

  const pipelineStages = [
    { name: "New", count: 5, value: "₹1,20,000" },
    { name: "Contacted", count: 8, value: "₹2,40,000" },
    { name: "Qualified", count: 6, value: "₹1,80,000" },
    { name: "Demo Scheduled", count: 3, value: "₹90,000" },
    { name: "Quote Sent", count: 2, value: "₹60,000" },
  ]

  // Show loading state
  if (opportunitiesLoading || leadsLoading || accountsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Loading your sales data...</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show error state
  if (opportunitiesError || leadsError || accountsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">There was an error loading your data.</p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load dashboard data. Please check your connection and try again.
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500">Data unavailable</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your sales pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview</CardTitle>
          <CardDescription>Current opportunities by stage</CardDescription>
        </CardHeader>
        <CardContent>
          {opportunities && opportunities.length > 0 ? (
            <div className="space-y-4">
              {pipelineStages.map((stage) => (
                <div key={stage.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-900">{stage.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{stage.count}</div>
                    <div className="text-xs text-gray-500">{stage.value}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities yet</h3>
              <p className="text-gray-500 mb-4">Start by creating your first opportunity to track your sales pipeline.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Opportunity
              </Button>
            </div>
          )}
          <div className="mt-4 pt-4 border-t">
            <Button className="w-full">View Full Pipeline</Button>
          </div>
        </CardContent>
      </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions across your team</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === "call" && <Phone className="h-4 w-4 text-blue-500" />}
                      {activity.type === "demo" && <Calendar className="h-4 w-4 text-purple-500" />}
                      {activity.type === "quote" && <FileText className="h-4 w-4 text-green-500" />}
                      {activity.type === "whatsapp" && <MessageSquare className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activities</h3>
                <p className="text-gray-500 mb-4">Start making calls, scheduling demos, or creating quotes to see activity here.</p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Activity
                </Button>
              </div>
            )}
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">View All Activities</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Phone className="h-6 w-6" />
              <span>Make a Call</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span>Send WhatsApp</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule Demo</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6" />
              <span>Create Quote</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  )
}
