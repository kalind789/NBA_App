from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from analytics import team_season_stats, winning_factors, outlier_games

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/team-stats")
def get_team_stats():
    return team_season_stats()


@app.get("/api/winning-factors")
def get_winning_factors():
    return winning_factors()


@app.get("/api/outliers")
def get_outliers():
    return outlier_games()
