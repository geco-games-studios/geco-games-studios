import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const MAX_FILE_SIZE = 250 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  "video/x-matroska",
])

const EXTENSIONS: Record<string, string> = {
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
  "video/webm": ".webm",
  "video/x-msvideo": ".avi",
  "video/x-matroska": ".mkv",
}

function safeName(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a PDF or video file before submitting the activity." }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only PDF and video files are accepted." }, { status: 400 })
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File must be between 1 byte and 250 MB." }, { status: 400 })
  }

  const now = new Date()
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`
  const uploadDir = path.join(process.cwd(), "public", "uploads", "academy-activity", month)
  await mkdir(uploadDir, { recursive: true })

  const ext = EXTENSIONS[file.type]
  const filename = `${Date.now()}-${randomUUID()}-${safeName(file.name) || "activity"}${ext}`
  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), bytes)

  return NextResponse.json({
    url: `/uploads/academy-activity/${month}/${filename}`,
    name: file.name,
    type: file.type,
    size: file.size,
  })
}
