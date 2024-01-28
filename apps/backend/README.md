# Dedicated NestJS Server

## Functionalities

- User:

  - Signup
  - Login
  - Refresh Token
  - Logout
  - Upload picture
  - Update info
  - Delete own profile

- Admin:

  - Delete profiles
  - Change user role

## Tech

- Nest.js
- PostgreSQL
- Prisma
- JWT
- bcrypt
- Multer & Sharp
- Swagger

## Usage

### Clone the repo

```
git clone <url>
```

### Install dependencies

```
pnpm install
```

### Create a Postgres database and connect it

### Create an .env file following the example

### Allow Postgres user CREATEDB privilege

(for Prisma Shadow Database: <https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database#shadow-database-user-permissions>)

```sql
GRANT CREATE ON DATABASE dbname TO username;
```

#### OR

```sql
ALTER ROLE username WITH CREATEDB;
```

### Apply migrations and seed

```
npx prisma migrate dev
npx prisma db seed
```

## Commands

### Development

```
pnpm run dev
```

#### Visit <http://localhost:3000/>

### Build

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
