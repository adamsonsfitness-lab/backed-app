# Backed

An evidence-based workout logger. Every exercise and training recommendation is backed by a peer-reviewed citation you can tap to read — plus straightforward set/rep logging.

## Stack

- React Native + Expo (Expo Router for navigation)
- Supabase (Postgres + Auth + Row Level Security), no separate backend

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Supabase project's URL and anon key (Project Settings → API):

   ```bash
   cp .env.example .env
   ```

3. Start the dev server:

   ```bash
   npx expo start
   ```

## Project structure

- `src/app` — screens, routed with Expo Router. `(auth)` holds sign-in/sign-up; `(tabs)` holds the authenticated app (Log, History, Learn, Profile).
- `src/lib/supabase.ts` — Supabase client.
- `src/lib/queries.ts` — all data access (exercises, principles, citations, workouts, sets).
- `src/types/database.ts` — hand-written mirror of the Supabase schema. Once the Supabase CLI is available, regenerate it with:

  ```bash
  npx supabase gen types typescript --project-id <ref> > src/types/database.ts
  ```

- `src/context/AuthContext.tsx` — session state, read by the root layout to gate `(tabs)` vs `(auth)`.

## Data model assumptions

Reference tables (`citations`, `exercises`, `principles`, and their join tables) are public read, no RLS. `workouts` and `workout_sets` are scoped to `auth.uid()` via RLS — the app relies on that for per-user isolation and doesn't filter by `user_id` beyond what's needed for the "my active workout" / "my history" queries.
