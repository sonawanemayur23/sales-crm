import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { opportunities, accounts, contacts } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { withErrorHandler, handleDatabaseError, AppError } from '@/lib/utils/error-handler'

async function getOpportunities(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('stage')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Validate parameters
    if (limit < 1 || limit > 100) {
      throw new AppError('Limit must be between 1 and 100', 400, 'INVALID_LIMIT')
    }
    if (offset < 0) {
      throw new AppError('Offset must be non-negative', 400, 'INVALID_OFFSET')
    }

    // Simple query with correct field names from schema
    let query = db
      .select({
        id: opportunities.opportunityId,
        title: opportunities.opportunityId, // Using ID as title for now since there's no title field
        stage: opportunities.opportunityStatus,
        value: opportunities.amountEstimate,
        probability: opportunities.probabilityPct,
        expectedCloseDate: opportunities.expectedCloseDate,
        createdAt: opportunities.createdAt,
        updatedAt: opportunities.updatedAt,
        accountId: opportunities.accountId,
        contactId: opportunities.primaryContactId,
        assignedTo: opportunities.ownerUserId,
      })
      .from(opportunities)
      .orderBy(desc(opportunities.updatedAt))
      .limit(limit)
      .offset(offset)

    if (stage) {
      query = query.where(eq(opportunities.opportunityStatus, stage))
    }

    const opportunitiesData = await query

    return NextResponse.json(opportunitiesData || [])

  } catch (error) {
    console.error('Error fetching opportunities:', error)
    
    // Handle database errors specifically
    if (error instanceof Error && (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('relation') ||
      error.message.includes('Cannot convert undefined or null to object')
    )) {
      handleDatabaseError(error)
    }
    
    throw error
  }
}

export const GET = withErrorHandler(getOpportunities)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newOpportunity = await db.insert(opportunities).values({
      title: body.title,
      stage: body.stage || 'new',
      value: body.value || 0,
      probability: body.probability || 0,
      expectedCloseDate: body.expectedCloseDate ? new Date(body.expectedCloseDate) : null,
      accountId: body.accountId,
      contactId: body.contactId,
      assignedTo: body.assignedTo,
      description: body.description,
      source: body.source || 'manual',
      priority: body.priority || 'medium',
    }).returning()

    return NextResponse.json(newOpportunity[0], { status: 201 })

  } catch (error) {
    console.error('Error creating opportunity:', error)
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    )
  }
}
