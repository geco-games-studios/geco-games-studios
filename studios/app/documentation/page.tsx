import Link from "next/link"


export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <main className="container mx-auto px-4 py-16 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Game Integration API Documentation
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              This guide explains how to integrate your game with the verification and connection service.
            </p>
          </div>

          <hr className="my-8 border-cyan-600 dark:border-cyan-400" />

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">1. Add API Key to Your Game</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li>Obtain your unique API key from the developer dashboard or admin.</li>
              <li>Store the API key securely in your game’s code or configuration.</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">2. Verify and Activate Your Game</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Endpoint:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">POST /api/v1/test/developer/games/verify-key/</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Request Body:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">{`{
  "api_key": "YOUR_GAME_API_KEY"
}`}</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Expected Response (Success):</p>
                <pre className="mt-2 rounded-lg bg-green-50 p-4 text-sm text-green-900 dark:bg-green-900 dark:text-green-100 overflow-x-auto">{`{
  "status": "verified"
}`}</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Error Response (Invalid Key):</p>
                <pre className="mt-2 rounded-lg bg-red-50 p-4 text-sm text-red-900 dark:bg-red-900 dark:text-red-100 overflow-x-auto">{`{
  "status": "unverified",
  "error": "Invalid API key."
}`}</pre>
                <p className="mt-2 text-slate-600 dark:text-slate-300"><code>401 Unauthorized</code> or <code>400 Bad Request</code></p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Possible Errors:</p>
                <ul className="list-disc list-inside ml-6 text-slate-600 dark:text-slate-300">
                  <li><code>502 Bad Gateway</code>: Server error or downstream service unavailable.</li>
                  <li>If the key is valid, the game is set as active.</li>
                  <li>If invalid, you’ll get <code>"status": "unverified"</code> and an error message.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">3. Connect a User (Jammer) to the Game</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Endpoint:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">POST /api/v1/test/developer/games/&lt;game_id&gt;/connect/</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Headers:</p>
                <ul className="list-disc list-inside ml-6 text-slate-600 dark:text-slate-300">
                  <li>Authorization: Bearer <code>&lt;user_token&gt;</code> (user must be authenticated)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Request Body (optional):</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">{`{
  "access_token": "<user_token>"
}`}</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Expected Response (Success):</p>
                <pre className="mt-2 rounded-lg bg-green-50 p-4 text-sm text-green-900 dark:bg-green-900 dark:text-green-100 overflow-x-auto">{`{
  "connected_users": 1,
  "session": {
    "session_id": "abc123",
    "user_id": 42,
    "game_id": 7,
    "connected_at": "2026-05-12T12:34:56Z"
  }
}`}</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Error Responses:</p>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Unauthorized (Missing or Invalid Token):</span>
                    <pre className="mt-2 rounded-lg bg-red-50 p-4 text-sm text-red-900 dark:bg-red-900 dark:text-red-100 overflow-x-auto">{`{
  "detail": "Authentication credentials were not provided."
}`}</pre>
                    <span className="text-slate-600 dark:text-slate-300">401 Unauthorized</span>
                  </div>
                  <div>
                    <span className="font-semibold">Game Not Found:</span>
                    <pre className="mt-2 rounded-lg bg-red-50 p-4 text-sm text-red-900 dark:bg-red-900 dark:text-red-100 overflow-x-auto">{`{
  "error": "Game not found."
}`}</pre>
                    <span className="text-slate-600 dark:text-slate-300">400 Bad Request or 404 Not Found</span>
                  </div>
                  <div>
                    <span className="font-semibold">Already Connected:</span>
                    <pre className="mt-2 rounded-lg bg-red-50 p-4 text-sm text-red-900 dark:bg-red-900 dark:text-red-100 overflow-x-auto">{`{
  "error": "User already connected to this game."
}`}</pre>
                    <span className="text-slate-600 dark:text-slate-300">400 Bad Request</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Possible Errors:</p>
                <ul className="list-disc list-inside ml-6 text-slate-600 dark:text-slate-300">
                  <li><code>502 Bad Gateway</code>: Server error or downstream service unavailable.</li>
                  <li>The user is now tracked as a connected user for the game if successful.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">4. Additional Endpoints</h2>
            <ul className="space-y-6 text-slate-600 dark:text-slate-300 list-disc list-inside">
              <li>
                <span className="font-mono">/developer/games/&lt;game_id&gt;/verify/</span> — Verify a game by ID and API key.
                <div className="ml-4 mt-2">
                  <span className="font-semibold">Expected Response:</span> <span className="font-mono">200 OK</span>
                  <pre className="rounded-lg bg-green-50 p-4 text-sm text-green-900 dark:bg-green-900 dark:text-green-100 overflow-x-auto">{`{
  "status": "verified"
}`}</pre>
                  <span className="font-semibold">Error Response:</span> <span className="font-mono">401 Unauthorized</span> or <span className="font-mono">400 Bad Request</span>
                  <pre className="rounded-lg bg-red-50 p-4 text-sm text-red-900 dark:bg-red-900 dark:text-red-100 overflow-x-auto">{`{
  "status": "unverified",
  "error": "Invalid API key or game ID."
}`}</pre>
                  <span className="font-semibold">Possible Errors:</span>
                  <ul className="list-disc list-inside ml-6">
                    <li><code>502 Bad Gateway</code>: Server error or downstream service unavailable.</li>
                  </ul>
                </div>
              </li>
              <li>
                <span className="font-mono">/developer/games/&lt;game_id&gt;/stats/</span> — Get game statistics.
                <div className="ml-4 mt-2">
                  <span className="font-semibold">Expected Response:</span> <span className="font-mono">200 OK</span>
                  <pre className="rounded-lg bg-green-50 p-4 text-sm text-green-900 dark:bg-green-900 dark:text-green-100 overflow-x-auto">{`{
  "game_id": 7,
  "total_users": 123,
  "active_sessions": 5,
  "playtime": 4567
}`}</pre>
                  <span className="font-semibold">Error Response:</span> <span className="font-mono">400 Bad Request</span> or <span className="font-mono">404 Not Found</span>
                  <pre className="rounded-lg bg-red-50 p-4 text-sm text-red-900 dark:bg-red-900 dark:text-red-100 overflow-x-auto">{`{
  "error": "Game not found."
}`}</pre>
                  <span className="font-semibold">Possible Errors:</span>
                  <ul className="list-disc list-inside ml-6">
                    <li><code>502 Bad Gateway</code>: Server error or downstream service unavailable.</li>
                  </ul>
                </div>
              </li>
              <li>
                <span className="font-mono">/developer/games/&lt;game_id&gt;/ratings/</span> — Get game ratings.
                <div className="ml-4 mt-2">
                  <span className="font-semibold">Expected Response:</span> <span className="font-mono">200 OK</span>
                  <pre className="rounded-lg bg-green-50 p-4 text-sm text-green-900 dark:bg-green-900 dark:text-green-100 overflow-x-auto">{`{
  "game_id": 7,
  "average_rating": 4.5,
  "ratings_count": 20,
  "ratings": [
    {"user_id": 1, "rating": 5, "comment": "Great game!"},
    {"user_id": 2, "rating": 4, "comment": "Fun but needs improvement."}
  ]
}`}</pre>
                  <span className="font-semibold">Error Response:</span> <span className="font-mono">400 Bad Request</span> or <span className="font-mono">404 Not Found</span>
                  <pre className="rounded-lg bg-red-50 p-4 text-sm text-red-900 dark:bg-red-900 dark:text-red-100 overflow-x-auto">{`{
  "error": "Game not found."
}`}</pre>
                  <span className="font-semibold">Possible Errors:</span>
                  <ul className="list-disc list-inside ml-6">
                    <li><code>502 Bad Gateway</code>: Server error or downstream service unavailable.</li>
                  </ul>
                </div>
              </li>
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
        </div>
      </main>
    </div>
  );
}
