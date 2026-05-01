import Link from "next/link"

export default function SupportFaqPage() {
  const faqs = [
    {
      question: "How do I join the Jampass tournament?",
      answer:
        "Register your game center for free, then pay the tournament entry fee when you submit a team for the next local qualifier.",
    },
    {
      question: "Where is the finals venue located?",
      answer: "The final national championships take place in Lusaka, Zambia, after local winners qualify from each center.",
    },
    {
      question: "Can I get support for studio or esports production?",
      answer: "Yes — we provide dedicated support for studio partnerships, event production, and esports operations.",
    },
    {
      question: "What should I do if I need technical help?",
      answer: "Email our support team or use the contact page to open a dedicated support request.",
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Frequently asked questions</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Answers to the questions we hear most about support, event registration, and partnership services.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/support/contact" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Contact support
            </Link>
            <Link href="/careers" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              See careers
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-2xl font-semibold">{faq.question}</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
