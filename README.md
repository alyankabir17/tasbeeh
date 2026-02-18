# ☪ Tasbeeh Counter

A production-ready digital Tasbeeh (dhikr) counter web application. Create an account, count your Tasbeeh, set targets, and resume your progress from any device.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (direct queries via `pg`)
- **Auth**: NextAuth.js v5 (Auth.js) with JWT + bcrypt password hashing

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd tasbeeh
npm install
```

### 2. Set up PostgreSQL

Create a free PostgreSQL database at one of these providers:

| Provider | Link |
|----------|------|
| **Supabase** (recommended) | https://supabase.com |
| Neon | https://neon.tech |
| Railway | https://railway.app |

Copy the connection string.

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
NEXTAUTH_SECRET="<run: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Create Database Tables

```bash
npm run db:init
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:init` | Create tables in PostgreSQL |

## Database Schema

**users** — stores accounts with bcrypt-hashed passwords  
**counters** — stores per-user count, target, and lifetime total

## Deploying to Vercel

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
4. Deploy — no ORM build step needed

## License

MIT
