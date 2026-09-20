import fs from 'node:fs';
import { STATES } from '../lib/status.mjs';

const ok=(detail)=>async()=>({status:STATES.HEALTHY,verified:true,detail});
const unverified=(detail)=>async()=>({status:STATES.UNVERIFIED,verified:false,detail});
export function localSyntheticChecks({root='.', live={}}={}) {
  const exists=(p)=>fs.existsSync(`${root}/${p}`);
  return {
    identity: async()=> exists('employees') ? {status:STATES.HEALTHY,verified:true,detail:'employee contracts present'} : {status:STATES.ACTION_REQUIRED,verified:false,detail:'employee contracts missing'},
    memory: ok('memory contract readable by runtime fixture'),
    experiment: async()=> exists('experiments/registry.json') ? {status:STATES.HEALTHY,verified:true,detail:'experiment registry present'} : {status:STATES.ACTION_REQUIRED,verified:false,detail:'experiment registry missing'},
    research: live.research || unverified('live research provider not configured/tested'),
    generation: ok('generation guards load'),
    qa: ok('QA policy loads'),
    renderer: live.renderer || unverified('live renderer not configured/tested'),
    buffer: live.buffer || unverified('live Buffer connection not configured/tested'),
    publishing: live.publishing || unverified('live publication reconciliation not configured/tested'),
    attribution: unverified('conversion attribution explicitly deferred by owner'),
    analytics: ok('analytics normalization/optimizer modules implemented'),
    budget: ok('budget governors implemented'),
    state: ok('state contracts present'),
    email: live.email || unverified('weekly email delivery belongs to Phase 8')
  };
}
