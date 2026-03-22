# 🌍 Rove

A location-based social travel journal. Capture photos tied to places, share them in a global feed, and explore memories on an interactive map.

## Features

- **Photo Posts** — Capture or upload a photo with a caption and geolocation. Images are optimized client-side before upload.
- **Global Feed** — Reverse-chronological feed of all posts with an editorial, magazine-style layout.
- **Interactive Map** — Full-screen Leaflet map with color-coded markers (teal for your posts, burnt orange for others). Click any marker to see the photo, caption, and location.
- **Personal Archive** — View only your own posts on the profile page.
- **Anonymous Auth** — No sign-up required. You get an auto-generated identity on first visit.
- **Editable Display Name** — Change your name anytime; it syncs across all your past posts.
- **Location Search** — Search for places via OpenStreetMap/Nominatim with debounced autocomplete, or auto-detect your current position.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | [Next.js](https://nextjs.org) (App Router, React 19) |
| Backend / DB | [Convex](https://convex.dev) |
| Auth | [Convex Auth](https://convex.dev/auth) (anonymous provider) |
| Maps | [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org/) with CARTO tiles |
| Styling | Tailwind CSS, Plus Jakarta Sans, Be Vietnam Pro |

## Getting Started

### Prerequisites

- Node.js 18+
- A Convex account ([convex.dev](https://convex.dev))

### Setup

```bash
# Install dependencies
npm install

# Start the Convex dev server (creates .env.local with deployment URL)
npx convex dev

# In another terminal, start the Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── app/
│   ├── page.tsx          # Global feed (homepage)
│   ├── layout.tsx        # Root layout with providers
│   ├── globals.css       # Global styles + Leaflet overrides
│   ├── map/page.tsx      # Interactive map view
│   ├── profile/page.tsx  # Personal archive + name editor
│   └── post/new/page.tsx # Create new post form
├── components/
│   ├── Providers.tsx     # Convex + Auth providers
│   ├── NavBar.tsx        # Bottom/top navigation bar
│   ├── PostCard.tsx      # Post card component
│   ├── MapView.tsx       # Leaflet map with markers
│   ├── LocationSearch.tsx# Nominatim search with debounce
│   └── utils.ts          # Utility functions
├── convex/
│   ├── schema.ts         # Database schema
│   ├── auth.ts           # Anonymous auth configuration
│   ├── auth.config.ts    # Auth provider config
│   ├── http.ts           # HTTP routes for auth
│   ├── posts.ts          # Post queries and mutations
│   └── users.ts          # User queries and mutations
└── README.md
```
