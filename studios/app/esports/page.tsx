import Link from "next/link"

export default function EsportsPage() {
  const offerings = [
    {
      title: "Competitive Tournaments",
      description: "Join thrilling tournaments across multiple games. From casual cups to championship series - there's a place for every skill level!",
      icon: "🏆",
    },
    {
      title: "Community Events",
      description: "Weekly community nights, special events, and fan competitions. Meet fellow gamers and make lasting friendships.",
      icon: "🎮",
    },
    {
      title: "Team Formation",
      description: "Find your perfect squad or get coaching to level up your game. Whether you're looking for teammates or want to improve your skills.",
      icon: "👥",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-100 uppercase tracking-[0.24em]">
                🎯 We're Getting Into Esports!
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Join the ultimate gaming party! 🎉
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                We're diving headfirst into the esports world and we want YOU to be part of the fun! Whether you're a casual player or a competitive beast, we've got tournaments, events, and communities waiting for you.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#join" className="inline-flex items-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400">
                  🚀 Join the Fun!
                </Link>
                <Link href="#tournaments" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  🏆 View Tournaments
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-yellow-200">🎮 Games We Play</p>
                  <p className="mt-3 text-3xl font-semibold">Multiple Titles</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-yellow-200">👥 Community</p>
                  <p className="mt-3 text-3xl font-semibold">Growing Fast!</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-yellow-200">🏅 Skill Levels</p>
                  <p className="mt-3 text-3xl font-semibold">All Welcome!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tournaments" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">🎯 What We Offer</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Jump into the action with us!</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Whether you're here to compete, make friends, or just have a blast - we've got something for everyone in our esports community.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {offerings.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="py-20 px-6 lg:px-12 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">🎉 Join the Party</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Ready to level up your gaming life?
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                We're building an amazing esports community where everyone can compete, connect, and have an absolute blast! Whether you're a weekend warrior or aspiring pro, there's a spot for you.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  "🏆 Regular tournaments with awesome prizes",
                  "🎮 Community events and game nights",
                  "👥 Team matchmaking and squad building",
                  "📈 Skill improvement workshops and coaching",
                  "🎉 Fun competitions and special events",
                  "🤝 Make friends and build your network",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-2xl font-semibold mb-4">🎯 Why Join Our Community?</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-semibold text-yellow-600 dark:text-yellow-400">🤩 Pure Fun First</p>
                  <p>We're all about having a great time while competing. Win or lose, the vibes are always amazing!</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-600 dark:text-yellow-400">👨‍👩‍👧‍👦 Welcoming Community</p>
                  <p>From beginners to veterans, everyone is welcome. We help each other grow and improve together.</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-600 dark:text-yellow-400">🚀 Skill Development</p>
                  <p>Learn from experienced players, get coaching tips, and watch your gaming skills soar to new heights.</p>
                </div>
              </div>
              <Link href="#contact" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400">
                🎮 Let's Get Gaming!
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">🎯 Ready to Join the Fun?</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Let's game together! 🚀</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-200">
            Whether you want to compete in tournaments, join community events, or just chat about games - we're excited to have you! Drop us a line and let's make some gaming memories.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="mailto:esports@gecogamesstudios.com" className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400">
              📧 Email the Esports Team
            </Link>
            <Link href="#tournaments" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              🏆 Check Out Tournaments
            </Link>
          </div>
          <div className="mt-12">
            <p className="text-yellow-200 font-semibold">🎉 Can't wait to see you in game! 🎉</p>
          </div>
        </div>
      </section>
    </div>
  )
}
