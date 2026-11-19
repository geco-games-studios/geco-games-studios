import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, House, Play, Sparkles, Swords, UsersRound, Wallet } from "lucide-react"

const clonesIncUrl = "https://geco-games-studios-ltd.itch.io/clones-inc"

export const metadata: Metadata = {
  title: "Clones Inc | GECO Games Studios",
  description:
    "Hunt through dungeons, bring home gold and artifacts, build a village for clone families, and learn everyday money decisions in Clones Inc.",
}

const features = [
  {
    icon: Swords,
    title: "Take on dungeon hunts",
    description: "Head into action-packed dungeons where every hunt brings new choices.",
  },
  {
    icon: Sparkles,
    title: "Bring home the loot",
    description: "Collect gold and artifacts as you explore, then decide what to do next.",
  },
  {
    icon: House,
    title: "Build a village",
    description: "Create a home where clone families can settle and grow.",
  },
  {
    icon: Wallet,
    title: "Make money choices",
    description: "Practice everyday money decisions through the choices you make in play.",
  },
]

export default function ClonesIncPage() {
  return (
    <div className="text-white">
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden px-6 pb-16 pt-36 sm:px-10 lg:px-12 lg:pb-24">
        <Image
          src="/games/clones-inc.png"
          alt="Clones Inc pixel-art world and characters"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#100d3d] via-[#100d3d]/80 to-[#100d3d]/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#100d3d] via-transparent to-[#100d3d]/20" />

        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/20 bg-violet-950/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-200 backdrop-blur">
              <UsersRound aria-hidden="true" className="h-4 w-4" />
              A GECO Games title
            </span>
            <h1 className="mt-7 text-5xl font-black tracking-tight sm:text-7xl">Clones Inc</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Meet the clones in a dungeon action and village-building game where every hunt brings new choices.
              Collect gold and artifacts, build a home for clone families, and learn to handle everyday money
              decisions through play.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={clonesIncUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-violet-500"
              >
                <Play aria-hidden="true" className="h-4 w-4" />
                Play on itch.io
              </a>
              <Link
                href="/#clones-inc"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Back to GECO Games
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="clones-inc-features" className="px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Hunt, choose, build</p>
            <h2 id="clones-inc-features" className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Every adventure adds to your village.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Set out with your clones, bring back what you find, and shape a place for families to call home.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-violet-200/15 bg-gradient-to-r from-violet-900/50 to-cyan-900/30 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-200">Ready to meet the clones?</p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">Start your next hunt in Clones Inc.</h2>
            </div>
            <a
              href={clonesIncUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-violet-950 transition hover:bg-violet-100"
            >
              Play on itch.io
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
