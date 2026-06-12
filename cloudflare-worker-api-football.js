// Edging the World Cup Live API Proxy
// Deploy as a Cloudflare Worker. Add secret: API_FOOTBALL_KEY
// Optional vars: API_FOOTBALL_LEAGUE_ID=1, API_FOOTBALL_SEASON=2026
// Public endpoint used by index.html: https://YOUR-WORKER.workers.dev/live

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== '/live') {
      return json({ ok: true, service: 'Edging the World Cup Live proxy', endpoint: '/live' });
    }

    const cache = caches.default;
    const cacheKey = new Request(url.origin + '/live-cache-v1');
    const cached = await cache.match(cacheKey);
    if (cached) return withCors(cached);

    const key = env.API_FOOTBALL_KEY;
    if (!key) return json({ ok: false, error: 'Missing API_FOOTBALL_KEY Worker secret' }, 500);

    const league = env.API_FOOTBALL_LEAGUE_ID || '1';
    const season = env.API_FOOTBALL_SEASON || '2026';
    const today = new Date().toISOString().slice(0, 10);

    // One daily fixtures request. This is the request budget anchor.
    const fixturesUrl = `https://v3.football.api-sports.io/fixtures?league=${league}&season=${season}&date=${today}`;
    const fixturesPayload = await apiFootball(fixturesUrl, key);
    const fixtures = fixturesPayload.response || [];

    // Only spend event calls for active or recently active fixtures.
    const liveish = fixtures.filter(f => {
      const s = (f.fixture?.status?.short || '').toUpperCase();
      return ['1H','2H','HT','ET','BT','P','LIVE','AET','PEN','FT'].includes(s);
    }).slice(0, 4);

    const eventsByFixture = {};
    const lineupsByFixture = {};
    for (const f of liveish) {
      const id = f.fixture?.id;
      if (!id) continue;
      try {
        const ev = await apiFootball(`https://v3.football.api-sports.io/fixtures/events?fixture=${id}`, key);
        eventsByFixture[id] = ev.response || [];
      } catch (e) { eventsByFixture[id] = []; }
      // Lineups usually become available close to kickoff. Only call when fixture is liveish.
      try {
        const lu = await apiFootball(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${id}`, key);
        lineupsByFixture[id] = lu.response || [];
      } catch (e) { lineupsByFixture[id] = []; }
    }

    // Attach events/lineups to raw fixture payload so the frontend can normalize it.
    for (const f of fixtures) {
      const id = f.fixture?.id;
      f.events = eventsByFixture[id] || [];
      f.lineups = lineupsByFixture[id] || [];
    }

    const body = {
      ok: true,
      source: 'api-football-worker',
      generated_at: new Date().toISOString(),
      request_budget_note: 'Cached at Worker layer. Frontend calls only during match windows.',
      response: fixtures
    };

    // Cache based on whether matches are live. During live: 60 sec. Otherwise: 10 min.
    const hasLive = liveish.some(f => ['1H','2H','HT','ET','BT','P','LIVE'].includes((f.fixture?.status?.short || '').toUpperCase()));
    const ttl = hasLive ? 60 : 600;
    const res = json(body, 200, ttl);
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return withCors(res);
  }
};

async function apiFootball(url, key) {
  const res = await fetch(url, { headers: { 'x-apisports-key': key } });
  if (!res.ok) throw new Error(`API-Football ${res.status}`);
  return await res.json();
}

function json(data, status = 200, maxAge = 0) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
      'access-control-allow-origin': '*'
    }
  });
}
function withCors(res) {
  const out = new Response(res.body, res);
  out.headers.set('access-control-allow-origin', '*');
  return out;
}
