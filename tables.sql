CREATE TABLE IF NOT EXISTS account (
   id uuid PRIMARY KEY NOT NULL,
   email text UNIQUE NOT NULL,
   username text NOT NULL,
   password text NOT NULL
);

CREATE TABLE IF NOT EXISTS serie (
   id uuid PRIMARY KEY NOT NULL,
   tmdb_id text NOT NULL,
   title text NOT NULL,
   overview text NOT NULL,
   poster_path text NOT NULL,
   episode_count integer NOT NULL
);

CREATE TABLE IF NOT EXISTS season (
   id uuid PRIMARY KEY NOT NULL,
   tmdb_id text NOT NULL,
   tmdb_season_nr text,
   title text NOT NULL,
   overview text NOT NULL,
   poster_path text NOT NULL,
   episode_count integer NOT NULL
);

CREATE TABLE IF NOT EXISTS collection (
   id uuid PRIMARY KEY NOT NULL,
   tmdb_id text NOT NULL,
   title text NOT NULL,
   overview text NOT NULL,
   poster_path text NOT NULL,
   backdrop_path text NOT NULL,
   part_count integer NOT NULL
);

CREATE TABLE IF NOT EXISTS video (
   id uuid PRIMARY KEY NOT NULL,
   tmdb_id text NOT NULL,
   tmdb_season_nr text,
   tmdb_episode_nr text,
   tmdb_collection_id text,
   duration integer NOT NULL,
   title text NOT NULL,
   overview text NOT NULL,
   release_date date NOT NULL,
   poster_path text NOT NULL,
   backdrop_path text NOT NULL
);

CREATE TABLE IF NOT EXISTS watch (
   id uuid PRIMARY KEY NOT NULL,
   account_id uuid REFERENCES account(id) NOT NULL,
   video_id uuid REFERENCES video(id) NOT NULL,
   duration INTEGER NOT NULL,
   last_updated date not null
);