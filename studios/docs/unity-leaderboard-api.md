# Unity Leaderboard API

This prototype exposes a simple leaderboard page and score endpoint:

- Page: `/unity-leaderboard`
- Read scores: `GET /api/unity-leaderboard`
- Submit score: `POST /api/unity-leaderboard`

## Submit Payload

```json
{
  "playerId": "unity-editor-test",
  "playerName": "Unity Editor Test",
  "score": 155
}
```

The endpoint keeps the highest score per `playerId`.

## Optional API Key

Set `UNITY_LEADERBOARD_API_KEY` in production to require Unity requests to include:

```http
x-api-key: YOUR_KEY
```

If the environment variable is not set, POST requests are open for quick Unity Editor testing.

## Storage

Current storage is prototype in-memory server storage. This is enough to test the Unity Editor feed and online route, but production leaderboards should move to durable storage such as Supabase, Firebase, Vercel KV, Postgres, or the existing Jampass backend before public launch.
