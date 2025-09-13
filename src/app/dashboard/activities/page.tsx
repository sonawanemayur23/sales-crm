"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  MessageSquare,
  Mail,
  Calendar,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"

interface Activity {
  id: string
  type: "call" | "email" | "whatsapp" | "meeting" | "note" | "task"
  direction: "in" | "out"
  subject: string
  description: string
  relatedTo: string
  user: string
  timestamp: string
  status: "completed" | "pending" | "cancelled"
  duration?: string
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "call",
    direction: "out",
    subject: "Initial discovery call",
    description: "Discussed current freight management challenges and requirements",
    relatedTo: "ABC Logistics - Freight Management System",
    user: "John Doe",
    timestamp: "2 hours ago",
    status: "completed",
    duration: "15 minutes"
  },
  {
    id: "2",
    type: "email",
    direction: "out",
    subject: "Product brochure and case studies",
    description: "Sent comprehensive product information and success stories",
    relatedTo: "XYZ Exports - Document Automation",
    user: "Jane Smith",
    timestamp: "4 hours ago",
    status: "completed"
  },
  {
    id: "3",
    type: "meeting",
    direction: "out",
    subject: "Demo scheduled",
    description: "Scheduled product demonstration for tomorrow at 2 PM",
    relatedTo: "Global Shipping Co. - Tracking Integration",
    user: "Mike Johnson",
    timestamp: "1 day ago",
    status: "pending"
  },
  {
    id: "4",
    type: "whatsapp",
    direction: "out",
    subject: "Follow-up message",
    description: "Sent WhatsApp message with meeting link and agenda",
    relatedTo: "DEF Freight - Custom Workflow",
    user: "Sarah Wilson",
    timestamp: "2 days ago",
    status: "completed"
  },
  {
    id: "5",
    type: "note",
    direction: "in",
    subject: "Client feedback",
    description: "Client mentioned budget approval process takes 2-3 weeks",
    relatedTo: "Premium Logistics - API Integration",
    user: "John Doe",
    timestamp: "3 days ago",
    status: "completed"
  }
]

const typeColors = {
  call: "bg-blue-100 text-blue-800",
  email: "bg-green-100 text-green-800",
  whatsapp: "bg-green-100 text-green-800",
  meeting: "bg-purple-100 text-purple-800",
  note: "bg-yellow-100 text-yellow-800",
  task: "bg-orange-100 text-orange-800"
}

const typeIcons = {
  call: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  meeting: <Calendar className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
  task: <Clock className="h-4 w-4" />
}

const statusIcons = {
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  cancelled: <XCircle className="h-4 w-4 text-red-500" />
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.relatedTo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === "all" || activity.type === typeFilter
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeCount = (type: string) => {
    return activities.filter(activity => activity.type === type).length
  }

  const getStatusCount = (status: string) => {
    return activities.filter(activity => activity.status === status).length
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">Track all your sales activities and interactions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Calls</p>
                <p className="text-2xl font-bold text-gray-900">{getTypeCount("call")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails</p>
                <p className="text-2xl font-bold text-gray-900">{getTypeCount("email")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Mail className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">WhatsApp</p>
                <p className="text-2xl font-bold text-gray-900">{getTypeCount("whatsapp")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{getTypeCount("meeting")}</p>
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount("completed")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
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
                  placeholder="Search activities by subject, description, or related opportunity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="call">Calls</option>
                <option value="email">Emails</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="meeting">Meetings</option>
                <option value="note">Notes</option>
                <option value="task">Tasks</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <CardDescription>
            {filteredActivities.length} of {activities.length} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {typeIcons[activity.type]}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{activity.subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {activity.user}
                        </span>
                        <span>•</span>
                        <span>{activity.timestamp}</span>
                        {activity.duration && (
                          <>
                            <span>•</span>
                            <span>{activity.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={typeColors[activity.type]}>
                        {activity.type}
                      </Badge>
                      {statusIcons[activity.status]}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    Related to: {activity.relatedTo}
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
