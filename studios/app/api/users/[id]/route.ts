import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/pi/v1/test"
console.log("API_BASE_URL:", API_BASE_URL)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } | any
) {
  try {
    console.log("User API route called with params:", params)

    const authHeader = request.headers.get("authorization")
    console.log("Auth header present:", !!authHeader)

    if (!authHeader) {
      console.log("No auth header found")
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      )
    }

    const userId = params?.id
    console.log("User ID from params:", userId)

    if (!userId) {
      console.log("No user ID provided")
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const apiUrl = `${API_BASE_URL}users/${userId}/`
    console.log("Making request to backend:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    })

    console.log("Backend response status:", response.status)
    console.log("Backend response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("Backend error response:", errorText)
      return NextResponse.json(
        { error: "Failed to fetch from backend" },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Backend response data:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying user request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}