import { useState } from "react"

export type TeamStat = {
  team: string
  team_name: string
  games: number
  win_pct: number
  avg_pts: number
  avg_fg3_pct: number
  avg_reb: number
  avg_ast: number
  avg_stl: number
  avg_blk: number
  avg_tov: number
}

type SortKey = keyof TeamStat
type Dir = "asc" | "desc"

const COLS: { key: SortKey; label: string; fmt: (v: number | string) => string }[] = [
  { key: "team", label: "Team", fmt: (v) => String(v) },
  { key: "win_pct", label: "Win%", fmt: (v) => `${(+v * 100).toFixed(1)}%` },
  { key: "avg_pts", label: "Pts", fmt: (v) => (+v).toFixed(1) },
  { key: "avg_fg3_pct", label: "3PT%", fmt: (v) => `${(+v * 100).toFixed(1)}%` },
  { key: "avg_reb", label: "Reb", fmt: (v) => (+v).toFixed(1) },
  { key: "avg_ast", label: "Ast", fmt: (v) => (+v).toFixed(1) },
  { key: "avg_stl", label: "Stl", fmt: (v) => (+v).toFixed(1) },
  { key: "avg_blk", label: "Blk", fmt: (v) => (+v).toFixed(1) },
  { key: "avg_tov", label: "TOV", fmt: (v) => (+v).toFixed(1) },
]

function winPctBar(pct: number) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <span>{(pct * 100).toFixed(1)}%</span>
    </div>
  )
}

export default function TeamStatsTable({ data }: { data: TeamStat[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("win_pct")
  const [dir, setDir] = useState<Dir>("desc")

  function handleSort(key: SortKey) {
    if (key === sortKey) setDir((d) => (d === "desc" ? "asc" : "desc"))
    else { setSortKey(key); setDir("desc") }
  }

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey]
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return dir === "desc" ? -cmp : cmp
  })

  return (
    <div>
      <p className="text-neutral-500 text-xs mb-3">Click a column header to sort. All stats are per-game averages.</p>
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900">
              {COLS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 text-left font-medium cursor-pointer select-none whitespace-nowrap transition-colors hover:text-orange-400 ${
                    sortKey === col.key ? "text-orange-400" : "text-neutral-400"
                  }`}
                >
                  {col.label} {sortKey === col.key ? (dir === "desc" ? "↓" : "↑") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={row.team}
                className={`border-b border-neutral-800/50 hover:bg-neutral-900/60 transition-colors ${
                  i === 0 ? "bg-orange-950/20" : ""
                }`}
              >
                <td className="px-4 py-3 font-bold">{row.team}</td>
                <td className="px-4 py-3">{winPctBar(row.win_pct)}</td>
                <td className="px-4 py-3">{row.avg_pts.toFixed(1)}</td>
                <td className="px-4 py-3 font-medium text-blue-400">{(row.avg_fg3_pct * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-green-400">{row.avg_reb.toFixed(1)}</td>
                <td className="px-4 py-3">{row.avg_ast.toFixed(1)}</td>
                <td className="px-4 py-3 text-yellow-400">{row.avg_stl.toFixed(1)}</td>
                <td className="px-4 py-3">{row.avg_blk.toFixed(1)}</td>
                <td className="px-4 py-3 text-red-400">{row.avg_tov.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
