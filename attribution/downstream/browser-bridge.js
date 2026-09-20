(function(global){
  'use strict';
  function endpoint(){ return global.CREATOR_ATTRIBUTION_ENDPOINT || ''; }
  async function safeTrack(event, properties){
    if(!global.CreatorAttribution || !endpoint()) return {ok:false,skipped:true};
    try { return await global.CreatorAttribution.track(endpoint(), event, properties || {}); }
    catch (_) { return {ok:false,failed:true}; }
  }
  function attributionFields(){
    const a=global.CreatorAttribution && global.CreatorAttribution.load ? global.CreatorAttribution.load() : null;
    if(!a) return {};
    const out={}; for(const k of global.CreatorAttribution.KEYS) out[k]=a[k]; return out;
  }
  function installLanding(product){
    if(!global.CreatorAttribution) return;
    const captured=global.CreatorAttribution.capture();
    if(captured) safeTrack('creator_landing',{product,path:global.location.pathname,referrer_host:(function(){try{return new URL(document.referrer).host}catch(_){return ''}})()});
  }
  function bindCheckoutLinks(selector, product){
    document.querySelectorAll(selector).forEach(function(el){
      el.addEventListener('click',function(){ safeTrack('checkout_started',{product,destination:el.href || '',path:global.location.pathname}); },{capture:true});
    });
  }
  function bindGuideCtas(selector){
    document.querySelectorAll(selector).forEach(function(el){
      el.addEventListener('click',function(){ safeTrack('lead_started',{vertical:el.dataset.verticalKey || '',destination:el.href || '',path:global.location.pathname}); },{capture:true});
    });
  }
  global.CreatorAttributionBridge={safeTrack,attributionFields,installLanding,bindCheckoutLinks,bindGuideCtas};
})(typeof window!=='undefined'?window:globalThis);
