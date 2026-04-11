import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Briefcase, Globe, Layers, Play, Shield, Sparkles, Star, Users } from "lucide-react"
import NewsletterSubscription from "../components/newsletter-subscription"

const stats = [
  { label: "Years in business", value: "6+", icon: Briefcase },
  { label: "Games launched", value: "28", icon: Star },
  { label: "Global players", value: "150K+", icon: Users },
  { label: "Studio partners", value: "12", icon: Globe },
]

const services = [
  {
    title: "Game Development",
    description: "Specialized mobile game and app development with premium execution, scalable live operations, and cross-platform deployment.",
    icon: Play,
  },
  {
    title: "Art & Animation",
    description: "Premium art direction, character design, and cinematic animation that elevate every story.",
    icon: Layers,
  },
  {
    title: "Academy & Education",
    description: "Comprehensive game development courses covering Unity, Unreal, art, audio, and business skills taught by industry professionals.",
    icon: Star,
  },
  {
    title: "Strategy & Growth",
    description: "Product strategy, live marketing, and audience growth plans built for game launches and long-term retention.",
    icon: Shield,
  },
  {
    title: "Esports & Events",
    description: "End-to-end esports experiences, event production, and community engagement for competitive brands.",
    icon: Globe,
  },
]

const portfolio = [
  {
    title: "Arena Legends",
    subtitle: "Competitive title launch",
    image: "/games/our-last-prayer-arena.png",
    details: "Premium battle arena title with a sustained eSports roadmap and community activation.",
  },
  {
    title: "Chef Stories",
    subtitle: "Brand-driven mobile game",
    image: "/games/become-a-chef.png",
    details: "A chef simulation title that blends casual gameplay with branded storytelling.",
  },
  {
    title: "Puzzle Mastery",
    subtitle: "Engagement campaign",
    image: "/games/block-cat-fill.png",
    details: "Puzzle experiences designed for high retention and cross-platform discovery.",
  },
]

const featuredGames = [
  {
    title: "Fruit Valley",
    image: "/games/fruit-valley.png",
    description: "A vibrant puzzle game with premium visuals and joyful player loops.",
  },
  {
    title: "Atomic Crush",
    image: "/games/atomic-crush.png",
    description: "A fast-paced arcade experience with strong retention mechanics.",
  },
  {
    title: "Clear Skies 3D",
    image: "/games/clear-skies-3d.png",
    description: "A polished 3D flight simulation with cinematic world art.",
  },
]

const characterGallery = [
  {
    name: "Jeonz",
    role: "Hero concept",
    image: "/characters/jeonz.png",
  },
  {
    name: "Lotus",
    role: "World champion",
    image: "/characters/lotus.png",
  },
  {
    name: "Mis Fortune",
    role: "Mystic rival",
    image: "/characters/mis-fortune.png",
  },
]

const processSteps = [
  { title: "Discover", description: "We align on vision, goals, and audience expectations before we design any concept." },
  { title: "Design", description: "Concept, art direction, and UX are crafted together to create a memorable player experience." },
  { title: "Deliver", description: "We build polished products with transparent milestones, QA, and production support." },
  { title: "Support", description: "Live operations, updates, and community growth keep your product thriving beyond launch." },
]

export default function HomePage() {
  return (
    <div className="bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative overflow-hidden min-h-screen lg:min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/creativity/animation-portal.png" 
            alt="Geco Games Studio background" 
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content positioned directly over the image */}
        <div className="container mx-auto px-6 py-20 lg:py-28 relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                Mobile-first game studio for modern brands
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl text-white">
                We build games, interactive experiences, and digital products that resonate.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-100">
                From concept and creative direction to launch support and esports production, Geco Games Studios helps teams deliver world-class interactive experiences with clarity and polish.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#contact" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
                  Start a project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="#portfolio" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  View portfolio
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <div className="flex items-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-sm">
                  <Image src="/logo-dark.png" alt="Geco Games Studios logo" width={32} height={32} className="object-contain" />
                  <span>Studio brand identity</span>
                </div>
                <div className="rounded-3xl border border-white/20 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Featured in</p>
                  <p className="mt-1 text-sm text-slate-100">Games, live events, and education.</p>
                </div>
              </div>
            </div>

            {/* Right side spacer for layout balance */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">Our services</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Solutions for every stage of your game.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              We combine creative storytelling, technical craftsmanship, and market experience to build products that perform and delight.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {services.map((service) => (
              <div key={service.title} className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                <p className="mt-4 text-slate-600 dark:text-slate-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
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

      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800 dark:bg-green-900/20 dark:text-green-300 mb-6">
              🚀 We're Hiring!
            </div>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-6">Join Our Creative Team</h2>
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 mb-8">
              We're looking for talented individuals to help us create amazing games and stories. Newly accepted positions will be classified as Full-Time and Remote.
            </p>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="rounded-3xl border border-green-200 bg-white p-8 shadow-sm dark:border-green-800 dark:bg-slate-900">
                <div className="text-3xl mb-4">✍️</div>
                <h3 className="text-2xl font-semibold mb-3">Story Writer</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Craft compelling narratives and character arcs for our games. Help bring worlds and stories to life through engaging storytelling.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/20">
                    Full-Time
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/20">
                    Remote
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-green-200 bg-white p-8 shadow-sm dark:border-green-800 dark:bg-slate-900">
                <div className="text-3xl mb-4">🎮</div>
                <h3 className="text-2xl font-semibold mb-3">Game Developer</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Build interactive experiences using modern game engines. Work on gameplay systems, mechanics, and technical implementation.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/20">
                    Full-Time
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/20">
                    Remote
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold mb-4">How to Apply</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Send your CV and portfolio to <strong>hello@gecogames.com</strong> with the position title in the subject line.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                  href="mailto:hello@gecogames.com?subject=Application for Story Writer Position"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
                >
                  Apply for Story Writer
                </Link>
                <Link
                  href="mailto:hello@gecogames.com?subject=Application for Game Developer Position"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
                >
                  Apply for Game Developer
                </Link>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-2xl border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>⏰ Application Deadline:</strong> April 10, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20 px-6 lg:px-8 bg-slate-100 dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">Portfolio</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Selected work that showcases our expertise.</h2>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            {portfolio.map((project) => (
              <div key={project.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="relative h-64 w-full">
                  <Image src={project.image} alt={project.title} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <p className="text-sm uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">{project.subtitle}</p>
                  <h3 className="mt-3 text-2xl font-semibold">{project.title}</h3>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">{project.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">Featured games</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Games that prove our work speaks for itself.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Every title in our portfolio is built with strong mechanics, polished visuals, and product-first launch thinking.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredGames.map((game) => (
              <div key={game.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="relative h-64 w-full">
                  <Image src={game.image} alt={game.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold">{game.title}</h3>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">{game.description}</p>
                  <div className="mt-6 flex gap-3">
                    <a
                      href="https://play.google.com/store/apps/dev?id=5105347513801222490"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      Download on Google Play
                    </a>
                    <span className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                      iOS Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-slate-100 dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">Character gallery</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Character designs that bring your worlds to life.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Iconic characters, strong silhouettes, and expressive art direction are at the heart of our visual storytelling.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {characterGallery.map((character) => (
              <div key={character.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="relative h-72 w-full overflow-hidden rounded-3xl">
                  <Image src={character.image} alt={character.name} fill className="object-cover" />
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-semibold">{character.name}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{character.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">How we work</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">A transparent process built for ambitious teams.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                We move quickly and intentionally, keeping milestones clear and communication aligned from day one.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {processSteps.map((step, index) => (
                <div key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white font-semibold">{index + 1}</div>
                  <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-slate-100 dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">Stay connected</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Join our community of creators.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Get exclusive insights, behind-the-scenes content, and early access to our latest projects. Join thousands of game developers, artists, and enthusiasts.
              </p>
              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">
                    <Sparkles className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span>Weekly industry insights and trends</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">
                    <Layers className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span>Exclusive tutorials and production tips</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">
                    <Star className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span>Early access to new game releases</span>
                </li>
              </ul>
            </div>
            <div className="lg:pl-8">
              <NewsletterSubscription />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-8 bg-slate-950 text-white">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-400">Let’s build together</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Bring your next game or digital experience to life.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Book a consultation with our team to explore product strategy, production, and live growth services.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Contact</p>
              <div className="mt-6 space-y-4 text-base leading-7 text-slate-200">
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:hello@gecogamesstudios.com" className="text-sky-400 hover:text-sky-300">hello@gecogamesstudios.com</a>
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+260978516926" className="text-sky-400 hover:text-sky-300">+260 978516926</a>
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p>Lusaka, Zambia</p>
                </div>
              </div>
              <Link href="mailto:hello@gecogamesstudios.com" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
                Send a message
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
