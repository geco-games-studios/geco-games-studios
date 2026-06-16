import { NextRequest, NextResponse } from "next/server"
import {
  createEnrollmentRequest,
  listEnrollmentRequests,
  type EnrollmentRequestRecord,
  updateEnrollmentRequestStatus,
  type EnrollmentRequestStatus,
} from "@/lib/academy-enrollment-requests"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test"

function requireAuth(request: NextRequest) {
  return Boolean(request.headers.get("authorization"))
}

async function readBackendError(response: Response) {
  const text = await response.text()
  if (!text) return `Backend request failed with status ${response.status}`

  try {
    const body = JSON.parse(text)
    return body.error || body.detail || body.message || JSON.stringify(body).slice(0, 240)
  } catch {
    return text.slice(0, 240)
  }
}

async function findTraineeIdByEmail(record: EnrollmentRequestRecord, authHeader: string) {
  if (!record.student_email || record.student_email === "Unknown email") return null

  const response = await fetch(`${API_BASE_URL}/academy/admin/trainees/`, {
    headers: { Authorization: authHeader },
  })

  if (!response.ok) return null

  const trainees = await response.json()
  if (!Array.isArray(trainees)) return null

  const match = trainees.find((trainee) =>
    typeof trainee?.email === "string" &&
    trainee.email.toLowerCase() === record.student_email.toLowerCase()
  )

  return match?.id ?? null
}

async function approveEnrollmentRequest(record: EnrollmentRequestRecord, authHeader: string) {
  const numericId = Number(record.student_id)
  const emailId = await findTraineeIdByEmail(record, authHeader)
  const traineeIds = [
    ...(Number.isFinite(numericId) && numericId > 0 ? [numericId] : []),
    ...(emailId && emailId !== numericId ? [emailId] : []),
  ]

  if (!traineeIds.length) {
    throw new Error("Could not find the trainee account for this request.")
  }

  let lastError = "Could not approve enrollment request."
  for (const traineeId of traineeIds) {
    const response = await fetch(`${API_BASE_URL}/academy/admin/trainees/${traineeId}/enroll/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ course_id: record.course_id }),
    })

    if (response.ok) return

    const detail = await readBackendError(response)
    if (/already\s+enroll/i.test(detail)) return
    lastError = detail
  }

  throw new Error(lastError)
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
  const authHeader = request.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
  }

  const body = await request.json()
  const status = body?.status as EnrollmentRequestStatus
  if (!body?.id || !["pending", "approved", "dismissed"].includes(status)) {
    return NextResponse.json({ error: "id and valid status are required" }, { status: 400 })
  }

  const records = await listEnrollmentRequests()
  const current = records.find((item) => item.id === body.id)
  if (!current) return NextResponse.json({ error: "Request not found" }, { status: 404 })

  if (status === "approved") {
    try {
      await approveEnrollmentRequest(current, authHeader)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Could not approve enrollment request." },
        { status: 502 }
      )
    }
  }

  const record = await updateEnrollmentRequestStatus(body.id, status)
  if (!record) return NextResponse.json({ error: "Request not found" }, { status: 404 })
  return NextResponse.json(record)
}
