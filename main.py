from supabase import create_client, Client
from dotenv import load_dotenv
import os
from nba_api.stats.endpoints import boxscoretraditionalv3
import pandas as pd
from util import PLAYERS_NEEDED_COLUMS, TEAMS_NEEDED_COLUMNS, supabase

GAME_ID = "0042500221"

def extract_game_info(game_id):
    boxscore = boxscoretraditionalv3.BoxScoreTraditionalV3(game_id=GAME_ID)
    df = boxscore.get_data_frames()[0]

    df['player_name'] = df['firstName'] + " " + df['familyName']
    players_df = df[PLAYERS_NEEDED_COLUMS]

    teams_df = df[TEAMS_NEEDED_COLUMNS]

    return players_df, teams_df

def load_teams_table():
    loaded_tm = supabase.table('teams').select('*').execute()
    return loaded_tm.data

def upsert_teams_table(df):
    df = df.drop_duplicates()
    records = [
        {
        "team_id": row['teamId'], "abbreviation": row["teamTricode"], "team_name": row["teamName"], 
        "simple_name": row['teamSlug'], "city": row['teamCity']
        }
        for _, row in df.iterrows()
        ]
    
    # upsert allows you to add new rows ONLY if they aren't duplicates
    supabase.table('teams').upsert(records, on_conflict="team_id").execute()

def load_players_table():
    loaded_pl = supabase.table('players').select('*').execute()
    return loaded_pl.data

def upsert_players_info(df):
    df = df.drop_duplicates(subset=["personId"])
    records = [
        {"player_id": row['personId'], "player_name": row["player_name"], "team_id": row["teamId"]}
        for _, row in df.iterrows()
        ]
    
    # upsert allows you to add new rows ONLY if they aren't duplicates
    supabase.table('players').upsert(records, on_conflict="player_id").execute()

if __name__ == "__main__":
    player_box_score_df, teams_box_score_df = extract_game_info(game_id=GAME_ID)
    # print(player_box_score_df.head())

    upsert_teams_table(teams_box_score_df)

    tbl1 = load_players_table()
    print(len(tbl1))

    upsert_players_info(player_box_score_df)

    tbl2 = load_players_table()
    print(len(tbl2))