import { NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      )
    }

    const apiResponse = await fetch(getApiUrl("login/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const contentType = apiResponse.headers.get("content-type") || ""
    const rawBody = await apiResponse.text()
    let data: any = {}

    if (contentType.includes("application/json")) {
      try {
        data = rawBody ? JSON.parse(rawBody) : {}
      } catch (parseError) {
        data = { message: rawBody || "Invalid JSON response from backend." }
      }
    } else {
      data = rawBody ? { message: rawBody } : {}
    }

    return NextResponse.json(data, {
      status: apiResponse.status,
    })
  } catch (error) {
    console.error("Login proxy error:", error)
    return NextResponse.json(
      { message: "An error occurred during authentication." },
      { status: 500 }
    )
  }
}
