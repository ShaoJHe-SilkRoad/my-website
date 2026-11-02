/* Route and semantic position controller. Typography has one owner in reading-preferences.js. */
(()=>{'use strict';const root=document.documentElement,params=new URLSearchParams(location.search);let revision=0,pendingMark=null;
const read=k=>{try{return localStorage.getItem(k)}catch{return null}};
const savedLanguage=read('qd-language');if(root.getAttribute('data-language-root')==='true'&&['en','zh-CN'].includes(savedLanguage)&&savedLanguage!==root.lang){const target=[...document.querySelectorAll('nav a[lang]')].find(a=>a.lang===savedLanguage);if(target){location.replace(target.href);return}}
root.classList.remove('focus');const focus=document.getElementById('focus');if(focus)focus.hidden=true;
const blocks=()=>[...document.querySelectorAll('[data-reading-anchor]')].filter(x=>x.getClientRects().length);
function capture(){if(pendingMark)return pendingMark;if(scrollY<2)return {top:true};const y=innerHeight*.35,el=blocks().find(x=>x.getBoundingClientRect().bottom>y)||blocks().at(-1);if(!el)return null;const r=el.getBoundingClientRect();return {id:el.dataset.readingAnchor,fraction:Math.max(0,Math.min(1,(y-r.top)/Math.max(1,r.height))),owner:el.closest('article[data-reading-anchor]')?.dataset.readingAnchor,focus:document.activeElement?.id||null}}
function restore(mark,ticket=revision){if(ticket!==revision||!mark)return;if(mark.top){scrollTo({top:0,behavior:'instant'});return}if(mark.scope==='fragment'){document.getElementById(mark.id)?.scrollIntoView({block:'start',behavior:'instant'});return}const all=blocks(),el=mark.scope==='article-body'?document.getElementById('full-reading'):all.find(x=>x.dataset.readingAnchor===mark.id)||all.find(x=>x.dataset.readingAnchor===mark.owner);if(el){const r=el.getBoundingClientRect();scrollBy({top:r.top+r.height*mark.fraction-innerHeight*.35,behavior:'instant'})}if(mark.focus)document.getElementById(mark.focus)?.focus({preventScroll:true})}
function change(fn){const mark=capture(),ticket=++revision;fn();requestAnimationFrame(()=>restore(mark,ticket))}
window.QDReadingPosition={capture,restore,change,generation:()=>revision};
const toolbar=document.querySelector('header.toolbar');if(toolbar){const measureToolbar=()=>root.style.setProperty('--qd-toolbar-height',toolbar.getBoundingClientRect().height+'px');measureToolbar();if(typeof ResizeObserver==='function')new ResizeObserver(measureToolbar).observe(toolbar);else window.addEventListener('resize',measureToolbar);}
for(const type of ['wheel','touchstart','pointerdown','keydown'])document.addEventListener(type,()=>{revision++;pendingMark=null},{passive:true});window.addEventListener('hashchange',()=>{revision++;pendingMark=null});
const depth=root.dataset.readerPage||'full',lazy=document.getElementById('depth-quick');if(depth==='full'&&['lazy','quick'].includes(params.get('depth'))&&lazy?.tagName==='A'){location.replace(lazy.href);return}root.dataset.depth=depth;
// Keep an explicit return/section fragment through initial font layout. Font
// loading may otherwise capture scrollY=0 before the browser's anchor jump.
if(location.hash){let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{}if(id&&document.getElementById(id)){const mark={scope:'fragment',id},ticket=++revision;pendingMark=mark;const apply=()=>requestAnimationFrame(()=>{restore(mark,ticket);if(ticket===revision)pendingMark=null});if(document.readyState==='complete')apply();else window.addEventListener('pageshow',apply,{once:true})}}
// Translated paragraph numbers are not semantic correspondences. Transfer only the
// actual shared article body, or the shared paper card on the edition overview.
function languageMark(){const mark=capture();if(!mark||mark.top||depth==='lazy'||mark.id==='lead')return mark;const body=document.getElementById('full-reading');if(!body)return {top:true};const r=body.getBoundingClientRect();return {scope:'article-body',id:'full-reading',fraction:Math.max(0,Math.min(1,(innerHeight*.35-r.top)/Math.max(1,r.height))),focus:null}}
const page=location.pathname.replace(/\/(en|zh-CN)(?=\/|$)/g,'/_language_');for(const a of document.querySelectorAll('nav a[lang]')){const u=new URL(a.href,location.href);u.searchParams.set('depth',depth);u.searchParams.set('mode','STANDARD');if(depth==='lazy'&&location.hash)u.hash=location.hash;a.href=u.href;a.addEventListener('click',()=>{try{localStorage.setItem('qd-language',a.lang);sessionStorage.setItem('qd-reading-position',JSON.stringify({page,mark:languageMark()}))}catch{}})}
for(const a of document.querySelectorAll('a.full-detail-link')){const u=new URL(a.href,location.href);u.searchParams.set('depth','full');u.searchParams.set('mode','STANDARD');a.href=u.href}
try{const saved=JSON.parse(sessionStorage.getItem('qd-reading-position')||'null');if(saved?.page===page){sessionStorage.removeItem('qd-reading-position');if(!location.hash){const ticket=++revision;pendingMark=saved.mark;const applyIncoming=()=>requestAnimationFrame(()=>{restore(saved.mark,ticket);if(ticket===revision)pendingMark=null});if(document.readyState==='complete')applyIncoming();else window.addEventListener('pageshow',applyIncoming,{once:true})}}}catch{}
})();

/* Native inline anchors remain the complete no-JS/failure fallback. */
(() => {
  if(typeof HTMLDialogElement==='undefined')return;
  let trigger=null;
  const dialog=document.createElement('dialog');dialog.className='term-dialog';
  const title=document.createElement('h2');title.id='term-dialog-title';dialog.setAttribute('aria-labelledby',title.id);
  const content=document.createElement('div'),close=document.createElement('button');close.type='button';close.textContent=document.documentElement.lang==='zh-CN'?'关闭术语说明':'Close explanation';
  dialog.append(title,content,close);document.body.append(dialog);
  const finish=()=>dialog.close();close.addEventListener('click',finish);
  dialog.addEventListener('close',()=>trigger?.focus({preventScroll:true}));
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)finish()}});
  for(const link of document.querySelectorAll('a.term-link')){
    const id=link.hash.slice(1),term=document.getElementById(id),definition=term?.nextElementSibling;
    if(!term||!definition||definition.tagName!=='DD')continue;
    link.setAttribute('aria-haspopup','dialog');
    link.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();trigger=link;title.textContent=term.textContent;content.replaceChildren();for(const p of definition.querySelectorAll('p'))content.append(p.cloneNode(true));dialog.showModal();close.focus()});
  }
})();
