import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

export interface SeatAssignmentProps {
  seats: Array<{
    id: string
    station: string
    platform: string
    status: "Available" | "Assigned" | "Occupied"
    currentMatch?: string
  }>
}

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-500/10 text-emerald-300",
  Assigned: "bg-amber-500/10 text-amber-300",
  Occupied: "bg-slate-700 text-slate-100",
}

export function SeatAssignment({ seats }: SeatAssignmentProps) {
  return (
    <Card className="border border-slate-800 bg-slate-950 text-white shadow-lg shadow-slate-950/20">
      <CardHeader className="bg-slate-900/95 p-6">
        <CardTitle>Seat & station management</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Table className="min-w-full border-separate border-spacing-y-3 text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Seat ID</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Match</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seats.map((seat) => (
              <TableRow key={seat.id} className="rounded-3xl bg-slate-900/95 shadow-sm">
                <TableCell className="font-semibold text-slate-100">{seat.id}</TableCell>
                <TableCell>{seat.station}</TableCell>
                <TableCell>{seat.platform}</TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[seat.status]}`}>
                    {seat.status}
                  </span>
                </TableCell>
                <TableCell>{seat.currentMatch ?? "Waiting"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
