import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test").replace(/\/+$/, "")

async function proxy(request: NextRequest, segments: string[]) {
  const authorization = request.headers.get("authorization")

  // Results remain private even though the public survey endpoints are anonymous.
  // Django is the source of truth for superuser status.
  if (["results", "completions"].includes(segments[0])) {
    if (!authorization) return NextResponse.json({ detail: "Django superuser access is required." }, { status: 401 })

    const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
      headers: { Authorization: authorization },
      cache: "no-store",
    })
    const user = userResponse.ok ? await userResponse.json() : null
    if (!user?.is_superuser) return NextResponse.json({ detail: "Django superuser access is required." }, { status: 403 })
  }

  const backendResponse = await fetch(`${API_BASE_URL}/survey/${segments.join("/")}/${request.nextUrl.search}`, {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    cache: "no-store",
  })

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") || "application/json",
    },
  })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ segments: string[] }> }) {
  return proxy(request, (await params).segments)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ segments: string[] }> }) {
  return proxy(request, (await params).segments)
}
