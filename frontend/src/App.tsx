import { useEffect, useState } from "react"
import NBATable, { type Player } from "@/components/NBATable"

function App() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://localhost:8000/players")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: Player[]) => setPlayers(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">NBA Players</h1>
      {loading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && <NBATable data={players} />}
    </main>
  )
}

export default App
