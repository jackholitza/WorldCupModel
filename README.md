# Edging the World Cup Live — Worker Integrated

This package has the Cloudflare Worker URL baked into `index.html`:

https://wc26liveapi.jack-holitza.workers.dev

Upload/commit `index.html` to your GitHub Pages repo root. The site fetches only through the Cloudflare Worker. Do not place your API-Football key in this HTML.

Live data flow:
- `/health` validates the Worker.
- `/today?date=YYYY-MM-DD` gets scheduled/current fixtures for the Denver-local day.
- `/live` pulls live fixtures only during live windows.
- `/events?fixture=ID` pulls goal/card events for relevant fixtures.
- `/lineups?fixture=ID` pulls lineups only near kickoff/live/final windows.

The site stores the last successful payload in localStorage and ripples the live cache into match cards, ticker, group tables, bracket/model projections, and data health.
