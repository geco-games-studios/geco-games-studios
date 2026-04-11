import Link from "next/link"

export default function EngineeringPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 text-white py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-200 uppercase tracking-[0.24em]">
                Engineering Services
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Technical engineering for ambitious game products.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                We deliver scalable solutions, multiplayer systems, and backend services that power modern games and digital experiences.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#capabilities" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Explore capabilities
                </Link>
                <Link href="#contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Talk to engineering
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-900 p-8 text-white">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Core focus</p>
                  <p className="mt-3 text-3xl font-semibold">Reliable architecture</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-8 text-white">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Delivery model</p>
                  <p className="mt-3 text-3xl font-semibold">Agile sprints</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">What we build</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Engineering solutions that scale.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Game Systems",
                description: "Multiplayer architecture, live services, and gameplay systems built for performance.",
              },
              {
                title: "Tools & Pipeline",
                description: "Production tools, content pipelines, and automation that accelerate teams.",
              },
              {
                title: "Backend & Cloud",
                description: "Secure APIs, matchmaking, analytics, and cloud infrastructure for launch-ready products.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Approach</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Studio-grade process, predictable delivery.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                We combine product clarity, technical quality, and delivery transparency to help teams launch faster and maintain stronger live operations.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  "Clear milestones and sprint planning",
                  "Hands-on QA and performance tuning",
                  "Cross-platform launch readiness",
                  "Dedicated post-launch support",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-2xl font-semibold mb-4">Capabilities</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-semibold">Responsive Engineering</p>
                  <p>We ship high-quality code that is easy to iterate on and scale.</p>
                </div>
                <div>
                  <p className="font-semibold">Cross-platform Delivery</p>
                  <p>Mobile, web, desktop, and live service architecture all handled by one team.</p>
                </div>
                <div>
                  <p className="font-semibold">Security & Stability</p>
                  <p>Production-grade practices and secure release processes keep your product safe.</p>
                </div>
              </div>
              <Link href="#contact" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Schedule a consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Contact engineering</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Launch stronger products with our studio team.</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Connect with our engineering leads to discuss your development roadmap and product ambitions.
          </p>
          <Link href="mailto:hello@gecogamesstudios.com" className="mt-10 inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400">
            Email engineering
          </Link>
        </div>
      </section>
    </div>
  )
}
