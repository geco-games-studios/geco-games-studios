import Image from "next/image"
import Link from "next/link"

const characters = [
  {
    name: "Jeonz",
    role: "The street architect",
    description:
      "A tactical mind forged in the neon districts, Jeonz masters every battle by reading the city and its people first.",
    href: "/stories/jeonz",
    image: "/characters/jeonz.png",
  },
  {
    name: "Lotus",
    role: "The tournament sovereign",
    description:
      "Lotus moves like water and lands like thunder. She is the embodiment of focus, precision, and a drive that never softens.",
    href: "/stories/lotus",
    image: "/characters/lotus.png",
  },
  {
    name: "Mis Fortune",
    role: "The gamble queen",
    description:
      "Every choice is a calculated risk for Mis Fortune. She draws power from danger and protects the people who are counted out.",
    href: "/stories/mis-fortune",
    image: "/characters/mis-fortune.png",
  },
]

export default function StoriesPage() {
  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_45%)]" />
        <div className="relative container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Stories
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Character chapters built to feel cinematic.
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg">
              Explore three original character stories from the Geco universe. Each page is written with precise tone, polished structure, and a strong sense of world.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {characters.map((character) => (
            <Link
              key={character.name}
              href={character.href}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:bg-slate-950"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-3xl bg-slate-800">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{character.role}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{character.name}</h2>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-700 dark:text-slate-300">{character.description}</p>

              <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6 text-sm text-cyan-300 transition group-hover:text-white">
                <span>Read the story</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
