import { NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"
import { responseFromBackend } from "@/lib/server-proxy"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || "").trim()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 })
    }

    const payload = JSON.stringify({ email })
    const requestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }

    const primaryResponse = await fetch(getApiUrl("forgot-password/"), requestInit)
    if (primaryResponse.status !== 404) return responseFromBackend(primaryResponse)

    const fallbackResponse = await fetch(getApiUrl("password-reset/"), requestInit)
    return responseFromBackend(fallbackResponse)
  } catch (error) {
    console.error("Forgot password proxy error:", error)
    return NextResponse.json(
      { message: "An error occurred while requesting a password reset." },
      { status: 500 }
    )
  }
}
