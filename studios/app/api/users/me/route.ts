import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    console.log("Current user API route called")

    const authHeader = request.headers.get("authorization")
    console.log("Auth header present:", !!authHeader)

    if (!authHeader) {
      console.log("No auth header found")
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      )
    }

    // Fetch current user profile from backend
    const apiUrl = getApiUrl("users/me/")
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
        { error: "Failed to fetch current user from backend" },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Backend response data:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log("Update current user API route called")

    const authHeader = request.headers.get("authorization")
    console.log("Auth header present:", !!authHeader)

    if (!authHeader) {
      console.log("No auth header found")
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("Update payload:", body)

    // Update current user profile on backend
    const apiUrl = getApiUrl("users/me/")
    console.log("Making PATCH request to backend:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    })

    console.log("Backend response status:", response.status)
    console.log("Backend response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("Backend error response:", errorText)
      return NextResponse.json(
        { error: "Failed to update user on backend" },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Backend response data:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating current user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
