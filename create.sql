-- TEAMS
CREATE TABLE teams(
    team_id INT PRIMARY KEY,
    abbreviation VARCHAR(5),
    team_name VARCHAR(100),
    simple_name VARCHAR(100),
    city VARCHAR(50)
);

CREATE INDEX idx_teams_abbreviation ON teams(abbreviation);


-- PLAYERS
CREATE TABLE players(
    player_id INT PRIMARY KEY,
    player_name VARCHAR(100),
    team_id INT,
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_name ON players(player_name);


-- GAMES
CREATE TABLE games (
    game_id TEXT PRIMARY KEY,
    game_date DATE,

    home_team_id INT,
    away_team_id INT,

    home_score INT,
    away_score INT,

    FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id)
);

CREATE INDEX idx_games_home_team ON games(home_team_id);
CREATE INDEX idx_games_away_team ON games(away_team_id);
CREATE INDEX idx_games_date ON games(game_date);

-- Stats for each player in each game
CREATE TABLE game_player_stats (
    game_id TEXT,
    player_id INT,
    team_id INT,

    pts INT,
    ast INT,
    reb INT,
    stl INT,
    blk INT,
    tov INT,

    fg_made INT,
    fg_attempted INT,
    fg_pct FLOAT,

    PRIMARY KEY (game_id, player_id),

    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE INDEX idx_gps_game_id ON game_player_stats(game_id);
CREATE INDEX idx_gps_player_id ON game_player_stats(player_id);
CREATE INDEX idx_gps_team_id ON game_player_stats(team_id);

-- Stas for each team in each game
CREATE TABLE game_team_stats (
    game_id TEXT,
    team_id INT,

    points INT,
    rebounds INT,
    assists INT,

    fg_pct FLOAT,
    fg3_pct FLOAT,
    ft_pct FLOAT,

    turnovers INT,

    is_winner BOOLEAN,

    PRIMARY KEY (game_id, team_id),

    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE INDEX idx_gts_game_id ON game_team_stats(game_id);
CREATE INDEX idx_gts_team_id ON game_team_stats(team_id);