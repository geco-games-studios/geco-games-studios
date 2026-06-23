import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"
import { responseFromBackend } from "@/lib/server-proxy"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) return NextResponse.json({ message: "Missing authorization header." }, { status: 401 })

    const backendResponse = await fetch(getApiUrl("auth/services/"), {
      headers: { Authorization: authHeader },
    })

    return responseFromBackend(backendResponse)
  } catch (error) {
    console.error("Services proxy error:", error)
    return NextResponse.json({ message: "Could not load GECO services." }, { status: 500 })
  }
}
