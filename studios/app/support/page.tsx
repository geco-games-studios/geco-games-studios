import Link from "next/link"

export default function SupportPage() {
  const categories = [
    {
      title: "Customer Support",
      description: "Assistance with accounts, purchases, and product access.",
    },
    {
      title: "Technical Support",
      description: "Bug reports, performance help, and compatibility guidance.",
    },
    {
      title: "Partnership Support",
      description: "Studio collaboration, service requests, and proposal inquiries.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-200 uppercase tracking-[0.24em]">
                Support Center
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Get the support you need, when you need it.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Our support team is ready to help with product questions, technical issues, and studio partnership requests.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#categories" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  View options
                </Link>
                <Link href="#contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Contact support
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-green-200">Response</p>
                  <p className="mt-3 text-3xl font-semibold">Fast and reliable</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-green-200">Coverage</p>
                  <p className="mt-3 text-3xl font-semibold">Product, technical, partnership</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Categories</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Support tailored to your needs.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-2xl font-semibold mb-3">{category.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Our promise</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Clear guidance, quick responses, and trusted support.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                Our support team is structured to help studios and players with fast solutions and thoughtful advice.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  "Direct access to support specialists",
                  "Transparent response times",
                  "Friendly and professional assistance",
                  "Product and partnership support",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-2xl font-semibold mb-4">Fast contact</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-semibold">Email</p>
                  <p>hello@gecogamesstudios.com</p>
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p>+260 978516926</p>
                </div>
                <div>
                  <p className="font-semibold">Office</p>
                  <p>Lusaka, Zambia</p>
                </div>
              </div>
              <Link href="#contact" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-400">
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-300">Support contact</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Need help? We’re here to support you.</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Email our support team to get help with your product, account, or partnership request.
          </p>
          <Link href="mailto:hello@gecogamesstudios.com" className="mt-10 inline-flex items-center justify-center rounded-full bg-green-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-green-400">
            Email support
          </Link>
        </div>
      </section>
    </div>
  )
}
