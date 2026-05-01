export type JampassUserRole = "admin" | "vendor" | "player"

export interface JampassUser {
  id: string
  name: string
  email: string
  role: JampassUserRole
  centerId?: string
}

export interface JampassVendor {
  id: string
  centerName: string
  city: string
  state: string
  entryFeePaid: boolean
  registeredAt: string
  teamName: string
}

export interface JampassPlayer {
  id: string
  name: string
  gameSpecialization: "FC 26" | "Mortal Kombat"
  rank: string
  winRate: string
  centerName: string
  matchHistory: Array<{ opponent: string; result: string; score: string }>
}

export interface JampassTournament {
  id: string
  name: string
  game: "FC 26" | "Mortal Kombat"
  venue: string
  startDate: string
  endDate: string
  phase: "Registration" | "Group Stage" | "Knockout" | "Final"
  totalTeams: number
}

export interface JampassMatch {
  id: string
  tournamentId: string
  round: string
  stage: string
  teamA: string
  teamB: string
  scheduledAt: string
  seatId: string
  status: "Pending" | "Live" | "Completed"
  result?: string
}

export interface JampassSeat {
  id: string
  station: string
  platform: "PS5" | "Xbox Series X" | "PC"
  status: "Available" | "Assigned" | "Occupied"
  currentMatch?: string
}
