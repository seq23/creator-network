const assert=require('assert');const {chooseMode}=require('../media/lib/media-director');const {authorize}=require('../media/lib/cost-governor');const {transition}=require('../media/lib/job-state');const ff=require('../media/renderers/local-ffmpeg');
let n=0;function t(name,fn){fn();n++;console.log('PASS',name)}
t('no slot blocks spend',()=>assert.equal(chooseMode({creatorId:'marcus_vale',desiredMode:'TALKING_CREATOR',remainingBudgetUsd:10,distributionSlotReserved:false,talkingRendererAvailable:true}).status,'BLOCKED'));
t('missing refs falls back and says why',()=>{const r=chooseMode({creatorId:'no_such_creator',desiredMode:'TALKING_CREATOR',remainingBudgetUsd:10,distributionSlotReserved:true,talkingRendererAvailable:true});assert.equal(r.mode,'EDITED_SOCIAL');assert.equal(r.reason,'CANONICAL_FACE_REFERENCE_MISSING');});
for(const c of ['marcus_vale','nia_brooks','camille_rose','maya_reyes'])t(`approved refs unlock TALKING_CREATOR for ${c}`,()=>assert.equal(chooseMode({creatorId:c,desiredMode:'TALKING_CREATOR',remainingBudgetUsd:10,distributionSlotReserved:true,talkingRendererAvailable:true}).mode,'TALKING_CREATOR'));
t('refs without a renderer still fall back to EDITED_SOCIAL',()=>assert.equal(chooseMode({creatorId:'marcus_vale',desiredMode:'TALKING_CREATOR',remainingBudgetUsd:10,distributionSlotReserved:true,talkingRendererAvailable:false}).reason,'LOW_COST_DEFAULT'));
t('free authorized',()=>assert(authorize({estimatedCostUsd:0}).allowed));
t('employee cap blocks',()=>assert.equal(authorize({estimatedCostUsd:5,employeeRemainingUsd:2,networkRemainingUsd:10}).fallback,'EDITED_SOCIAL'));
t('network cap blocks',()=>assert(!authorize({estimatedCostUsd:5,employeeRemainingUsd:10,networkRemainingUsd:2}).allowed));
t('valid transition',()=>assert.equal(transition({status:'READY'},'RENDERING').status,'RENDERING'));
t('invalid transition throws',()=>assert.throws(()=>transition({status:'RENDERED'},'READY')));
t('ffmpeg probe returns bool',()=>assert.equal(typeof ff.available(),'boolean'));
console.log(`${n}/8 PASS`);
