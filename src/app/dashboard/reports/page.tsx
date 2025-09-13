"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Phone, 
  MessageSquare,
  Calendar,
  FileText,
  DollarSign,
  Target,
  Download,
  Filter,
  BarChart3
} from "lucide-react"

interface ReportData {
  period: string
  leads: number
  opportunities: number
  demos: number
  quotes: number
  revenue: number
  conversionRate: number
}

const mockReportData: ReportData[] = [
  {
    period: "2024-01",
    leads: 45,
    opportunities: 24,
    demos: 18,
    quotes: 12,
    revenue: 2400000,
    conversionRate: 26.7
  },
  {
    period: "2024-02",
    leads: 52,
    opportunities: 28,
    demos: 22,
    quotes: 15,
    revenue: 3200000,
    conversionRate: 28.8
  },
  {
    period: "2024-03",
    leads: 38,
    opportunities: 20,
    demos: 16,
    quotes: 10,
    revenue: 1800000,
    conversionRate: 26.3
  }
]

const mockTeamPerformance = [
  {
    name: "John Doe",
    role: "AE",
    leads: 12,
    opportunities: 8,
    demos: 6,
    quotes: 4,
    revenue: 1200000,
    conversionRate: 33.3
  },
  {
    name: "Jane Smith",
    role: "SDR",
    leads: 18,
    opportunities: 10,
    demos: 8,
    quotes: 5,
    revenue: 800000,
    conversionRate: 27.8
  },
  {
    name: "Mike Johnson",
    role: "AE",
    leads: 15,
    opportunities: 9,
    demos: 7,
    quotes: 6,
    revenue: 1500000,
    conversionRate: 40.0
  }
]

const mockSourcePerformance = [
  { source: "Website", leads: 25, opportunities: 12, conversionRate: 48.0 },
  { source: "Referral", leads: 18, opportunities: 10, conversionRate: 55.6 },
  { source: "Campaign", leads: 22, opportunities: 8, conversionRate: 36.4 },
  { source: "Cold Outreach", leads: 15, opportunities: 6, conversionRate: 40.0 }
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedDateRange, setSelectedDateRange] = useState("2024-01")

  const currentData = mockReportData.find(d => d.period === selectedDateRange) || mockReportData[0]
  const previousData = mockReportData[mockReportData.indexOf(currentData) - 1]

  const calculateChange = (current: number, previous?: number) => {
    if (!previous) return 0
    return ((current - previous) / previous) * 100
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your sales performance and team metrics</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Button
                variant={selectedPeriod === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("weekly")}
              >
                Weekly
              </Button>
              <Button
                variant={selectedPeriod === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={selectedPeriod === "quarterly" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("quarterly")}
              >
                Quarterly
              </Button>
            </div>
            
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="2024-01">January 2024</option>
              <option value="2024-02">February 2024</option>
              <option value="2024-03">March 2024</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{currentData.leads}</p>
                <div className="flex items-center text-xs">
                  {calculateChange(currentData.leads, previousData?.leads) >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={calculateChange(currentData.leads, previousData?.leads) >= 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(calculateChange(currentData.leads, previousData?.leads)).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{currentData.opportunities}</p>
                <div className="flex items-center text-xs">
                  {calculateChange(currentData.opportunities, previousData?.opportunities) >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={calculateChange(currentData.opportunities, previousData?.opportunities) >= 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(calculateChange(currentData.opportunities, previousData?.opportunities)).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Target className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Demos</p>
                <p className="text-2xl font-bold text-gray-900">{currentData.demos}</p>
                <div className="flex items-center text-xs">
                  {calculateChange(currentData.demos, previousData?.demos) >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={calculateChange(currentData.demos, previousData?.demos) >= 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(calculateChange(currentData.demos, previousData?.demos)).toFixed(1)}%
                  </span>
                </div>
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
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.revenue)}</p>
                <div className="flex items-center text-xs">
                  {calculateChange(currentData.revenue, previousData?.revenue) >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={calculateChange(currentData.revenue, previousData?.revenue) >= 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(calculateChange(currentData.revenue, previousData?.revenue)).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Track leads through your sales process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">Leads</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{currentData.leads}</div>
                  <div className="text-sm text-gray-500">100%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">Opportunities</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{currentData.opportunities}</div>
                  <div className="text-sm text-gray-500">
                    {((currentData.opportunities / currentData.leads) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">Demos</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{currentData.demos}</div>
                  <div className="text-sm text-gray-500">
                    {((currentData.demos / currentData.leads) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">Quotes</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{currentData.quotes}</div>
                  <div className="text-sm text-gray-500">
                    {((currentData.quotes / currentData.leads) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Individual performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTeamPerformance.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{formatCurrency(member.revenue)}</div>
                    <div className="text-xs text-gray-500">{member.conversionRate}% conversion</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Source Performance</CardTitle>
          <CardDescription>Track which sources generate the best leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSourcePerformance.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{source.source}</h3>
                    <div className="text-sm text-gray-500">
                      {source.leads} leads • {source.opportunities} opportunities
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {source.conversionRate}%
                    </div>
                    <div className="text-sm text-gray-500">conversion rate</div>
                  </div>
                  
                  <Badge 
                    className={
                      source.conversionRate >= 50 
                        ? "bg-green-100 text-green-800" 
                        : source.conversionRate >= 40 
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {source.conversionRate >= 50 ? "Excellent" : source.conversionRate >= 40 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
