import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Player = {
  player_id: number
  player_name: string
  team_id: number
}

type NBATableProps = {
  data: Player[]
}

export default function NBATable({ data }: NBATableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player ID</TableHead>
            <TableHead>Player Name</TableHead>
            <TableHead>Team ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No players found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((player) => (
              <TableRow key={player.player_id}>
                <TableCell>{player.player_id}</TableCell>
                <TableCell>{player.player_name}</TableCell>
                <TableCell>{player.team_id}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
