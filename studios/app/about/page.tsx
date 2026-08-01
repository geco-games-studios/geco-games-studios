import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  const milestones = [
    {
      year: "2015",
      title: "Founded in Southern Province",
      description: "Luyando Shilukukwa and Bulemu Narco Shilukukwa founded Geco Games Limited in the heart of Southern Province, Zambia.",
    },
    {
      year: "Early days",
      title: "Built to experiment",
      description: "The studio began by developing, playing, and testing games internally. Super Hero Race Madness became one of its earliest original titles.",
    },
    {
      year: "2016",
      title: "Our first international project",
      description: "Geco Games created Explore My Space Ride for Legends of Learning—an educational mathematics game designed for an international audience.",
    },
    {
      year: "2026",
      title: "The first Academy cohort",
      description: "Geco Games Academy welcomed its first cohort, extending the studio’s mission from making games to developing the next generation of creators.",
    },
  ]

  const portfolio = [
    {
      title: "Arena Legends",
      subtitle: "Competitive title launch",
      image: "/games/our-last-prayer-arena.png",
      details: "Premium battle arena title with a sustained eSports roadmap and community activation.",
      category: "Mobile Game",
      features: [
        "Competitive PvP gameplay",
        "Esports tournament system",
        "Live community events",
        "Cross-platform play",
        "Regular content updates"
      ]
    },
    {
      title: "Chef Stories",
      subtitle: "Brand-driven mobile game",
      image: "/games/become-a-chef.png",
      details: "A chef simulation title that blends casual gameplay with branded storytelling.",
      category: "Simulation Game",
      features: [
        "Restaurant management",
        "Recipe creation system",
        "Story-driven campaigns",
        "Social cooking features",
        "Daily challenges"
      ]
    },
    {
      title: "Puzzle Mastery",
      subtitle: "Engagement campaign",
      image: "/games/block-cat-fill.png",
      details: "Puzzle experiences designed for high retention and cross-platform discovery.",
      category: "Puzzle Game",
      features: [
        "Brain-teasing puzzles",
        "Daily challenges",
        "Achievement system",
        "Offline play",
        "Minimalist design"
      ]
    },
    {
      title: "Fruit Valley",
      subtitle: "Casual gaming experience",
      image: "/games/fruit-valley.png",
      details: "A vibrant puzzle game with premium visuals and joyful player loops.",
      category: "Puzzle Game",
      features: [
        "Colorful fruit themes",
        "Relaxing gameplay",
        "Beautiful animations",
        "Multiple difficulty levels",
        "Free-to-play model"
      ]
    },
    {
      title: "Atomic Crush",
      subtitle: "Arcade action game",
      image: "/games/atomic-crush.png",
      details: "A fast-paced arcade experience with strong retention mechanics.",
      category: "Arcade Game",
      features: [
        "Fast-paced action",
        "Power-up system",
        "High score challenges",
        "Retro arcade feel",
        "Endless gameplay"
      ]
    },
    {
      title: "Clear Skies 3D",
      subtitle: "Flight simulation",
      image: "/games/clear-skies-3d.png",
      details: "A polished 3D flight simulation with cinematic world art.",
      category: "Simulation Game",
      features: [
        "Realistic flight physics",
        "Beautiful 3D environments",
        "Multiple aircraft",
        "Weather systems",
        "Free flight mode"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white">
              About Us
            </span>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
              Born in Zambia. Building worlds for everyone.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-white/80">
              Geco Games Limited is an independent game company founded in 2015 by Luyando Shilukukwa and Bulemu Narco Shilukukwa in Southern Province, Zambia.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="#our-story" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Read our story
              </Link>
              <Link href="#contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="our-story" className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-32">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Our story</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Games can do more than entertain.</h2>
              <p className="mt-6 text-lg leading-8">
                What started as two innovators making games for internal play and testing grew into a studio with a broader purpose: using interactive entertainment to communicate ideas, make knowledge visual, and help people learn through play.
              </p>
              <p className="mt-5 text-lg leading-8">
                Today, Geco Games continues to build original games and digital experiences while nurturing new creative talent through Geco Games Academy.
              </p>
            </div>

            <div className="relative space-y-5 before:absolute before:bottom-10 before:left-[2.15rem] before:top-10 before:w-px before:bg-gradient-to-b before:from-violet-400 before:via-cyan-400 before:to-transparent">
              {milestones.map((milestone) => (
                <article key={milestone.year} className="relative rounded-3xl border border-white/10 bg-white/5 p-7 pl-24 shadow-xl backdrop-blur sm:p-9 sm:pl-28">
                  <div className="absolute left-5 top-7 z-10 flex h-9 min-w-9 items-center justify-center rounded-full border border-cyan-300/30 bg-[#18144d] px-3 text-[10px] font-black uppercase tracking-wider text-cyan-200 sm:left-6 sm:top-9">
                    {milestone.year}
                  </div>
                  <h3 className="text-2xl font-bold">{milestone.title}</h3>
                  <p className="mt-3 leading-7">{milestone.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Featured work</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Selected projects that showcase our expertise.</h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Each game represents a unique challenge solved with creativity, technical excellence, and player-centric design thinking.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {portfolio.map((project) => (
              <div key={project.title} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className="relative h-64 w-full">
                  <Image src={project.image} alt={project.title} fill className="object-cover transition group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-white/80">{project.subtitle}</p>
                        <h3 className="text-2xl font-semibold">{project.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">{project.details}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.features.map((feature) => (
                        <span key={feature} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 bg-slate-100 dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-6">Ready to create something amazing?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Let's discuss your game idea and how we can help bring it to life. Our portfolio is just the beginning of what's possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#contact" className="inline-flex items-center rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
              Start your project
            </Link>
            <Link href="/services" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
              Our services
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Let's build together</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Your next game starts here.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Join the ranks of successful game developers who've trusted us with their vision. Let's create something players will love.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Contact</p>
              <div className="mt-6 space-y-4 text-base leading-7 text-slate-200">
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:hello@gecogamesstudios.com" className="text-emerald-400 hover:text-emerald-300">hello@gecogamesstudios.com</a>
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+260978516926" className="text-emerald-400 hover:text-emerald-300">+260 978516926</a>
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p>Lusaka, Zambia</p>
                </div>
              </div>
              <Link href="mailto:hello@gecogamesstudios.com" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
                Send a message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
