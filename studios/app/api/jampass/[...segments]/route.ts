import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test")
  .replace(/(^['"]|['"]$)/g, "")
  .replace(/\/+$|^\s+|\s+$/g, "")

async function proxyRequest(request: NextRequest, params: Promise<{ segments: string[] }> | { segments: string[] }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
    }

    const resolvedParams = await params
    const endpoint = (resolvedParams?.segments || []).filter(Boolean).join("/")
    const backendUrl = `${API_BASE_URL}/jampass/${endpoint}/`
    const requestBody = request.method !== "GET" ? await request.text() : undefined

    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: requestBody,
    })

    const responseText = await backendResponse.text()
    const contentType = backendResponse.headers.get("content-type") || "application/json"

    return new Response(responseText, {
      status: backendResponse.status,
      headers: { "content-type": contentType },
    })
  } catch (error) {
    console.error("Error proxying Jampass request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ segments: string[] }> }) {
  return proxyRequest(request, params)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ segments: string[] }> }) {
  return proxyRequest(request, params)
}
