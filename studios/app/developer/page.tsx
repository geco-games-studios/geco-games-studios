import Link from "next/link"
import Image from "next/image"
import NewsletterSubscription from "../../components/newsletter-subscription"

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-slate-950 text-white py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-200 uppercase tracking-[0.24em]">
                Developer Portal
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Submit your game and reach players worldwide.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Geco's developer hub helps you showcase your games, manage launch details, and connect with our growing gaming audience.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/login?type=developer" className="inline-flex items-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">
                  Developer Login
                </Link>
                <Link href="#features" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Explore features
                </Link>
                <Link href="/developer/games" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Submit your game
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-900 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Launch window</p>
                  <p className="mt-3 text-3xl font-semibold">Live submissions all year round</p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-slate-900 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Platform support</p>
                    <p className="mt-2 text-xl font-semibold">Mobile, PC, Web & Console</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Featured exposure</p>
                    <p className="mt-2 text-xl font-semibold">Showcase to our community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Developer Resources</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Everything you need to launch your next title.</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Submit your game with details, upload assets, and get in front of players through our developer showcase.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Game Submission Guide",
                description: "Follow a step-by-step submission workflow to provide your game details, assets, and launch plans to the Geco team.",
                duration: "Flexible",
                level: "All developers",
                lessons: [
                  "Game concept summary",
                  "Platform readiness checklist",
                  "Store page assets",
                  "Gameplay trailer tips",
                  "Publish schedule",
                  "Launch strategy",
                  "Community growth",
                  "Monetization planning",
                  "Bug reporting",
                  "Support setup"
                ]
              },
              {
                title: "Marketing & Launch",
                description: "Learn how to package your game for launch with optimized messaging, update schedules, and player acquisition support.",
                duration: "Ongoing",
                level: "Intermediate to Advanced",
                lessons: [
                  "Audience targeting",
                  "Promotional campaigns",
                  "Trailer creation",
                  "Press outreach",
                  "Player retention",
                  "Community engagement",
                  "Game analytics",
                  "Release milestones",
                  "Beta testing",
                  "Launch events"
                ]
              },
              {
                title: "Developer Growth",
                description: "Build a sustainable developer workflow with tools, collaboration, and release cadence designed for modern game teams.",
                duration: "Continuous",
                level: "All levels",
                lessons: [
                  "Project tools & pipelines",
                  "Team communication",
                  "Version control",
                  "Build automation",
                  "Quality assurance",
                  "Player feedback loops",
                  "Post-launch support",
                  "Revenue optimization",
                  "Portfolio development",
                  "Game update planning"
                ]
              }
            ].map((program) => (
              <div key={program.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-semibold">{program.title}</h3>
                  <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {program.level}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{program.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                  <span>📅 {program.duration}</span>
                  <span>📚 {program.lessons.length} tips</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">What you'll manage:</p>
                  <ul className="space-y-1">
                    {program.lessons.slice(0, 4).map((lesson, index) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                        {lesson}
                      </li>
                    ))}
                    {program.lessons.length > 4 && (
                      <li className="text-sm text-slate-500 dark:text-slate-500">
                        +{program.lessons.length - 4} more tips...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="boost" className="py-20 px-6 lg:px-12 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white">
              Developer Showcase
            </span>
            <h2 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
              Get your game noticed by players.
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-white/80">
              Submit your title, share your creative vision, and join our growing library of games built for ambitious developers.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 mb-12">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 mx-auto mb-4">
                <span className="text-2xl font-bold text-white">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Submissions</h3>
              <p className="text-white/80">Submit your game details quickly and keep your page updated.</p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 mx-auto mb-4">
                <span className="text-2xl font-bold text-white">🎮</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Player Reach</h3>
              <p className="text-white/80">Connect with our community across mobile, PC, and web.</p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 mx-auto mb-4">
                <span className="text-2xl font-bold text-white">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Insights</h3>
              <p className="text-white/80">Track early interest and optimize your launch strategy.</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">What Developers Need</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3">Submission Tools</h4>
                <ul className="text-sm text-white/80 space-y-2">
                  <li>• Game detail forms</li>
                  <li>• Platform targeting</li>
                  <li>• Asset upload guidance</li>
                  <li>• Release checklist</li>
                </ul>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3">Discovery Support</h4>
                <ul className="text-sm text-white/80 space-y-2">
                  <li>• Featured placement</li>
                  <li>• Community showcase</li>
                  <li>• Trailer highlight</li>
                  <li>• Launch announcements</li>
                </ul>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3">Developer Growth</h4>
                <ul className="text-sm text-white/80 space-y-2">
                  <li>• Feedback loops</li>
                  <li>• Update planning</li>
                  <li>• Player engagement</li>
                  <li>• Release roadmap</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Share your game with our studio</h3>
              <p className="text-white/80 mb-6">Our team is ready to review your game submission and help you bring it to an engaged audience.</p>
              <Link href="/developer/games" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 w-full">
                Submit your game
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 uppercase tracking-[0.24em] mb-6">
              Success Story
            </span>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-4">See what's possible with Geco</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Kopala Survival is an example of the ambitious games finding success through our developer platform.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <div className="relative h-80 w-full">
                <Image src="/Kopala.jpg" alt="Kopala Survival" fill className="object-cover" />
              </div>
            </div>
            
            <div>
              <h3 className="text-3xl font-semibold mb-4">Kopala Survival</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                An atmospheric survival adventure built for tense exploration and emergent gameplay. This title demonstrates the kind of ambitious, polished experiences that thrive on the Geco platform.
              </p>
              
              <div className="grid gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <span className="text-lg">🎮</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Gameplay Focus</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Emergent survival mechanics with environmental storytelling</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <span className="text-lg">🎨</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Visual Quality</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Premium art direction and atmospheric world design</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Multi-Platform</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Launching across mobile and PC platforms</p>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 mb-8">
                🚀 Coming Soon
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Games like Kopala showcase the quality and ambition possible when developers partner with Geco. Ready to submit your next project?
              </p>

              <Link href="/developer/games" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Submit Your Game
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Need help?</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Questions about game submissions?</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Reach out to our developer support team for guidance on game requirements, publishing, and platform readiness.
          </p>
          <Link href="mailto:hello@gecogamesstudios.com" className="mt-10 inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
            Email developer support
          </Link>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 bg-violet-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-400">Stay Connected</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Get developer updates and launch tips</h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Subscribe to our newsletter for release announcements, studio updates, and community events.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <NewsletterSubscription variant="default" />
          </div>
        </div>
      </section>
    </div>
  )
}
