import Link from "next/link"
import { ArrowRight, Globe, ShieldCheck, Trophy, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const featureTiles = [
  {
    title: "Role-based workflows",
    description: "Admin, vendor, player and developer interfaces with tailored permissions, registration flows, and ecosystem controls.",
    icon: ShieldCheck,
  },
  {
    title: "On-demand tournament entry",
    description: "Pay K2,500 only when your center decides to enter the esports tournament, keeping the platform affordable and accessible.",
    icon: Trophy,
  },
  {
    title: "Jam Wallet & marketplace",
    description: "Deposit money, buy in-game items, join clans, and access communities through the Jam Store outside tournament play.",
    icon: Globe,
  },
  {
    title: "Developer integration",
    description: "Build Jampass into mobile, PC, Xbox, and web games with currency/token conversion and reward ad systems.",
    icon: Activity,
  },
]

export default function JampassPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%),linear-gradient(to_bottom,_#eff6ff,_#ffffff)] px-6 py-20 lg:px-12">
        <div className="container mx-auto grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-cyan-300">
              🇿🇲 Lusaka, Zambia
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Geco Games Jampass — Zambia's esports wallet, developer platform, and tournament access system.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Jampass brings gaming centers, players and developers into one unified ecosystem. Centers register free and pay K2,500 only when they decide to enter the esports tournament, while developers integrate token conversion, reward ad systems, and players outside competition use the Jam Store, communities, and clan networks.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild className="bg-cyan-500 hover:bg-cyan-400">
                <Link href="/register" className="inline-flex items-center gap-2">
                  Register your center
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Link href="#how-it-works" className="inline-flex items-center rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-cyan-500 hover:text-cyan-700 border border-slate-200">
                How it works
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="#features" className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-cyan-500 hover:text-cyan-700">
                Learn more
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-lg shadow-cyan-200/20">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Finals Location</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">Lusaka, Zambia</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-lg shadow-cyan-200/20">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Tournament Duration</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">5-day live event</p>
              </div>
            </div>
          </div>
          <div className="space-y-6 rounded-[2rem] border border-cyan-500/10 bg-white p-8 shadow-2xl shadow-cyan-200/40">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">What is Jampass?</p>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                Jampass is Zambia's unified esports ecosystem for centers, players, and developers. It includes optional tournament entry, a Jam Wallet for buying in-game goods, community and clan access, and a developer framework for token conversion and reward ad systems.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-cyan-300 mb-4">
                <Trophy className="h-4 w-4" />
                Tournament games
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-100 p-3">
                  <p className="text-sm font-semibold text-slate-900">EA Sports FC 25</p>
                  <p className="text-xs text-slate-500 mt-1">Football/Soccer competitive title</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3">
                  <p className="text-sm font-semibold text-slate-900">Mortal Kombat</p>
                  <p className="text-xs text-slate-500 mt-1">Fighting game championship</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-slate-200 px-6 py-20 lg:px-12">
        <div className="container mx-auto space-y-12">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">How Jampass works</p>
            <h2 className="text-4xl font-semibold text-slate-900 mb-6">A simple, transparent Jampass ecosystem for Zambian esports.</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">1</div>
                <CardTitle>Free platform registration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  Gaming centers join the Jampass network at no cost. Registration secures your center profile, dashboard access, and eligibility to declare tournament intent.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">2</div>
                <CardTitle>Pay only to join</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  Your center pays K2,500 only when it decides to enter the tournament. This keeps the platform accessible while funding the finals and prize pool.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">3</div>
                <CardTitle>Local qualifiers at your center</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  Each gaming center hosts its own local qualifier for FC 26 and Mortal Kombat. The strongest player in each game earns the center's national tournament slot.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">4</div>
                <CardTitle>Best players advance</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  The top FC 26 and top Mortal Kombat player from each entered center advances, creating a national field of finalists for Lusaka.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">5</div>
                <CardTitle>5-day finals in Lusaka</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  Qualifiers travel to Lusaka for a live 5-day finals event. Matches are staged on premium stations with full event production.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">🏆</div>
                <CardTitle>Prize pool winners</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  The national finals award a prize pool to the top FC 26 and Mortal Kombat champions, plus runner-up support and center recognition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-slate-200 px-6 py-20 lg:px-12">
        <div className="container mx-auto grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Key user roles</p>
            <h2 className="text-4xl font-semibold text-slate-900">Who uses Jampass?</h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Jampass is designed for four core users, each with their own interface and responsibilities in the ecosystem.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {featureTiles.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-100 p-6 shadow-sm">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-slate-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6">
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/40">
              <CardHeader className="space-y-3 p-6">
                <CardTitle>Gaming center members (Jampass holders)</CardTitle>
                <CardDescription className="text-slate-500">
                  Register your gaming center and join the national Jampass ecosystem.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 text-slate-600 text-sm">
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Free Jampass membership registration with unlimited jammer slots</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Pay K2,500 Gold class ticket only when entering the tournament</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Qualify 3 representatives: 1 manager + 2 participants (FC & MK specialists)</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Receive tournament resources and full accommodation in Lusaka</p>
                </div>
                <div className="pt-4">
                  <Link href="/register" className="inline-flex items-center rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400">
                    Register your center
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/40">
              <CardHeader className="space-y-3 p-6">
                <CardTitle>Competitive players</CardTitle>
                <CardDescription className="text-slate-500">
                  Represent your gaming center on the national stage and access the broader Jam ecosystem.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 text-slate-600 text-sm">
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Build your competitive profile and gaming stats</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Compete against other Zambian players nationally</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Buy goods and services from the Jam Store, join clans, and interact in communities</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Qualify for the 5-day finals event and earn rewards</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/40">
              <CardHeader className="space-y-3 p-6">
                <CardTitle>Game developers</CardTitle>
                <CardDescription className="text-slate-500">
                  Integrate Jampass as a developer framework across mobile, PC, Xbox, and web games.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 text-slate-600 text-sm">
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Convert real currency into in-game Jam tokens</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Set token value back to real money with transparent settlement</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Use dynamic reward ads to reward players and earn ad-based value</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Access developer analytics, campaign management, and game support tools</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/40">
              <CardHeader className="space-y-3 p-6">
                <CardTitle>Tournament administrators</CardTitle>
                <CardDescription className="text-slate-500">
                  Jampass organizers manage the entire event.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 text-slate-600 text-sm">
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Manage vendor registrations and approvals</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Generate brackets and group stage draws</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Manage match schedules and seat assignments</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">✓</span>
                  <p>Monitor real-time tournament progress</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 px-6 py-20 lg:px-12">
        <div className="container mx-auto space-y-12">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Example tournament structure</p>
            <h2 className="text-4xl font-semibold text-slate-900">How the Jampass season unfolds</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <CardTitle>Step 1: Local qualifiers</CardTitle>
                <CardDescription className="text-slate-500">Each center hosts a local tournament for FC 26 and MK.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm">
                <p>The best player for each game is selected as the center's representative for the national field.</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <CardTitle>Step 2: National entry</CardTitle>
                <CardDescription className="text-slate-500">Qualified players form the national finals roster.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm">
                <p>Each member center qualifies 3 representatives: 1 manager + 2 specialists (1 FC 25 player, 1 Mortal Kombat player) for the national finals in Lusaka.</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <CardTitle>Step 3: Finals bracket</CardTitle>
                <CardDescription className="text-slate-500">5-day live event in Lusaka.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm">
                <p>Players compete in a knockout bracket with live match production, seat assignments, and final day grand finals.</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40 lg:col-span-3">
              <CardHeader className="p-6">
                <CardTitle>Prize pool structure</CardTitle>
                <CardDescription className="text-slate-500">Jampass championship awards</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-cyan-300 font-semibold mb-3">Hotspot Prizes</p>
                    <ul className="space-y-2 text-xs">
                      <li className="flex justify-between"><span>1st Position</span> <span className="text-green-400 font-semibold">K15,000</span></li>
                      <li className="flex justify-between"><span>2nd Position</span> <span className="text-green-400 font-semibold">K10,000</span></li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-cyan-300 font-semibold mb-3">Individual Prizes (Per Game)</p>
                    <ul className="space-y-2 text-xs">
                      <li className="flex justify-between"><span>1st Position</span> <span className="text-green-400 font-semibold">K10,000 x2</span></li>
                      <li className="flex justify-between"><span>2nd Position</span> <span className="text-green-400 font-semibold">K5,000 x2</span></li>
                      <li className="flex justify-between"><span>3rd Position</span> <span className="text-green-400 font-semibold">K2,500 x2</span></li>
                    </ul>
                  </div>
                </div>
                <p className="text-slate-500 text-xs">All finalists receive full accommodation for the 5-day tournament in Lusaka. Tournament accommodates 696 total individuals: 580 participants and 116 managers.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="border-b border-slate-200 px-6 py-20 lg:px-12">
        <div className="container mx-auto space-y-12">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Why Jampass?</p>
            <h2 className="text-4xl font-semibold text-slate-900">A better way to compete and connect Zambia's gaming community.</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-green-300 text-lg font-semibold mb-4">🎯</div>
                <CardTitle>Fair & transparent competition</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm space-y-3">
                <p>No hidden rules or favoritism. Every gaming center competes under the same framework with automated bracket generation and clear advancement rules.</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300 text-lg font-semibold mb-4">🏆</div>
                <CardTitle>National recognition</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm space-y-3">
                <p>Winners become official national champions. Your gaming center gains prestige and standing in the Zambian esports ecosystem.</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 text-lg font-semibold mb-4">💰</div>
                <CardTitle>Revenue & prizes</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm space-y-3">
                <p>Entry fees and sponsorships fund prize pools. Players and centers earn rewards for performance and qualification to the finals.</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-300 text-lg font-semibold mb-4">📱</div>
                <CardTitle>Digital-first management</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm space-y-3">
                <p>Real-time schedule updates, automatic seat assignments, live bracket tracking, and all administrative oversight through one unified platform.</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-300 text-lg font-semibold mb-4">🌍</div>
                <CardTitle>National reach</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm space-y-3">
                <p>Participate from anywhere in Zambia. Compete against centers from Lusaka, Copperbelt, Southern Province, and beyond without traveling until the finals.</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-300 text-lg font-semibold mb-4">⚡</div>
                <CardTitle>Scalable infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm space-y-3">
                <p>Start with regional tournaments and scale to nationwide competitions. The system is built to grow as Zambia's esports community expands.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Getting started</p>
            <h2 className="text-4xl font-semibold text-slate-900">Join Jampass in Zambia.</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                Jampass is launching its inaugural season with gaming centers across Lusaka and Zambia. Whether you run a gaming center, are a competitive player, or an esports organizer, there's a role for you.
              </p>
              <p>
                The platform is built to be fair, transparent, and accessible to every gaming center in Zambia. Compete at your level, climb the national rankings, and prove your center is the best.
              </p>
            </div>
            <div className="space-y-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5">
                <p className="text-sm font-semibold text-cyan-300">Early access</p>
                <p className="mt-2 text-slate-600 text-sm">Pilot event with 16 centers in Lusaka.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5">
                <p className="text-sm font-semibold text-cyan-300">Entry fee</p>
                <p className="mt-2 text-slate-600 text-sm">K2,500 per gaming center per tournament.</p>
              </div>
            </div>
            <Button asChild className="bg-cyan-500 hover:bg-cyan-400">
              <Link href="/register" className="inline-flex items-center gap-2">
                Register your center
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6">
            <Card className="border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <CardTitle>Platform pathways</CardTitle>
                <CardDescription>How Jampass tournaments are structured.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Registration phase</p>
                  <p className="mt-2 text-slate-600">Gaming centers register and submit players.</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Group stage</p>
                  <p className="mt-2 text-slate-600">Teams divided into groups. Round-robin matches determine group winners.</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Knockout phase</p>
                  <p className="mt-2 text-slate-600">Single-elimination bracket. Winners advance until finals.</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">5-day finals</p>
                  <p className="mt-2 text-slate-600">Top 2 teams from each game compete live in Lusaka with prizes.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-200 bg-slate-100 p-6 text-slate-600">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300 mb-4">FAQ</p>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="text-cyan-300 font-semibold flex-shrink-0">Q:</span>
                  <span>What is the Jampass membership? <span className="text-cyan-300">A:</span> A free membership for gaming centers and developers. Pay K2,500 only when you enter the esports tournament.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-300 font-semibold flex-shrink-0">Q:</span>
                  <span>How do developers use Jampass? <span className="text-cyan-300">A:</span> Developers integrate Jampass into mobile, PC, Xbox, or web games to convert real currency to in-game tokens, settle token value back to cash, and run reward-based ad campaigns.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-300 font-semibold flex-shrink-0">Q:</span>
                  <span>What can players do outside the tournament? <span className="text-cyan-300">A:</span> Players can buy goods and services from the Jam Store, join communities and clans, and use the Jam Wallet for in-game purchases.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-300 font-semibold flex-shrink-0">Q:</span>
                  <span>Does accommodation include Lusaka stay? <span className="text-cyan-300">A:</span> Yes. All 696 finalists receive full accommodation during the 5-day championship.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}


