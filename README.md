## Run locally

Create `.env.local` with `TMDB_API_KEY`, `DATABASE_URL` and `UPLOAD_URL`

e.g.:

```
TMDB_API_KEY=<your key>
DATABASE_URL="file:../dev.db"
UPLOAD_URL="videos"
```

## Run on usb

### Build

Build on the usb drive with a pc with node installed.

#### Env

Create `.env.production` with `TMDB_API_KEY`, `DATABASE_URL` and `UPLOAD_URL`

e.g.:

```
TMDB_API_KEY=<your key>
DATABASE_URL="file:../../production.db"
UPLOAD_URL="../videos"
```

### Prisma

Generate and apply prisma
`npm run prismaGenerateProduction`<br/>
`npm run prismaDeployProduction`

### Build

Build nextjs site
`npm install` <br/>
`npm run build`

After this make sure a node installation is located on the usb drive `..\node-v21.1.0-win-x64\`

### Start

The `start.bat` will run `npm run start` with this node. So no node is required to be installed.
