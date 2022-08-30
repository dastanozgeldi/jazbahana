# Jazbahana

~ a note-trader app created to help students all around the world.
bootstrapped via [create-t3-app](https://create.t3.gg)

## Running Locally

this setup requires [Docker](https://docker.com) to be installed as it uses docker-compose to run `PostgreSQL`.

### Environment Variables

create an `.env` file and fill those in.

```sh
# Prisma
DATABASE_URL="postgresql://postgres:@localhost:5932/jazbahana"
PGPASSWORD="postgres"

# Next Auth
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Next Auth Google Provider
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Yarn

```sh
yarn     # installs dependencies from package.json
yarn dx  # boots up postgres, runs migration, seed file and finally next server.
```

^ note that you don't always need to run `yarn dx`. After run once, you can simply start the server via `yarn dev`
