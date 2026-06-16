import { randomUUID } from "crypto"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

export type EnrollmentRequestStatus = "pending" | "approved" | "dismissed"

export interface EnrollmentRequestRecord {
  id: string
  course_id: number
  course_title: string
  student_id: string | null
  student_name: string
  student_email: string
  requires_payment: boolean
  status: EnrollmentRequestStatus
  requested_at: string
  updated_at: string
}

const DATA_DIR = path.join(process.cwd(), "data")
const REQUESTS_FILE = path.join(DATA_DIR, "academy-enrollment-requests.json")

async function readRequests(): Promise<EnrollmentRequestRecord[]> {
  try {
    const text = await readFile(REQUESTS_FILE, "utf8")
    const parsed = JSON.parse(text)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeRequests(requests: EnrollmentRequestRecord[]) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2), "utf8")
}

export async function listEnrollmentRequests() {
  const requests = await readRequests()
  return requests.sort((a, b) => {
    if (a.status !== b.status) return a.status === "pending" ? -1 : 1
    return new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
  })
}

export async function createEnrollmentRequest(input: {
  course_id: number
  course_title?: string
  student_id?: string | number | null
  student_name?: string | null
  student_email?: string | null
  requires_payment?: boolean
}) {
  const requests = await readRequests()
  const now = new Date().toISOString()
  const studentId = input.student_id == null ? null : String(input.student_id)
  const studentEmail = input.student_email?.trim() || "Unknown email"
  const existing = requests.find((request) =>
    request.status === "pending" &&
    request.course_id === input.course_id &&
    ((studentId && request.student_id === studentId) || request.student_email === studentEmail)
  )

  if (existing) {
    existing.course_title = input.course_title?.trim() || existing.course_title
    existing.student_name = input.student_name?.trim() || existing.student_name
    existing.student_email = studentEmail
    existing.requires_payment = Boolean(input.requires_payment)
    existing.updated_at = now
    await writeRequests(requests)
    return existing
  }

  const record: EnrollmentRequestRecord = {
    id: randomUUID(),
    course_id: input.course_id,
    course_title: input.course_title?.trim() || `Course ${input.course_id}`,
    student_id: studentId,
    student_name: input.student_name?.trim() || studentEmail,
    student_email: studentEmail,
    requires_payment: Boolean(input.requires_payment),
    status: "pending",
    requested_at: now,
    updated_at: now,
  }

  requests.push(record)
  await writeRequests(requests)
  return record
}

export async function updateEnrollmentRequestStatus(id: string, status: EnrollmentRequestStatus) {
  const requests = await readRequests()
  const request = requests.find((item) => item.id === id)
  if (!request) return null
  request.status = status
  request.updated_at = new Date().toISOString()
  await writeRequests(requests)
  return request
}
