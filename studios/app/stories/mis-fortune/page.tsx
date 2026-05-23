import Image from "next/image"
import Link from "next/link"

export default function MisFortunePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.25),transparent_40%)]" />
        <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl dark:bg-amber-500/20" />
        <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl dark:bg-rose-500/20" />

        <div className="relative container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="space-y-8">
              <p className="inline-flex rounded-full border border-amber-200/80 bg-amber-50/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-amber-700 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                Chapter III
              </p>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
                Mis Fortune, the balance between risk and shelter.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
                In the places where shadows and chance meet, she moves deliberately. Each decision is a promise, each gamble a shield for the people she protects.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/stories"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-950/5 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-50/10 dark:text-white dark:hover:bg-slate-800"
                >
                  Back to stories
                </Link>
                <span className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-100/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                  Gamble queen
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/30">
              <div className="absolute -left-8 top-12 h-32 w-32 rounded-full bg-amber-300/10 blur-3xl dark:bg-amber-400/20" />
              <div className="absolute -right-10 bottom-8 h-36 w-36 rounded-full bg-rose-300/10 blur-3xl dark:bg-rose-500/15" />
              <Image
                src="/characters/mis-fortune.png"
                alt="Mis Fortune"
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
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">Hidden past</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">A life shaped by risk</h2>
            <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
              Mis Fortune grew up with every opportunity weighed against the danger that comes with it. She learned early that the right gamble could protect more than just herself.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-10 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75 dark:shadow-black/20">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">The pact</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Choosing who to shield</h2>
            <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
              When a reckless challenger threatened the balance of the city, Mis Fortune stepped in. Her intervention was both subtle and decisive — the kind that changes the story without flair.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-10 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/20">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">Her mission</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Protect the world without being seen</h2>
            <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
              Mis Fortune is not interested in glory. Her story is about quiet influence, the courage to take a loss for others, and the discipline to stay one step ahead of what fate expects.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
