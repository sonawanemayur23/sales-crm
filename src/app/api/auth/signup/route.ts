import { NextRequest, NextResponse } from 'next/server'
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users, accounts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, companyName } = await request.json()

    if (!email || !password || !firstName || !lastName || !companyName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await db.insert(users).values({
      email,
      firstName,
      lastName,
      passwordHash: hashedPassword,
      isActive: false, // Will be activated after email verification
    }).returning()

    // Create company account
    const newAccount = await db.insert(accounts).values({
      name: companyName,
      industry: 'Technology', // Default industry
      size: 'startup',
    }).returning()

    // Generate email verification token
    const verificationToken = jwt.sign(
      { userId: newUser[0].userId, email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    )

    // Send verification email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@freightnaut.com',
        to: email,
        subject: 'Welcome to Freightnaut CRM - Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to Freightnaut CRM!</h1>
            <p>Hi ${firstName},</p>
            <p>Thank you for signing up for Freightnaut CRM. To complete your registration, please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">
              ${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}
            </p>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>The Freightnaut Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail the signup if email fails
    }

    return NextResponse.json({
      message: 'User created successfully. Please check your email to verify your account.',
      userId: newUser[0].userId,
      accountId: newAccount[0].accountId,
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
