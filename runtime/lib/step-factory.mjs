import fs from 'node:fs';
import {createRequire} from 'node:module';
import {BufferClient} from '../../distribution/buffer/client.mjs';
import {reserveSlot} from '../../distribution/lib/slots.mjs';
import {scheduleJob} from '../../distribution/lib/publisher.mjs';
const require=createRequire(import.meta.url);
const {OpenRouterProvider}=require('../../intelligence/providers/openrouter.js');
const {assertAssignment}=require('../../intelligence/lib/generation-guard.js');
const {decide:qaDecide}=require('../../intelligence/lib/qa-policy.js');
const {chooseMode}=require('../../media/lib/media-director.js');
const registry=JSON.parse(fs.readFileSync('experiments/registry.json','utf8')).records;
const accounts=JSON.parse(fs.readFileSync('distribution/config/accounts.json','utf8'));
function envRef(s){return process.env[String(s||'').replace(/^env:/,'')]||''}
function pickExperiment(employee,state){const prior=new Set((state?.content_history||[]).map(x=>x.experiment_id));return registry.find(x=>x.creator_id===employee.creator_id&&x.batch===1&&!prior.has(x.id))||registry.find(x=>x.creator_id===employee.creator_id&&x.batch===1);}
function parseContent(data){const text=data?.choices?.[0]?.message?.content;if(!text)throw new Error('GENERATION_EMPTY');const m=text.match(/\{[\s\S]*\}/);if(!m)throw new Error('GENERATION_NOT_JSON');return JSON.parse(m[0]);}
export function makeStepFactory({stateClient,runId,now=()=>new Date(),liveWritesEnabled=process.env.LIVE_PUBLISHING_ENABLED==='true'}={}){
 const provider=new OpenRouterProvider({apiKey:process.env.OPENROUTER_API_KEY});
 return employee=>{const ctx={}; const persist=async(step,status,detail={})=>stateClient.receipt({id:`${runId}:${employee.creator_id}:${step}`,run_id:runId,employee_id:employee.creator_id,step,status,detail});
 return {
  PRECHECK:async()=>{ctx.state=await stateClient.get(`employee/${employee.creator_id}`,{});ctx.experiment=pickExperiment(employee,ctx.state);if(!ctx.experiment)throw new Error('NO_EXPERIMENT');await persist('PRECHECK','PASS',{experiment_id:ctx.experiment.id});},
  HEALTH:async()=>{await stateClient.health();await persist('HEALTH','PASS');},
  PLAN:async()=>{ctx.platform=process.env.DEFAULT_PUBLISH_PLATFORM||'threads';ctx.publishAt=new Date(now().getTime()+24*3600*1000).toISOString();await persist('PLAN','PASS',{platform:ctx.platform,publish_at:ctx.publishAt});},
  RESERVE:async()=>{const dist=await stateClient.get('distribution',{reservations:[]});const r=reserveSlot(dist,employee.creator_id,ctx.platform,ctx.publishAt,10);if(!r.ok)return {halt:true,reason:r.reason};ctx.reservation=r.reservation;await stateClient.put('distribution',r.state);await persist('RESERVE','PASS',r.reservation);},
  INTELLIGENCE:async()=>{const prompt=`Create one social post for virtual creator ${employee.creator_id}. Assigned experiment ${JSON.stringify(ctx.experiment)}. Return JSON only with experiment_id, hook_family, format, text, caption, desired_mode. Do not invent credentials, personal history, customer results, legal/medical guarantees, or guaranteed outcomes.`;const raw=await provider.chat({model:process.env.OPENROUTER_GENERATION_MODEL,messages:[{role:'user',content:prompt}]});ctx.content=parseContent(raw);ctx.content.icp_id=ctx.experiment.icp_id||ctx.experiment.icp;assertAssignment(ctx.experiment,ctx.content);await persist('INTELLIGENCE','PASS',{experiment_id:ctx.experiment.id});},
  QA:async()=>{const raw=await provider.chat({model:process.env.OPENROUTER_QA_MODEL,messages:[{role:'user',content:`Audit this virtual creator social content. Return JSON only: {"unsupportedClaims":boolean,"personaViolation":boolean,"duplicationRisk":number}. Content: ${JSON.stringify(ctx.content)}`}]});const audit=parseContent(raw);ctx.qa=qaDecide({employeeId:employee.creator_id,tier:employee.creator_id==='maya_reyes'?'HIGH_STAKES':'LIGHT',freshness:{ok:employee.creator_id!=='maya_reyes'},unsupportedClaims:!!audit.unsupportedClaims,personaViolation:!!audit.personaViolation,duplicationRisk:Number(audit.duplicationRisk||0)});await persist('QA',ctx.qa.decision,ctx.qa);if(ctx.qa.decision!=='PASS')return {halt:true,qa:ctx.qa};},
  MEDIA:async()=>{ctx.media=chooseMode({creatorId:employee.creator_id,desiredMode:ctx.content.desired_mode||'EDITED_SOCIAL',remainingBudgetUsd:0,distributionSlotReserved:true,talkingRendererAvailable:false,imageVideoRendererAvailable:false});await persist('MEDIA','PASS',ctx.media);},
  SCHEDULE:async()=>{const acct=accounts[employee.creator_id];const accountEnabled=acct?.enabled===true||String(process.env[`BUFFER_ENABLED_${employee.creator_id.toUpperCase()}`]||'').toLowerCase()==='true';if(!accountEnabled)return {halt:true,reason:'BUFFER_ACCOUNT_DISABLED'};const apiKey=envRef(acct.credential_ref),org=envRef(acct.organization_id_ref),channel=envRef(acct.channels[ctx.platform]);if(!apiKey||!org||!channel)throw new Error('BUFFER_CONFIG_MISSING');const client=new BufferClient({apiKey});let job={id:`${runId}:${employee.creator_id}`,employee:employee.creator_id,experiment_id:ctx.experiment.id,platform:ctx.platform,text:ctx.content.caption||ctx.content.text,publish_at:ctx.publishAt,state:'RESERVED',attempts:0};ctx.job=await scheduleJob({job,client,channelId:channel,liveWritesEnabled});ctx.client=client;ctx.org=org;ctx.channel=channel;await persist('SCHEDULE',ctx.job.state,{post_id:ctx.job.buffer_post_id||null});if(ctx.job.state!=='SCHEDULED')return {halt:true,reason:ctx.job.last_error||ctx.job.state};},
  CONFIRM:async()=>{await persist('CONFIRM','DEFERRED',{reason:'post scheduled for future confirmation'});},
  METRICS:async()=>{await persist('METRICS','DEFERRED',{reason:'metrics collected after publication'});},
  OPTIMIZE:async()=>{await persist('OPTIMIZE','DEFERRED',{reason:'requires post-publication metrics'});},
  PERSIST:async()=>{const hist=[...(ctx.state.content_history||[]),{at:now().toISOString(),experiment_id:ctx.experiment.id,platform:ctx.platform,publish_at:ctx.publishAt,buffer_post_id:ctx.job?.buffer_post_id||null}].slice(-200);await stateClient.put(`employee/${employee.creator_id}`,{...ctx.state,content_history:hist,last_run_id:runId,last_run_at:now().toISOString()});await persist('PERSIST','PASS');}
 };};}
