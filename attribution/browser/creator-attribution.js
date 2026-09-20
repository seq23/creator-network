(function (global) {
  'use strict';
  const KEYS = ['src_creator','src_platform','src_experiment','src_icp','src_franchise','src_cta'];
  const STORAGE_KEY = 'creator_network_attribution_v1';
  const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
  function clean(v){ return typeof v === 'string' ? v.trim().slice(0,160) : ''; }
  function readQuery(search){ const p=new URLSearchParams(search || global.location.search); const out={}; for(const k of KEYS){const v=clean(p.get(k)); if(v) out[k]=v;} return out; }
  function valid(a){ return KEYS.every(k => typeof a[k] === 'string' && a[k].length > 0); }
  function capture(search){ const found=readQuery(search); if(!valid(found)) return load(); const record={...found,captured_at:new Date().toISOString()}; try{global.localStorage.setItem(STORAGE_KEY,JSON.stringify(record));}catch(_){} return record; }
  function load(){ try{const raw=global.localStorage.getItem(STORAGE_KEY); if(!raw)return null; const r=JSON.parse(raw); if(!valid(r))return null; const age=Date.now()-Date.parse(r.captured_at||0); if(!Number.isFinite(age)||age>MAX_AGE_MS){global.localStorage.removeItem(STORAGE_KEY);return null;} return r;}catch(_){return null;} }
  function decorate(url){ const a=load(); if(!a)return url; const u=new URL(url,global.location.origin); for(const k of KEYS)u.searchParams.set(k,a[k]); return u.toString(); }
  function payload(event,props){ const a=load(); return {event,event_id:(global.crypto&&global.crypto.randomUUID)?global.crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(16).slice(2),occurred_at:new Date().toISOString(),attribution:a||undefined,properties:props||{}}; }
  async function track(endpoint,event,props){ const body=payload(event,props); const res=await global.fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),keepalive:true}); if(!res.ok)throw new Error('attribution event rejected: '+res.status); return res.json(); }
  global.CreatorAttribution={KEYS,capture,load,decorate,payload,track};
})(typeof window !== 'undefined' ? window : globalThis);
