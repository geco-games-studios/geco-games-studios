import Link from "next/link"

export default function SupportContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <span className="inline-flex rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-200 uppercase tracking-[0.24em]">
            Contact Support
          </span>
          <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">Reach our support team.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            We’re here to help with account questions, tournament registration, studio onboarding, and general support.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="mailto:hello@gecogamesstudios.com" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Email support
            </a>
            <Link href="/support/faq" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              Visit FAQ
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "Email support",
              description: "hello@gecogamesstudios.com",
            },
            {
              title: "Phone",
              description: "+260 978516926",
            },
            {
              title: "Location",
              description: "Lusaka, Zambia",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
