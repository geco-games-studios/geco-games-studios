import nodemailer from "nodemailer"
import { NextResponse } from "next/server"
import { z } from "zod"

const applicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  learningPath: z.string().min(1),
  isDeveloper: z.enum(["yes", "no"]),
  languages: z.array(z.string()),
  rolledOutProject: z.enum(["yes", "no"]),
  unity: z.enum(["yes", "no"]),
  unreal: z.enum(["yes", "no"]),
})

const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const smtpFrom = process.env.SMTP_FROM ?? smtpUser
const smtpTo = process.env.SMTP_TO ?? smtpUser
const smtpSecure = process.env.SMTP_SECURE === "true"

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpTo) {
  console.warn("Missing SMTP environment variables for academy application route.")
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
    data = applicationSchema.parse(body)
  } catch (error) {
    return NextResponse.json({ message: "Invalid application payload.", error }, { status: 400 })
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
      <h2>New Academy Application</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Learning Path:</strong> ${data.learningPath}</p>
      <p><strong>Software developer:</strong> ${data.isDeveloper}</p>
      <p><strong>Languages:</strong> ${data.languages.join(", ") || "None"}</p>
      <p><strong>Rolled out a full project:</strong> ${data.rolledOutProject}</p>
      <p><strong>Unity 3D:</strong> ${data.unity}</p>
      <p><strong>Unreal:</strong> ${data.unreal}</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      subject: `New Academy Application from ${data.firstName} ${data.lastName}`,
      text: `New academy application from ${data.firstName} ${data.lastName}. Email: ${data.email}. Phone: ${data.phone}. Learning path: ${data.learningPath}. Developer: ${data.isDeveloper}. Languages: ${data.languages.join(", ")}. Rolled out project: ${data.rolledOutProject}. Unity: ${data.unity}. Unreal: ${data.unreal}.`,
      html,
    })

    return NextResponse.json({ message: "Application delivered successfully." }, { status: 200 })
  } catch (error) {
    console.error("Failed to send academy application email", error)
    return NextResponse.json({ message: "Failed to send application email.", error }, { status: 500 })
  }
}
