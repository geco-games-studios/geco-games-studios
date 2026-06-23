import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"

const PROVIDERS = new Set(["google", "facebook", "apple"])
const FALLBACK_PUBLIC_ORIGIN = "https://gecogames.com"

function getPublicOrigin(request: NextRequest) {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL
  if (configuredOrigin) return configuredOrigin.replace(/\/+$/, "")

  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto")
  if (forwardedHost) return `${forwardedProto || "https"}://${forwardedHost}`

  const origin = request.nextUrl.origin
  if (!origin.includes("localhost") && !origin.includes("127.0.0.1")) return origin

  return FALLBACK_PUBLIC_ORIGIN
}

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params
  if (!PROVIDERS.has(provider)) {
    return NextResponse.json({ message: "Unsupported social login provider." }, { status: 400 })
  }

  const callbackUrl = new URL("/auth/callback", getPublicOrigin(request))
  callbackUrl.searchParams.set("provider", provider)

  const backendUrl = new URL(getApiUrl(`auth/${provider}/start/`))
  backendUrl.searchParams.set("redirect_uri", callbackUrl.toString())

  const next = request.nextUrl.searchParams.get("next")
  if (next) backendUrl.searchParams.set("next", next)

  return NextResponse.redirect(backendUrl)
}
