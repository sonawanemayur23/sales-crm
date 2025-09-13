import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads, accounts, contacts } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Return empty array for now to get dashboard working
    return NextResponse.json([])

  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newLead = await db.insert(leads).values({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      company: body.company,
      status: body.status || 'new',
      source: body.source || 'manual',
      score: body.score || 0,
      assignedTo: body.assignedTo,
      accountId: body.accountId,
      contactId: body.contactId,
      title: body.title,
      industry: body.industry,
      notes: body.notes,
    }).returning()

    return NextResponse.json(newLead[0], { status: 201 })

  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
