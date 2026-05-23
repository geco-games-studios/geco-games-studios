import Image from "next/image"
import Link from "next/link"

export default function LotusPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.18),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(219,39,119,0.22),transparent_40%)]" />
        <div className="absolute left-10 top-24 h-72 w-72 rounded-full bg-pink-400/10 blur-3xl dark:bg-pink-500/20" />
        <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/20" />

        <div className="relative container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="space-y-8">
              <p className="inline-flex rounded-full border border-pink-200/80 bg-pink-50/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-pink-700 shadow-sm dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-200">
                Chapter II
              </p>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
                Lotus, the arena’s quiet storm.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
                Lotus moves with the calm of a river and the force of a storm. Every match is a meditation, every victory a carefully placed blossom.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/stories"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-950/5 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-50/10 dark:text-white dark:hover:bg-slate-800"
                >
                  Back to stories
                </Link>
                <span className="inline-flex items-center rounded-full border border-pink-200/80 bg-pink-100/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-pink-700 dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-200">
                  Tournament sovereign
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/30">
              <div className="absolute -left-10 top-14 h-32 w-32 rounded-full bg-pink-300/10 blur-3xl dark:bg-pink-400/20" />
              <div className="absolute -right-10 bottom-8 h-36 w-36 rounded-full bg-violet-300/10 blur-3xl dark:bg-violet-500/15" />
              <Image
                src="/characters/lotus.png"
                alt="Lotus"
                width={640}
                height={640}
                className="relative rounded-[1.75rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-3">
          <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-10 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/20">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">Early trials</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Rising through the ranks</h2>
            <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
              Lotus began in small competitions where every success was earned with discipline. Each day taught her that consistency was the true edge, not just a flash of brilliance.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-10 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75 dark:shadow-black/20">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">The breakthrough</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">A single calm strike</h2>
            <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
              In a match where everyone expected her to crack, Lotus held her breath and did not waver. That quiet precision became the moment people realized she was not just strong — she was inevitable.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-10 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/20">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">The present</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">The steady force</h2>
            <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
              Lotus now commands attention without raising her voice. She is the standard for those who turn pressure into momentum and focus into legend.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
