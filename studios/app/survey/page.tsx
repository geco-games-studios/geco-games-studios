import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Gamepad2, GraduationCap, Layers3, Network, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "BUNC AI | Geco Games Studios",
  description:
    "Discover BUNC, Geco Games Studios' cross-system integrated artificial intelligence initiative.",
}

const connectedSystems = [
  {
    title: "Games & play",
    description: "Explore how intelligent features can support richer, more responsive game experiences.",
    icon: Gamepad2,
  },
  {
    title: "Learning & creation",
    description: "Bring AI-assisted tools and guidance closer to the people learning and building with us.",
    icon: GraduationCap,
  },
  {
    title: "Studio services",
    description: "Connect creative and technical workflows across the wider Geco Games Studios ecosystem.",
    icon: Layers3,
  },
]

export default function BuncPage() {
  return (
    <div className="min-h-screen text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#17104c] via-[#28206d] to-[#10143d] px-6 py-24 sm:py-32 lg:px-12">
        <div className="container relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/20 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-violet-100">
              <Sparkles className="h-4 w-4" />
              Introducing BUNC
            </span>
            <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Geco Games Studios
              <span className="mt-2 block text-violet-200">Artificial Intelligence</span>
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-violet-100 sm:text-xl">
              A first-ever cross-system integrated artificial intelligence initiative—bringing
              together the games, learning, and creative technology of Geco Games Studios.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="#vision"
                className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-violet-400"
              >
                Explore the vision <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:hello@gecogamesstudios.com?subject=BUNC%20AI%20enquiry"
                className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="vision" className="px-6 py-20 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <Network className="mx-auto h-10 w-10 text-cyan-300" />
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
              One connected ecosystem
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Intelligence built to work across systems.
            </h2>
            <p className="mt-6 text-lg leading-8 text-violet-100">
              BUNC is Geco Games Studios&apos; vision for a connected AI layer across our digital
              ecosystem. It is designed to help people discover, create, learn, and play—with
              experiences shaped for each part of the studio.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {connectedSystems.map((system) => (
              <article
                key={system.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
              >
                <system.icon className="h-8 w-8 text-violet-300" />
                <h3 className="mt-5 text-xl font-bold">{system.title}</h3>
                <p className="mt-3 leading-7 text-violet-100">{system.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-12">
        <div className="container mx-auto max-w-5xl rounded-3xl border border-violet-200/15 bg-violet-500/10 px-7 py-10 text-center sm:px-12 sm:py-14">
          <h2 className="text-3xl font-bold sm:text-4xl">A smarter studio experience starts here.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-violet-100">
            BUNC is an evolving initiative. Talk to our team about its direction and the future of
            integrated AI at Geco Games Studios.
          </p>
          <Link
            href="mailto:hello@gecogamesstudios.com?subject=BUNC%20AI%20enquiry"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-violet-400"
          >
            Contact the studio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
