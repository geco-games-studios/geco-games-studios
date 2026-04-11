// @ts-ignore
import nodemailer from "nodemailer"
import { NextResponse } from "next/server"
import { z } from "zod"

const subscriptionSchema = z.object({
  email: z.string().email(),
  preferences: z.array(z.string()).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const smtpFrom = process.env.SMTP_FROM ?? smtpUser
const smtpTo = process.env.SMTP_TO ?? smtpUser
const smtpSecure = process.env.SMTP_SECURE === "true"

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpTo) {
  console.warn("Missing SMTP environment variables for newsletter subscription route.")
}

export async function POST(request: Request) {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpTo) {
    return NextResponse.json(
      { message: "SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_TO." },
      { status: 500 }
    )
  }

  let data
  try {
    const body = await request.json()
    data = subscriptionSchema.parse(body)
  } catch (error) {
    return NextResponse.json({ message: "Invalid subscription payload.", error }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  const preferencesText = data.preferences && data.preferences.length > 0
    ? `\n\nNewsletter Preferences:\n${data.preferences.join(", ")}`
    : ""

  const nameText = data.firstName || data.lastName
    ? `\n\nName: ${[data.firstName, data.lastName].filter(Boolean).join(" ")}`
    : ""

  const mailOptions = {
    from: smtpFrom,
    to: smtpTo,
    subject: "New Newsletter Subscription - Geco Games Studios",
    text: `New newsletter subscription received:

Email: ${data.email}${nameText}${preferencesText}

--
Geco Games Studios Newsletter System`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ message: "Subscription successful! We'll be in touch soon." })
  } catch (error) {
    console.error("Failed to send newsletter subscription email:", error)
    return NextResponse.json({ message: "Failed to process subscription. Please try again." }, { status: 500 })
  }
}