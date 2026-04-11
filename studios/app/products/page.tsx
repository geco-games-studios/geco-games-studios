import Link from "next/link"

export default function ProductsPage() {
  const products = [
    {
      title: "Live Event Platform",
      description: "A turnkey solution for events, tournaments, and community activations.",
    },
    {
      title: "Interactive Learning Hub",
      description: "A modern education platform for game creators and teams.",
    },
    {
      title: "Creator Toolkit",
      description: "Assets, templates, and production tools for fast game development.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-950 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-200 uppercase tracking-[0.24em]">
                Digital Products
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Products designed for studios and creators.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                We deliver tools, platforms, and interactive products that help teams launch faster and engage broader audiences.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#portfolio" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Explore products
                </Link>
                <Link href="#contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Contact sales
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Scale</p>
                  <p className="mt-3 text-3xl font-semibold">Flexible deployments</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Support</p>
                  <p className="mt-3 text-3xl font-semibold">Platform services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Products</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Studio products for modern workflows.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Product</p>
                <h3 className="mt-4 text-2xl font-semibold">{product.title}</h3>
                <p className="mt-4 text-slate-600 dark:text-slate-400">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Product design</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Tools built to help teams ship faster.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                We build intuitive products that streamline creative workflows and support game launches at every stage.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  "Collaborative production dashboards",
                  "Content pipeline automation",
                  "Player engagement tools",
                  "Event and launch management systems",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-2xl font-semibold mb-4">Implementation support</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-semibold">Integration guidance</p>
                  <p>We help you adopt our products quickly and efficiently.</p>
                </div>
                <div>
                  <p className="font-semibold">Training resources</p>
                  <p>Documentation and onboarding for your team.
</p>
                </div>
                <div>
                  <p className="font-semibold">Ongoing updates</p>
                  <p>Regular improvements and support for evolving needs.</p>
                </div>
              </div>
              <Link href="#contact" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
                Talk product
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Product inquiry</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Launch stronger digital products with us.</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Email our product team to discuss how our studio products can support your next release.
          </p>
          <Link href="mailto:hello@gecogamesstudios.com" className="mt-10 inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
            Email product team
          </Link>
        </div>
      </section>
    </div>
  )
}
