import Image from "next/image"
import Link from "next/link"

export default function JeonzPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.25),transparent_40%)]" />
        <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/20" />
        <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/20" />

        <div className="relative container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="space-y-8">
              <p className="inline-flex rounded-full border border-cyan-200/80 bg-cyan-50/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-700 shadow-sm dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
                Chapter I
              </p>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
                Angel
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
                Angel was just another kid trying to survive in a violent, dying city until the night he was caught in a massacre caused by a secret experiment beneath the streets. Left dying, he encountered a fallen angel imprisoned below the city — a divine being abandoned by Heaven itself.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/stories"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-950/5 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-50/10 dark:text-white dark:hover:bg-slate-800"
                >
                  Back to stories
                </Link>
                <span className="inline-flex items-center rounded-full border border-cyan-200/80 bg-cyan-100/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
                  Fallen avatar
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/30">
              <div className="absolute -left-8 top-12 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl dark:bg-cyan-400/20" />
              <div className="absolute -right-10 bottom-8 h-36 w-36 rounded-full bg-violet-300/10 blur-3xl dark:bg-violet-500/15" />
              <Image
                src="/characters/jeonz.png"
                alt="Angel"
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
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">Origin</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">The neon alley begun</h2>
            <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
              Angel was just another kid trying to survive in a violent, dying city when a secret experiment beneath the streets turned into a massacre. Left for dead, he found a fallen angel imprisoned below — a divine being abandoned by Heaven itself.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-10 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75 dark:shadow-black/20">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">Turning point</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">A quiet victory</h2>
            <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
              The entity offered him a choice: die powerless, or become something feared. Angel accepted, and the fallen angel now lives inside him, granting terrifying power while slowly consuming his humanity.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-10 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/20">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">Legacy</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">A story of clarity</h2>
            <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
              Angel fights to stay in control, but each use of his power blurs the line between saviour and monster a little more. The blue wings behind him are fragments of the fallen creature trying to fully manifest through his body.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
