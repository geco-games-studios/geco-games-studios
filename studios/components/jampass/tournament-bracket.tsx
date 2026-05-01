import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowRight, Trophy } from "lucide-react"

export interface BracketRound {
  title: string
  matches: Array<{
    id: string
    teamA: string
    teamB: string
    scoreA?: number
    scoreB?: number
    status: "Completed" | "Live" | "Pending"
  }>
}

export interface TournamentBracketProps {
  title: string
  game: string
  rounds: BracketRound[]
}

export function TournamentBracket({ title, game, rounds }: TournamentBracketProps) {
  return (
    <Card className="border border-slate-800 bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
      <CardHeader className="space-y-3 bg-slate-900/95 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{game} tournament</p>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            <Trophy className="h-4 w-4" /> Final venue live in 5 days
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
        {rounds.map((round) => (
          <div key={round.title} className="space-y-4">
            <div className="rounded-3xl bg-slate-900 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{round.title}</p>
            </div>
            <div className="space-y-4">
              {round.matches.map((match) => (
                <div key={match.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-500/50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{match.teamA}</p>
                      <p className="text-xs text-slate-500">vs</p>
                      <p className="text-sm font-semibold text-slate-200">{match.teamB}</p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      {match.status}
                    </div>
                  </div>
                  {(match.scoreA !== undefined || match.scoreB !== undefined) && (
                    <div className="mt-3 flex items-center gap-3 text-sm font-semibold text-slate-200">
                      <span>{match.scoreA ?? "-"}</span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                      <span>{match.scoreB ?? "-"}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
