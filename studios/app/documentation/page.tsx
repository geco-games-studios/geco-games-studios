import Link from "next/link"

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <main className="container mx-auto px-4 py-16 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Game Integration API Documentation</h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">This guide explains how to fully integrate your game with the platform: authentication, game verification, user connection, and metric submission.</p>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 text-right">
              <div className="font-semibold">Version</div>
              <div className="mt-1">0.0.3</div>
            </div>
          </div>

          <hr className="my-8 border-cyan-600 dark:border-cyan-400" />

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">1. User Authentication (Login Required)</h2>
            <p className="text-slate-600 dark:text-slate-300">Authentication is required for all user actions. Obtain a JWT access token via login and send it as a Bearer token on protected endpoints.</p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Endpoint:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">POST /api/v1/test/login/</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Request Body:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">{`{
  "email": "user@example.com",
  "password": "user_password"
}`}</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Expected Response (Success):</p>
                <pre className="mt-2 rounded-lg bg-green-50 p-4 text-sm text-green-900 dark:bg-green-900 dark:text-green-100 overflow-x-auto">{`{
  "refresh": "<refresh_token>",
  "access": "<access_token>",
  "user": { "id": 5, "email": "user@example.com" }
}`}</pre>
              </div>
              <p className="text-slate-600 dark:text-slate-300">Notes: Save the <code>access</code> token and send <code>Authorization: Bearer &lt;access&gt;</code> for protected endpoints.</p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">2. Add API Key to Your Game</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li>Obtain your unique API key from the developer dashboard or admin.</li>
              <li>Store the API key securely in your game’s code or configuration.</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">3. Verify and Activate Your Game</h2>
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
                <p className="font-semibold text-slate-900 dark:text-white">Notes:</p>
                <ul className="list-disc list-inside ml-6 text-slate-600 dark:text-slate-300">
                  <li>If the key is valid, the game is set as active.</li>
                  <li>If invalid, you’ll get <code>"status": "unverified"</code> and an error message.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">4. Connect a User (Jammer) to the Game</h2>
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
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">5. Submit a Metric (Score, Level, etc.)</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Endpoint:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">POST /api/v1/test/developer/game-sessions/&lt;session_id&gt;/submit-metric/</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Headers:</p>
                <ul className="list-disc list-inside ml-6 text-slate-600 dark:text-slate-300">
                  <li>Authorization: Bearer <code>&lt;access_token&gt;</code></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Request Body:</p>
                <pre className="mt-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto">{`{
  "game": <game_id>,
  "value": <metric_value>
}`}</pre>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Note: The field must be named <code>game</code> (not <code>game_id</code>).</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Expected Response (Success):</p>
                <pre className="mt-2 rounded-lg bg-green-50 p-4 text-sm text-green-900 dark:bg-green-900 dark:text-green-100 overflow-x-auto">{`{
  "detail": "<metric_name> updated.",
  "value": <metric_value>,
  "leaderboard": [ ... ]
}`}</pre>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Error Responses:</p>
                <ul className="list-disc list-inside ml-6 text-slate-600 dark:text-slate-300">
                  <li><code>400 Bad Request</code>: Missing or invalid fields, or session/game not found.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">6. Integration Checklist</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li>Authenticate user and obtain access token.</li>
              <li>Verify and activate your game with its API key.</li>
              <li>Connect the authenticated user to the game.</li>
              <li>Submit metrics for the connected session (include <code>game</code> and <code>value</code>).</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold mb-4">7. Additional Endpoints</h2>
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
            <h2 className="text-2xl font-semibold mb-4">8. Notes</h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300 list-disc list-inside">
              <li>Always keep your API key secret.</li>
              <li>Only authenticated users (jammers) can connect and be tracked.</li>
              <li>Use the verify-key endpoint to activate your game before connecting users.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
