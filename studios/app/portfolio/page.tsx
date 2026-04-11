import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink, Play, Star, Users } from "lucide-react"

export default function PortfolioPage() {
  const portfolio = [
    {
      title: "Arena Legends",
      subtitle: "Competitive title launch",
      image: "/games/our-last-prayer-arena.png",
      details: "Premium battle arena title with a sustained eSports roadmap and community activation.",
      category: "Mobile Game",
      platform: "iOS & Android",
      downloads: "500K+",
      rating: "4.8",
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
      platform: "iOS & Android",
      downloads: "1.2M+",
      rating: "4.6",
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
      platform: "iOS & Android",
      downloads: "800K+",
      rating: "4.7",
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
      platform: "iOS & Android",
      downloads: "2.1M+",
      rating: "4.9",
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
      platform: "iOS & Android",
      downloads: "950K+",
      rating: "4.5",
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
      platform: "iOS & Android",
      downloads: "650K+",
      rating: "4.4",
      features: [
        "Realistic flight physics",
        "Beautiful 3D environments",
        "Multiple aircraft",
        "Weather systems",
        "Free flight mode"
      ]
    }
  ]

  const stats = [
    { label: "Games Launched", value: "28", icon: Play },
    { label: "Total Downloads", value: "10M+", icon: Users },
    { label: "Average Rating", value: "4.7", icon: Star },
    { label: "Platforms", value: "iOS & Android", icon: ExternalLink }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white">
              Our Portfolio
            </span>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
              Games that speak for themselves.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-white/80">
              Every title in our portfolio represents our commitment to quality mobile game development, innovation, and player satisfaction. From concept to launch, we deliver exceptional mobile gaming experiences.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="#portfolio" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                View our work
              </Link>
              <Link href="#contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-6 text-3xl font-semibold">{item.value}</p>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              </div>
            ))}
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
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{project.rating}</span>
                        </div>
                        <p className="text-sm text-white/80">{project.downloads} downloads</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {project.category}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{project.platform}</span>
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

                  <div className="flex gap-3">
                    <a
                      href="https://play.google.com/store/apps/dev?id=5105347513801222490"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      View on Play Store
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                      iOS Coming Soon
                    </span>
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