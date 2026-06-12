# Edging the World Cup Live

A GitHub Pages front end for WC26 live score/event modeling.

## Files

- `index.html` — public GitHub Pages app. No secret keys in this file.
- `cloudflare-worker-api-football.js` — optional Cloudflare Worker proxy template for API-Football.

## Live data design

The front end only needs live scores, goalscorers/events, and lineups if available. It calculates standings, bracket movement, and model fair odds locally.

API call strategy:

- No match window open: no API call from the front end.
- Pre-match: slow polling.
- 30 minutes before kickoff: lineup window opens.
- Match live: controlled polling.
- After full time: one final verification, then stop.
- Quota hit or API fails: show last cached data and fall back to embedded model projections.

## Cloudflare Worker setup

1. Create a Worker.
2. Paste `cloudflare-worker-api-football.js`.
3. Add secret `API_FOOTBALL_KEY`.
4. Optional vars:
   - `API_FOOTBALL_LEAGUE_ID=1`
   - `API_FOOTBALL_SEASON=2026`
5. Deploy.
6. In the site, open the Live tab and paste your Worker URL ending with `/live`.

Never paste an API key into `index.html`.
