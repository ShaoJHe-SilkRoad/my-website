/* Presentation snapshots only. Persistent state wins over obsolete tab state. */
(function(g){'use strict';
const S=g.QDPreferencesSchema||(typeof require==='function'?require('./preferences-schema.js'):null);
const KEY='q3d-reader.settings.v2',SESSION='q3d-reader.started.v2',VERSION='q3d-reader-settings/2.0';
const copy=x=>JSON.parse(JSON.stringify(x)),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function keys(x,allowed){if(!x||Array.isArray(x)||Object.getPrototypeOf(x)!==Object.prototype||Object.keys(x).some(k=>!allowed.includes(k)))throw Error('Unsafe settings')}
function snapshot(x){keys(x,['profiles','theme']);if(!['system','light','dark'].includes(x.theme))throw Error('Theme');return {profiles:S.payload({schema:S.VERSION,profiles:x.profiles,remember:true}).profiles,theme:x.theme}}
function empty(theme='system'){return {schema:VERSION,revision:'initial',current:snapshot({profiles:Object.fromEntries(S.LANGS.map(l=>[l,S.defaults(l)])),theme}),slots:[null,null,null],startup:'last',active:null}}
function validate(x){keys(x,['schema','revision','current','slots','startup','active']);if(x.schema!==VERSION||typeof x.revision!=='string'||!Array.isArray(x.slots)||x.slots.length!==3||!['last',0,1,2].includes(x.startup)||![null,0,1,2].includes(x.active))throw Error('Settings schema');const v={schema:VERSION,revision:x.revision,current:snapshot(x.current),slots:x.slots.map(z=>z===null?null:snapshot(z)),startup:x.startup,active:x.active};if(v.startup!=='last'&&!v.slots[v.startup])throw Error('Empty default');if(v.active!==null&&(!v.slots[v.active]||!same(v.current,v.slots[v.active])))throw Error('Stale active slot');return v}
function create({local,session,theme='system',start=true}={}){
 let value=empty(theme),persistent=false,sessionOK=true,invalid=false,legacy=false;
 const read=(s,k)=>{try{return s?.getItem(k)||null}catch{return null}};
 const latest=()=>{const raw=read(local,KEY);if(!raw)return null;try{return validate(JSON.parse(raw))}catch{invalid=true;return null}};
 const existing=latest();if(existing){value=existing;persistent=true}else{
  // A valid persistent v1 profile always wins over its stale session counterpart.
  for(const [s,k]of [[local,'q3d-reader.preferences.v1'],[session,'q3d-reader.session.v1']]){const raw=read(s,k);if(!raw)continue;try{value.current.profiles=S.payload(JSON.parse(raw)).profiles;legacy=true;break}catch{invalid=true}}
  const old=Number(read(local,'qd-text-size'));if(!legacy&&old>=16&&old<=28){for(const l of S.LANGS)value.current.profiles[l].size=old;legacy=true}
 }
 function commit(next){next=validate(next);next.revision=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);let ok=false;try{local.setItem(KEY,JSON.stringify(next));ok=true}catch{}value=next;persistent=ok;if(ok&&legacy){try{local.removeItem('qd-text-size')}catch{}legacy=false}return ok}
 // The session marker contains no profiles and can never overwrite saved data.
 if(start){const begun=read(session,SESSION)==='started';if(!begun&&value.startup!=='last'){value.current=copy(value.slots[value.startup]);value.active=value.startup;commit(value)}else if(!existing&&(legacy||!invalid))commit(value);try{session.setItem(SESSION,'started')}catch{sessionOK=false}}
 function change(fn){const next=(persistent&&latest())||copy(value);fn(next);return commit(next)}
 return {
  get:()=>copy(value),status:()=>({persistent,sessionOK,invalid}),
  refresh:()=>{if(!persistent)return false;const next=latest();if(next){value=next;persistent=true;return true}return false},
  update:current=>change(v=>{v.current=snapshot(current);if(v.active!==null&&!same(v.current,v.slots[v.active]))v.active=null}),
  save:slot=>{if(![0,1,2].includes(slot))throw Error('Slot');const current=copy(value.current);return change(v=>{v.current=current;v.slots[slot]=copy(current);v.active=slot})},
  use:slot=>{if(![0,1,2].includes(slot))throw Error('Slot');return change(v=>{if(!v.slots[slot])throw Error('Empty slot');v.current=copy(v.slots[slot]);v.active=slot})},
  setDefault:slot=>{if(!['last',0,1,2].includes(slot))throw Error('Default');return change(v=>{if(slot!=='last'&&!v.slots[slot])throw Error('Empty default');v.startup=slot})}
 };
}
const api={KEY,SESSION,VERSION,create,validate,snapshot};g.QDSettingsStore=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
