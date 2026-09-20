import assert from 'node:assert/strict';
import {runEmployeeDay} from '../launch/lib/orchestrator.mjs';
import {DurableStateClient} from '../runtime/lib/durable-state.mjs';
let r=await runEmployeeDay({employee:{creator_id:'x'},readiness:{status:'READY'},steps:{PRECHECK:async()=>({})}});assert.equal(r.status,'ISOLATED_FAILURE');assert.equal(r.error,'STEP_NOT_WIRED:HEALTH');
let store={};const fetchImpl=async(url,opt={})=>{const p=new URL(url).pathname;if(p==='/health')return new Response(JSON.stringify({ok:true}),{status:200});const k=decodeURIComponent(p.replace('/state/',''));if(opt.method==='PUT'){store[k]=JSON.parse(opt.body).value;return new Response(JSON.stringify({ok:true}),{status:200})}if(k in store)return new Response(JSON.stringify({value:store[k]}),{status:200});return new Response(JSON.stringify({error:'not_found'}),{status:404});};const c=new DurableStateClient({endpoint:'https://state.test',token:'x',fetchImpl});assert.equal((await c.health()).ok,true);assert.equal(await c.get('a','fallback'),'fallback');await c.put('a',{x:1});assert.deepEqual(await c.get('a'),{x:1});
console.log('production hardening tests PASS');
