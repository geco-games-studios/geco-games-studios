import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function WebGLPlayerPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  if (!/^[a-z0-9-]+$/.test(slug)) {
    notFound()
  }

  return (
    <main className="fixed inset-0 z-[100] h-dvh w-dvw overflow-hidden bg-black overscroll-none">
      <iframe
        src={`/webgl/${slug}/index.html`}
        title={`${slug} WebGL Player`}
        className="block h-dvh w-dvw border-0"
        allow="fullscreen; autoplay; gamepad; pointer-lock; screen-wake-lock"
        allowFullScreen
        scrolling="no"
      />
    </main>
  )
}
