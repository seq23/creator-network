function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}})}
function auth(req,env){const h=req.headers.get('authorization')||'';return !!env.STATE_API_TOKEN && h===`Bearer ${env.STATE_API_TOKEN}`}
export default {async fetch(req,env){
  if(!auth(req,env)) return json({error:'unauthorized'},401);
  const u=new URL(req.url); const parts=u.pathname.split('/').filter(Boolean);
  if(req.method==='GET'&&u.pathname==='/health'){await env.DB.prepare('SELECT 1 AS ok').first();return json({ok:true,backend:'d1'});}
  if(parts[0]==='state'&&parts[1]){
    const key=decodeURIComponent(parts.slice(1).join('/'));
    if(req.method==='GET'){const row=await env.DB.prepare('SELECT value_json,version,updated_at FROM state_objects WHERE state_key=?').bind(key).first();return row?json({key,value:JSON.parse(row.value_json),version:row.version,updated_at:row.updated_at}):json({error:'not_found',key},404);}
    if(req.method==='PUT'){const body=await req.json();const now=new Date().toISOString();const existing=await env.DB.prepare('SELECT version FROM state_objects WHERE state_key=?').bind(key).first();const version=(existing?.version||0)+1;await env.DB.prepare('INSERT INTO state_objects(state_key,value_json,version,updated_at) VALUES(?,?,?,?) ON CONFLICT(state_key) DO UPDATE SET value_json=excluded.value_json,version=excluded.version,updated_at=excluded.updated_at').bind(key,JSON.stringify(body.value),version,now).run();return json({ok:true,key,version,updated_at:now});}
  }
  if(req.method==='POST'&&u.pathname==='/receipts'){const b=await req.json();for(const k of ['id','run_id','step','status']) if(!b[k]) return json({error:`missing_${k}`},400);const now=b.created_at||new Date().toISOString();await env.DB.prepare('INSERT OR IGNORE INTO runtime_receipts(id,run_id,employee_id,step,status,detail_json,created_at) VALUES(?,?,?,?,?,?,?)').bind(b.id,b.run_id,b.employee_id||null,b.step,b.status,JSON.stringify(b.detail||null),now).run();return json({ok:true,id:b.id},201);}
  return json({error:'not_found'},404);
}};
