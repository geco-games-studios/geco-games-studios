import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Clock4, LayoutDashboard, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MatchCardProps {
  match: {
    teamA: string
    teamB: string
    scheduledAt: string
    seatId: string
    status: "Pending" | "Live" | "Completed"
    result?: string
    round: string
  }
}

export function MatchCard({ match }: MatchCardProps) {
  const statusColor =
    match.status === "Live"
      ? "bg-emerald-500 text-white"
      : match.status === "Completed"
      ? "bg-slate-800 text-white"
      : "bg-slate-700 text-slate-100"

  return (
    <Card className="overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-xl shadow-slate-950/20">
      <CardHeader className="space-y-3 bg-slate-900/95 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{match.round}</p>
            <CardTitle className="text-lg">{match.teamA} vs {match.teamB}</CardTitle>
          </div>
          <span className={cn("inline-flex rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em]", statusColor)}>
            {match.status}
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock4 className="h-4 w-4" />
            <span>{match.scheduledAt}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <LayoutDashboard className="h-4 w-4" />
            <span>{match.seatId}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5 pt-3">
        <p className="text-sm text-slate-300">{match.result ?? "Match setup complete. Awaiting kickoff."}</p>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-500">
          <ShieldCheck className="h-4 w-4" />
          Tournament-managed schedule
        </div>
      </CardContent>
    </Card>
  )
}
