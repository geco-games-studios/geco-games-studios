import Link from "next/link"

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <main className="container mx-auto px-4 py-16 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">
              Game Integration API Documentation
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Game Integration API Documentation
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              This guide explains how to integrate your game with the verification and connection service.
            </p>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">1. Add API Key to Your Game</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Obtain your unique API key from the developer dashboard or admin. Store the API key securely in your game’s code or configuration.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">2. Verify and Activate Your Game</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Use the verify-key endpoint to activate your game before connecting users.
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Endpoint:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">
                  POST /api/v1/test/developer/games/verify-key/
                </pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Request Body:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">
{`{
  "api_key": "YOUR_GAME_API_KEY"
}`}
                </pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Response:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">
{`{
  "status": "verified"
}`}
                </pre>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                If the key is valid, the game is set as active. If invalid, you’ll get <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">"status": "unverified"</code>.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">3. Connect a User (Jammer) to the Game</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Use the connect endpoint to track authenticated users connected to your game.
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Endpoint:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">
                  POST /api/v1/test/developer/games/&lt;game_id&gt;/connect/
                </pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Headers:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">
{`Authorization: Bearer <user_token>
`}
                </pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Request Body (optional):</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">
{`{
  "access_token": "<user_token>"
}`}
                </pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Response:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">
{`{
  "connected_users": <number>,
  "session": { ... }
}`}
                </pre>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                The user is now tracked as a connected user for the game.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">4. Additional Endpoints</h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300 list-disc list-inside">
              <li><code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">/developer/games/&lt;game_id&gt;/verify/</code> — Verify a game by ID and API key.</li>
              <li><code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">/developer/games/&lt;game_id&gt;/stats/</code> — Get game statistics.</li>
              <li><code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">/developer/games/&lt;game_id&gt;/ratings/</code> — Get game ratings.</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">Notes</h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300 list-disc list-inside">
              <li>Always keep your API key secret.</li>
              <li>Only authenticated users (jammers) can connect and be tracked.</li>
              <li>Use the verify-key endpoint to activate your game before connecting users.</li>
            </ul>
          </section>

          <div className="text-center">
            <Link href="/developer/support" className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400">
              Back to Developer Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
