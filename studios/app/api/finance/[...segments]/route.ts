import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test").replace(/(^['"]|['"]$)/g, "").trim()

type RouteContext = { params: Promise<{ segments: string[] }> }

async function proxyRequest(request: NextRequest, params: Promise<{ segments: string[] }> | any) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
    }

    const resolvedParams = await params
    const segments = resolvedParams?.segments || []
    const endpoint = segments.filter(Boolean).join("/")
    const backendUrl = `${API_BASE_URL}/${endpoint}/`

    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: request.method !== "GET" ? await request.text() : undefined,
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      return NextResponse.json(
        { error: `Backend request failed: ${backendResponse.status} ${errorText}` },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying finance request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  return proxyRequest(request, params)
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  return proxyRequest(request, params)
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return proxyRequest(request, params)
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return proxyRequest(request, params)
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return proxyRequest(request, params)
}
