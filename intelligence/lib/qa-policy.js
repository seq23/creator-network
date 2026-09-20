function decide({employeeId,tier,freshness,unsupportedClaims=false,personaViolation=false,duplicationRisk=0,revisionCount=0}){
 if(personaViolation)return {decision:'REJECT',reason:'PERSONA_OR_PROHIBITED_CLAIM'};
 if(unsupportedClaims && tier==='HIGH_STAKES')return {decision:'HUMAN_REVIEW',reason:'UNSUPPORTED_HIGH_STAKES_CLAIM'};
 if(tier==='HIGH_STAKES' && (!freshness||freshness.ok!==true))return {decision:'HUMAN_REVIEW',reason:freshness?.reason||'EVIDENCE_NOT_PROVEN'};
 if(duplicationRisk>=.72)return {decision:revisionCount<2?'REVISE':'REJECT',reason:'DUPLICATE_CONTENT'};
 if(unsupportedClaims)return {decision:revisionCount<2?'REVISE':'HUMAN_REVIEW',reason:'UNSUPPORTED_CLAIM'};
 return {decision:'PASS',reason:'POLICY_CLEAR'};
}
module.exports={decide};
