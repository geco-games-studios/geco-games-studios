import Link from "next/link"

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <span className="inline-flex rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-200 uppercase tracking-[0.24em]">
            Careers
          </span>
          <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">Build games, events, and experiences with us.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Join the Geco Games Studios team in Lusaka and help shape the national esports movement with product, creative, and live-event roles.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/support/contact" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Contact hiring
            </Link>
            <Link href="/support/faq" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              View hiring process
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Open roles</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Opportunities in design, engineering, and events.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                We hire local talent across game production, esports operations, community engagement, and studio growth.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Esports operations manager",
                "Game designer / level designer",
                "Community & content lead",
                "Business development associate",
              ].map((role) => (
                <div key={role} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-2xl font-semibold">{role}</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-400">A growth-focused role supporting our gaming centers, events, and studio delivery in Zambia.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-300">Apply today</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Ready to join a Lusaka-first esports studio?</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Send a short message describing your experience and the role you want to pursue.
          </p>
          <Link href="mailto:hello@gecogamesstudios.com" className="mt-10 inline-flex items-center justify-center rounded-full bg-green-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-green-400">
            Email us your application
          </Link>
        </div>
      </section>
    </main>
  )
}
