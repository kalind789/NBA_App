import { useState } from "react"

export type OutlierGame = {
  game_date: string
  team: string
  matchup: string
  pts: number
  fg_pct: number
  fg3_pct: number
  ft_pct: number
  reb: number
  ast: number
  stl: number
  blk: number
  tov: number
  weak_factors: string[]
  compensators: string[]
}

const WEAK_COLORS: Record<string, string> = {
  "Rebounds":   "bg-red-950/60 text-red-300 border-red-800",
  "Assists":    "bg-orange-950/60 text-orange-300 border-orange-800",
  "Turnovers":  "bg-pink-950/60 text-pink-300 border-pink-800",
  "Steals":     "bg-rose-950/60 text-rose-300 border-rose-800",
  "3PT%":       "bg-red-950/60 text-red-300 border-red-800",
  "FG%":        "bg-orange-950/60 text-orange-300 border-orange-800",
}

const COMP_COLORS: Record<string, string> = {
  "Rebounds":             "bg-green-900/60 text-green-300 border-green-700",
  "Assists":              "bg-blue-900/60 text-blue-300 border-blue-700",
  "Steals":               "bg-yellow-900/60 text-yellow-300 border-yellow-700",
  "Blocks":               "bg-purple-900/60 text-purple-300 border-purple-700",
  "3PT%":                 "bg-cyan-900/60 text-cyan-300 border-cyan-700",
  "FG%":                  "bg-teal-900/60 text-teal-300 border-teal-700",
  "FT%":                  "bg-indigo-900/60 text-indigo-300 border-indigo-700",
  "Turnovers":            "bg-green-900/60 text-green-300 border-green-700",
  "Opponent underperformed": "bg-neutral-800 text-neutral-400 border-neutral-700",
}

function Badge({ label, type }: { label: string; type: "weak" | "comp" }) {
  const map = type === "weak" ? WEAK_COLORS : COMP_COLORS
  const cls = map[label] ?? "bg-neutral-800 text-neutral-300 border-neutral-700"
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded border ${cls} mr-1 mb-1 whitespace-nowrap`}>
      {label}
    </span>
  )
}

type FilterMode = "weak" | "comp"

export default function OutlierGamesTable({ data }: { data: OutlierGame[] }) {
  const [filterMode, setFilterMode] = useState<FilterMode>("weak")
  const [active, setActive] = useState("All")

  const weakTags = Array.from(new Set(data.flatMap((d) => d.weak_factors))).sort()
  const compTags = Array.from(new Set(data.flatMap((d) => d.compensators))).sort()
  const tags = filterMode === "weak" ? weakTags : compTags

  const filtered =
    active === "All"
      ? data
      : filterMode === "weak"
      ? data.filter((d) => d.weak_factors.includes(active))
      : data.filter((d) => d.compensators.includes(active))

  function switchMode(mode: FilterMode) {
    setFilterMode(mode)
    setActive("All")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Outlier Wins</h2>
        <p className="text-neutral-400 text-sm">
          Games where a team won despite being below the average winning team in one or more key factors
          (Rebounds, Assists, Turnovers, Steals, 3PT%, FG%). Sorted by how many key factors were weak.
        </p>
      </div>

      {/* Filter mode toggle */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-500">Filter by:</span>
        <div className="flex gap-1 bg-neutral-900 p-1 rounded-full">
          <button
            onClick={() => switchMode("weak")}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filterMode === "weak" ? "bg-red-700 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            Weak Factor
          </button>
          <button
            onClick={() => switchMode("comp")}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filterMode === "comp" ? "bg-green-700 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            Compensator
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {["All", ...tags].map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              active === tag
                ? "bg-orange-500 border-orange-500 text-white"
                : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900">
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Date</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Team</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Matchup</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Pts</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">FG%</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">3PT%</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">FT%</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Reb</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Ast</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Stl</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Blk</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">TOV</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Was weak in</th>
              <th className="px-4 py-3 text-left text-neutral-400 font-medium">Won because of</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-900/60 transition-colors">
                <td className="px-4 py-3 text-neutral-500 whitespace-nowrap text-xs">{row.game_date}</td>
                <td className="px-4 py-3 font-bold">{row.team}</td>
                <td className="px-4 py-3 text-neutral-400 whitespace-nowrap text-xs">{row.matchup}</td>
                <td className="px-4 py-3 font-semibold">{row.pts}</td>
                <td className="px-4 py-3">{(row.fg_pct * 100).toFixed(1)}%</td>
                <td className="px-4 py-3">{(row.fg3_pct * 100).toFixed(1)}%</td>
                <td className="px-4 py-3">{(row.ft_pct * 100).toFixed(1)}%</td>
                <td className="px-4 py-3">{row.reb}</td>
                <td className="px-4 py-3">{row.ast}</td>
                <td className="px-4 py-3">{row.stl}</td>
                <td className="px-4 py-3">{row.blk}</td>
                <td className="px-4 py-3">{row.tov}</td>
                <td className="px-4 py-3 min-w-[160px]">
                  <div className="flex flex-wrap">
                    {row.weak_factors.map((w) => <Badge key={w} label={w} type="weak" />)}
                  </div>
                </td>
                <td className="px-4 py-3 min-w-[160px]">
                  <div className="flex flex-wrap">
                    {row.compensators.map((c) => <Badge key={c} label={c} type="comp" />)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-neutral-500 py-8">No games match this filter.</p>
        )}
      </div>
      <p className="text-neutral-600 text-xs">{filtered.length} of {data.length} outlier wins shown.</p>
    </div>
  )
}
