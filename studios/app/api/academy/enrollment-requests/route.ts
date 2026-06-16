import { NextRequest, NextResponse } from "next/server"
import {
  createEnrollmentRequest,
  listEnrollmentRequests,
  updateEnrollmentRequestStatus,
  type EnrollmentRequestStatus,
} from "@/lib/academy-enrollment-requests"

function requireAuth(request: NextRequest) {
  return Boolean(request.headers.get("authorization"))
}

export async function GET(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
  }

  return NextResponse.json(await listEnrollmentRequests())
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
  }

  const body = await request.json()
  if (!body?.course_id) {
    return NextResponse.json({ error: "course_id is required" }, { status: 400 })
  }

  const record = await createEnrollmentRequest({
    course_id: Number(body.course_id),
    course_title: body.course_title,
    student_id: body.student_id,
    student_name: body.student_name,
    student_email: body.student_email,
    requires_payment: body.requires_payment,
  })

  return NextResponse.json(record)
}

export async function PATCH(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
  }

  const body = await request.json()
  const status = body?.status as EnrollmentRequestStatus
  if (!body?.id || !["pending", "approved", "dismissed"].includes(status)) {
    return NextResponse.json({ error: "id and valid status are required" }, { status: 400 })
  }

  const record = await updateEnrollmentRequestStatus(body.id, status)
  if (!record) return NextResponse.json({ error: "Request not found" }, { status: 404 })
  return NextResponse.json(record)
}
