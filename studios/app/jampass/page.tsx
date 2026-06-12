import Link from "next/link"
import { Check } from "lucide-react"
import { ArrowRight, Globe, ShieldCheck, Trophy, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const featureTiles = [
  {
    title: "Aggregator payments",
    description: "One unified gateway for game developers that routes payments, tracks settlement, and maintains transparent revenue splits.",
    icon: ShieldCheck,
  },
  {
    title: "Developer monetization",
    description: "Convert currency into in-game Jam tokens, manage ad-driven rewards, and collect platform revenue with clear analytics.",
    icon: Trophy,
  },
  {
    title: "Real-time leaderboards",
    description: "Live scoreboards with daily, weekly, and all-time ranking filters to keep players competing and engaged.",
    icon: Globe,
  },
  {
    title: "Community hubs",
    description: "Zero-contact chat rooms, clan boards, and moderation tools that protect player privacy while enabling social play.",
    icon: Activity,
  },
  {
    title: "Rewarded ad flows",
    description: "Support timed rewarded ads that generate developer revenue while preserving gameplay and player choice.",
    icon: Globe,
  },
]

export default function JampassPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%),linear-gradient(to_bottom,_#eff6ff,_#ffffff)] px-6 py-20 lg:px-12">
        <div className="container mx-auto grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-cyan-300">
              African game commerce
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Jampass is the payment and engagement platform for African game developers.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Jampass unifies transaction routing, ledger-level settlement, leaderboards, community chat, and rewarded ad infrastructure into one developer-friendly experience.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <Button asChild className="rounded-full bg-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400">
                <Link href="/register" className="inline-flex items-center gap-2">
                  Register your studio
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
            <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-full bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-700 ring-1 ring-cyan-200">
              <span className="rounded-full bg-cyan-500 px-3 py-1 text-white">New</span>
              <span>Launch your studio with payment routing, leaderboards, and rewarded engagement in one platform.</span>
            </div>
          </div>
          <div className="space-y-6 rounded-[2rem] border border-cyan-500/10 bg-white p-8 shadow-2xl shadow-cyan-200/40">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">What is Jampass?</p>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                Jampass is a master aggregator for game commerce. It gives developers one integration point for payments, transparent fee splits, real-time engagement, and secure platform services.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-cyan-300 mb-4">
                <Trophy className="h-4 w-4" />
                Core capabilities
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-100 p-3">
                  <p className="text-sm font-semibold text-slate-900">Payment aggregation</p>
                  <p className="text-xs text-slate-500 mt-1">One endpoint for all sub-merchant transactions and settlement tracking.</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3">
                  <p className="text-sm font-semibold text-slate-900">Leaderboards & chat</p>
                  <p className="text-xs text-slate-500 mt-1">Live game rankings, community rooms, and moderated clan channels.</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3">
                  <p className="text-sm font-semibold text-slate-900">Rewarded ads</p>
                  <p className="text-xs text-slate-500 mt-1">Support 1s, 7s, and 15s ad experiences for player rewards and revenue.</p>
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
            <h2 className="text-4xl font-semibold text-slate-900 mb-6">A simple, transparent platform for game commerce and engagement.</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">1</div>
                <CardTitle>Developer integration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  Integrate Jampass into mobile, PC, Xbox, and web games through a single SDK and backend interface.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">2</div>
                <CardTitle>Transaction routing</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  All player purchases flow through Jampass as the master aggregator, with clear fee and payout tracking for each sub-merchant.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">3</div>
                <CardTitle>Settlement tracking</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  Jampass tracks net payouts, platform margin, and developer balances so each partner sees accurate financial status.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">4</div>
                <CardTitle>Leaderboards</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  Live leaderboards keep gameplay competitive with daily, weekly, and all-time scopes and instant ranking updates.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">5</div>
                <CardTitle>Community & chat</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  Zero-contact community rooms and clan boards let players connect without exposing personal data.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-slate-50 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-lg font-semibold mb-4">6</div>
                <CardTitle>Rewarded ads</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-600">
                <p>
                  Support 1s, 7s, and 15s rewarded ad experiences that provide developers with incremental revenue while respecting players.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-slate-200 px-6 py-20 lg:px-12">
        <div className="container mx-auto grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Key platform pillars</p>
            <h2 className="text-4xl font-semibold text-slate-900">Built for developers, players, and operators.</h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Jampass combines payment aggregation, engagement systems, and secure settlement into one platform that scales with games and studios.
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
                <CardTitle>Game developers</CardTitle>
                <CardDescription className="text-slate-500">
                  Integrate Jampass into mobile, PC, Xbox, or web titles and manage payments, rewards, and analytics from one dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 text-slate-600 text-sm">
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0"><Check className="h-3.5 w-3.5" /></span>
                  <p>Convert currency into Jam tokens for in-game economy flows.</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0"><Check className="h-3.5 w-3.5" /></span>
                  <p>Track settlement and platform fee splits with transparent reporting.</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0"><Check className="h-3.5 w-3.5" /></span>
                  <p>Offer rewarded ads and special in-game incentives backed by secure validation.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/40">
              <CardHeader className="space-y-3 p-6">
                <CardTitle>Players</CardTitle>
                <CardDescription className="text-slate-500">
                  Enjoy seamless virtual commerce, competitive leaderboards, and private community spaces in one experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 text-slate-600 text-sm">
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0"><Check className="h-3.5 w-3.5" /></span>
                  <p>Buy game items, earn rewards, and track progress in your Jam Wallet.</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0"><Check className="h-3.5 w-3.5" /></span>
                  <p>Compete on live leaderboards with daily, weekly, and all-time rankings.</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0"><Check className="h-3.5 w-3.5" /></span>
                  <p>Join games, clans, and moderated chat rooms with privacy-safe handles.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/40">
              <CardHeader className="space-y-3 p-6">
                <CardTitle>Platform operators</CardTitle>
                <CardDescription className="text-slate-500">
                  Monitor platform health, balance settlement flows, and manage community content from one control center.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 text-slate-600 text-sm">
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0"><Check className="h-3.5 w-3.5" /></span>
                  <p>See revenue, payouts, and current ledger balances in real time.</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0"><Check className="h-3.5 w-3.5" /></span>
                  <p>Moderate community channels and enforce keyword filters automatically.</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0"><Check className="h-3.5 w-3.5" /></span>
                  <p>Manage leaderboard resets and support developer analytics across games.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 px-6 py-20 lg:px-12">
        <div className="container mx-auto space-y-12">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Platform flow</p>
            <h2 className="text-4xl font-semibold text-slate-900">How Jampass supports monetization and engagement.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <CardTitle>Master aggregation</CardTitle>
                <CardDescription className="text-slate-500">One integration for game commerce.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm">
                <p>Developers connect once and route all purchases through the Jampass gateway.</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <CardTitle>Transparent settlement</CardTitle>
                <CardDescription className="text-slate-500">Clear financial tracking.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm">
                <p>Jampass records gross value, platform fee, and developer share for every transaction.</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40">
              <CardHeader className="p-6">
                <CardTitle>Engagement systems</CardTitle>
                <CardDescription className="text-slate-500">Live social features.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm">
                <p>Players stay engaged with leaderboards, community rooms, and reward flows.</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/40 lg:col-span-3">
              <CardHeader className="p-6">
                <CardTitle>Developer revenue</CardTitle>
                <CardDescription className="text-slate-500">Built for studio growth.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-slate-600 text-sm space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-cyan-300 font-semibold mb-3">Fee split model</p>
                    <p className="text-xs text-slate-500">A 2.5% processing fee is split transparently into platform margin and developer settlement.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-cyan-300 font-semibold mb-3">Real-time visibility</p>
                    <p className="text-xs text-slate-500">Track payouts, ad earnings, and engagement metrics from one dashboard.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Get started</p>
            <h2 className="text-4xl font-semibold text-slate-900">Take your game studio further with Jampass.</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                Jampass is designed for African game studios that need a unified payments, engagement, and reward ecosystem without extra integration overhead.
              </p>
              <p>
                Build with confidence knowing every player payment, leaderboard event, and ad impression is tracked transparently and securely.
              </p>
            </div>
            <div className="space-y-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5">
                <p className="text-sm font-semibold text-cyan-300">Developer-ready</p>
                <p className="mt-2 text-slate-600 text-sm">One integration for payments, rewards, and community tools.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5">
                <p className="text-sm font-semibold text-cyan-300">Transparent finance</p>
                <p className="mt-2 text-slate-600 text-sm">Net developer shares are tracked clearly with every transaction.</p>
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
                <CardTitle>Platform overview</CardTitle>
                <CardDescription className="text-slate-500">Jampass supports every layer of the game commerce lifecycle.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Integration</p>
                  <p className="mt-2 text-slate-600">Connect your game once and use the platform for payments, leaderboards, ads, and communities.</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Engagement</p>
                  <p className="mt-2 text-slate-600">Deliver live leaderboards, private clan rooms, and reward experiences to players.</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Settlement</p>
                  <p className="mt-2 text-slate-600">View net revenue, platform charges, and payout balances through a single dashboard.</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Support</p>
                  <p className="mt-2 text-slate-600">Developer tools and analytics help studios optimize monetization and player retention.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-200 bg-slate-100 p-6 text-slate-600">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300 mb-4">FAQ</p>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="text-cyan-300 font-semibold flex-shrink-0">Q:</span>
                  <span>What is Jampass? <span className="text-cyan-300">A:</span> A unified game payment and engagement platform that supports developers, players, and studios across Africa.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-300 font-semibold flex-shrink-0">Q:</span>
                  <span>How does Jampass handle fees? <span className="text-cyan-300">A:</span> A flat 2.5% processing fee is split transparently between platform margin and net developer settlement.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-300 font-semibold flex-shrink-0">Q:</span>
                  <span>Can developers add leaderboards? <span className="text-cyan-300">A:</span> Yes, Jampass provides live leaderboards with time-scoped rank filters and reset controls.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-300 font-semibold flex-shrink-0">Q:</span>
                  <span>What community features are included? <span className="text-cyan-300">A:</span> Zero-contact lobby chat, clan feeds, and automated moderation to keep interactions safe and private.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-cyan-500/5 px-6 py-20 lg:px-12">
        <div className="container mx-auto rounded-[2rem] border border-cyan-200 bg-white/90 p-10 shadow-xl shadow-cyan-200/20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-500 mb-4">Inquiry</p>
              <h2 className="text-4xl font-semibold text-slate-900">Questions about Jampass for your studio?</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Reach out and our team will help you understand how Jampass fits your studio, handles payments, and powers player engagement.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="bg-cyan-500 hover:bg-cyan-400 px-8 py-4 text-base font-semibold text-white">
                  <Link href="/contact" className="inline-flex items-center gap-2">
                    Send an inquiry
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <a href="mailto:hello@gecogames.studio" className="inline-flex items-center rounded-full border border-cyan-200 bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  Email hello@gecogames.studio
                </a>
              </div>
            </div>
            <div className="rounded-[2rem] bg-cyan-500/10 p-8 text-slate-900 shadow-lg shadow-cyan-200/30">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">Need help fast?</p>
              <p className="mt-4 text-xl font-semibold">Studio launch, payment setup, or platform demo.</p>
              <ul className="mt-6 space-y-4 text-slate-600">
                <li className="flex gap-3"><span className="text-cyan-500">•</span> Integration planning</li>
                <li className="flex gap-3"><span className="text-cyan-500">•</span> Payment routing and settlement</li>
                <li className="flex gap-3"><span className="text-cyan-500">•</span> Leaderboards and rewarded engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


