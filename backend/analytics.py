import pandas as pd
from data_loader import get_df

# Factors that most separate winners from losers.
# Ordered by impact: reb, ast, tov, stl, fg3_pct, fg_pct
KEY_FACTORS = ["reb", "ast", "tov", "stl", "fg3_pct", "fg_pct"]

METRIC_LABELS = {
    "fg3_pct": "3PT%",
    "fg_pct": "FG%",
    "reb": "Rebounds",
    "ast": "Assists",
    "stl": "Steals",
    "blk": "Blocks",
    "tov": "Turnovers",
    "ft_pct": "FT%",
}

LOWER_IS_BETTER = {"tov"}


def _base_df() -> pd.DataFrame:
    df = get_df().copy()
    df["win"] = (df["wl"] == "W").astype(int)
    return df


def _is_weak(metric: str, value: float, win_avg: float) -> bool:
    if metric in LOWER_IS_BETTER:
        return value > win_avg
    return value < win_avg


def _is_strong(metric: str, value: float, win_avg: float) -> bool:
    """Meaningfully better the winning average."""
    if metric in LOWER_IS_BETTER:
        return value < win_avg - 1.5
    if metric in ("fg3_pct", "fg_pct", "ft_pct"):
        return value > win_avg + 0.025
    return value > win_avg + 2.5


def team_season_stats() -> list[dict]:
    df = _base_df()
    grp = df.groupby(["team_abbreviation", "team_name"])
    agg = grp.agg(
        games=("game_id", "count"),
        wins=("win", "sum"),
        avg_pts=("pts", "mean"),
        avg_fg3_pct=("fg3_pct", "mean"),
        avg_reb=("reb", "mean"),
        avg_ast=("ast", "mean"),
        avg_stl=("stl", "mean"),
        avg_blk=("blk", "mean"),
        avg_tov=("tov", "mean"),
    ).reset_index()
    agg["win_pct"] = agg["wins"] / agg["games"]
    agg = agg.sort_values("win_pct", ascending=False)

    def _r(v): return round(float(v), 3)

    return [
        {
            "team": row["team_abbreviation"],
            "team_name": row["team_name"],
            "games": int(row["games"]),
            "win_pct": _r(row["win_pct"]),
            "avg_pts": _r(row["avg_pts"]),
            "avg_fg3_pct": _r(row["avg_fg3_pct"]),
            "avg_reb": _r(row["avg_reb"]),
            "avg_ast": _r(row["avg_ast"]),
            "avg_stl": _r(row["avg_stl"]),
            "avg_blk": _r(row["avg_blk"]),
            "avg_tov": _r(row["avg_tov"]),
        }
        for _, row in agg.iterrows()
    ]


def winning_factors() -> dict:
    df = _base_df()
    metrics = ["fg3_pct", "reb", "ast", "stl", "blk", "tov", "pts", "fg_pct", "ft_pct"]
    wins = df[df["win"] == 1][metrics].mean()
    losses = df[df["win"] == 0][metrics].mean()
    return {
        "factors": [
            {
                "metric": m,
                "wins_avg": round(float(wins[m]), 3),
                "losses_avg": round(float(losses[m]), 3),
                "diff": round(float(wins[m] - losses[m]), 3),
            }
            for m in metrics
        ]
    }


def outlier_games() -> list[dict]:
    df = _base_df()
    wins = df[df["win"] == 1]

    all_metrics = KEY_FACTORS + ["blk", "ft_pct"]
    win_avgs = wins[all_metrics].mean()

    records = []
    for _, row in wins.iterrows():
        weak = [
            METRIC_LABELS[f]
            for f in KEY_FACTORS
            if _is_weak(f, row[f], win_avgs[f])
        ]
        if not weak:
            continue

        compensators = [
            METRIC_LABELS[m]
            for m in all_metrics
            if METRIC_LABELS.get(m) not in weak
            and _is_strong(m, row[m], win_avgs[m])
        ]
        if not compensators:
            compensators = ["Opponent underperformed"]

        records.append({
            "game_date": str(row["game_date"]),
            "team": row["team_abbreviation"],
            "matchup": row["matchup"],
            "pts": int(row["pts"]),
            "fg_pct": round(float(row["fg_pct"]), 3),
            "fg3_pct": round(float(row["fg3_pct"]), 3),
            "ft_pct": round(float(row["ft_pct"]), 3),
            "reb": int(row["reb"]),
            "ast": int(row["ast"]),
            "stl": int(row["stl"]),
            "blk": int(row["blk"]),
            "tov": int(row["tov"]),
            "weak_factors": weak,
            "compensators": compensators,
        })

    records.sort(key=lambda r: len(r["weak_factors"]), reverse=True)
    return records
