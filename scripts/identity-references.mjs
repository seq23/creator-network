// Phase 7 — generate the six canonical reference slots per creator from the IDENTITY.json casting block.
// Runs ONLY inside the vault child:   npm run identities:generate [-- --only marcus_vale] [--slots face_front,body] [--force]
// face_front is generated from the prompt; every other slot is an EDIT of face_front (image reference), so all six
// depict one generated person. Outputs: media/identities/<id>/references/<slot>.png + manifest.json (sha256, model,
// prompt, cost estimate). Never overwrites an existing slot without --force — a canonical face is owner-approved, not
// regenerated unattended.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const key=process.env.OPENAI_IMAGE_API_KEY;if(!key){console.error('NAMED STOP: OPENAI_IMAGE_API_KEY not injected — run via scripts/vault-exec.py');process.exit(3);}
const args=process.argv.slice(2);const opt=(n,d)=>{const i=args.indexOf(n);return i<0?d:args[i+1]};const force=args.includes('--force');
const MODELS=(process.env.IDENTITY_IMAGE_MODELS||'gpt-image-2,gpt-image-1.5,gpt-image-1').split(',');
const SIZE='1024x1024',QUALITY=process.env.IDENTITY_IMAGE_QUALITY||'medium';
const CREATORS=(opt('--only')||'marcus_vale,nia_brooks,camille_rose,maya_reyes').split(',');
const SLOT_DIRECTION={
 face_front:'head-and-shoulders portrait, facing camera directly, direct eye contact, neutral-warm expression, mouth closed',
 face_left:'same person, head turned about 35 degrees to their left (camera sees their right side), eyes toward camera',
 face_right:'same person, head turned about 35 degrees to their right (camera sees their left side), eyes toward camera',
 face_smile:'same person, facing camera, genuine warm smile showing teeth, eyes crinkled',
 face_neutral:'same person, facing camera, relaxed neutral resting expression, mouth closed, calm',
 body:'same person, three-quarter body shot from mid-thigh up, standing, hands relaxed, same wardrobe, same environment'};
const SLOTS=(opt('--slots')||Object.keys(SLOT_DIRECTION).join(',')).split(',');
const LIGHT=(polish)=>'photographed like a high-converting talking-head creator: warm key light at 45 degrees slightly above eye level, soft fill, eyes on the upper-third line, slight headroom, clean softly-blurred background, 85mm lens look, '+polish+'. Photorealistic. No text, no logos, no watermark.';
function prompt(id,slot){const i=JSON.parse(fs.readFileSync(`media/identities/${id}/IDENTITY.json`));const c=i.casting,s=i.canonical_subject;
 const who=`A ${c.ethnicity} ${s.presentation_gender==='male'?'man':'woman'}, age ${s.presentation_age}, ${c.skin_tone} skin, ${c.hair}. ${c.features}.${c.glasses?` Wearing ${c.glasses} glasses.`:''} ${s.appearance_direction}. Wearing ${i.wardrobe[0]}. Setting: ${c.signature}.`;
 const polish=c.look==='modelesque'?'editorial fashion-campaign polish, flawless luminous skin, model-like beauty, still photorealistic with fine skin texture':'natural skin texture with visible pores, realistic and believable, not a model, not airbrushed';const neg=`Avoid: ${i.negative_prompt.join(', ')}.`;return `${SLOT_DIRECTION[slot]}. ${who} ${LIGHT(polish)} ${neg} This is a fictional synthetic person; do not resemble any real or famous person.`;}
async function call(url,body,isForm){for(const model of MODELS){if(isForm)body.set('model',model);else body.model=model;
 let r;for(let attempt=1;;attempt++){try{r=await fetch(url,{method:'POST',headers:{authorization:`Bearer ${key}`,...(isForm?{}:{'content-type':'application/json'})},body:isForm?body:JSON.stringify(body)});break;}catch(e){if(attempt>=4)throw e;console.error(`  network error (${e.cause?.code||e.message}), retry ${attempt}/3`);await new Promise(r=>setTimeout(r,3000*attempt));}}
 const j=await r.json();if(r.ok)return{model,b64:j.data[0].b64_json,usage:j.usage||null};
 const msg=j.error?.message||JSON.stringify(j).slice(0,200);if(/model|not found|does not exist|permission/i.test(msg)){console.error(`  ${model}: ${msg} — trying next`);continue;}throw new Error(`${model}: ${msg}`);}
 throw new Error('no image model accepted the request');}
for(const id of CREATORS){const dir=`media/identities/${id}/references`;fs.mkdirSync(dir,{recursive:true});const mp=path.join(dir,'manifest.json');const manifest=fs.existsSync(mp)?JSON.parse(fs.readFileSync(mp)):{creator_id:id,slots:{}};
 for(const slot of SLOTS){const out=path.join(dir,`${slot}.png`);if(fs.existsSync(out)&&!force){console.log(`${id}/${slot}: exists, keeping (use --force to regenerate)`);continue;}
  const p=prompt(id,slot);let res;
  if(slot==='face_front'){res=await call('https://api.openai.com/v1/images/generations',{prompt:p,size:SIZE,quality:QUALITY,n:1,output_format:'png'});}
  else{const ref=path.join(dir,'face_front.png');if(!fs.existsSync(ref)){console.error(`${id}/${slot}: face_front.png missing — generate it first`);process.exit(4);}
   const fd=new FormData();fd.append('image[]',new Blob([fs.readFileSync(ref)],{type:'image/png'}),'face_front.png');fd.set('prompt',p);fd.set('size',SIZE);fd.set('quality',QUALITY);fd.set('n','1');
   res=await call('https://api.openai.com/v1/images/edits',fd,true);}
  const buf=Buffer.from(res.b64,'base64');fs.writeFileSync(out,buf);const sha=crypto.createHash('sha256').update(buf).digest('hex');
  manifest.slots[slot]={file:`${slot}.png`,sha256:sha,bytes:buf.length,model:res.model,size:SIZE,quality:QUALITY,generated_at:new Date().toISOString(),derived_from:slot==='face_front'?null:'face_front.png',prompt:p,usage:res.usage};
  fs.writeFileSync(mp,JSON.stringify(manifest,null,2)+'\n');console.log(`${id}/${slot}: ${res.model} ${buf.length}B sha256:${sha.slice(0,12)}`);}}
