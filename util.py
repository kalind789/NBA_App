import os
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY")
)

PLAYERS_NEEDED_COLUMS = [
    "gameId",
    "teamId",
    
    "personId",
    "firstName",
    "familyName",
    "player_name",

    "position",
    "jerseyNum",
    "minutes",
    "fieldGoalsMade",
    "fieldGoalsAttempted",
    "fieldGoalsPercentage",

    "threePointersMade",
    "threePointersAttempted",
    "threePointersPercentage",

    "freeThrowsMade",
    "freeThrowsAttempted",
    "freeThrowsPercentage",

    "reboundsOffensive",
    "reboundsDefensive",
    "reboundsTotal",

    "assists",
    "steals",
    "blocks",
    "turnovers",
    "foulsPersonal",
    "points",
    "plusMinusPoints"
]

TEAMS_NEEDED_COLUMNS = [
    'teamId', 
    'teamCity', 
    'teamName', 
    'teamTricode', 
    'teamSlug'
]