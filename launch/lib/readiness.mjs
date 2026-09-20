import fs from 'node:fs';
import path from 'node:path';
const env=v=>Boolean(v&&process.env[v]&&String(process.env[v]).trim());
const boolEnv=v=>String(process.env[v]||'').toLowerCase()==='true';
function approvedReferenceExists(root,employee){
 const dir=path.join(root,'media','identities',employee,'references');
 if(!fs.existsSync(dir)) return false;
 return fs.readdirSync(dir).some(name=>name.toLowerCase()!=='readme.md' && !name.startsWith('.'));
}
function refName(ref){return String(ref||'').startsWith('env:')?String(ref).slice(4):String(ref||'');}
export function assessReadiness({root='.', policy, accounts, employees=['marcus_vale','nia_brooks','camille_rose','maya_reyes']}={}){
 const checks=[]; const add=(id,ok,blocking,detail)=>checks.push({id,ok:Boolean(ok),blocking:Boolean(blocking),detail});
 add('portfolio_boundary',policy?.portfolio_repo_mutation_allowed===false,true,'portfolio repositories must remain read-only');
 add('pipeline_floor',Number(policy?.minimum_pipeline_coverage_days)>=1,true,`coverage floor=${policy?.minimum_pipeline_coverage_days}`);
 add('runtime_wired',boolEnv('AUTONOMOUS_RUNTIME_WIRED'),true,'real PRECHECK→PERSIST step factory integration-tested');
 add('durable_state',boolEnv('DURABLE_STATE_CONFIGURED')&&env('CREATOR_STATE_API_URL')&&env('CREATOR_STATE_API_TOKEN'),true,'durable state API configured; live health is checked at runtime');
 add('openrouter_key',env('OPENROUTER_API_KEY'),true,'OpenRouter credential configured');
 add('generation_model',env('OPENROUTER_GENERATION_MODEL'),true,'generation model explicitly configured');
 add('qa_model',env('OPENROUTER_QA_MODEL'),true,'QA model explicitly configured');
 add('high_stakes_model',env('OPENROUTER_HIGH_STAKES_MODEL'),true,'high-stakes model explicitly configured');
 const weeklyEnabled=String(process.env.WEEKLY_REPORT_DELIVERY_ENABLED||'').toLowerCase()==='true';
 add('weekly_email',weeklyEnabled&&env('WEEKLY_OWNER_EMAIL')&&env('WEEKLY_REPORT_FROM')&&env('WEEKLY_EMAIL_ENDPOINT')&&env('WEEKLY_EMAIL_TOKEN'),true,'weekly owner email enabled and fully configured');
 for(const e of employees){
   const a=accounts?.[e]||{}; const key=refName(a.credential_ref), org=refName(a.organization_id_ref); const channelRefs=Object.values(a.channels||{}).map(refName);
   const enabled=a.enabled===true||boolEnv(`BUFFER_ENABLED_${e.toUpperCase()}`); add(`buffer:${e}`,enabled&&env(key)&&env(org)&&channelRefs.length>0&&channelRefs.every(env),true,`${e} Buffer enabled + key/org/channels configured`);
 }
 const refs=employees.map(e=>approvedReferenceExists(root,e));
 add('identity_references',policy?.require_canonical_identity_for_face_media===false || refs.every(Boolean),true,'approved non-placeholder creator reference assets present');
 const daily=Number(process.env.MAX_DAILY_OPERATING_SPEND_USD), monthly=Number(process.env.MAX_MONTHLY_OPERATING_SPEND_USD); add('budget_caps',Number.isFinite(daily)&&daily>0&&Number.isFinite(monthly)&&monthly>=daily,true,'hard daily/monthly production spend caps explicitly configured');
 add('attribution_deferred',true,false,'conversion attribution intentionally deferred');
 const blockers=checks.filter(x=>x.blocking&&!x.ok); return {status:blockers.length?'NOT_READY':'READY',checks,blockers:blockers.map(x=>x.id)};
}
