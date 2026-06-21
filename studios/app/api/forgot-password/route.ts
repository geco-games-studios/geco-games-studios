import { NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"

function getPublicOrigin(request: Request) {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL
  if (configuredOrigin) return configuredOrigin.replace(/\/+$/, "")

  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto")
  if (forwardedHost) return `${forwardedProto || "https"}://${forwardedHost}`

  const origin = new URL(request.url).origin
  if (!origin.includes("localhost") && !origin.includes("127.0.0.1")) return origin

  return "https://gecogames.com"
}

async function parseBackendResponse(response: Response) {
  const contentType = response.headers.get("content-type") || ""
  const rawBody = await response.text()
  if (!contentType.includes("application/json")) {
    return rawBody ? { message: rawBody } : {}
  }

  try {
    return rawBody ? JSON.parse(rawBody) : {}
  } catch {
    return { message: rawBody || "Invalid response from password reset service." }
  }
}

async function sendResetEmail(email: string, resetUrl: string) {
  const nodemailer = await import("nodemailer")
  const port = Number(process.env.SMTP_PORT || 587)
  const secureMode = String(process.env.SMTP_SECURE || "").toLowerCase()
  const secure = port === 465 || secureMode === "ssl"

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure && (port === 587 || secureMode === "true" || secureMode === "starttls"),
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "GECO Games <hello@gecogames.com>",
    to: email,
    subject: "Reset your GECO Games password",
    text: [
      "We received a request to reset your GECO Games password.",
      "",
      `Reset your password here: ${resetUrl}`,
      "",
      "This link expires in 24 hours. If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>Reset your GECO Games password</h2>
        <p>We received a request to reset your GECO Games password.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #0891b2; color: white; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
            Reset Password
          </a>
        </p>
        <p>This link expires in 24 hours. If you did not request this, you can ignore this email.</p>
      </div>
    `,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || "").trim()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 })
    }

    const origin = getPublicOrigin(request)
    const payload = JSON.stringify({
      email,
      reset_url_base: `${origin}/reset-password`,
      expiration_hours: 24,
    })
    const requestInit: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }

    const backendResponse = await fetch(getApiUrl("password-reset/request/"), requestInit)
    const data = await parseBackendResponse(backendResponse)

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status })
    }

    if (!data.reset_url) {
      return NextResponse.json(
        { message: "Password reset service did not return a reset link." },
        { status: 502 }
      )
    }

    await sendResetEmail(email, String(data.reset_url))

    return NextResponse.json({
      message: "Password reset link sent. Please check your email.",
    })
  } catch (error) {
    console.error("Forgot password proxy error:", error)
    return NextResponse.json(
      { message: "An error occurred while requesting a password reset." },
      { status: 500 }
    )
  }
}
