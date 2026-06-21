import { promises as fs } from "fs"
import path from "path"
import { notFound, redirect } from "next/navigation"

export const dynamic = "force-dynamic"

const DEPLOY_ROOT = path.join(process.cwd(), "public", "webgl")
const REGISTRY_PATH = path.join(process.cwd(), "data", "webgl-deployments.json")

type Deployment = {
  slug: string
}

type PageProps = {
  params: Promise<{ slug: string }>
}

async function fileExists(filePath: string) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  } catch {
    return false
  }
}

async function getLatestAvailableSlug(exceptSlug: string) {
  try {
    const content = await fs.readFile(REGISTRY_PATH, "utf8")
    const deployments = JSON.parse(content) as Deployment[]
    if (!Array.isArray(deployments)) {
      return ""
    }

    for (const deployment of deployments) {
      if (!deployment?.slug || deployment.slug === exceptSlug) {
        continue
      }

      if (await fileExists(path.join(DEPLOY_ROOT, deployment.slug, "index.html"))) {
        return deployment.slug
      }
    }
  } catch {
    return ""
  }

  return ""
}

export default async function WebGLPlayerPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  if (!/^[a-z0-9-]+$/.test(slug)) {
    notFound()
  }

  if (!(await fileExists(path.join(DEPLOY_ROOT, slug, "index.html")))) {
    const fallbackSlug = await getLatestAvailableSlug(slug)
    if (fallbackSlug) {
      redirect(`/play/${fallbackSlug}`)
    }

    notFound()
  }

  return (
    <main className="fixed inset-0 z-[100] flex h-dvh w-dvw items-center justify-center overflow-hidden bg-black overscroll-none sm:bg-slate-950">
      <iframe
        src={`/webgl/${slug}/index.html`}
        title={`${slug} WebGL Player`}
        className="block h-dvh w-dvw border-0 bg-black sm:h-[min(100dvh,calc(100dvw*16/9))] sm:max-h-dvh sm:w-[min(100dvw,calc(100dvh*9/16))] sm:max-w-[430px]"
        allow="fullscreen; autoplay; gamepad; pointer-lock; screen-wake-lock"
        allowFullScreen
        scrolling="no"
      />
    </main>
  )
}
