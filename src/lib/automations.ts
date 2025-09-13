// Automation and cadence management

export interface CadenceStep {
  id: string
  type: 'call' | 'email' | 'whatsapp' | 'task'
  delay: number // hours
  template: string
  subject?: string
  body: string
}

export interface Cadence {
  id: string
  name: string
  description: string
  steps: CadenceStep[]
  isActive: boolean
}

export const defaultCadences: Cadence[] = [
  {
    id: 'outreach',
    name: 'Outreach Cadence',
    description: 'Standard outreach sequence for new leads',
    isActive: true,
    steps: [
      {
        id: 'step1',
        type: 'call',
        delay: 0,
        template: 'initial_call',
        body: 'Initial discovery call to understand requirements'
      },
      {
        id: 'step2',
        type: 'whatsapp',
        delay: 2,
        template: 'intro_whatsapp',
        body: 'Hi {name}, Mayur from Freightnaut here. We help exporters with docs + tracking. Quick 15-min demo this week? Here are two slots: {slot1}, {slot2}. Reply 1/2 or suggest a time.'
      },
      {
        id: 'step3',
        type: 'email',
        delay: 24,
        template: 'follow_up_email',
        subject: 'Quick follow-up on your freight management needs',
        body: 'Hi {name}, I wanted to follow up on our conversation about your freight management challenges. Here\'s a case study that might be relevant: {case_study_link}. Would you like to schedule a quick demo?'
      },
      {
        id: 'step4',
        type: 'call',
        delay: 48,
        template: 'follow_up_call',
        body: 'Follow-up call to address any questions and schedule demo'
      }
    ]
  },
  {
    id: 'post_demo',
    name: 'Post-Demo Follow-up',
    description: 'Follow-up sequence after demo completion',
    isActive: true,
    steps: [
      {
        id: 'step1',
        type: 'email',
        delay: 1,
        template: 'demo_recap',
        subject: 'Demo Recap & Next Steps',
        body: 'Thank you for the demo today! Here\'s a summary of what we discussed: {demo_summary}. Next steps: {next_steps}. I\'ll send over the quote shortly.'
      },
      {
        id: 'step2',
        type: 'task',
        delay: 2,
        template: 'create_quote',
        body: 'Create and send quote based on demo discussion'
      },
      {
        id: 'step3',
        type: 'whatsapp',
        delay: 24,
        template: 'quote_follow_up',
        body: 'Hi {name}, I\'ve sent over the quote. Any questions? I\'m available to discuss pricing or customize the plan for your needs.'
      }
    ]
  }
]

export interface AutomationRule {
  id: string
  name: string
  trigger: {
    type: 'stage_change' | 'time_based' | 'activity_based'
    condition: string
  }
  action: {
    type: 'send_email' | 'send_whatsapp' | 'create_task' | 'assign_user'
    template: string
    delay?: number
  }
  isActive: boolean
}

export const defaultAutomations: AutomationRule[] = [
  {
    id: 'new_lead_welcome',
    name: 'New Lead Welcome',
    trigger: {
      type: 'stage_change',
      condition: 'lead.status = "new"'
    },
    action: {
      type: 'send_email',
      template: 'welcome_email',
      delay: 0
    },
    isActive: true
  },
  {
    id: 'demo_no_show',
    name: 'Demo No-Show Follow-up',
    trigger: {
      type: 'activity_based',
      condition: 'demo.status = "no_show"'
    },
    action: {
      type: 'send_whatsapp',
      template: 'demo_reschedule',
      delay: 2
    },
    isActive: true
  },
  {
    id: 'quote_reminder',
    name: 'Quote Reminder',
    trigger: {
      type: 'time_based',
      condition: 'quote.created_at > 48 hours AND quote.status = "sent"'
    },
    action: {
      type: 'send_whatsapp',
      template: 'quote_reminder',
      delay: 0
    },
    isActive: true
  }
]

export function getCadenceById(id: string): Cadence | undefined {
  return defaultCadences.find(cadence => cadence.id === id)
}

export function getActiveCadences(): Cadence[] {
  return defaultCadences.filter(cadence => cadence.isActive)
}

export function getAutomationById(id: string): AutomationRule | undefined {
  return defaultAutomations.find(automation => automation.id === id)
}

export function getActiveAutomations(): AutomationRule[] {
  return defaultAutomations.filter(automation => automation.isActive)
}
