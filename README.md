# Cricket Liveline — public website

Next.js 16 (App Router) + Tailwind 4. Server-renders match lists, then streams live updates over Socket.IO.

## Pages (same flow as the mobile app)
| Route | What it shows |
|---|---|
| `/` | Featured-series hero, quick links, **live now** (realtime), upcoming, recent results |
| `/matches` | Live / Upcoming / Recent tabs with format filter (`?tab=`) |
| `/fixtures` | Upcoming or past matches grouped by date, with "load more" |
| `/match/[id]` | Scoreboard + Live, Scorecard, Commentary, Squads, Points table, Info (all realtime) |
| `/series`, `/series/[id]` | Series by status; tabs: Overview, Fixtures, Teams (+squads), Stats (leaders), Venues, Points table |
| `/rankings` | Teams / batting / bowling / all-rounders, men/women, Test/ODI/T20 |
| `/venues`, `/venues/[id]` | Searchable grounds, venue records |
| `/players`, `/players/[id]` | Searchable players, role filter, career stats by format |
| `/search?q=` | Matches, series, players, venues |

Theme tokens mirror the mobile app (`src/theme/index.ts`): same sky/blue palette in light and dark.
News and Shorts are managed from the admin panel (News / Shorts).

## Run
```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at the gateway (…/api)
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start
```
Backend gateway must allow this origin in `FRONTEND_URL` (CORS + socket).

## Structure
- `lib/api.ts` public API client (`/api/app/*`), `lib/socket.ts` realtime hook, `lib/format.ts` / `lib/match.ts` helpers
- `components/match/*` match center tabs, `components/ui.tsx` shared primitives
- Theme tokens live in `app/globals.css` (light + dark, user toggle, no flash)
