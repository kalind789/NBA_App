import os
import time
import pandas as pd
from nba_api.stats.endpoints import leaguegamelog

CACHE_PATH = os.path.join(os.path.dirname(__file__), "data_cache.csv")


def fetch_team_game_logs(season: str = "2025-26") -> pd.DataFrame:
    if os.path.exists(CACHE_PATH):
        return pd.read_csv(CACHE_PATH)

    print(f"Fetching NBA playoff team game logs for {season}...")
    time.sleep(0.6)
    logs = leaguegamelog.LeagueGameLog(
        season=season,
        player_or_team_abbreviation="T",
        season_type_all_star="Playoffs",
    )
    df = logs.get_data_frames()[0]

    # Normalize column names to lowercase
    df.columns = [c.lower() for c in df.columns]

    df.to_csv(CACHE_PATH, index=False)
    print(f"Cached {len(df)} rows to {CACHE_PATH}")
    return df


def get_df() -> pd.DataFrame:
    return fetch_team_game_logs()