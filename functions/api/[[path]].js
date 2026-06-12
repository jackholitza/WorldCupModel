const BASE = 'https://worldcup26.ir';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8'
  };
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (!env.WORLDCUP26_TOKEN) {
    return json({ ok:false, error:'Missing WORLDCUP26_TOKEN secret on this Cloudflare Pages project.' }, cors, 500);
  }
  const route = url.pathname.replace(/^\/api/, '') || '/health';
  try {
    if (route === '/' || route === '/health') {
      return json({ ok:true, source:'Cloudflare Pages Function', upstream:'worldcup26.ir', token_present:true, endpoints:['/api/games','/api/today','/api/live','/api/groups','/api/teams','/api/stadiums','/api/game?id=1'] }, cors);
    }
    if (route === '/debug') return json({ ok:true, now:new Date().toISOString(), token_present:Boolean(env.WORLDCUP26_TOKEN), base:BASE }, cors);
    if (route === '/games') return proxy('/get/games', env, cors, url.searchParams.get('fresh')==='1'?0:120);
    if (route === '/groups') return proxy('/get/groups', env, cors, url.searchParams.get('fresh')==='1'?0:300);
    if (route === '/teams') return proxy('/get/teams', env, cors, url.searchParams.get('fresh')==='1'?0:3600);
    if (route === '/stadiums') return proxy('/get/stadiums', env, cors, url.searchParams.get('fresh')==='1'?0:3600);
    if (route === '/game') {
      const id = url.searchParams.get('id');
      if (!id) return json({ ok:false, error:'Missing id', example:'/api/game?id=1' }, cors, 400);
      return proxy(`/get/game/${encodeURIComponent(id)}`, env, cors, url.searchParams.get('fresh')==='1'?0:120);
    }
    if (route === '/today' || route === '/live') {
      const upstream = await fetchUpstream('/get/games', env, url.searchParams.get('fresh')==='1'?0:120);
      const games = extractArray(upstream.data).map(normalizeGame);
      const today = denverDate();
      const filtered = route === '/today' ? games.filter(g => g.day === today) : games.filter(g => isLive(g));
      return json({ ok:upstream.ok, cached:upstream.cached, status:upstream.status, source:'worldcup26.ir', endpoint:'/get/games', mode:route.slice(1), date:today, response_count:filtered.length, response:filtered, all_games_count:games.length, data:upstream.data }, cors, upstream.status || 200);
    }
    return json({ ok:false, error:'Unknown API route', route, valid:['/api/health','/api/games','/api/today','/api/live','/api/groups','/api/teams','/api/stadiums','/api/game?id=1'] }, cors, 404);
  } catch (error) {
    return json({ ok:false, error:error.message }, cors, 500);
  }
}

async function proxy(path, env, headers, cacheSeconds) {
  const upstream = await fetchUpstream(path, env, cacheSeconds);
  return json({ ok:upstream.ok, cached:upstream.cached, status:upstream.status, source:'worldcup26.ir', endpoint:path, fetched_at:upstream.fetched_at, response_count:extractArray(upstream.data).length, response:extractArray(upstream.data), data:upstream.data }, headers, upstream.status || 200);
}
async function fetchUpstream(path, env, cacheSeconds) {
  const apiUrl = `${BASE}${path}`;
  const cache = caches.default;
  const key = new Request(apiUrl, { method:'GET' });
  if (cacheSeconds > 0) {
    const cached = await cache.match(key);
    if (cached) return { ok:true, cached:true, status:200, ...(await cached.json()) };
  }
  const res = await fetch(apiUrl, { headers:{ Authorization:`Bearer ${env.WORLDCUP26_TOKEN}`, Accept:'application/json' } });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = { raw_text:text }; }
  const payload = { fetched_at:new Date().toISOString(), data };
  if (res.ok && cacheSeconds > 0) await cache.put(key, new Response(JSON.stringify(payload), { headers:{ 'Content-Type':'application/json', 'Cache-Control':`public, max-age=${cacheSeconds}` } }));
  return { ok:res.ok, cached:false, status:res.status, ...payload };
}
function extractArray(data){ if(Array.isArray(data)) return data; if(Array.isArray(data?.response)) return data.response; if(Array.isArray(data?.games)) return data.games; if(Array.isArray(data?.teams)) return data.teams; if(Array.isArray(data?.groups)) return data.groups; if(Array.isArray(data?.stadiums)) return data.stadiums; if(data?.game) return [data.game]; return []; }
function normalizeGame(g){ const day = dateOnly(g.local_date); return { ...g, day, home:g.home_team_name_en, away:g.away_team_name_en, homeScore:Number(g.home_score||0), awayScore:Number(g.away_score||0), finished:String(g.finished).toLowerCase()==='true', status:String(g.time_elapsed||'scheduled').toLowerCase() }; }
function isLive(g){ return !g.finished && !['notstarted','not started','scheduled',''].includes(String(g.status||'').toLowerCase()); }
function dateOnly(local){ const m=String(local||'').match(/^(\d{2})\/(\d{2})\/(\d{4})/); return m?`${m[3]}-${m[1]}-${m[2]}`:''; }
function denverDate(){ return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
function json(data, headers, status=200){ return new Response(JSON.stringify(data,null,2), { status, headers }); }
