import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"
import { responseFromBackend } from "@/lib/server-proxy"

export async function POST(request: NextRequest, context: { params: Promise<{ serviceId: string }> }) {
  try {
    const { serviceId } = await context.params
    const authHeader = request.headers.get("authorization")
    if (!authHeader) return NextResponse.json({ message: "Missing authorization header." }, { status: 401 })

    const body = await request.text()
    const backendResponse = await fetch(getApiUrl(`auth/services/${serviceId}/select/`), {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: body || "{}",
    })

    return responseFromBackend(backendResponse)
  } catch (error) {
    console.error("Service select proxy error:", error)
    return NextResponse.json({ message: "Could not switch to this GECO service." }, { status: 500 })
  }
}
