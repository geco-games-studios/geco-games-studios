import { NextResponse } from "next/server"

export async function responseFromBackend(response: Response) {
  const contentType = response.headers.get("content-type") || ""
  const rawBody = await response.text()
  let data: any = {}

  if (contentType.includes("application/json")) {
    try {
      data = rawBody ? JSON.parse(rawBody) : {}
    } catch {
      data = { message: rawBody || "Invalid JSON response from backend." }
    }
  } else {
    data = rawBody ? { message: rawBody } : {}
  }

  return NextResponse.json(data, { status: response.status })
}
