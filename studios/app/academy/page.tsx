import Link from "next/link"
import NewsletterSubscription from "../../components/newsletter-subscription"

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-slate-950 text-white py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-200 uppercase tracking-[0.24em]">
                Academy & Education
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Master game development with expert-led courses.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Our comprehensive academy offers specialized courses covering game development, programming, and web development skills taught by industry professionals.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#programs" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Explore courses
                </Link>
                <Link href="#bootcamp" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  2026 Boot Camp
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-900 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Next cohort</p>
                  <p className="mt-3 text-3xl font-semibold">June 2026</p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-slate-900 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Duration</p>
                    <p className="mt-2 text-xl font-semibold">12 weeks</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Outcome</p>
                    <p className="mt-2 text-xl font-semibold">Portfolio-ready projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Academy Courses</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Comprehensive game development curriculum.</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              From fundamentals to advanced techniques, our courses cover every aspect of game development and programming.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Game Design & Development",
                description: "Master the fundamentals of game design and development, from concept to implementation using industry-standard tools and workflows.",
                duration: "16 weeks",
                level: "Beginner to Intermediate",
                lessons: [
                  "Game Design Principles & Theory",
                  "Level Design & World Building",
                  "Game Mechanics & Systems",
                  "Player Experience & Psychology",
                  "Prototyping & Iteration",
                  "Unity Game Development Basics",
                  "Unreal Engine Introduction",
                  "Game Production Pipelines",
                  "Version Control & Team Collaboration",
                  "Project Management for Games",
                  "Quality Assurance & Testing",
                  "Portfolio Development"
                ]
              },
              {
                title: "C# Programming for Games",
                description: "Comprehensive C# programming course specifically tailored for game development, covering Unity scripting and general programming concepts.",
                duration: "12 weeks",
                level: "Beginner to Advanced",
                lessons: [
                  "C# Fundamentals & Syntax",
                  "Object-Oriented Programming",
                  "Unity Scripting Essentials",
                  "Game Object Manipulation",
                  "Physics & Collision Detection",
                  "Input Systems & Controls",
                  "UI Programming & Events",
                  "Data Structures & Algorithms",
                  "Performance Optimization",
                  "Debugging & Error Handling",
                  "Scriptable Objects & Architecture",
                  "Advanced C# Patterns"
                ]
              },
              {
                title: "Web Development for Games",
                description: "Learn modern web development technologies to create game-related websites, tools, and web-based games using HTML, CSS, and JavaScript.",
                duration: "10 weeks",
                level: "Beginner to Intermediate",
                lessons: [
                  "HTML5 & Semantic Markup",
                  "CSS3 & Responsive Design",
                  "JavaScript Fundamentals",
                  "DOM Manipulation & Events",
                  "Web APIs & Browser Features",
                  "Canvas & WebGL for Games",
                  "Frontend Frameworks (React)",
                  "Backend Development (Node.js)",
                  "Database Integration",
                  "Authentication & Security",
                  "Deployment & Hosting",
                  "Web Game Optimization"
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
                  <span>📚 {program.lessons.length} lessons</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">What you'll learn:</p>
                  <ul className="space-y-1">
                    {program.lessons.slice(0, 4).map((lesson, index) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                        {lesson}
                      </li>
                    ))}
                    {program.lessons.length > 4 && (
                      <li className="text-sm text-slate-500 dark:text-slate-500">
                        +{program.lessons.length - 4} more lessons...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 bg-violet-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-400">Stay Connected</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Join our learning community</h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive content, course updates, industry insights, and early access to new programs.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <NewsletterSubscription variant="default" />
          </div>
        </div>
      </section>

      <section id="bootcamp" className="py-20 px-6 lg:px-12 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white">
              2026 Boot Camp
            </span>
            <h2 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
              Transform your career in 12 weeks.
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-white/80">
              Join our intensive 2026 Game Development Boot Camp and master the skills you need to build professional games. Learn online through Microsoft Teams with live instruction, hands-on projects, and career support.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 mb-12">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 mx-auto mb-4">
                <span className="text-2xl font-bold text-white">12</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Weeks of Intensive Training</h3>
              <p className="text-white/80">Full-time immersive learning experience with daily live sessions</p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 mx-auto mb-4">
                <span className="text-2xl font-bold text-white">🎓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Industry-Ready Skills</h3>
              <p className="text-white/80">Master Game Design, C#, and Web Development for games</p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 mx-auto mb-4">
                <span className="text-2xl font-bold text-white">💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Support</h3>
              <p className="text-white/80">Portfolio development, job placement assistance, and networking</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">What You'll Learn</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3">Game Design & Development</h4>
                <ul className="text-sm text-white/80 space-y-2">
                  <li>• Game design principles</li>
                  <li>• Level design & mechanics</li>
                  <li>• Unity & Unreal Engine</li>
                  <li>• Production workflows</li>
                </ul>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3">C# Programming</h4>
                <ul className="text-sm text-white/80 space-y-2">
                  <li>• C# fundamentals</li>
                  <li>• Unity scripting</li>
                  <li>• Object-oriented programming</li>
                  <li>• Game logic implementation</li>
                </ul>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3">Web Development</h4>
                <ul className="text-sm text-white/80 space-y-2">
                  <li>• HTML5 & CSS3</li>
                  <li>• JavaScript & frameworks</li>
                  <li>• Web APIs for games</li>
                  <li>• Deployment & hosting</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Register for 2026 Boot Camp</h3>
              <p className="text-white/80 mb-6">Limited spots available. Early registration recommended.</p>
              <Link href="#contact" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 w-full">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Get in touch</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Ready to join the academy?</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Email our academy team and secure your spot in the next cohort.
          </p>
          <Link href="mailto:hello@gecogamesstudios.com" className="mt-10 inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
            Email admissions
          </Link>
        </div>
      </section>
    </div>
  )
}
