import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Globe, GraduationCap, Layers, Play, Shield, Sparkles, Star, Trophy, Users } from "lucide-react"
import NewsletterSubscription from "../components/newsletter-subscription"

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
  {
    title: "Kopala Survival",
    image: "/Kopala.jpg",
    description: "An atmospheric survival adventure built for tense exploration and emergent gameplay.",
  },
]

const characterGallery = [
  {
    name: "The Horned Warlord",
    role: "Legends of Alkebulan · Character reveal",
    image: "/alkebulan-horned-warlord.jpeg",
  },
  {
    name: "The Bone Shaman",
    role: "Legends of Alkebulan · Character reveal",
    image: "/alkebulan-bone-shaman.jpeg",
  },
  {
    name: "The Forest Guardian",
    role: "Legends of Alkebulan · Character reveal",
    image: "/alkebulan-forest-guardian.jpeg",
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
      <section className="cosmic-hero relative flex min-h-screen items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(83,63,218,.38),transparent_25%),radial-gradient(circle_at_12%_18%,rgba(220,32,129,.2),transparent_18%),linear-gradient(180deg,#121044_0%,#17124e_70%,#24145a_100%)]" />
        <div className="absolute left-[8%] top-[18%] h-20 w-20 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-900 opacity-70 shadow-[0_0_70px_rgba(225,47,151,.35)]" />
        <div className="absolute right-[8%] top-[14%] h-28 w-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-900 opacity-50 shadow-[0_0_90px_rgba(39,216,232,.25)]" />
        <div className="absolute bottom-[15%] left-[42%] h-2 w-40 rotate-[-38deg] rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-violet-500 shadow-[0_0_18px_#27d8e8]" />
        
        {/* Content positioned directly over the image */}
        <div className="container mx-auto px-6 py-20 lg:py-28 relative z-10">
          <div className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-violet-200 shadow-sm">
                Independent game studio · Zambia
              </span>
              <h1 className="mt-8 text-5xl font-black leading-[.98] tracking-[-.04em] text-white sm:text-7xl">
                We create worlds worth playing.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-100">
                Original games, unforgettable characters, and digital experiences shaped by African imagination and built for players everywhere.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/gaming" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-7 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-sky-400">
                  Explore our games
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/about" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10">
                  Meet the studio
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <div className="flex items-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-sm">
                  <Image src="/logo-light.png" alt="Geco Games Studios" width={32} height={32} className="h-8 w-8 object-contain" />
                  <span>Studio brand identity</span>
                </div>
                <div className="rounded-3xl border border-white/20 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Featured in</p>
                  <p className="mt-1 text-sm text-slate-100">Games, live events, and education.</p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto h-[470px] w-full max-w-[620px] sm:h-[590px]">
              <div className="absolute inset-x-[8%] bottom-[6%] h-20 rounded-[50%] bg-black/50 blur-2xl" />
              <div className="absolute left-0 top-[22%] h-[62%] w-[44%] rotate-[-7deg] overflow-hidden rounded-[2rem] border border-white/10 bg-cyan-400/10 shadow-2xl">
                <Image src="/alkebulan-bone-shaman.jpeg" alt="The Bone Shaman from Legends of Alkebulan" fill className="object-cover object-top" priority />
              </div>
              <div className="absolute right-0 top-[15%] h-[70%] w-[48%] rotate-[6deg] overflow-hidden rounded-[2rem] border border-white/10 bg-violet-400/10 shadow-2xl">
                <Image src="/alkebulan-horned-warlord.jpeg" alt="The Horned Warlord from Legends of Alkebulan" fill className="object-cover object-top" priority />
              </div>
              <div className="absolute bottom-0 left-[28%] h-[64%] w-[46%] overflow-hidden rounded-[2rem] border border-white/20 bg-fuchsia-400/10 shadow-[0_30px_80px_rgba(5,3,29,.65)]">
                <Image src="/alkebulan-forest-guardian.jpeg" alt="The Forest Guardian from Legends of Alkebulan" fill className="object-cover object-top" priority />
              </div>
              <div className="absolute right-[3%] top-[6%] rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-200 backdrop-blur">Legends of Alkebulan</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="container mx-auto">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#17124e]/80 shadow-[0_30px_100px_rgba(4,3,24,.45)]">
            <div className="grid lg:grid-cols-[1.08fr_.92fr] lg:items-stretch">
              <div className="relative min-h-[440px] overflow-hidden sm:min-h-[600px]">
                <Image
                  src="/legends-of-alkebulan-map.jpeg"
                  alt="The world map of Legends of Alkebulan"
                  fill
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100d3d]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#17124e]" />
                <div className="absolute bottom-6 left-6 rounded-full border border-white/15 bg-[#100d3d]/70 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-cyan-200 backdrop-blur">
                  Early world map
                </div>
              </div>
              <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <p className="text-xs font-black uppercase tracking-[.3em] text-violet-300">A new legend is forming</p>
                <h2 className="mt-5 text-4xl font-black tracking-[-.04em] sm:text-6xl">Legends of Alkebulan</h2>
                <p className="mt-7 text-lg leading-8">
                  Journey across a vast world of frozen peaks, ancient forests, winding rivers, and distant island realms. A new original game from Geco Games Studios is currently in development.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  {[
                    ["3", "Great realms"],
                    ["New", "Original world"],
                    ["WIP", "In development"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xl font-black text-white">{value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider">{label}</p>
                    </div>
                  ))}
                </div>
                <Link href="#characters" className="mt-9 inline-flex w-fit items-center rounded-full bg-violet-600 px-7 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-violet-500">
                  Meet the first characters <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[.26em] text-violet-300">More than a game studio</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.035em] sm:text-5xl">Play, compete, learn, and build with GECO.</h2>
            <p className="mt-6 text-lg leading-8">Our ecosystem brings players, competitors, students, and creators together through three connected experiences.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <article className="group relative overflow-hidden rounded-[2rem] border border-violet-300/15 bg-gradient-to-br from-violet-500/20 to-[#17132f] p-8 shadow-2xl sm:p-10">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-violet-500/20 blur-2xl transition group-hover:scale-125" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-[0_0_30px_rgba(139,92,246,.35)]"><Users className="h-7 w-7" /></div>
              <p className="relative mt-8 text-xs font-black uppercase tracking-[.24em] text-violet-300">Community platform</p>
              <h3 className="relative mt-3 text-3xl font-black">JamPass</h3>
              <p className="relative mt-4 leading-7">A home for players to join gaming communities, discover competitions, follow leaderboards, and participate in the wider GECO ecosystem.</p>
              <Link href="/jampass" className="relative mt-8 inline-flex items-center text-sm font-black text-white">Discover JamPass <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></Link>
            </article>

            <article className="group relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-500/20 to-[#17132f] p-8 shadow-2xl sm:p-10">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-500/20 blur-2xl transition group-hover:scale-125" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,.35)]"><Trophy className="h-7 w-7" /></div>
              <p className="relative mt-8 text-xs font-black uppercase tracking-[.24em] text-cyan-300">Competitive gaming</p>
              <h3 className="relative mt-3 text-3xl font-black">GECO Esports</h3>
              <p className="relative mt-4 leading-7">Competitive experiences, tournament production, player engagement, and community events designed to help gaming talent take the stage.</p>
              <Link href="/esports" className="relative mt-8 inline-flex items-center text-sm font-black text-white">Explore Esports <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></Link>
            </article>

            <article className="group relative overflow-hidden rounded-[2rem] border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/20 to-[#17132f] p-8 shadow-2xl sm:p-10">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-fuchsia-500/20 blur-2xl transition group-hover:scale-125" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-500 text-white shadow-[0_0_30px_rgba(217,70,239,.35)]"><GraduationCap className="h-7 w-7" /></div>
              <p className="relative mt-8 text-xs font-black uppercase tracking-[.24em] text-fuchsia-300">Creative education</p>
              <h3 className="relative mt-3 text-3xl font-black">Geco Academy</h3>
              <p className="relative mt-4 leading-7">Industry-led game development, programming, and digital creation training. Our first 2026 cohort is currently underway.</p>
              <Link href="/academy" className="relative mt-8 inline-flex items-center text-sm font-black text-white">Visit the Academy <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></Link>
            </article>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="characters" className="py-20 px-6 lg:px-8 bg-slate-100 dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">Character gallery</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Meet the first legends of Alkebulan.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              A first look at the warriors, guardians, and mystics taking shape inside our newest original world. Official names and stories will be revealed as development continues.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {characterGallery.map((character) => (
              <div key={character.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="relative h-[28rem] w-full overflow-hidden rounded-3xl">
                  <Image src={character.image} alt={character.name} fill className="object-cover object-top transition duration-500 hover:scale-105" />
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
              <ul className="mt-10 grid gap-4">
                <li className="flex items-center gap-4 rounded-2xl border border-violet-300/20 bg-violet-400/10 p-5 text-base font-bold text-white shadow-lg backdrop-blur">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white shadow-[0_0_24px_rgba(139,92,246,.4)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span>Weekly industry insights and trends</span>
                </li>
                <li className="flex items-center gap-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-5 text-base font-bold text-white shadow-lg backdrop-blur">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-[0_0_24px_rgba(6,182,212,.4)]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span>Exclusive tutorials and production tips</span>
                </li>
                <li className="flex items-center gap-4 rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-5 text-base font-bold text-white shadow-lg backdrop-blur">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500 text-white shadow-[0_0_24px_rgba(217,70,239,.4)]">
                    <Star className="h-5 w-5" />
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

      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-16">
            <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white mb-6">
              Professional Tools
            </span>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Licenses & Tools
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We use industry-leading tools and hold licenses for professional game development, ensuring the highest quality in every project.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="group">
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center">
                  <div className="w-32 h-32 mb-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-inner">
                    <img 
                      src="/blender.png" 
                      alt="Blender" 
                      className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Blender</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">3D Modeling & Animation</p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center">
                  <div className="w-32 h-32 mb-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-inner">
                    <img 
                      src="/unity.jpeg" 
                      alt="Unity 3D" 
                      className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Unity 3D</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Game Engine & Development</p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-950/20 dark:to-slate-900/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center">
                  <div className="w-32 h-32 mb-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-inner">
                    <img
                      src="/godot.webp"
                      alt="Godot Engine"
                      className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Godot Engine</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Open-source Game Engine</p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center">
                  <div className="w-32 h-32 mb-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-inner">
                    <img 
                      src="/Unreal_Engine-Logo.wine.png" 
                      alt="Unreal Engine" 
                      className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Unreal Engine</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Advanced Game Engine</p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center">
                  <div className="w-32 h-32 mb-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-inner">
                    <img 
                      src="/Inkscape_Logo_full.png" 
                      alt="Inkscape" 
                      className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Inkscape</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Vector Graphics & Design</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              These industry-standard tools power our creative process and ensure professional-quality results.
            </p>
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
