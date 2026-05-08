import nodemailer from "nodemailer"
import { NextResponse } from "next/server"
import { z } from "zod"

const submissionSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  gameTitle: z.string().min(1),
  gameGenre: z.string().min(1),
  platforms: z.array(z.string()).min(1),
  releaseStage: z.string().min(1),
  engine: z.string().min(1),
  website: z.string().min(1),
  description: z.string().min(10),
  published: z.enum(["yes", "no"]),
})

const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const smtpFrom = process.env.SMTP_FROM ?? smtpUser
const smtpTo = process.env.SMTP_TO ?? smtpUser
const smtpSecure = process.env.SMTP_SECURE === "true"

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpTo) {
  console.warn("Missing SMTP environment variables for developer submission route.")
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
    data = submissionSchema.parse(body)
  } catch (error) {
    return NextResponse.json({ message: "Invalid submission payload.", error }, { status: 400 })
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

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2>New Developer Game Submission</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Game Title:</strong> ${data.gameTitle}</p>
      <p><strong>Genre:</strong> ${data.gameGenre}</p>
      <p><strong>Platforms:</strong> ${data.platforms.join(", ")}</p>
      <p><strong>Release Stage:</strong> ${data.releaseStage}</p>
      <p><strong>Engine:</strong> ${data.engine}</p>
      <p><strong>Website:</strong> ${data.website}</p>
      <p><strong>Published:</strong> ${data.published}</p>
      <p><strong>Description:</strong></p>
      <p>${data.description}</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      subject: `New Game Submission from ${data.firstName} ${data.lastName}`,
      text: `New developer game submission from ${data.firstName} ${data.lastName}. Email: ${data.email}. Phone: ${data.phone}. Game: ${data.gameTitle}. Genre: ${data.gameGenre}. Platforms: ${data.platforms.join(", ")}. Release stage: ${data.releaseStage}. Engine: ${data.engine}. Website: ${data.website}. Published: ${data.published}. Description: ${data.description}`,
      html,
    })

    return NextResponse.json({ message: "Game submission delivered successfully." }, { status: 200 })
  } catch (error) {
    console.error("Failed to send developer submission email", error)
    return NextResponse.json({ message: "Failed to send submission email.", error }, { status: 500 })
  }
}
