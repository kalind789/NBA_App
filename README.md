# NBA Analytics Dashboard

An analytics app for exploring how NBA playoff teams win — not just whether they won, but *why*.

The core idea: a winning team doesn't always dominate every stat. Sometimes their 3-point shooting is cold, yet they still win. What compensated? This app finds those outlier games and identifies the factors that picked up the slack.

**Live site:** https://kadhika2.github.io/NBA_App

---

## What It Does

**Team Season Stats** — Compare all 2025–26 playoff teams by win percentage, points, rebounds, assists, steals, blocks, turnovers, and 3PT%.

**Winning Factors** — See which stats most separated wins from losses across the entire season. (Rebounds and assists tend to matter more than 3PT%.)

**Outlier Game Analysis** — Browse games where a team won despite underperforming their own winning averages. Each game shows which stats were weak and what compensated for it.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Python, FastAPI, Pandas |
| Data | `nba_api` (NBA Stats API) — 2025–26 Playoffs |
| Deploy | GitHub Pages (frontend) + Render (backend) |

---

## Running Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

The API will be at `http://localhost:8000`. On first run it fetches playoff game logs from the NBA API and caches them to `data_cache.csv`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dev build points to `http://localhost:8000` by default.

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/team-stats` | Season aggregates for every playoff team |
| `GET /api/winning-factors` | Average stats in wins vs. losses, with diffs |
| `GET /api/outliers` | Games won despite below-average key metrics |

---

## How the Outlier Analysis Works

For each win, the app checks six key metrics against that team's winning averages: rebounds, assists, turnovers, steals, 3PT%, and FG%. If any metric underperformed, it looks for compensating strengths — stats that were meaningfully above the winning average in the same game.

If no single stat stands out as a compensator, the game is labeled "Opponent underperformed."
