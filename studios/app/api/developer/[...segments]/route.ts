import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test").replace(/(^['"]|['"]$)/g, "").trim()

async function proxyRequest(request: NextRequest, params: Promise<{ segments: string[] }> | any) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
    }

    const resolvedParams = await params
    const segments = resolvedParams?.segments || []
    const endpoint = segments.filter(Boolean).join("/")
    const backendUrl = `${API_BASE_URL}/developer/${endpoint}/`

    console.debug(`Proxying ${request.method} ${backendUrl}`)

    const requestBody = request.method !== "GET" ? await request.text() : undefined
    // Log headers with Authorization redacted
    const headersObj: Record<string, string | null> = {}
    for (const [k, v] of request.headers.entries()) {
      headersObj[k] = k.toLowerCase() === 'authorization' ? (v ? 'REDACTED' : null) : v
    }
    console.debug('Proxy request headers:', headersObj)
    if (requestBody) {
      console.debug('Proxy request body (truncated 2kb):', requestBody.slice(0, 2048))
    }

    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: requestBody,
    })

    const respText = await backendResponse.text()
    const contentType = backendResponse.headers.get("content-type") || "text/plain"

    if (!backendResponse.ok) {
      console.error(`Backend ${backendUrl} responded ${backendResponse.status}:`, respText)
      return new Response(respText || JSON.stringify({ error: `Backend request failed with status ${backendResponse.status}` }), {
        status: backendResponse.status,
        headers: { "content-type": contentType },
      })
    }

    // Forward success response body and content-type exactly as received
    return new Response(respText, { status: backendResponse.status, headers: { "content-type": contentType } })
  } catch (error) {
    console.error("Error proxying developer request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { segments: string[] } }) {
  return proxyRequest(request, params)
}

export async function POST(request: NextRequest, { params }: { params: { segments: string[] } }) {
  return proxyRequest(request, params)
}

export async function PATCH(request: NextRequest, { params }: { params: { segments: string[] } }) {
  return proxyRequest(request, params)
}

export async function PUT(request: NextRequest, { params }: { params: { segments: string[] } }) {
  return proxyRequest(request, params)
}

export async function DELETE(request: NextRequest, { params }: { params: { segments: string[] } }) {
  return proxyRequest(request, params)
}
