import { HelpCircle, Info, Lightbulb, AlertCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { cn } from '@/lib/utils'

interface HelpTextProps {
  content: string
  type?: 'info' | 'tip' | 'warning' | 'error'
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const iconMap = {
  info: Info,
  tip: Lightbulb,
  warning: AlertCircle,
  error: AlertCircle,
}

const colorMap = {
  info: 'text-blue-500',
  tip: 'text-yellow-500',
  warning: 'text-orange-500',
  error: 'text-red-500',
}

export function HelpText({ 
  content, 
  type = 'info', 
  className, 
  side = 'top' 
}: HelpTextProps) {
  const Icon = iconMap[type]
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={cn("inline-flex items-center", className)}>
            <Icon className={cn("h-4 w-4", colorMap[type])} />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface HelpCardProps {
  title: string
  content: string
  type?: 'info' | 'tip' | 'warning' | 'error'
  className?: string
}

export function HelpCard({ title, content, type = 'info', className }: HelpCardProps) {
  const Icon = iconMap[type]
  
  return (
    <div className={cn(
      "p-4 rounded-lg border-l-4",
      {
        'bg-blue-50 border-blue-400': type === 'info',
        'bg-yellow-50 border-yellow-400': type === 'tip',
        'bg-orange-50 border-orange-400': type === 'warning',
        'bg-red-50 border-red-400': type === 'error',
      },
      className
    )}>
      <div className="flex items-start">
        <Icon className={cn("h-5 w-5 mt-0.5 mr-3", colorMap[type])} />
        <div>
          <h4 className="font-medium text-sm text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{content}</p>
        </div>
      </div>
    </div>
  )
}

interface QuickActionsProps {
  actions: Array<{
    label: string
    description: string
    onClick: () => void
    icon?: React.ReactNode
  }>
  className?: string
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-medium text-gray-900">Quick Actions</h4>
      <div className="space-y-1">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              {action.icon && <span className="mr-2">{action.icon}</span>}
              <div>
                <div className="text-sm font-medium text-gray-900">{action.label}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
