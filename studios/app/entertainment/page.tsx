import Link from "next/link"

export default function EntertainmentPage() {
  const pieces = [
    {
      title: "Studio Showreel",
      description: "A cinematic look at our most ambitious creative projects and game experiences.",
    },
    {
      title: "Music & Sound Design",
      description: "Original audio production crafted to amplify storytelling and emotional impact.",
    },
    {
      title: "Community Stories",
      description: "Behind-the-scenes features, interviews, and fan-driven narratives.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white">
                Creative Entertainment
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Showcase your brand with premium entertainment content.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
                We produce trailers, original media, and editorial content that make your games and events feel unforgettable.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#content" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  View content
                </Link>
                <Link href="#contact" className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Book a session
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/80">Featured</p>
                  <p className="mt-3 text-3xl font-semibold">Original series</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/80">Formats</p>
                  <p className="mt-3 text-3xl font-semibold">Video, audio, stories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="content" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Our work</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Media that amplifies player engagement.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {pieces.map((item) => (
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
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Capabilities</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">From trailers to original storytelling.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                We help studios build cultural moments with visual stories, audio branding, and community-driven entertainment.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  "Trailer production and cinematic edits",
                  "Music and sound design for games and campaigns",
                  "Documentaries, interviews, and community features",
                  "Branded content for launch and events",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-pink-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-2xl font-semibold mb-4">Featured formats</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-semibold">Launch trailers</p>
                  <p>High-impact trailers designed for launches and key campaigns.</p>
                </div>
                <div>
                  <p className="font-semibold">Audio identities</p>
                  <p>Original soundtracks, ambient music, and audio branding.</p>
                </div>
                <div>
                  <p className="font-semibold">Behind-the-scenes content</p>
                  <p>Studio stories and player-focused narratives that build trust.</p>
                </div>
              </div>
              <Link href="#contact" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-400">
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-300">Connect with our creative team</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Build compelling content for your brand and audience.</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Reach out to explore video, audio, and editorial experiences for your next game or campaign.
          </p>
          <Link href="mailto:hello@gecogamesstudios.com" className="mt-10 inline-flex items-center justify-center rounded-full bg-pink-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-pink-400">
            Email our team
          </Link>
        </div>
      </section>
    </div>
  )
}
