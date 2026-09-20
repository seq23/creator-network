function normalize(s){return String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function similarity(a,b){const A=new Set(normalize(a).split(' ').filter(Boolean)),B=new Set(normalize(b).split(' ').filter(Boolean)); if(!A.size&&!B.size)return 1; let i=0;for(const x of A)if(B.has(x))i++;return i/(A.size+B.size-i||1)}
function duplicateRisk(candidate,recent=[],threshold=.72){let max=0;for(const r of recent)max=Math.max(max,similarity(candidate,typeof r==='string'?r:r.script||r.hook||''));return {risk:max,duplicate:max>=threshold};}
module.exports={similarity,duplicateRisk};
