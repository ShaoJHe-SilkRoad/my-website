/* Local presentation preferences only; no diagnosis, tracking or provider work. */
(() => {
  const root=document.documentElement, focus=document.getElementById('focus');
  if(!focus)return;
  let enabled=false, size=null, revision=0;
  const read=k=>{try{return localStorage.getItem(k)}catch{return null}};
  const save=(k,v)=>{try{v===null?localStorage.removeItem(k):localStorage.setItem(k,String(v))}catch{}};
  const params=new URLSearchParams(location.search), requestedMode=params.get('mode');
  enabled=requestedMode==='ADHD_FOCUS'?true:requestedMode==='STANDARD'?false:read('qd-focus')==='true';
  const settings=document.getElementById('reading-settings');if(settings)settings.hidden=false;
  const stored=Number(read('qd-text-size'));if(stored>=16&&stored<=28)size=stored;
  const blocks=()=>[...document.querySelectorAll('[data-reading-anchor]')].filter(x=>x.getClientRects().length);
  const capture=()=>{if(typeof scrollY==='number'&&scrollY<2)return {top:true};const all=blocks(),y=innerHeight*.35,el=all.find(b=>b.getBoundingClientRect().bottom>y)||all.at(-1),r=el?.getBoundingClientRect();return el?{id:el.dataset.readingAnchor,index:all.indexOf(el),fraction:Math.max(0,Math.min(1,(y-r.top)/r.height))}:null};
  const restore=mark=>{if(!mark)return;if(mark.top){scrollTo({top:0,behavior:'instant'});return}const all=blocks(),el=all.find(b=>b.dataset.readingAnchor===mark.id)||all[mark.index];if(el){const r=el.getBoundingClientRect();scrollBy({top:r.top+r.height*mark.fraction-innerHeight*.35,behavior:'instant'})}};
  const paint=()=>{root.classList.toggle('focus',enabled);focus.setAttribute('aria-pressed',String(enabled));root.style.setProperty('--reader-size',(size??(enabled?20.5:18))/16+'rem');const down=document.getElementById('size-down'),up=document.getElementById('size-up');if(down)down.disabled=(size??(enabled?20.5:18))<=16;if(up)up.disabled=(size??(enabled?20.5:18))>=28};
  const change=fn=>{const mark=capture(),ticket=++revision;fn();paint();requestAnimationFrame(()=>{if(ticket!==revision)return;restore(mark);if(document.fonts?.status==='loading')document.fonts.ready.then(()=>{if(ticket===revision)restore(mark)})})};
  // A later reader gesture must win over deferred font reflow restoration.
  document.addEventListener('wheel',()=>revision++,{passive:true});
  document.addEventListener('touchstart',()=>revision++,{passive:true});
  focus.hidden=false;focus.addEventListener('click',()=>change(()=>{enabled=!enabled;save('qd-focus',enabled)}));
  const controls=document.getElementById('size-controls');
  if(controls){controls.hidden=false;for(const [id,delta] of [['size-down',-1],['size-up',1]])document.getElementById(id).addEventListener('click',()=>change(()=>{size=Math.max(16,Math.min(28,(size??(enabled?20.5:18))+delta));save('qd-text-size',size)}));document.getElementById('size-reset').addEventListener('click',()=>change(()=>{size=null;save('qd-text-size',null)}))}
  // Cross-language return to the same semantic block, scoped to this article/edition.
  const page=location.pathname.replace(/\/(en|zh-CN)(?=\/|$)/g,'/_language_');
  for(const link of document.querySelectorAll('nav a[lang]'))link.addEventListener('click',()=>{try{sessionStorage.setItem('qd-reading-position',JSON.stringify({page,mark:capture()}))}catch{}});
  // Content depth is independent of typography/theme and defaults to Full.
  // All Full text is present and visible without JavaScript; no provider I/O.
  const depthControls=document.getElementById('depth-controls'), full=document.getElementById('full-reading');
  if(depthControls&&full){
    const quick=document.getElementById('depth-quick'), all=document.getElementById('depth-full'), link=document.getElementById('full-link');
    const setDepth=value=>{
      full.hidden=value==='quick';quick.setAttribute('aria-pressed',String(full.hidden));all.setAttribute('aria-pressed',String(!full.hidden));
      if(link)link.hidden=!full.hidden;
      for(const a of document.querySelectorAll('nav a[lang]')){const u=new URL(a.href,location.href);if(full.hidden)u.searchParams.set('depth','quick');else u.searchParams.delete('depth');a.href=u.href}
    };
    depthControls.hidden=false;setDepth(new URLSearchParams(location.search).get('depth')==='quick'?'quick':'full');
    quick.addEventListener('click',()=>{setDepth('quick');document.getElementById('quick-reading').scrollIntoView({block:'start'});quick.focus()});
    all.addEventListener('click',()=>{setDepth('full');all.focus()});
    if(link)link.querySelector('a').addEventListener('click',()=>setDepth('full'));
  }
  const syncLanguage=()=>{for(const a of document.querySelectorAll('nav a[lang]')){const u=new URL(a.href,location.href);u.searchParams.set('mode',enabled?'ADHD_FOCUS':'STANDARD');a.href=u.href}};
  focus.addEventListener('click',syncLanguage);syncLanguage();
  paint();
  try{const saved=JSON.parse(sessionStorage.getItem('qd-reading-position')||'null');if(saved?.page===page){sessionStorage.removeItem('qd-reading-position');requestAnimationFrame(()=>{restore(saved.mark);if(document.fonts?.status==='loading')document.fonts.ready.then(()=>restore(saved.mark))})}}catch{}
})();
