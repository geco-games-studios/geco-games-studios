import { NextResponse } from "next/server"
import { z } from "zod"

export const dynamic = "force-dynamic"

type LeaderboardEntry = {
  playerId: string
  playerName: string
  score: number
  updatedAt: string
}

type LeaderboardStore = {
  entries: LeaderboardEntry[]
}

const seedEntries: LeaderboardEntry[] = [
  { playerId: "sir-bacon", playerName: "Sir Bacon", score: 90, updatedAt: new Date().toISOString() },
  { playerId: "lord-stove", playerName: "Lord Stove", score: 70, updatedAt: new Date().toISOString() },
  { playerId: "master-pantoise", playerName: "Master Pantoise", score: 50, updatedAt: new Date().toISOString() },
  { playerId: "myekule", playerName: "Myekule", score: 40, updatedAt: new Date().toISOString() },
]

const scoreSchema = z.object({
  playerId: z.string().trim().min(1).max(80),
  playerName: z.string().trim().min(1).max(80),
  score: z.number().int().min(0).max(999999999),
})

const resetSchema = z.object({
  reset: z.literal(true),
})

const globalStore = globalThis as typeof globalThis & {
  unityLeaderboardStore?: LeaderboardStore
}

function getStore() {
  if (!globalStore.unityLeaderboardStore) {
    globalStore.unityLeaderboardStore = {
      entries: seedEntries.map((entry) => ({ ...entry })),
    }
  }

  return globalStore.unityLeaderboardStore
}

function rankedEntries() {
  return [...getStore().entries].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score
    }

    return left.playerName.localeCompare(right.playerName)
  })
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    "Cache-Control": "no-store",
  }
}

function isAuthorized(request: Request) {
  const apiKey = process.env.UNITY_LEADERBOARD_API_KEY

  if (!apiKey) {
    return true
  }

  return request.headers.get("x-api-key") === apiKey
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  })
}

export async function GET() {
  return NextResponse.json(
    {
      leaderboard: rankedEntries(),
      updatedAt: new Date().toISOString(),
      storage: "prototype-memory",
    },
    { headers: corsHeaders() }
  )
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Invalid leaderboard API key." }, { status: 401, headers: corsHeaders() })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400, headers: corsHeaders() })
  }

  const resetPayload = resetSchema.safeParse(body)
  if (resetPayload.success) {
    getStore().entries = seedEntries.map((entry) => ({ ...entry, updatedAt: new Date().toISOString() }))
    return NextResponse.json({ leaderboard: rankedEntries() }, { headers: corsHeaders() })
  }

  const parsed = scoreSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Send playerId, playerName, and an integer score.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400, headers: corsHeaders() }
    )
  }

  const store = getStore()
  const now = new Date().toISOString()
  const existing = store.entries.find((entry) => entry.playerId === parsed.data.playerId)

  if (existing) {
    existing.playerName = parsed.data.playerName
    existing.score = Math.max(existing.score, parsed.data.score)
    existing.updatedAt = now
  } else {
    store.entries.push({ ...parsed.data, updatedAt: now })
  }

  return NextResponse.json(
    {
      leaderboard: rankedEntries(),
      accepted: parsed.data,
    },
    { headers: corsHeaders() }
  )
}
