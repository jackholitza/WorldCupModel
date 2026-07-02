# World Cup 2026 Forecasting Model

An interactive tournament-analysis application that combines squad data, match forecasts, fair sportsbook-style odds, and Monte Carlo simulations in one browser experience.

**[Open the live project](https://jackholitza.github.io/WorldCupModel/)**

## What it demonstrates

- End-to-end sports analytics product design
- Data transformation and forecast presentation
- Scenario modeling across the group stage and knockout bracket
- Probability communication through fair odds and futures views
- Cloudflare Worker and Pages integration for live matchday data

## Product features

- 48-team tournament model with a 1,248-player data layer
- Expected starting lineups
- Group-stage match center
- Match forecasts and fair odds
- Monte Carlo tournament futures
- Interactive group and bracket machines
- Futures and bet-slip scenario builder
- Matchday synchronization through Cloudflare Pages Functions

## Architecture

The static frontend is deployable to GitHub Pages or Cloudflare Pages. Requests to `/api/games` use Cloudflare Pages Functions; the GitHub Pages deployment falls back to the hosted Worker.

## Cloudflare deployment

- Framework preset: None
- Build command: blank
- Build output directory: `/`
- Required secret: `WORLDCUP26_TOKEN`

## Portfolio context

Built by [Jack Holitza](https://github.com/jackholitza), an economics graduate focused on operations, analytics, sports, and practical decision-support tools.
