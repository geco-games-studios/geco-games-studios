export default function SupportTermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Terms of Use</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            These terms govern your use of Geco Games Studios websites, services, and tournament programs.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl space-y-8 text-slate-700 dark:text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold">Use of our services</h2>
            <p className="mt-4">
              You agree to use our platforms responsibly, respect other users, and follow the rules for tournaments and community engagement.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Tournament participation</h2>
            <p className="mt-4">
              Participation is subject to our event rules, eligibility requirements, and the specific terms of each tournament.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Intellectual property</h2>
            <p className="mt-4">
              All content and branding on the site are owned by Geco Games Studios. You may not reproduce or redistribute without permission.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
