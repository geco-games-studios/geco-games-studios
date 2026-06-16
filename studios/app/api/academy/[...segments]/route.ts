import { NextRequest, NextResponse } from "next/server"
import { createEnrollmentRequest } from "@/lib/academy-enrollment-requests"

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1/test" //localhost_test
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test" //production_test

type RouteContext = { params: Promise<{ segments: string[] }> } | { params: { segments: string[] } } | any

async function resolveSegments(context: RouteContext): Promise<string[]> {
  const params = typeof context?.params?.then === "function" ? await context.params : context?.params
  return Array.isArray(params?.segments) ? params.segments.filter(Boolean) : []
}

function decodeJwtPayload(authHeader: string) {
  const token = authHeader.replace(/^Bearer\s+/i, "")
  const payload = token.split(".")[1]
  if (!payload) return null

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8"))
  } catch {
    return null
  }
}

function getUserIdFromToken(authHeader: string) {
  const payload = decodeJwtPayload(authHeader)
  return payload?.user_id ?? payload?.id ?? payload?.sub ?? payload?.userId ?? null
}

async function forwardJson(response: Response) {
  const text = await response.text()
  if (!text) return new NextResponse(null, { status: response.status })

  try {
    return NextResponse.json(JSON.parse(text), { status: response.status })
  } catch {
    return NextResponse.json(
      { error: "Backend returned a non-JSON response", detail: text.slice(0, 500) },
      { status: response.status >= 400 ? response.status : 502 }
    )
  }
}

async function handleCourseEnrollment(request: NextRequest, authHeader: string, courseId: string) {
  let body: {
    requires_payment?: boolean
    course_title?: string
    student_id?: string | number | null
    student_name?: string | null
    student_email?: string | null
  } = {}
  try {
    const text = await request.text()
    body = text ? JSON.parse(text) : {}
  } catch {
    body = {}
  }

  if (body.requires_payment) {
    await createEnrollmentRequest({
      course_id: Number(courseId),
      course_title: body.course_title,
      student_id: body.student_id ?? getUserIdFromToken(authHeader),
      student_name: body.student_name,
      student_email: body.student_email,
      requires_payment: true,
    })
    return NextResponse.json({
      status: "pending",
      enrollment_status: "pending",
      message: "Application sent to the Academy admin team for approval.",
    })
  }

  const traineeId = getUserIdFromToken(authHeader)
  if (!traineeId) {
    await createEnrollmentRequest({
      course_id: Number(courseId),
      course_title: body.course_title,
      student_id: body.student_id,
      student_name: body.student_name,
      student_email: body.student_email,
      requires_payment: Boolean(body.requires_payment),
    })
    return NextResponse.json({
      status: "pending",
      enrollment_status: "pending",
      message: "Enrollment request sent to the Academy admin team.",
    })
  }

  const backendUrl = `${API_BASE_URL}/academy/admin/trainees/${traineeId}/enroll/`
  const response = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ course_id: Number(courseId) }),
  })

  if (response.ok) {
    return NextResponse.json({
      status: "enrolled",
      enrollment_status: "enrolled",
      message: "You are enrolled. The Academy admin dashboard has been notified.",
    })
  }

  const text = await response.text()
  console.warn("Self-enrollment fallback returned", response.status, text.slice(0, 300))
  await createEnrollmentRequest({
    course_id: Number(courseId),
    course_title: body.course_title,
    student_id: body.student_id ?? traineeId,
    student_name: body.student_name,
    student_email: body.student_email,
    requires_payment: Boolean(body.requires_payment),
  })
  return NextResponse.json({
    status: "pending",
    enrollment_status: "pending",
    message: "Enrollment request sent to the Academy admin team for approval.",
  })
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      )
    }

    const segments = await resolveSegments(context)
    const endpoint = segments.join("/")
    console.log("Academy route - segments:", segments)
    console.log("Academy route - filtered endpoint:", endpoint)

    if (
      request.method === "POST" &&
      segments.length === 3 &&
      segments[0] === "courses" &&
      segments[2] === "enroll"
    ) {
      return handleCourseEnrollment(request, authHeader, segments[1])
    }

    let backendUrl: string
    if (endpoint.startsWith("users/")) {
      backendUrl = `${API_BASE_URL}/${endpoint}/`
      console.log("User endpoint detected, backend URL:", backendUrl)
    } else {
      backendUrl = `${API_BASE_URL}/academy/${endpoint}/`
      console.log("Academy endpoint, backend URL:", backendUrl)
    }

    backendUrl += request.nextUrl.search

    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: request.method !== "GET" ? await request.text() : undefined,
    })

    return forwardJson(response)
  } catch (error) {
    console.error("Error proxying academy request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}
