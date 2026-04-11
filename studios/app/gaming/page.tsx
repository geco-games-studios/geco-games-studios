import Link from "next/link"

export default function GamingPage() {
  const games = [
    {
      title: "Fruit Valley",
      category: "Puzzle",
      description: "A polished match-3 experience designed for wide audience appeal.",
    },
    {
      title: "Block Cat Fill",
      category: "Puzzle",
      description: "A strategic logic game with charming visuals and clean progression.",
    },
    {
      title: "Become A Chef",
      category: "Simulation",
      description: "A narrative-driven restaurant simulation with premium art direction.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-950 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-100 uppercase tracking-[0.24em]">
                Game Portfolio
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Games crafted for quality, retention, and engagement.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Our gaming portfolio includes polished mobile and casual experiences designed to look premium and feel addictive.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#products" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  View catalog
                </Link>
                <Link href="#contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Talk to our team
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-amber-200">Highlights</p>
                  <p className="mt-3 text-3xl font-semibold">Beautiful design</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-amber-200">Focus</p>
                  <p className="mt-3 text-3xl font-semibold">Long-term retention</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Games</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Selected titles from our studio.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {games.map((game) => (
              <div key={game.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{game.category}</p>
                <h3 className="mt-4 text-2xl font-semibold">{game.title}</h3>
                <p className="mt-4 text-slate-600 dark:text-slate-400">{game.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Why our games</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">A studio approach to design and retention.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                We combine strong game design, polished visuals, and live product thinking to create titles that grow over time.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  "Player-first progression systems",
                  "Brand-aligned art direction",
                  "Live updates and retention planning",
                  "Cross-platform enablement",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-2xl font-semibold mb-4">Product support</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-semibold">Live operations planning</p>
                  <p>Clear roadmaps for updates and player retention.</p>
                </div>
                <div>
                  <p className="font-semibold">Monetization strategy</p>
                  <p>Thoughtful systems that respect players and drive revenue.</p>
                </div>
                <div>
                  <p className="font-semibold">Quality assurance</p>
                  <p>Polished launches with stability and performance testing.</p>
                </div>
              </div>
              <Link href="#contact" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-400">
                Discuss your game
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Talk games</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Bring your next title to life with our studio.</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Email our games team to explore concept, production, and live product support.
          </p>
          <Link href="mailto:hello@gecogamesstudios.com" className="mt-10 inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-amber-400">
            Email game team
          </Link>
        </div>
      </section>
    </div>
  )
}
