"use client"

export const dynamic = "force-dynamic"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileArchive,
  Gamepad2,
  LinkIcon,
  Loader2,
  UploadCloud,
} from "lucide-react"
import { canAccessService } from "@/lib/auth-session"

type Deployment = {
  title: string
  slug: string
  url: string
  indexUrl: string
  deployedAt: string
  files: number
  sizeBytes: number
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB"]
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}

export default function WebGLDeployPage() {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState("")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeploying, setIsDeploying] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<Deployment | null>(null)
  const [copiedUrl, setCopiedUrl] = useState("")

  const generatedSlug = useMemo(() => slugify(title), [title])

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    const token = localStorage.getItem("accessToken")

    if (!userData || !token) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (!canAccessService(parsedUser, "developer")) {
        router.push("/login")
        return
      }
    } catch (parseError) {
      console.warn("Failed to parse currentUser from localStorage", parseError)
      router.push("/login")
      return
    }

    setAccessToken(token)
  }, [router])

  useEffect(() => {
    if (!slugTouched) {
      setSlug(generatedSlug)
    }
  }, [generatedSlug, slugTouched])

  useEffect(() => {
    if (!accessToken) {
      return
    }

    const loadDeployments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/developer/webgl-deploy", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load WebGL deployments.")
        }

        setDeployments(payload.deployments || [])
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load WebGL deployments.")
      } finally {
        setIsLoading(false)
      }
    }

    loadDeployments()
  }, [accessToken])

  const handleDeploy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSuccess(null)

    if (!title.trim()) {
      setError("Enter a game title.")
      return
    }

    const cleanSlug = slugify(slug)
    if (!cleanSlug) {
      setError("Enter a valid URL slug.")
      return
    }

    if (!file) {
      setError("Choose a zipped Unity WebGL build.")
      return
    }

    try {
      setIsDeploying(true)
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("slug", cleanSlug)
      formData.append("zip", file)

      const response = await fetch("/api/developer/webgl-deploy", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || "Failed to deploy WebGL build.")
      }

      const deployment = payload.deployment as Deployment
      setSuccess(deployment)
      setDeployments((current) => [deployment, ...current.filter((item) => item.slug !== deployment.slug)])
      setSlug(deployment.slug)
    } catch (deployError) {
      setError(deployError instanceof Error ? deployError.message : "Failed to deploy WebGL build.")
    } finally {
      setIsDeploying(false)
    }
  }

  const copyLink = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    window.setTimeout(() => setCopiedUrl(""), 1600)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <main className="container mx-auto px-4 py-12 lg:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-300">
              <Gamepad2 className="h-3.5 w-3.5" />
              Unity WebGL
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">WebGL Deploy</h2>
            <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">
              Upload a zipped Unity WebGL build and publish it to a reusable GECO Games web player.
            </p>
          </div>
          <Link
            href="/developer/games"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ExternalLink className="h-4 w-4" />
            My Games
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <form className="space-y-6" onSubmit={handleDeploy}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Game title</span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-cyan-950"
                    placeholder="Word Game"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Share URL slug</span>
                  <input
                    value={slug}
                    onChange={(event) => {
                      setSlugTouched(true)
                      setSlug(slugify(event.target.value))
                    }}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-cyan-950"
                    placeholder="word-game"
                  />
                </label>
              </div>

              <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-cyan-400 hover:bg-cyan-50/60 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30">
                <FileArchive className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                <span className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {file ? file.name : "Choose Unity WebGL ZIP"}
                </span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  The ZIP must contain index.html, Build, and TemplateData.
                </span>
                <input
                  type="file"
                  accept=".zip,application/zip,application/x-zip-compressed"
                  className="sr-only"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </label>

              {error ? (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                  <p>{error}</p>
                </div>
              ) : null}

              {success ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600 dark:text-emerald-300" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-200">Game deployed</p>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <a
                          href={success.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-w-0 items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-100 dark:bg-slate-950 dark:text-emerald-200 dark:ring-emerald-900 dark:hover:bg-emerald-950"
                        >
                          <LinkIcon className="h-4 w-4 flex-none" />
                          <span className="truncate">{success.url}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => copyLink(success.url)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          {copiedUrl === success.url ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copiedUrl === success.url ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isDeploying}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-cyan-500 dark:hover:bg-cyan-400"
              >
                {isDeploying ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                {isDeploying ? "Deploying..." : "Deploy WebGL Build"}
              </button>
            </form>
          </section>

          <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Build checklist</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                <p className="font-semibold text-slate-800 dark:text-slate-100">Unity export</p>
                <p className="mt-1">Build target must be WebGL and the ZIP should include the generated player files.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                <p className="font-semibold text-slate-800 dark:text-slate-100">Required files</p>
                <p className="mt-1">The deployer checks for index.html, Build, and TemplateData before publishing.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                <p className="font-semibold text-slate-800 dark:text-slate-100">Overwrite behavior</p>
                <p className="mt-1">Deploying the same slug replaces the old WebGL files and keeps the share URL stable.</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Published WebGL Games</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Recent dashboard deployments are listed here.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading deployments...
            </div>
          ) : deployments.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <UploadCloud className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">No WebGL deployments yet</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your deployed games will appear after the first upload.</p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {deployments.map((deployment) => (
                  <div key={`${deployment.slug}-${deployment.deployedAt}`} className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{deployment.title}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          /play/{deployment.slug}
                        </span>
                      </div>
                      <p className="mt-2 truncate text-sm text-slate-500 dark:text-slate-400">{deployment.url}</p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {new Date(deployment.deployedAt).toLocaleString()} · {deployment.files} files · {formatBytes(deployment.sizeBytes)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyLink(deployment.url)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {copiedUrl === deployment.url ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedUrl === deployment.url ? "Copied" : "Copy"}
                      </button>
                      <a
                        href={deployment.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
