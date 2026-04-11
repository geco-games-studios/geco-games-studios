import Link from "next/link"
import NewsletterSubscription from "../../components/newsletter-subscription"

export default function NewslettersPage() {
  const newsletters = [
    {
      title: "Game Dev Weekly",
      description: "Industry insights, project updates, and studio news every week.",
    },
    {
      title: "Player Spotlight",
      description: "Community stories, featured creators, and exclusive interviews.",
    },
    {
      title: "Tech Insider",
      description: "Deep dives into game technology, tools, and production workflows.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-violet-900 via-fuchsia-900 to-pink-900 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white">
                Insights & News
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Subscribe to our studio newsletters.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Stay connected with the latest product announcements, editorial stories, and industry analysis from our studio.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#plan" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  View editions
                </Link>
                <Link href="#contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Subscribe now
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/80">Edition</p>
                  <p className="mt-3 text-3xl font-semibold">Weekly insights</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/80">Focus</p>
                  <p className="mt-3 text-3xl font-semibold">Creative and technical coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="plan" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Newsletters</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Choose the stories you want to receive.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {newsletters.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Newsletter</p>
                <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Subscription</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Get relevant updates that matter.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                Pick the topics you care about and receive curated content from our studio and community.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  "Product launches and developer insights",
                  "Community highlights and player stories",
                  "Technical tutorials and production tips",
                  "Event announcements and special offers",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-violet-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <NewsletterSubscription />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">Stay informed</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">Subscribe with confidence.</h2>
              <p className="mt-6 max-w-2xl text-lg text-slate-300">
                Join our newsletter community and receive curated content from our studio and industry insights.
              </p>
            </div>
            <NewsletterSubscription variant="hero" />
          </div>
        </div>
      </section>
    </div>
  )
}
