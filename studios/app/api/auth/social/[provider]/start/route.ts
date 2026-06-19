import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"

const PROVIDERS = new Set(["google", "facebook", "apple"])

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params
  if (!PROVIDERS.has(provider)) {
    return NextResponse.json({ message: "Unsupported social login provider." }, { status: 400 })
  }

  const callbackUrl = new URL("/auth/callback", request.url)
  callbackUrl.searchParams.set("provider", provider)

  const backendUrl = new URL(getApiUrl(`auth/${provider}/start/`))
  backendUrl.searchParams.set("redirect_uri", callbackUrl.toString())

  const next = request.nextUrl.searchParams.get("next")
  if (next) backendUrl.searchParams.set("next", next)

  return NextResponse.redirect(backendUrl)
}
