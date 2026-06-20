import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string }
}

export default async function WebGLPlayerPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  if (!/^[a-z0-9-]+$/.test(slug)) {
    notFound()
  }

  return (
    <main className="fixed inset-0 z-[100] bg-black">
      <iframe
        src={`/webgl/${slug}/index.html`}
        title={`${slug} WebGL Player`}
        className="h-full w-full border-0"
        allow="fullscreen; autoplay"
      />
    </main>
  )
}
