# Cricket Liveline — public website

Next.js 16 (App Router) + Tailwind 4. Server-renders match lists, then streams live updates over Socket.IO.

## Pages
| Route | What it shows |
|---|---|
| `/` | Live / Upcoming / Results tabs, format filter, featured series. Scores patch in live via the listing socket |
| `/match/[id]` | Scoreboard header + Live, Scorecard, Commentary, Squads, Info tabs (all realtime) |
| `/series`, `/series/[id]` | Series by status, fixtures, points table |
| `/rankings` | Team / batting / bowling / all-rounder rankings, men/women, Test/ODI/T20I |

Formats are handled natively: The Hundred shows ball counts and "sets", others show overs.

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
