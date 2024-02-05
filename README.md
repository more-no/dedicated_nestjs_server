# Dedicated NestJS Server

## Tech

- Nest.js
- Angular.js
- Turbo Repo
- PostgreSQL
- Prisma
- JWT
- bcrypt
- Multer & Sharp
- Swagger

## Usage

#### Clone the repo

#### Install dependencies

```
pnpm install
```

#### Create a Postgres database and connect it

#### Create an .env file following the example

#### Allow Postgres user CREATEDB privilege (for Prisma Shadow Database)

```sql
ALTER ROLE username WITH CREATEDB;
```

#### Apply migrations and seed

```
pnpm dlx prisma migrate dev
```

## Commands

### Development

```
pnpm run dev
```

#### backend <http://localhost:3000/>

#### frontend <http://localhost:4200/>

### Build (with Turbo Repo)

```
pnpm run build
```

### Prisma Studio

```
pnpm prisma studio
```

#### <http://localhost:5555/>

### Swagger UI

#### <http://localhost:3000/api>

### Swagger JSON

#### <http://localhost:3000/api-json>
