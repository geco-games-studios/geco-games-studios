import Link from "next/link"
import { ArrowRight, Globe, Layers, Play, Shield, Star, Users } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      title: "Game Development",
      description: "Full-cycle production for mobile, PC, and console titles delivered with craftsmanship and scalable live operations.",
      icon: Play,
      features: [
        "Complete game production pipeline",
        "Cross-platform development (iOS, Android, PC, Console)",
        "Live operations and post-launch support",
        "Quality assurance and testing",
        "Performance optimization",
        "Multiplayer implementation"
      ],
      process: [
        "Concept & Design",
        "Prototype Development",
        "Full Production",
        "Testing & QA",
        "Launch & Live Ops"
      ]
    },
    {
      title: "Art & Animation",
      description: "Premium art direction, character design, and cinematic animation that elevate every story.",
      icon: Layers,
      features: [
        "Character design and modeling",
        "Environment art creation",
        "UI/UX design for games",
        "2D/3D animation",
        "Visual effects and particles",
        "Art direction and style guides"
      ],
      process: [
        "Concept Art",
        "Asset Creation",
        "Animation",
        "Integration",
        "Polish & Optimization"
      ]
    },
    {
      title: "Academy & Education",
      description: "Comprehensive game development courses covering Unity, Unreal, art, audio, and business skills taught by industry professionals.",
      icon: Star,
      features: [
        "9 specialized courses",
        "60+ detailed lessons",
        "Hands-on project development",
        "Industry expert instructors",
        "Portfolio building",
        "Career guidance"
      ],
      process: [
        "Course Selection",
        "Structured Learning",
        "Project Work",
        "Mentorship",
        "Certification"
      ]
    },
    {
      title: "Strategy & Growth",
      description: "Product strategy, live marketing, and audience growth plans built for game launches and long-term retention.",
      icon: Shield,
      features: [
        "Market research and analysis",
        "Go-to-market strategy",
        "User acquisition planning",
        "Community management",
        "Analytics and insights",
        "Retention optimization"
      ],
      process: [
        "Strategy Planning",
        "Market Analysis",
        "Implementation",
        "Measurement",
        "Optimization"
      ]
    },
    {
      title: "Esports & Events",
      description: "End-to-end esports experiences, event production, and community engagement for competitive brands.",
      icon: Globe,
      features: [
        "Tournament organization",
        "Live streaming production",
        "Community engagement",
        "Prize pool management",
        "Broadcast graphics",
        "Event logistics"
      ],
      process: [
        "Event Planning",
        "Production Setup",
        "Live Execution",
        "Post-Event Analysis",
        "Community Follow-up"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-violet-900 via-fuchsia-900 to-pink-900 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white">
              Our Services
            </span>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
              Everything you need to build amazing games.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-white/80">
              From concept to launch, we specialize in mobile game and app development services that turn your vision into reality. Our expert team delivers premium quality across all disciplines with a mobile-first approach.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="#services" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Explore services
              </Link>
              <Link href="#contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Service offerings</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Comprehensive game development solutions.</h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              We combine technical expertise, creative vision, and business acumen to deliver exceptional results across every aspect of game development.
            </p>
          </div>

          <div className="space-y-20">
            {services.map((service, index) => (
              <div key={service.title} className={`grid gap-12 lg:grid-cols-2 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 dark:bg-violet-900/20">
                      <service.icon className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold">{service.title}</h3>
                      <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">{service.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">What we deliver</h4>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-violet-500 flex-shrink-0"></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4">Our process</h4>
                      <div className="space-y-3">
                        {service.process.map((step, stepIndex) => (
                          <div key={step} className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {stepIndex + 1}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="text-center">
                    <service.icon className="mx-auto h-12 w-12 text-violet-600 dark:text-violet-400 mb-4" />
                    <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">{service.description}</p>
                    <Link href="#contact" className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 bg-slate-100 dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-6">Ready to start your project?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Let's discuss your vision and how we can help bring your game to life. Our team is ready to collaborate on your next big project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#contact" className="inline-flex items-center rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
              Start a project
            </Link>
            <Link href="/portfolio" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
              View our work
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">Let's build together</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Transform your game idea into reality.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Whether you're a solo developer, indie studio, or established publisher, we have the expertise and resources to help you succeed.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Contact</p>
              <div className="mt-6 space-y-4 text-base leading-7 text-slate-200">
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:hello@gecogamesstudios.com" className="text-violet-400 hover:text-violet-300">hello@gecogamesstudios.com</a>
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+260978516926" className="text-violet-400 hover:text-violet-300">+260 978516926</a>
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p>Lusaka, Zambia</p>
                </div>
              </div>
              <Link href="mailto:hello@gecogamesstudios.com" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
                Send a message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}