import { createReadStream } from "fs"
import { promises as fs } from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ segments: string[] }>
}

const WEBGL_ROOT = path.join(process.cwd(), "public", "webgl")

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
  ".symbols.json": "application/json; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mem": "application/octet-stream",
}

function getMimeType(filePath: string) {
  if (filePath.endsWith(".symbols.json")) {
    return MIME_TYPES[".symbols.json"]
  }

  return MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream"
}

function resolveWebGLPath(segments: string[]) {
  const requestedPath = path.resolve(WEBGL_ROOT, ...segments)
  const rootPath = path.resolve(WEBGL_ROOT)

  if (requestedPath !== rootPath && !requestedPath.startsWith(rootPath + path.sep)) {
    return ""
  }

  return requestedPath
}

async function serveWebGLFile(request: NextRequest, context: RouteContext, includeBody: boolean) {
  const { segments } = await context.params
  const filePath = resolveWebGLPath(segments || [])

  if (!filePath) {
    return NextResponse.json({ error: "Invalid WebGL file path." }, { status: 400 })
  }

  try {
    const stat = await fs.stat(filePath)
    if (!stat.isFile()) {
      return new NextResponse("Not found", { status: 404 })
    }

    const headers = new Headers({
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=0",
      "Content-Length": stat.size.toString(),
      "Content-Type": getMimeType(filePath),
      "Last-Modified": stat.mtime.toUTCString(),
    })

    if (!includeBody || request.method === "HEAD") {
      return new NextResponse(null, { status: 200, headers })
    }

    const stream = createReadStream(filePath)
    return new NextResponse(stream as unknown as BodyInit, { status: 200, headers })
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return new NextResponse("Not found", { status: 404 })
    }

    console.error("Failed to serve WebGL file:", error)
    return NextResponse.json({ error: "Failed to serve WebGL file." }, { status: 500 })
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return serveWebGLFile(request, context, true)
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  return serveWebGLFile(request, context, false)
}
