import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MessageSquare, Calendar, FileText, BarChart3, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Freightnaut CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Streamline Your Sales Process
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            From lead capture to quote approval, manage your entire sales pipeline with our comprehensive CRM solution built for Freightnaut.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button size="lg" className="w-full" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/login">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/signup">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Phone className="h-8 w-8 text-blue-600" />
                <CardTitle>Click-to-Call</CardTitle>
                <CardDescription>
                  Make calls directly from the CRM with automatic call logging and disposition tracking.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/signup">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-green-600" />
                <CardTitle>WhatsApp Integration</CardTitle>
                <CardDescription>
                  Send templated messages, track delivery status, and maintain conversation history.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/signup">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-8 w-8 text-purple-600" />
                <CardTitle>Demo Scheduling</CardTitle>
                <CardDescription>
                  Schedule online and in-person demos with Google Calendar integration and automated reminders.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/signup">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 text-orange-600" />
                <CardTitle>Quote Builder</CardTitle>
                <CardDescription>
                  Create professional quotes with dynamic pricing, discounts, and approval workflows.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/signup">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-red-600" />
                <CardTitle>Advanced Reporting</CardTitle>
                <CardDescription>
                  Track KPIs, conversion rates, and pipeline performance with customizable reports.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/signup">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-indigo-600" />
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Role-based access control, team assignments, and collaborative workflows.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Pipeline Preview */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Visual Pipeline Management
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { name: "New", count: 12, color: "bg-gray-100" },
                { name: "Contacted", count: 8, color: "bg-blue-100" },
                { name: "Qualified", count: 15, color: "bg-yellow-100" },
                { name: "Demo Scheduled", count: 6, color: "bg-purple-100" },
                { name: "Quote Sent", count: 4, color: "bg-green-100" },
              ].map((stage) => (
                <div key={stage.name} className="text-center">
                  <div className={`${stage.color} rounded-lg p-4 mb-2`}>
                    <div className="text-2xl font-bold text-gray-900">{stage.count}</div>
                    <div className="text-sm text-gray-600">{stage.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">
              © 2024 Freightnaut CRM. Built for modern sales teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}