import fs from 'node:fs'; import path from 'node:path';
import {compileWeeklyReport} from './lib/compile.mjs'; import {renderText} from './lib/render.mjs'; import {sendWeeklyEmail} from './providers/http-email.mjs';
const root=process.cwd(); const now=new Date(); const end=now.toISOString().slice(0,10); const start=new Date(now.getTime()-7*86400000).toISOString().slice(0,10);
const report=compileWeeklyReport({root,start,end,now:now.toISOString()}); const text=renderText(report);
const out=path.join(root,'state/reporting/latest-weekly-report.json'); fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n'); fs.writeFileSync(path.join(root,'state/reporting/latest-weekly-report.txt'),text+'\n');
const delivery=await sendWeeklyEmail({subject:`Creator Network Weekly Owner Report — ${end}`,text});
console.log(JSON.stringify({report:out,network_health:report.network_health,owner_action_required:report.owner_action_required,delivery},null,2));
