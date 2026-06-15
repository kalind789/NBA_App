import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export type Factor = {
  metric: string
  wins_avg: number
  losses_avg: number
  diff: number
}

const LABELS: Record<string, string> = {
  fg3_pct: "3PT%",
  reb: "Rebounds",
  ast: "Assists",
  stl: "Steals",
  blk: "Blocks",
  tov: "Turnovers",
  pts: "Points",
  fg_pct: "FG%",
  ft_pct: "FT%",
}

const PCT_METRICS = new Set(["fg3_pct", "fg_pct", "ft_pct"])

function fmt(metric: string, v: number) {
  return PCT_METRICS.has(metric) ? `${(v * 100).toFixed(1)}%` : v.toFixed(1)
}

function DiffCard({ f }: { f: Factor }) {
  const positive = f.metric !== "tov"
  const good = positive ? f.diff > 0 : f.diff < 0
  return (
    <div className={`rounded-xl border p-4 ${good ? "border-green-800 bg-green-950/30" : "border-red-800 bg-red-950/20"}`}>
      <p className="text-xs text-neutral-400 mb-1">{LABELS[f.metric] ?? f.metric}</p>
      <p className={`text-lg font-bold ${good ? "text-green-400" : "text-red-400"}`}>
        {f.diff > 0 ? "+" : ""}{fmt(f.metric, f.diff)}
      </p>
      <p className="text-xs text-neutral-500 mt-1">winners vs losers</p>
    </div>
  )
}

export default function WinningFactorsChart({ factors }: { factors: Factor[] }) {
  const chartData = factors.map((f) => ({
    name: LABELS[f.metric] ?? f.metric,
    metric: f.metric,
    Wins: PCT_METRICS.has(f.metric) ? +(f.wins_avg * 100).toFixed(1) : +f.wins_avg.toFixed(1),
    Losses: PCT_METRICS.has(f.metric) ? +(f.losses_avg * 100).toFixed(1) : +f.losses_avg.toFixed(1),
  }))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-1">Winning vs. Losing Team Averages</h2>
        <p className="text-neutral-400 text-sm">
          Across all 2025-26 playoff games, how do winning teams compare to losing teams on key metrics?
        </p>
      </div>

      {/* Diff summary cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {factors.map((f) => <DiffCard key={f.metric} f={f} />)}
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="text-sm font-medium text-neutral-300 mb-4">Side-by-Side Comparison</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="name" tick={{ fill: "#737373", fontSize: 12 }} />
            <YAxis tick={{ fill: "#737373", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#171717", border: "1px solid #404040", borderRadius: 8 }}
              labelStyle={{ color: "#e5e5e5" }}
            />
            <Legend wrapperStyle={{ color: "#a3a3a3", fontSize: 12 }} />
            <Bar dataKey="Wins" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Losses" fill="#525252" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-neutral-600 text-xs">
        3PT%, FG%, FT% shown as percentages (×100). Turnovers: lower is better for winners.
      </p>
    </div>
  )
}
