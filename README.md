# Dedicated NestJS Server

## Basetask

Please create a simple NestJS service, which provides a user
management with at least 2 roles. Besides the profile information
(nickname, full name, email, role etc.), each user should be able to
upload his own profile picture. Profile pictures have to be scaled to
a chosen default size.

## Extension

Think about an authentication and authorization solution. Users
should be able to login and be allowed to upload a picture or not,
depending on their role.

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

#### Allow Postgres user CREATEDB privilege (for Prisma Shadow Database - <https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database#shadow-database-user-permissions>)

```sql
GRANT CREATE ON DATABASE dbname TO username;
```

#### OR

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
