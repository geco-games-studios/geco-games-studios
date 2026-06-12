import { NextRequest, NextResponse } from "next/server"

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1/test" //localhost_test
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test" //production_test

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ segments: string[] }> } | any
) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      )
    }

    // Get all 
    const segments = params?.segments || []
    const endpoint = segments.filter((s: string) => s).join("/") // Filter out empty segments
    console.log("Academy route - segments:", segments)
    console.log("Academy route - filtered endpoint:", endpoint)

    // Handle user endpoints differently - they go to /users/
    let backendUrl: string
    if (endpoint.startsWith('users/')) {
      backendUrl = `${API_BASE_URL}/${endpoint}/`
      console.log("User endpoint detected, backend URL:", backendUrl)
    } else {
      backendUrl = `${API_BASE_URL}/academy/${endpoint}/`
      console.log("Academy endpoint, backend URL:", backendUrl)
    }

    // Preserve query string (e.g. ?course=2 filters)
    backendUrl += request.nextUrl.search

    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: request.method !== "GET" ? await request.text() : undefined,
    })

    // Forward the backend response as-is, tolerating empty bodies (e.g. 204 on DELETE)
    const text = await response.text()
    if (!text) {
      return new NextResponse(null, { status: response.status })
    }
    try {
      return NextResponse.json(JSON.parse(text), { status: response.status })
    } catch {
      return NextResponse.json(
        { error: "Backend returned a non-JSON response", detail: text.slice(0, 500) },
        { status: response.status >= 400 ? response.status : 502 }
      )
    }
  } catch (error) {
    console.error("Error proxying academy request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ segments: string[] }> } | any
) {
  return GET(request, { params })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ segments: string[] }> } | any
) {
  return GET(request, { params })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ segments: string[] }> } | any
) {
  return GET(request, { params })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ segments: string[] }> } | any
) {
  return GET(request, { params })
}
