<h1 align="center">🏌️ ImpactLoop — Play. Win. Give Back.</h1>

<p align="center">
  <b>A production-grade Golf Charity Subscription Platform</b><br/>
  Subscription payments • Monthly lottery draws • Charity contributions<br/>
  Built with Next.js 16, PostgreSQL, Prisma, Stripe, Redis & Framer Motion
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-000?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-7.5-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" />
  <img src="https://img.shields.io/badge/Stripe-20-008CDD?logo=stripe" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Draw Engine](#-draw-engine)
- [Prize Distribution](#-prize-distribution)
- [Security](#-security)
- [Performance & Caching](#-performance--caching)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Edge Cases Handled](#-edge-cases-handled)
- [License](#-license)

---

## 🌟 Overview

ImpactLoop is a subscription-based platform where users:

1. **Subscribe** monthly via Stripe
2. **Enter golf scores** (Stableford system, 1–45, max 5 per month)
3. **Participate in monthly lottery draws** where their scores are matched against winning numbers
4. **Win prizes** split across tiers (5-match jackpot, 4-match, 3-match)
5. **Contribute to charities** — a portion of every subscription goes to verified causes

> This is **NOT** a golf website. It's a reward + charity impact SaaS platform with premium, emotionally engaging UX.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 (App Router) | Server & Client Components |
| **UI** | Tailwind CSS v4 + Framer Motion | Premium glassmorphism, micro-animations |
| **Language** | TypeScript 5 | End-to-end type safety |
| **Database** | PostgreSQL | Relational data with ACID transactions |
| **ORM** | Prisma 7 | Type-safe schema, migrations, queries |
| **Payments** | Stripe | Subscriptions, webhooks, checkout |
| **Caching** | Redis (ioredis) | Query caching, rate limiting |
| **Auth** | JWT + bcryptjs | Stateless auth, password hashing |
| **Validation** | Zod | Runtime schema validation |
| **Charts** | Recharts | Admin analytics dashboards |
| **Icons** | Lucide React | Consistent icon system |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────┐
│                    CLIENT (Next.js)              │
│   Landing • Dashboard • Draw • Charities • Admin │
└──────────────────┬───────────────────────────────┘
                   │ HTTP / fetch
┌──────────────────▼───────────────────────────────┐
│              API ROUTES (/api/*)                  │
│         Request Validation (Zod)                 │
│         Authentication (JWT)                     │
│         Rate Limiting (Redis)                    │
└──────────────────┬───────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────┐
│             SERVICE LAYER                        │
│   ScoreService • DrawEngineService               │
│   StripeService • CacheService                   │
└──────────────────┬───────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────┐
│           REPOSITORY LAYER                       │
│   UserRepo • ScoreRepo • DrawRepo • CharityRepo │
└──────────────────┬───────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────┐
│       PostgreSQL (Prisma ORM) + Redis            │
└──────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing Page (Hero, Stats, CTA)
│   ├── layout.tsx                # Root layout with Navbar
│   ├── globals.css               # Design system & animations
│   ├── dashboard/page.tsx        # User Dashboard
│   ├── draw/page.tsx             # Lottery Draw Experience
│   ├── charities/page.tsx        # Charity Directory
│   ├── admin/page.tsx            # Admin Control Panel
│   └── api/                      # REST API Routes
│       ├── auth/
│       │   ├── signup/route.ts   # POST /api/auth/signup
│       │   └── login/route.ts    # POST /api/auth/login
│       ├── scores/route.ts       # POST + GET /api/scores
│       ├── subscribe/route.ts    # POST + GET /api/subscribe
│       ├── draw/
│       │   ├── run/route.ts      # POST /api/draw/run (Admin)
│       │   └── results/route.ts  # GET /api/draw/results
│       └── webhooks/
│           └── stripe/route.ts   # POST /api/webhooks/stripe
│
├── components/
│   ├── ui/
│   │   ├── button.tsx            # Animated Button (shimmer, neon, glass)
│   │   └── card.tsx              # Glassmorphism Card (mouse spotlight)
│   └── layout/
│       └── navbar.tsx            # Responsive nav with active indicators
│
├── lib/
│   └── prisma.ts                 # Prisma singleton (serverless-safe)
│
└── server/
    ├── repositories/
    │   ├── user.repository.ts    # User + Subscription CRUD
    │   ├── score.repository.ts   # Score queries with month bounds
    │   ├── draw.repository.ts    # Draw lifecycle + atomic finalize
    │   └── charity.repository.ts # Charity + Donation tracking
    ├── services/
    │   ├── score.service.ts      # Max 5 scores, duplicate detection
    │   ├── draw-engine.service.ts# Random + Algorithm draw modes
    │   ├── stripe.service.ts     # Checkout + Webhook handling
    │   └── cache.service.ts      # Redis get-or-set with TTL
    └── security/
        ├── auth.ts               # JWT, Zod schemas, password utils
        └── rate-limiter.ts       # Sliding-window rate limiter

prisma/
└── schema.prisma                 # 7 normalized PostgreSQL tables
```

---

## 🗄 Database Schema

7 strictly normalized tables with enums, foreign keys, and composite indexes:

```
┌─────────┐     ┌───────────────┐     ┌────────┐
│  users  │────<│ subscriptions │     │ scores │
│─────────│     │───────────────│     │────────│
│ id      │     │ user_id (FK)  │     │ user_id│
│ name    │     │ plan_type     │     │ score  │ ← 1-45
│ email   │     │ status (enum) │     │ date   │
│ role    │     │ stripe_cust_id│     └────────┘
│ (enum)  │     │ renewal_date  │
└────┬────┘     └───────────────┘
     │
     ├─────────<┌──────────┐>─────────┌───────┐
     │          │ winners  │          │ draws │
     │          │──────────│          │───────│
     │          │ user_id  │          │ numbers│ ← Int[]
     │          │ draw_id  │          │ mode   │ ← RANDOM/ALGORITHM
     │          │match_count│         │ status │ ← PENDING/COMPLETED
     │          │prize_amt │          │ jackpot│
     │          └──────────┘          └───────┘
     │
     └─────────<┌───────────┐>────────┌───────────┐
                │ donations │         │ charities │
                │───────────│         │───────────│
                │ user_id   │         │ name      │
                │ charity_id│         │ total_don │
                │ amount    │         └───────────┘
                └───────────┘
```

**Key Constraints:**
- `users.email` — Unique index
- `winners` — `@@unique([userId, drawId])` prevents double payouts
- `scores` — `@@index([userId, date])` for fast monthly lookups
- `draws` — `@@index([status])` for quick open draw queries

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | Public | Register (name, email, password) |
| `POST` | `/api/auth/login` | Public | Login → JWT token |

**Signup Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Login Response:**
```json
{
  "status": "success",
  "data": {
    "user": { "id": "...", "name": "John", "role": "USER" },
    "token": "eyJhbGciOiJI..."
  }
}
```

---

### Scores

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/scores` | JWT | Submit score (1-45, max 5/month) |
| `GET` | `/api/scores` | JWT | Get user's score history |

**Submit Score:**
```json
{ "score": 38 }
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "score": { "id": "...", "score": 38, "date": "..." },
    "remainingSubmissions": 3
  }
}
```

**Error (400) — Limit reached:**
```json
{
  "status": "error",
  "message": "VALIDATION: Maximum 5 scores per month reached"
}
```

---

### Subscription

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/subscribe` | JWT | Create Stripe checkout session |
| `GET` | `/api/subscribe` | JWT | Get subscription status |

---

### Draw

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/draw/run` | Admin | Execute monthly draw |
| `GET` | `/api/draw/results` | Public | View past draw results |

**Run Draw (Admin):**
```json
{
  "drawId": "clx...",
  "mode": "RANDOM"
}
```

---

### Webhooks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/webhooks/stripe` | Stripe Signature | Handle payment events |

Handles: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## 🎯 Draw Engine

The system supports **two draw modes**:

### Random Mode (Default)
- Uses Node.js `crypto.randomBytes()` for cryptographic randomness
- Generates 5 unique numbers between 1–45
- Zero bias, fully auditable

### Algorithm Mode
- Runs `prisma.score.groupBy()` frequency analysis on all scores submitted that month
- Selects the **5 least-frequently picked numbers**
- Strategy: preserves the jackpot by picking numbers users are less likely to have

### Matching Logic
```
User Scores:  [7, 12, 23, 38, 41]  (5 scores submitted this month)
Draw Numbers: [12, 23, 30, 38, 44]

Matches: [12, 23, 38] → 3 matches → User wins 3-match prize tier
```

---

## 💰 Prize Distribution

The prize pool is split into **3 tiers**:

| Match Count | Pool % | Description |
|-------------|--------|-------------|
| **5 matches** | 40% | Jackpot — rolls over if no winner |
| **4 matches** | 35% | Split equally among all 4-match winners |
| **3 matches** | 25% | Split equally among all 3-match winners |

**Jackpot Rollover:** If nobody matches all 5 numbers, the 40% accumulates into the next month's jackpot, creating increasing excitement over time.

---

## 🛡 Security

| Layer | Implementation |
|-------|---------------|
| **Authentication** | JWT tokens (7-day expiry) via `jsonwebtoken` |
| **Password Hashing** | bcrypt with 12 salt rounds |
| **Input Validation** | Zod schemas on every API route |
| **Rate Limiting** | Redis sliding-window (10 req/min on `/api/scores`) |
| **RBAC** | `requireAdmin()` guard on admin-only routes |
| **HSTS** | `Strict-Transport-Security: max-age=63072000` |
| **CSP** | Content-Security-Policy restricting scripts/styles to self |
| **Clickjacking** | `X-Frame-Options: SAMEORIGIN` |
| **CORS** | Locked to `NEXT_PUBLIC_BASE_URL` origin |
| **SQL Injection** | Prisma parameterized queries (inherent protection) |
| **Race Conditions** | Prisma `$transaction` for draw finalization & score submission |

---

## ⚡ Performance & Caching

| Optimization | Details |
|-------------|---------|
| **Redis Cache** | `getOpenDraw()` cached with 60s TTL; auto-invalidated on status change |
| **Connection Pooling** | Prisma singleton prevents serverless connection exhaustion |
| **Composite Indexes** | `[userId, date]` on scores, `[drawId, matchCount]` on winners |
| **Cursor Batching** | Ticket processing in 5000-row chunks via async generators |
| **Security Headers** | `poweredByHeader: false` hides server fingerprint |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14
- **Redis** (optional — graceful fallback if unavailable)
- **Stripe Account** (for payment processing)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Suryank7/impactloop_digital_heroes.git
cd impactloop_digital_heroes

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL, Stripe keys, etc.

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. Start development server
npm run dev
```

The app will be running at **http://localhost:3000**

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma migrate dev` | Create and apply migrations |

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/impactloop?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_MONTHLY_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

### Database Options
- **Supabase** — Free PostgreSQL with connection pooling
- **Neon** — Serverless Postgres
- **Railway** — Managed PostgreSQL

### Redis Options
- **Upstash** — Serverless Redis with free tier (recommended for Vercel)
- **Redis Cloud** — Managed Redis

---

## ⚠️ Edge Cases Handled

| Edge Case | How It's Handled |
|-----------|-----------------|
| User submits >5 scores | `ScoreService` counts existing scores and throws `400` |
| Duplicate score same day | Checked against existing scores before insertion |
| Score outside 1-45 range | Zod validation rejects at API boundary |
| No jackpot winners | 40% pool rolls over to next month's draw |
| Subscription expired | Stripe webhook updates status to `CANCELLED` |
| Payment failure | Stripe webhook updates status to `PAST_DUE` |
| Concurrent draw execution | `lockDrawForProcessing()` + `$transaction` prevents double execution |
| Double form submission | Rate limiter blocks rapid duplicate requests |
| Invalid JWT token | Returns `401 Unauthorized` immediately |
| Non-admin runs draw | `requireAdmin()` guard returns `403 Forbidden` |

---

## 🎨 Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Hero with animated gradient, social proof, CTAs |
| **Dashboard** | `/dashboard` | Score tracking, winnings ticker, streak badges |
| **Draw** | `/draw` | Cinematic lottery reveal with confetti |
| **Charities** | `/charities` | Filterable charity grid with impact meters |
| **Admin** | `/admin` | Revenue charts, subscriber table, draw controls |

---

## 📄 License

This project is private and proprietary.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Suryank7">Suryank7</a>
</p>
