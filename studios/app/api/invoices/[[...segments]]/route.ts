import { NextRequest, NextResponse } from "next/server"

async function proxy(request: NextRequest, context: { params: Promise<{ segments?: string[] }> }) {
  const authorization = request.headers.get("authorization")
  if (!authorization) return NextResponse.json({ detail: "Please sign in to manage invoices." }, { status: 401 })
  const { segments = [] } = await context.params
  if (segments.length > 2 || (segments[0] && !/^\d+$/.test(segments[0])) || (segments[1] && !["pdf", "email"].includes(segments[1]))) {
    return NextResponse.json({ detail: "Invalid invoice endpoint." }, { status: 404 })
  }
  try {
    const configuredBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com").trim().replace(/^['"]|['"]$/g, "")
    const base = process.env.INVOICE_API_BASE_URL || `${new URL(configuredBase).origin}/api/test/v1/invoices/`
    const response = await fetch(`${base.replace(/\/+$/, "")}/${segments.length ? segments.join("/") + "/" : ""}`, {
      method: request.method,
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
      cache: "no-store",
      redirect: "error",
    })
    const headers = new Headers({ "Cache-Control": "no-store" })
    for (const name of ["content-type", "content-disposition"]) {
      const value = response.headers.get(name)
      if (value) headers.set(name, value)
    }
    return new Response(response.body, { status: response.status, headers })
  } catch {
    return NextResponse.json({ detail: "Unable to reach the invoice service. Please try again." }, { status: 502 })
  }
}

export const GET = proxy
export const POST = proxy
