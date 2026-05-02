import { NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      first_name,
      last_name,
      email,
      password,
      account_type,
      country,
      phone_number,
      nrc_number,
      date_of_birth,
    } = body

    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !account_type ||
      !country ||
      !phone_number ||
      !nrc_number ||
      !date_of_birth
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    const apiResponse = await fetch(getApiUrl("register/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
    console.error("Registration proxy error:", error)
    return NextResponse.json(
      { message: "An error occurred while forwarding registration to the backend." },
      { status: 500 }
    )
  }
}
