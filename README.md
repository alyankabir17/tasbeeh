# ☪ Tasbeeh Counter

A full-stack digital Tasbeeh (prayer bead counter) web application built with **Next.js 16**, **NextAuth v5**, **PostgreSQL**, and **Tailwind CSS 4**.

Each user gets their own personal counter with lifetime stats, round tracking, and customizable targets — accessible from any device.

---

## ✨ Features

- **User Authentication** — Register & login with email/password (NextAuth v5 + bcrypt)
- **Personal Counter** — Each user has their own independent counter stored in the database
- **Lifetime Count** — Tracks total dhikr across all sessions (never resets)
- **Rounds Tracking** — Shows how many complete rounds (target cycles) you've finished
- **Customizable Target** — Set your own target per round (default: 100)
- **Reset Count** — Reset the current round without affecting lifetime stats
- **Progress Ring** — Visual circular progress indicator
- **Keyboard Support** — Press `Space` or `Enter` to count
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Dark Islamic Theme** — Emerald green themed UI

---

## 🛠 Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 16 (App Router)             |
| Language     | TypeScript                          |
| Auth         | NextAuth v5 (Credentials Provider)  |
| Database     | PostgreSQL                          |
| ORM/Driver   | pg (node-postgres)                  |
| Styling      | Tailwind CSS 4                      |
| Hashing      | bcryptjs                            |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Registration page
│   ├── dashboard/page.tsx        # Main counter dashboard
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts   # NextAuth handler
│       │   └── register/route.ts        # User registration API
│       └── counter/route.ts             # Counter CRUD API
├── components/
│   ├── AuthProvider.tsx          # NextAuth session provider
│   ├── Navbar.tsx                # Navigation bar
│   └── TasbeehCounter.tsx        # Main counter component
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   └── db.ts                     # PostgreSQL connection pool
├── types/
│   └── next-auth.d.ts            # NextAuth type extensions
└── middleware.ts                  # Route protection
scripts/
└── init-db.mjs                   # Database initialization script
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** (local, or a hosted service like [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))

### 1. Clone the repository

```bash
git clone https://github.com/alyankabir17/tasbeeh.git
cd tasbeeh
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# NextAuth secrets — generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-here"
AUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize the database

```bash
npm run db:init
```

This creates the `users` and `counters` tables.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start development server           |
| `npm run build`  | Build for production                |
| `npm start`      | Start production server             |
| `npm run lint`   | Run ESLint                          |
| `npm run db:init`| Initialize database tables          |

---

## 🗄 Database Schema

**users**

| Column        | Type      | Description              |
| ------------- | --------- | ------------------------ |
| id            | UUID (PK) | Auto-generated           |
| email         | TEXT      | Unique, required         |
| password_hash | TEXT      | bcrypt hashed password   |
| created_at    | TIMESTAMP | Account creation time    |

**counters**

| Column         | Type      | Description                           |
| -------------- | --------- | ------------------------------------- |
| id             | UUID (PK) | Auto-generated                        |
| user_id        | UUID (FK) | References users(id), CASCADE delete  |
| current_count  | INTEGER   | Current round count (resets to 0)     |
| target         | INTEGER   | Target per round (default: 100)       |
| lifetime_count | INTEGER   | Total count across all time           |
| last_updated   | TIMESTAMP | Last activity time                    |

---

## 🔐 API Endpoints

| Method | Endpoint              | Description                  | Auth     |
| ------ | --------------------- | ---------------------------- | -------- |
| POST   | `/api/auth/register`  | Create a new account         | Public   |
| POST   | `/api/auth/[...nextauth]` | NextAuth sign in/out     | Public   |
| GET    | `/api/counter`        | Fetch user's counter         | Required |
| PUT    | `/api/counter`        | Increment / reset / set target | Required |

### PUT `/api/counter` actions

```json
{ "action": "increment" }
{ "action": "reset" }
{ "action": "setTarget", "target": 33 }
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`)
4. Deploy — Vercel auto-detects Next.js

> **Note:** You'll need a hosted PostgreSQL database (Neon, Supabase, or Railway) for production.

---

## 📄 License

This project is private and not licensed for public distribution.

---

Built with ❤️ and ☪️
