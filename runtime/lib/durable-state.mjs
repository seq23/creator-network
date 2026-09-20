export class DurableStateClient{
 constructor({endpoint=process.env.CREATOR_STATE_API_URL,token=process.env.CREATOR_STATE_API_TOKEN,fetchImpl=globalThis.fetch}={}){if(!endpoint)throw new Error('CREATOR_STATE_API_URL_REQUIRED');if(!token)throw new Error('CREATOR_STATE_API_TOKEN_REQUIRED');this.endpoint=endpoint.replace(/\/$/,'');this.token=token;this.fetch=fetchImpl;}
 async request(path,{method='GET',body}={}){const r=await this.fetch(this.endpoint+path,{method,headers:{authorization:`Bearer ${this.token}`,'content-type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});const text=await r.text();let out={};try{out=JSON.parse(text)}catch{out={raw:text}}if(!r.ok)throw new Error(`STATE_HTTP_${r.status}:${JSON.stringify(out).slice(0,240)}`);return out;}
 health(){return this.request('/health')}
 async get(key,fallback=null){try{return (await this.request(`/state/${encodeURIComponent(key)}`)).value}catch(e){if(String(e.message).startsWith('STATE_HTTP_404'))return fallback;throw e}}
 put(key,value){return this.request(`/state/${encodeURIComponent(key)}`,{method:'PUT',body:{value}})}
 receipt(value){return this.request('/receipts',{method:'POST',body:value})}
}
