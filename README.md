# Jack Holitza's Guide to The World Cup — Master v2

This is the master app built from the working matchday HTML plus the full prior modeling cache.

Included:
- 48 teams
- 1,248-player layer
- Expected XIs
- Group stage match center
- Match forecasts and fair sportsbook-style odds
- Monte Carlo World Cup futures
- Group machine
- Bracket machine
- Futures/slip builder
- Matchday sync through Cloudflare Pages Functions

Deploy on Cloudflare Pages with:
- Framework preset: None
- Build command: blank
- Build output directory: `/`
- Secret: `WORLDCUP26_TOKEN`

The app calls `/api/games` on Cloudflare Pages. If hosted on GitHub Pages, it falls back to the existing Worker URL.
