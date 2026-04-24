# HopSpot

HopSpot is a GrabMaps hackathon app for curating date and hangout itineraries by neighborhood, with travel-friendly sequencing, a discover feed, wishlist flow, and KOL-style public sharing.

## What's in this repo

- A React + Vite + TypeScript frontend scaffold with:
  - Home, builder, discover, wishlist, profile, auth, and share routes
  - Itinerary builder state powered by Zustand
  - Search flow wired to a GrabMaps proxy with mock fallback data
  - Route estimation hooks with transport mode switching
  - A save flow that pushes drafts into a shareable in-app state
- Supabase scaffolding:
  - `supabase/functions/grabmaps-proxy/index.ts`
  - `supabase/migrations/001_init.sql`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Supabase project values.

3. Leave `VITE_GRABMAPS_PROXY_URL` empty if you want to keep using mock GrabMaps data locally.
   Only set it after you have deployed the Supabase edge function, for example:

```env
VITE_GRABMAPS_PROXY_URL=https://your-project.supabase.co/functions/v1/grabmaps-proxy
```

4. Start the frontend:

```bash
npm run dev
```

5. When you are ready for live GrabMaps data, deploy the Supabase function and run the SQL migration in your Supabase project.

## Notes

- In this workspace, `npm` was not available as a shell command, so the app code was created directly but dependencies were not installed here.
- Until `VITE_GRABMAPS_PROXY_URL` is configured to a deployed edge function, the UI uses mock places and route timings so the product can still be demoed.
