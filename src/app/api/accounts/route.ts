import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { accounts } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const accountsData = await db
      .select()
      .from(accounts)
      .orderBy(desc(accounts.updatedAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json(accountsData)

  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newAccount = await db.insert(accounts).values({
      name: body.name,
      industry: body.industry,
      website: body.website,
      size: body.size,
      billingAddress: body.billingAddress,
      shippingAddress: body.shippingAddress,
      gstin: body.gstin,
      pan: body.pan,
    }).returning()

    return NextResponse.json(newAccount[0], { status: 201 })

  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
