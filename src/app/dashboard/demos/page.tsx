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
  Calendar, 
  Video,
  MapPin,
  Clock,
  User,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

interface Demo {
  id: string
  opportunity: string
  company: string
  contact: string
  mode: "online" | "in_person"
  location?: string
  meetLink?: string
  scheduledStart: string
  scheduledEnd: string
  status: "scheduled" | "rescheduled" | "no_show" | "done" | "cancelled"
  notes?: string
  createdBy: string
  createdAt: string
}

const mockDemos: Demo[] = [
  {
    id: "1",
    opportunity: "Freight Management System",
    company: "ABC Logistics",
    contact: "John Smith",
    mode: "online",
    meetLink: "https://meet.google.com/abc-def-ghi",
    scheduledStart: "2024-01-20T14:00:00Z",
    scheduledEnd: "2024-01-20T15:00:00Z",
    status: "scheduled",
    notes: "Focus on document automation features",
    createdBy: "John Doe",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    opportunity: "Document Automation",
    company: "XYZ Exports",
    contact: "Sarah Johnson",
    mode: "in_person",
    location: "XYZ Exports Office, Mumbai",
    scheduledStart: "2024-01-21T10:00:00Z",
    scheduledEnd: "2024-01-21T11:30:00Z",
    status: "scheduled",
    notes: "Bring laptop and demo materials",
    createdBy: "Jane Smith",
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    opportunity: "Tracking Integration",
    company: "Global Shipping Co.",
    contact: "Mike Wilson",
    mode: "online",
    meetLink: "https://meet.google.com/xyz-abc-def",
    scheduledStart: "2024-01-18T16:00:00Z",
    scheduledEnd: "2024-01-18T17:00:00Z",
    status: "done",
    notes: "Demo completed successfully. Client interested in API integration.",
    createdBy: "Mike Johnson",
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    opportunity: "Custom Workflow",
    company: "DEF Freight",
    contact: "Lisa Brown",
    mode: "online",
    meetLink: "https://meet.google.com/def-ghi-jkl",
    scheduledStart: "2024-01-19T11:00:00Z",
    scheduledEnd: "2024-01-19T12:00:00Z",
    status: "no_show",
    notes: "Client didn't show up. Follow up required.",
    createdBy: "Sarah Wilson",
    createdAt: "2024-01-12"
  }
]

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  rescheduled: "bg-yellow-100 text-yellow-800",
  no_show: "bg-red-100 text-red-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800"
}

const statusIcons = {
  scheduled: <Clock className="h-4 w-4" />,
  rescheduled: <AlertCircle className="h-4 w-4" />,
  no_show: <XCircle className="h-4 w-4" />,
  done: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />
}

export default function DemosPage() {
  const [demos, setDemos] = useState<Demo[]>(mockDemos)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showScheduler, setShowScheduler] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedMode, setSelectedMode] = useState<"online" | "in_person">("online")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")

  const filteredDemos = demos.filter(demo => {
    const matchesSearch = 
      demo.opportunity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.contact.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || demo.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status: string) => {
    return demos.filter(demo => demo.status === status).length
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getUpcomingDemos = () => {
    const now = new Date()
    return demos.filter(demo => {
      const demoDate = new Date(demo.scheduledStart)
      return demoDate > now && demo.status === "scheduled"
    }).sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime())
  }

  const DemoScheduler = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Demo</CardTitle>
          <CardDescription>Book a demo with your prospect</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opportunity">Opportunity</Label>
              <Input id="opportunity" placeholder="Select opportunity..." />
            </div>
            <div>
              <Label htmlFor="contact">Contact Person</Label>
              <Input id="contact" placeholder="Contact name..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                type="time" 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Demo Mode</Label>
            <div className="flex space-x-4 mt-2">
              <Button
                variant={selectedMode === "online" ? "default" : "outline"}
                onClick={() => setSelectedMode("online")}
              >
                <Video className="h-4 w-4 mr-2" />
                Online
              </Button>
              <Button
                variant={selectedMode === "in_person" ? "default" : "outline"}
                onClick={() => setSelectedMode("in_person")}
              >
                <MapPin className="h-4 w-4 mr-2" />
                In Person
              </Button>
            </div>
          </div>

          {selectedMode === "in_person" && (
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="Enter meeting location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              placeholder="Add any special notes or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex space-x-3">
            <Button onClick={() => setShowScheduler(false)}>
              Schedule Demo
            </Button>
            <Button variant="outline" onClick={() => setShowScheduler(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (showScheduler) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Demo</h1>
            <p className="text-gray-600">Book a demo with your prospect</p>
          </div>
          <Button variant="outline" onClick={() => setShowScheduler(false)}>
            Back to Demos
          </Button>
        </div>
        <DemoScheduler />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demos</h1>
          <p className="text-gray-600">Schedule and manage your product demonstrations</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowScheduler(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Demo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Demos</p>
                <p className="text-2xl font-bold text-gray-900">{demos.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount("scheduled")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount("done")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No Shows</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount("no_show")}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Show Rate</p>
                <p className="text-2xl font-bold text-gray-900">75%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Demos */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Demos</CardTitle>
          <CardDescription>Your next scheduled demonstrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getUpcomingDemos().slice(0, 3).map((demo) => {
              const { date, time } = formatDateTime(demo.scheduledStart)
              return (
                <div key={demo.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {demo.mode === "online" ? (
                        <Video className="h-5 w-5 text-blue-600" />
                      ) : (
                        <MapPin className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {demo.opportunity}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{demo.company}</span>
                        <span>•</span>
                        <span>{demo.contact}</span>
                        <span>•</span>
                        <span>{date} at {time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={statusColors[demo.status as keyof typeof statusColors]}>
                      <div className="flex items-center space-x-1">
                        {statusIcons[demo.status as keyof typeof statusIcons]}
                        <span>{demo.status}</span>
                      </div>
                    </Badge>
                    
                    <div className="flex space-x-1">
                      {demo.mode === "online" && demo.meetLink && (
                        <Button variant="outline" size="sm">
                          Join Meeting
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search demos by opportunity, company, or contact..."
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
                <option value="scheduled">Scheduled</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="done">Completed</option>
                <option value="no_show">No Show</option>
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

      {/* All Demos */}
      <Card>
        <CardHeader>
          <CardTitle>All Demos</CardTitle>
          <CardDescription>
            {filteredDemos.length} of {demos.length} demos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDemos.map((demo) => {
              const { date, time } = formatDateTime(demo.scheduledStart)
              return (
                <div key={demo.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {demo.mode === "online" ? (
                        <Video className="h-5 w-5 text-blue-600" />
                      ) : (
                        <MapPin className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {demo.opportunity}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{demo.company}</span>
                        <span>•</span>
                        <span>{demo.contact}</span>
                        <span>•</span>
                        <span>{date} at {time}</span>
                        {demo.mode === "in_person" && demo.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {demo.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm text-gray-500">
                      <div>Created by {demo.createdBy}</div>
                      <div>{date}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={statusColors[demo.status as keyof typeof statusColors]}>
                        <div className="flex items-center space-x-1">
                          {statusIcons[demo.status as keyof typeof statusIcons]}
                          <span>{demo.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-1">
                      {demo.mode === "online" && demo.meetLink && (
                        <Button variant="outline" size="sm">
                          Join
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
