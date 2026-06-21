import { execFile } from "child_process"
import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import os from "os"
import path from "path"
import { promisify } from "util"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const execFileAsync = promisify(execFile)
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://system.gecogames.com/api/v1/test").replace(/(^['"]|['"]$)/g, "").replace(/\/+$/g, "")
const MAX_ZIP_BYTES = 350 * 1024 * 1024
const DEPLOY_ROOT = path.join(process.cwd(), "public", "webgl")
const REGISTRY_PATH = path.join(process.cwd(), "data", "webgl-deployments.json")

type Deployment = {
  title: string
  slug: string
  url: string
  indexUrl: string
  deployedAt: string
  files: number
  sizeBytes: number
}

type ExtractSummary = {
  files: number
  sizeBytes: number
}

type ServiceProfileLike = {
  service?: string
  service_id?: string
  id?: string
  slug?: string
  status?: string
  state?: string
  active?: boolean
}

const extractorScript = String.raw`
import json
import os
import shutil
import sys
import zipfile
from pathlib import PurePosixPath

zip_path = sys.argv[1]
destination = sys.argv[2]
max_uncompressed = int(sys.argv[3])

with zipfile.ZipFile(zip_path) as archive:
    infos = [info for info in archive.infolist() if not info.is_dir()]
    normalized = []
    total = 0

    for info in infos:
        raw_name = info.filename.replace("\\", "/")
        parts = [part for part in PurePosixPath(raw_name).parts if part not in ("", ".")]
        if not parts:
            continue
        if parts[0] == "__MACOSX" or parts[-1] == ".DS_Store":
            continue
        if any(part == ".." for part in parts) or PurePosixPath(raw_name).is_absolute():
            raise SystemExit(f"Unsafe zip path: {raw_name}")
        if any("BurstDebugInformation_DoNotShip" in part for part in parts):
            continue

        total += info.file_size
        if total > max_uncompressed:
            raise SystemExit("The uncompressed build is too large.")
        normalized.append((info, parts))

    if not normalized:
        raise SystemExit("The zip file is empty.")

    top_levels = {parts[0] for _, parts in normalized}
    strip_top = False
    if len(top_levels) == 1:
        root = next(iter(top_levels))
        nested = [parts[1:] for _, parts in normalized if len(parts) > 1]
        nested_names = {"/".join(parts) for parts in nested}
        if "index.html" in nested_names and any(parts and parts[0] == "Build" for parts in nested) and any(parts and parts[0] == "TemplateData" for parts in nested):
            strip_top = True

    entries = []
    for info, parts in normalized:
        output_parts = parts[1:] if strip_top else parts
        if not output_parts:
            continue
        entries.append((info, output_parts))

    names = {"/".join(parts) for _, parts in entries}
    if "index.html" not in names:
        raise SystemExit("Missing index.html. Upload the root of a Unity WebGL build.")
    if not any(parts and parts[0] == "Build" for _, parts in entries):
        raise SystemExit("Missing Build folder. Upload a complete Unity WebGL build.")
    if not any(parts and parts[0] == "TemplateData" for _, parts in entries):
        raise SystemExit("Missing TemplateData folder. Upload a complete Unity WebGL build.")

    if os.path.exists(destination):
        shutil.rmtree(destination)
    os.makedirs(destination, exist_ok=True)

    for info, parts in entries:
        target = os.path.abspath(os.path.join(destination, *parts))
        destination_abs = os.path.abspath(destination)
        if target != destination_abs and not target.startswith(destination_abs + os.sep):
            raise SystemExit(f"Unsafe extracted path: {'/'.join(parts)}")
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with archive.open(info) as source, open(target, "wb") as output:
            shutil.copyfileobj(source, output)

    print(json.dumps({"files": len(entries), "sizeBytes": total}))
`

function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
}

function getBaseUrl(request: NextRequest) {
  const host = request.headers.get("host") || "gecogames.com"
  const forwardedProto = request.headers.get("x-forwarded-proto")
  const proto = forwardedProto || (host.includes("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

function hasDeveloperServiceProfile(profile: any) {
  const accountType = String(profile?.type || profile?.account_type || profile?.service || "").toLowerCase()
  if (accountType === "developer") {
    return true
  }

  const profileLists = [profile?.services, profile?.service_profiles].filter(Array.isArray) as ServiceProfileLike[][]
  return profileLists.some((profiles) =>
    profiles.some((serviceProfile) => {
      const serviceId = String(
        serviceProfile?.service || serviceProfile?.service_id || serviceProfile?.id || serviceProfile?.slug || "",
      ).toLowerCase()
      const state = String(serviceProfile?.status || serviceProfile?.state || "").toLowerCase()
      const isActive = serviceProfile?.active === true || state === "active" || state === ""

      return serviceId === "developer" && isActive
    }),
  )
}

async function readRegistry(): Promise<Deployment[]> {
  try {
    const content = await fs.readFile(REGISTRY_PATH, "utf8")
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : []
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return []
    }
    throw error
  }
}

async function writeRegistry(deployments: Deployment[]) {
  await fs.mkdir(path.dirname(REGISTRY_PATH), { recursive: true })
  await fs.writeFile(REGISTRY_PATH, `${JSON.stringify(deployments, null, 2)}\n`, "utf8")
}

function resolveDeployDir(slug: string) {
  const deployRootResolved = path.resolve(DEPLOY_ROOT)
  const deployDir = path.join(DEPLOY_ROOT, slug)
  const deployDirResolved = path.resolve(deployDir)

  if (deployDirResolved !== deployRootResolved && !deployDirResolved.startsWith(deployRootResolved + path.sep)) {
    throw new Error("Invalid deployment path.")
  }

  return deployDir
}

function createDeploymentRecord(request: NextRequest, title: string, slug: string, summary: ExtractSummary): Deployment {
  const baseUrl = getBaseUrl(request)
  return {
    title,
    slug,
    url: `${baseUrl}/play/${slug}`,
    indexUrl: `${baseUrl}/webgl/${slug}/index.html`,
    deployedAt: new Date().toISOString(),
    files: summary.files,
    sizeBytes: summary.sizeBytes,
  }
}

async function runExtractor(zipPath: string, stagingDir: string): Promise<ExtractSummary> {
  const candidates = process.platform === "win32" ? ["python", "py"] : ["python3", "python"]
  let lastError: unknown

  for (const command of candidates) {
    try {
      const { stdout } = await execFileAsync(command, ["-c", extractorScript, zipPath, stagingDir, String(MAX_ZIP_BYTES)], {
        maxBuffer: 1024 * 1024,
      })
      return JSON.parse(stdout.trim()) as ExtractSummary
    } catch (error: any) {
      lastError = error
      if (error?.code === "ENOENT") {
        continue
      }
      const message = error?.stderr?.trim() || error?.stdout?.trim() || error?.message || "Failed to extract WebGL build."
      throw new Error(message)
    }
  }

  throw new Error(lastError instanceof Error ? lastError.message : "Python is required to extract WebGL build zips.")
}

async function requireDeveloperAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
  }

  const profileResponse = await fetch(`${API_BASE_URL}/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    cache: "no-store",
  })

  if (!profileResponse.ok) {
    return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 })
  }

  const profile = await profileResponse.json()

  if (!hasDeveloperServiceProfile(profile)) {
    return NextResponse.json({ error: "Developer access is required." }, { status: 403 })
  }

  return null
}

export async function GET(request: NextRequest) {
  const authError = await requireDeveloperAuth(request)
  if (authError) {
    return authError
  }

  const deployments = await readRegistry()
  return NextResponse.json({ deployments })
}

export async function POST(request: NextRequest) {
  const authError = await requireDeveloperAuth(request)
  if (authError) {
    return authError
  }

  const tempRoot = path.join(os.tmpdir(), "geco-webgl-deploy", randomUUID())
  const uploadPath = path.join(tempRoot, "build.zip")
  const stagingDir = path.join(tempRoot, "staging")

  try {
    const formData = await request.formData()
    const file = formData.get("zip")
    const title = String(formData.get("title") || "").trim()
    const requestedSlug = String(formData.get("slug") || title)
    const slug = sanitizeSlug(requestedSlug)

    if (!title) {
      return NextResponse.json({ error: "Game title is required." }, { status: 400 })
    }

    if (!slug) {
      return NextResponse.json({ error: "A URL slug is required." }, { status: 400 })
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Upload a Unity WebGL zip file." }, { status: 400 })
    }

    if (file.size > MAX_ZIP_BYTES) {
      return NextResponse.json({ error: "The zip file is too large. Keep it under 350 MB." }, { status: 400 })
    }

    await fs.mkdir(tempRoot, { recursive: true })
    await fs.writeFile(uploadPath, Buffer.from(await file.arrayBuffer()))

    const summary = await runExtractor(uploadPath, stagingDir)
    let deployDir: string
    try {
      deployDir = resolveDeployDir(slug)
    } catch (pathError) {
      return NextResponse.json({ error: "Invalid deployment path." }, { status: 400 })
    }

    await fs.mkdir(DEPLOY_ROOT, { recursive: true })
    await fs.rm(deployDir, { recursive: true, force: true })
    await fs.rename(stagingDir, deployDir)


    const deployment = createDeploymentRecord(request, title, slug, summary)


    const deployments = await readRegistry()
    const nextDeployments = [deployment, ...deployments.filter((item) => item.slug !== slug)]
    await writeRegistry(nextDeployments)

    return NextResponse.json({ ok: true, deployment })
  } catch (error) {
    console.error("WebGL deploy failed:", error)
    const message = error instanceof Error ? error.message : "Failed to deploy WebGL build."
    return NextResponse.json({ error: message }, { status: 500 })
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true }).catch(() => undefined)
  }
}
export async function PATCH(request: NextRequest) {
  const authError = await requireDeveloperAuth(request)
  if (authError) {
    return authError
  }

  try {
    const body = await request.json()
    const currentSlug = sanitizeSlug(String(body?.currentSlug || body?.slug || ""))
    const title = String(body?.title || "").trim()
    const nextSlug = sanitizeSlug(String(body?.nextSlug || body?.slug || currentSlug))

    if (!currentSlug) {
      return NextResponse.json({ error: "Deployment slug is required." }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: "Game title is required." }, { status: 400 })
    }

    if (!nextSlug) {
      return NextResponse.json({ error: "A valid URL slug is required." }, { status: 400 })
    }

    const deployments = await readRegistry()
    const existing = deployments.find((deployment) => deployment.slug === currentSlug)

    if (!existing) {
      return NextResponse.json({ error: "Deployment was not found." }, { status: 404 })
    }

    if (nextSlug !== currentSlug && deployments.some((deployment) => deployment.slug === nextSlug)) {
      return NextResponse.json({ error: "Another deployment already uses that slug." }, { status: 409 })
    }

    if (nextSlug !== currentSlug) {
      const fromDir = resolveDeployDir(currentSlug)
      const toDir = resolveDeployDir(nextSlug)
      await fs.mkdir(DEPLOY_ROOT, { recursive: true })
      await fs.rm(toDir, { recursive: true, force: true })
      await fs.rename(fromDir, toDir)
    }

    const baseUrl = getBaseUrl(request)
    const updated: Deployment = {
      ...existing,
      title,
      slug: nextSlug,
      url: `${baseUrl}/play/${nextSlug}`,
      indexUrl: `${baseUrl}/webgl/${nextSlug}/index.html`,
    }

    const nextDeployments = deployments.map((deployment) =>
      deployment.slug === currentSlug ? updated : deployment,
    )
    await writeRegistry(nextDeployments)

    return NextResponse.json({ ok: true, deployment: updated })
  } catch (error) {
    console.error("WebGL deployment update failed:", error)
    const message = error instanceof Error ? error.message : "Failed to update WebGL deployment."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireDeveloperAuth(request)
  if (authError) {
    return authError
  }

  try {
    const body = await request.json().catch(() => ({}))
    const slugFromQuery = request.nextUrl.searchParams.get("slug") || ""
    const slug = sanitizeSlug(String(body?.slug || slugFromQuery))

    if (!slug) {
      return NextResponse.json({ error: "Deployment slug is required." }, { status: 400 })
    }

    const deployments = await readRegistry()
    const existing = deployments.find((deployment) => deployment.slug === slug)

    if (!existing) {
      return NextResponse.json({ error: "Deployment was not found." }, { status: 404 })
    }

    await fs.rm(resolveDeployDir(slug), { recursive: true, force: true })
    await writeRegistry(deployments.filter((deployment) => deployment.slug !== slug))

    return NextResponse.json({ ok: true, slug })
  } catch (error) {
    console.error("WebGL deployment delete failed:", error)
    const message = error instanceof Error ? error.message : "Failed to delete WebGL deployment."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
