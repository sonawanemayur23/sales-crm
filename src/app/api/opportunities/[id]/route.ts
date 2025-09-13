import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { opportunities, accounts, contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const opportunity = await db
      .select({
        id: opportunities.id,
        title: opportunities.title,
        stage: opportunities.stage,
        value: opportunities.value,
        probability: opportunities.probability,
        expectedCloseDate: opportunities.expectedCloseDate,
        createdAt: opportunities.createdAt,
        updatedAt: opportunities.updatedAt,
        accountId: opportunities.accountId,
        contactId: opportunities.contactId,
        assignedTo: opportunities.assignedTo,
        description: opportunities.description,
        source: opportunities.source,
        priority: opportunities.priority,
        account: {
          id: accounts.id,
          name: accounts.name,
          industry: accounts.industry,
          website: accounts.website,
          phone: accounts.phone,
          email: accounts.email,
        },
        contact: {
          id: contacts.id,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          email: contacts.email,
          phone: contacts.phone,
          title: contacts.title,
        }
      })
      .from(opportunities)
      .leftJoin(accounts, eq(opportunities.accountId, accounts.id))
      .leftJoin(contacts, eq(opportunities.contactId, contacts.id))
      .where(eq(opportunities.id, params.id))
      .limit(1)

    if (opportunity.length === 0) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(opportunity[0])

  } catch (error) {
    console.error('Error fetching opportunity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updatedOpportunity = await db
      .update(opportunities)
      .set({
        title: body.title,
        stage: body.stage,
        value: body.value,
        probability: body.probability,
        expectedCloseDate: body.expectedCloseDate ? new Date(body.expectedCloseDate) : null,
        accountId: body.accountId,
        contactId: body.contactId,
        assignedTo: body.assignedTo,
        description: body.description,
        source: body.source,
        priority: body.priority,
        updatedAt: new Date(),
      })
      .where(eq(opportunities.id, params.id))
      .returning()

    if (updatedOpportunity.length === 0) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedOpportunity[0])

  } catch (error) {
    console.error('Error updating opportunity:', error)
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedOpportunity = await db
      .delete(opportunities)
      .where(eq(opportunities.id, params.id))
      .returning()

    if (deletedOpportunity.length === 0) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Opportunity deleted successfully' })

  } catch (error) {
    console.error('Error deleting opportunity:', error)
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    )
  }
}
