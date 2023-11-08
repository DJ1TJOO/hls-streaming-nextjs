-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Serie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdb_id" INTEGER NOT NULL,
    "tmdb_collection_id" INTEGER,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "backdrop_path" TEXT NOT NULL,
    "season_count" INTEGER NOT NULL,
    "episode_count" INTEGER NOT NULL,
    "release_date" DATETIME NOT NULL,
    CONSTRAINT "Serie_tmdb_collection_id_fkey" FOREIGN KEY ("tmdb_collection_id") REFERENCES "Collection" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdb_serie_id" INTEGER NOT NULL,
    "tmdb_season_nr" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "episode_count" INTEGER NOT NULL,
    "release_date" DATETIME NOT NULL,
    CONSTRAINT "Season_tmdb_serie_id_fkey" FOREIGN KEY ("tmdb_serie_id") REFERENCES "Serie" ("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdb_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "backdrop_path" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdb_id" INTEGER,
    "tmdb_serie_id" INTEGER,
    "tmdb_season_nr" INTEGER,
    "tmdb_episode_nr" INTEGER,
    "tmdb_collection_id" INTEGER,
    "duration" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "release_date" DATETIME NOT NULL,
    "poster_path" TEXT,
    "backdrop_path" TEXT,
    "completed_upload" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Video_tmdb_serie_id_fkey" FOREIGN KEY ("tmdb_serie_id") REFERENCES "Serie" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Video_tmdb_serie_id_tmdb_season_nr_fkey" FOREIGN KEY ("tmdb_serie_id", "tmdb_season_nr") REFERENCES "Season" ("tmdb_serie_id", "tmdb_season_nr") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Video_tmdb_collection_id_fkey" FOREIGN KEY ("tmdb_collection_id") REFERENCES "Collection" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Serie_tmdb_id_key" ON "Serie"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "Season_tmdb_serie_id_tmdb_season_nr_key" ON "Season"("tmdb_serie_id", "tmdb_season_nr");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_tmdb_id_key" ON "Collection"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_tmdb_id_tmdb_serie_id_tmdb_season_nr_tmdb_episode_nr_tmdb_collection_id_key" ON "Video"("tmdb_id", "tmdb_serie_id", "tmdb_season_nr", "tmdb_episode_nr", "tmdb_collection_id");
