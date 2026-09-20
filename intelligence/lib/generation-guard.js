function assertAssignment(experiment, output){ const expected={experiment_id:experiment.id,icp_id:experiment.icp_id||experiment.icp,hook_family:experiment.hook_family,format:experiment.format}; for(const [k,v] of Object.entries(expected)){if(v!==undefined&&String(output[k])!==String(v))throw new Error(`ASSIGNMENT_MUTATION_${k}`)} return true; }
module.exports={assertAssignment};
