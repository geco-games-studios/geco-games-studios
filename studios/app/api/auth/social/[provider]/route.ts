import { NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"
import { responseFromBackend } from "@/lib/server-proxy"

const PROVIDERS = new Set(["google", "facebook", "apple"])

export async function POST(request: Request, context: { params: Promise<{ provider: string }> }) {
  try {
    const { provider } = await context.params
    if (!PROVIDERS.has(provider)) {
      return NextResponse.json({ message: "Unsupported social login provider." }, { status: 400 })
    }

    const body = await request.json()
    const backendResponse = await fetch(getApiUrl(`auth/${provider}/`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    return responseFromBackend(backendResponse)
  } catch (error) {
    console.error("Social auth proxy error:", error)
    return NextResponse.json({ message: "Social sign in is not available right now." }, { status: 500 })
  }
}
