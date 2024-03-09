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

- Editor:

  - Same as the User, but not allowed to upload pictures

- Admin:

  - Delete any profiles
  - Change the role of any profile

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

```bash
git clone <url>
```

### Install dependencies

```bash
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

```bash
npx prisma migrate dev
npx prisma db seed
```

## Commands

### Development

```bash
pnpm run dev
```

#### Visit <http://localhost:3000/>

### Build

```bash
pnpm run build
```

### Prisma Studio

```bash
pnpm prisma studio
```

#### <http://localhost:5555/>

### Swagger UI

#### <http://localhost:3000/api>

### Swagger JSON

#### <http://localhost:3000/api-json>
