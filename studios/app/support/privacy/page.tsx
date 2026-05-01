export default function SupportPrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Privacy Policy</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            We respect your privacy. This page explains how we collect, use, and protect the data shared with Geco Games Studios.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl space-y-8 text-slate-700 dark:text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold">Information we collect</h2>
            <p className="mt-4">
              We collect contact details, account information, and support requests to help deliver our services and communicate updates.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">How we use it</h2>
            <p className="mt-4">
              Data is used to respond to inquiries, manage tournament registrations, and improve our services. We never sell your personal information.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Data protection</h2>
            <p className="mt-4">
              We protect information with industry standard security measures and limit access to trusted Geco Games Studios team members.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
