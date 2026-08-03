import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test").replace(/\/+$/, "")

async function proxy(request: NextRequest, segments: string[]) {
  const backendResponse = await fetch(`${API_BASE_URL}/survey/${segments.join("/")}/${request.nextUrl.search}`, {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
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
