// Durable trace for every GitHub Actions run of the daily lane, so a SAFE_STANDBY run can never exit 0 having touched
// nothing (Rule 0). Two modes, both writing receipts keyed `actions/<run_id>` that the Worker serves back at
// GET /receipts/<run_id>:
//   node scripts/actions-state-probe.mjs precheck            health() must reach D1, else the job fails here
//   node scripts/actions-state-probe.mjs outcome <exit_code> records how runtime/run.mjs ended
// Locally: npm run probe:actions (vault child). Same script, GITHUB_RUN_ID defaults to local_<timestamp>.
import {DurableStateClient} from '../runtime/lib/durable-state.mjs';

const [mode='precheck',exitCode='']=process.argv.slice(2);
const runId=process.env.GITHUB_RUN_ID?`actions/${process.env.GITHUB_RUN_ID}`:`actions/local_${Date.now()}`;
const attempt=process.env.GITHUB_RUN_ATTEMPT||'1';
const workflow=process.env.GITHUB_WORKFLOW||'local';
const runUrl=process.env.GITHUB_SERVER_URL&&process.env.GITHUB_REPOSITORY&&process.env.GITHUB_RUN_ID
  ?`${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`:null;

let client;
try{client=new DurableStateClient();}catch(e){console.error(`NAMED STOP: ${e.message} — Phase 4 provisioning (npm run secrets:github / vars:github) not applied to this lane`);process.exit(3);}

if(mode==='precheck'){
  const health=await client.health();
  if(health.ok!==true||health.backend!=='d1'){console.error('NAMED STOP: state Worker health did not reach D1',health);process.exit(5);}
  const r=await client.receipt({id:`${runId}:${attempt}:precheck`,run_id:runId,step:'ACTIONS_PRECHECK',status:'PASS',
    detail:{workflow,run_url:runUrl,attempt,health,sha:process.env.GITHUB_SHA||null,event:process.env.GITHUB_EVENT_NAME||'local',at:new Date().toISOString()}});
  console.log(JSON.stringify({mode,run_id:runId,receipt:r.id,health},null,2));
}else if(mode==='outcome'){
  const code=Number(exitCode===''?1:exitCode); // empty = the operate step never reported (cancelled/killed) = FAILED
  if(!Number.isInteger(code)){console.error('usage: actions-state-probe.mjs outcome <exit_code>');process.exit(2);}
  const status=code===0?'SAFE_STANDBY_OR_RUN':code===2?'NOT_READY_STRICT':'FAILED';
  const r=await client.receipt({id:`${runId}:${attempt}:outcome`,run_id:runId,step:'ACTIONS_OUTCOME',status,
    detail:{workflow,run_url:runUrl,attempt,exit_code:code,at:new Date().toISOString()}});
  const back=await client.receipts(runId);
  console.log(JSON.stringify({mode,run_id:runId,receipt:r.id,exit_code:code,status,receipts_for_run:back.receipts.map(x=>x.id)},null,2));
  if(!back.receipts.some(x=>x.id===r.id)){console.error('NAMED STOP: outcome receipt not readable back from D1');process.exit(6);}
}else{console.error(`unknown mode ${mode}`);process.exit(2);}
