import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1/test"
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test" //production_test

export async function GET(request: NextRequest) {
  try {
    console.log("Users list API route called")

    const authHeader = request.headers.get("authorization")
    console.log("Auth header present:", !!authHeader)

    if (!authHeader) {
      console.log("No auth header found")
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      )
    }

    // Fetch users list from backend
    const apiUrl = `${API_BASE_URL}users/`
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
        { error: "Failed to fetch users from backend" },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Backend response data:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}