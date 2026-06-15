import { useEffect, useState } from "react"
import TeamStatsTable, { type TeamStat } from "@/components/TeamStatsTable"
import WinningFactorsChart, { type Factor } from "@/components/WinningFactorsChart"
import OutlierGamesTable, { type OutlierGame } from "@/components/OutlierGamesTable"

type Tab = "stats" | "factors" | "outliers"

const API = "http://localhost:8000"

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [url])
  return { data, loading, error }
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
        active
          ? "bg-orange-500 text-white shadow"
          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
      }`}
    >
      {label}
    </button>
  )
}

function Section({ loading, error, children }: { loading: boolean; error: string | null; children: React.ReactNode }) {
  if (loading) return <p className="text-neutral-500 py-12 text-center">Loading...</p>
  if (error) return <p className="text-red-400 py-12 text-center">Error: {error}</p>
  return <>{children}</>
}

export default function App() {
  const [tab, setTab] = useState<Tab>("stats")
  const stats = useFetch<TeamStat[]>(`${API}/api/team-stats`)
  const factors = useFetch<{ factors: Factor[] }>(`${API}/api/winning-factors`)
  const outliers = useFetch<OutlierGame[]>(`${API}/api/outliers`)

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">NBA Team Analytics</h1>
          <p className="text-neutral-400 mt-1 text-sm">2025-26 Playoffs — What made teams win?</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-neutral-900 p-1 rounded-full w-fit">
          <TabButton label="Season Stats" active={tab === "stats"} onClick={() => setTab("stats")} />
          <TabButton label="Winning Factors" active={tab === "factors"} onClick={() => setTab("factors")} />
          <TabButton label="Outlier Wins" active={tab === "outliers"} onClick={() => setTab("outliers")} />
        </div>

        {/* Content */}
        {tab === "stats" && (
          <Section loading={stats.loading} error={stats.error}>
            {stats.data && <TeamStatsTable data={stats.data} />}
          </Section>
        )}
        {tab === "factors" && (
          <Section loading={factors.loading} error={factors.error}>
            {factors.data && <WinningFactorsChart factors={factors.data.factors} />}
          </Section>
        )}
        {tab === "outliers" && (
          <Section loading={outliers.loading} error={outliers.error}>
            {outliers.data && <OutlierGamesTable data={outliers.data} />}
          </Section>
        )}
      </div>
    </div>
  )
}
