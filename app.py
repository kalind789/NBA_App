from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from util import supabase

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/players")
def get_players():
    info = supabase.table('players').select('*').execute()
    return info.data