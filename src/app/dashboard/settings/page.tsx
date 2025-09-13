"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Users, 
  Shield, 
  Bell, 
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  Save,
  Plus,
  Trash2
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "users", name: "Users & Roles", icon: Users },
    { id: "integrations", name: "Integrations", icon: Phone },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "templates", name: "Templates", icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your CRM configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic CRM configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" defaultValue="Freightnaut" />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input id="timezone" defaultValue="Asia/Kolkata" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Input id="currency" defaultValue="INR" />
                    </div>
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Input id="dateFormat" defaultValue="DD/MM/YYYY" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Company Address</Label>
                    <Input id="address" defaultValue="123 Business Park, Mumbai, Maharashtra 400001" />
                  </div>

                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Users & Roles</CardTitle>
                      <CardDescription>Manage team members and permissions</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "John Doe", email: "john@freightnaut.com", role: "Admin", status: "Active" },
                      { name: "Jane Smith", email: "jane@freightnaut.com", role: "Sales Manager", status: "Active" },
                      { name: "Mike Johnson", email: "mike@freightnaut.com", role: "AE", status: "Active" },
                      { name: "Sarah Wilson", email: "sarah@freightnaut.com", role: "SDR", status: "Inactive" },
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-blue-100 text-blue-800">{user.role}</Badge>
                          <Badge className={user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {user.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Connect with external services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Telephony", description: "Exotel/Knowlarity for click-to-call", status: "Connected", icon: Phone },
                    { name: "WhatsApp", description: "Meta Cloud API for messaging", status: "Connected", icon: MessageSquare },
                    { name: "Email", description: "AWS SES for email campaigns", status: "Connected", icon: Mail },
                    { name: "Calendar", description: "Google Calendar for scheduling", status: "Not Connected", icon: Calendar },
                  ].map((integration, index) => {
                    const Icon = integration.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{integration.name}</h3>
                            <p className="text-sm text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Badge className={integration.status === "Connected" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {integration.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {integration.status === "Connected" ? "Configure" : "Connect"}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { name: "Email Notifications", description: "Receive updates via email" },
                      { name: "SMS Notifications", description: "Receive updates via SMS" },
                      { name: "WhatsApp Notifications", description: "Receive updates via WhatsApp" },
                      { name: "Slack Notifications", description: "Receive updates via Slack" },
                    ].map((notification, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{notification.name}</h3>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Message Templates</CardTitle>
                      <CardDescription>Manage your communication templates</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "WhatsApp Intro", type: "WhatsApp", category: "Outreach" },
                      { name: "Email Follow-up", type: "Email", category: "Follow-up" },
                      { name: "Call Script", type: "Call", category: "Script" },
                      { name: "Demo Invite", type: "Email", category: "Demo" },
                    ].map((template, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-blue-100 text-blue-800">{template.type}</Badge>
                            <Badge className="bg-gray-100 text-gray-800">{template.category}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
