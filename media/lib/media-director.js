const fs=require('fs');const path=require('path');
const ROOT=path.join(__dirname,'..','..');
function refsReady(creator){const d=path.join(ROOT,'media','identities',creator,'references');return ['face_front.png','face_neutral.png'].some(f=>fs.existsSync(path.join(d,f)));}
function chooseMode(input){const desired=input.desiredMode||'EDITED_SOCIAL';const budget=Number(input.remainingBudgetUsd||0);const slot=!!input.distributionSlotReserved;const face=refsReady(input.creatorId);
 if(!slot)return {mode:null,status:'BLOCKED',reason:'DISTRIBUTION_SLOT_NOT_RESERVED'};
 if(desired==='TALKING_CREATOR' && face && budget>0 && input.talkingRendererAvailable)return {mode:'TALKING_CREATOR',status:'READY',reason:'PREMIUM_ALLOWED'};
 if((desired==='TALKING_CREATOR'||desired==='CREATOR_LIFESTYLE') && face && budget>0 && input.imageVideoRendererAvailable)return {mode:'CREATOR_LIFESTYLE',status:'READY',reason:'LOWER_COST_VISUAL_FALLBACK'};
 return {mode:'EDITED_SOCIAL',status:'READY',reason:face?'LOW_COST_DEFAULT':'CANONICAL_FACE_REFERENCE_MISSING'};}
module.exports={chooseMode,refsReady};
