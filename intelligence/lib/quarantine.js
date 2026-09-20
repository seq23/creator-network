function quarantineRecord({jobId,employeeId,experimentId,qa,content}){return {id:`q_${jobId}`,job_id:jobId,employee_id:employeeId,experiment_id:experimentId,decision:qa.decision,reason:qa.reason,owner_interrupt:false,status:'QUARANTINED',content};}
module.exports={quarantineRecord};
