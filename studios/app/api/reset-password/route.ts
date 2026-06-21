import { NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"

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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const resetToken = String(body.reset_token || body.token || "").trim()
    const newPassword = String(body.new_password || "").trim()
    const confirmPassword = String(body.confirm_password || "").trim()

    if (!resetToken) {
      return NextResponse.json({ message: "Reset token is required." }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Passwords don't match." }, { status: 400 })
    }

    const backendResponse = await fetch(getApiUrl("password-reset/complete/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reset_token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    })
    const data = await parseBackendResponse(backendResponse)

    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error("Reset password proxy error:", error)
    return NextResponse.json(
      { message: "An error occurred while resetting your password." },
      { status: 500 }
    )
  }
}
