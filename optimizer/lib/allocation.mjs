export function allocate(decisions,totalSlots){
  if(!Number.isInteger(totalSlots)||totalSlots<0) throw new Error('INVALID_TOTAL_SLOTS');
  const eligible=decisions.filter(d=>d.next_state!=='KILL'&&d.next_state!=='HOLD');
  if(!eligible.length) return decisions.map(d=>({...d,recommended_capacity_share:0,recommended_slots:0}));
  const explore=eligible.filter(d=>d.next_state==='EXPLORE'); const others=eligible.filter(d=>d.next_state!=='EXPLORE');
  const explorationSlots=explore.length?Math.min(totalSlots,Math.ceil(totalSlots*0.30)):0; const out=new Map(decisions.map(d=>[d.experiment_id,{...d,recommended_slots:0}]));
  for(let i=0;i<explorationSlots;i++){const d=explore[i%explore.length];out.get(d.experiment_id).recommended_slots++;}
  let left=totalSlots-explorationSlots; const ranked=[...others].sort((a,b)=>b.score-a.score);
  let i=0; while(left>0 && ranked.length){const d=ranked[i%ranked.length]; const rec=out.get(d.experiment_id); const cap=Math.max(1,Math.ceil(totalSlots*0.25)); if(rec.recommended_slots<cap){rec.recommended_slots++;left--;} i++; if(i>totalSlots*ranked.length*3) break;}
  if(left>0 && explore.length){for(let j=0;j<left;j++) out.get(explore[j%explore.length].experiment_id).recommended_slots++; left=0;}
  return [...out.values()].map(d=>({...d,recommended_capacity_share:totalSlots?Number((d.recommended_slots/totalSlots).toFixed(6)):0}));
}
