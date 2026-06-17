# WCLIVE Cache Master Files

This folder is intentionally **data-only**. It does not build the app yet.

It prepares the tournament-long live model foundation for:

1. Matchday Pulse
2. Group Survival
3. Overreaction Meter
4. Best Futures Movement
5. Next Fixtures War Room
6. Monte Carlo Title Board

## Counts

- Teams: 48
- Players: 1248
- Fixtures: 72
- Expected XIs: 48

## Main Files

- `cache/master_cache.json` — full master model cache
- `cache/players_master.json` — all players
- `cache/teams_master.json` — all teams
- `cache/fixtures_master.json` — group fixtures
- `cache/expected_xis_master.json` — projected XIs
- `cache/derived/fixture_model_baselines.json` — expected scores + fair odds before live result overlay
- `cache/live_results_overlay.seed.json` — seed overlay for known live results; runtime app should refresh from `/api/games`
- `cache/live_impact_engine.json` — rules for how live results ripple through all windows
- `embed/WCLIVE_MASTER_EMBED.js` — single embeddable JS bundle

## Design Principle

The final app should revolve around live results by treating them as overlays. Live results should not destroy the base model. They should create before/after deltas that move standings, futures, match pressure, overreaction labels, and Monte Carlo paths.
