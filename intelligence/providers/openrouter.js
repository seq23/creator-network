class OpenRouterProvider {
 constructor({apiKey,fetchImpl=globalThis.fetch,baseUrl='https://openrouter.ai/api/v1'}){this.apiKey=apiKey;this.fetch=fetchImpl;this.baseUrl=baseUrl.replace(/\/$/,'');}
 async chat({model,messages,temperature=0.3}){ if(!this.apiKey)throw new Error('OPENROUTER_API_KEY_MISSING'); if(!model||model==='configurable')throw new Error('MODEL_NOT_CONFIGURED'); const r=await this.fetch(this.baseUrl+'/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${this.apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages,temperature})}); if(!r.ok)throw new Error(`OPENROUTER_HTTP_${r.status}`); return r.json(); }
}
module.exports={OpenRouterProvider};
