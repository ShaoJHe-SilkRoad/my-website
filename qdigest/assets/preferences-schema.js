/* Shared, strict, presentation-only schema. No content or theme payloads. */
(function(g){'use strict';
const VERSION='q3d-reader/1.0', LANGS=['en','zh-CN','zh-TW'];
const RANGES={size:[16,40],line:[1.3,2.6],letter:[0,.2],word:[0,.4],paragraph:[.5,2.5],measure:[18,42]};
const FONTS={en:['openSans','notoSerifLatin','od','lato','merriweather'],'zh-CN':['notoSans','notoSerif','wenkai','ibmPlexSans','chillRound'],'zh-TW':['notoSans','notoSerif','wenkai','ibmPlexSans','chillRound']};
const FONT_LABELS={en:{openSans:'Open Sans',notoSerifLatin:'Noto Serif',od:'OpenDyslexic',lato:'Lato',merriweather:'Merriweather'},'zh-CN':{notoSans:'Noto Sans SC / TC',notoSerif:'Noto Serif SC / TC',wenkai:'LXGW WenKai TC（TC 字形）',ibmPlexSans:'IBM Plex Sans（简／繁黑体）',chillRound:'寒蝉全圆体 ChillRoundF'},'zh-TW':{notoSans:'Noto Sans SC / TC',notoSerif:'Noto Serif SC / TC',wenkai:'LXGW WenKai TC（TC 字形）',ibmPlexSans:'IBM Plex Sans（簡／繁黑體）',chillRound:'寒蟬全圓體 ChillRoundF'}};
const defaults=lang=>({font:FONTS[lang][0],size:18,line:lang==='en'?1.8:1.9,letter:lang==='en'?0:.02,word:0,paragraph:1,measure:42,emphasis:'semantic',guide:'none',progress:false,italic:false});
function object(x){return x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype}
function keys(x,allowed){if(!object(x)||Object.keys(x).some(k=>!allowed.includes(k)))throw Error('Unknown or unsafe keys')}
function profile(x,lang){if(!LANGS.includes(lang))throw Error('Language');keys(x,Object.keys(defaults(lang)));const d=defaults(lang);for(const [k,v]of Object.entries(x)){
 if(k in RANGES){const [a,b]=RANGES[k];if(typeof v!=='number'||!Number.isFinite(v)||v<a||v>b)throw Error('Range: '+k)}
 else if(k==='font'){if(lang==='en'&&v==='timesNewRoman'){d.font=defaults(lang).font;continue}if(!FONTS[lang].includes(v))throw Error('Font')}
 else if(k==='emphasis'){if(!['semantic','none','terms','first','half'].includes(v))throw Error('Emphasis')}
 else if(k==='guide'){if(!['none','paragraph','line1','line3'].includes(v))throw Error('Guide')}
 else if(typeof v!=='boolean')throw Error('Boolean');d[k]=v;}return d}
function payload(x){keys(x,['schema','profiles','remember','migration']);if(x.schema!==VERSION||typeof x.remember!=='boolean')throw Error('Schema');keys(x.profiles,LANGS);const profiles={};for(const l of LANGS)profiles[l]=profile(x.profiles[l]||{},l);if(x.migration!==undefined&&x.migration!==true)throw Error('Migration');return {schema:VERSION,profiles,remember:x.remember,migration:true}}
const V6_KEYS=['zhFont','latinFont','fontSize','letterSpacing','wordSpacing','lineHeight','paragraphGap','measure','boldMode','boldWeight','italic','italicScope','guide','showLegend','showProgress','theme','speechRate'];
function fromV6Settings(x,lang){keys(x,V6_KEYS);const p=defaults(lang),map={fontSize:'size',letterSpacing:'letter',wordSpacing:'word',lineHeight:'line',paragraphGap:'paragraph',measure:'measure',boldMode:'emphasis',italic:'italic',guide:'guide',showProgress:'progress'};for(const[k,v]of Object.entries(map))if(k in x)p[v]=x[k];
 for(const [k,vals]of Object.entries({zhFont:FONTS['zh-CN'],latinFont:FONTS.en,italicScope:['latin','all'],theme:['light','dark']}))if(k in x&&!vals.includes(x[k]))throw Error('v6 enum '+k);
 for(const[k,a,b]of [['boldWeight',600,900],['speechRate',.6,1.4]])if(k in x&&(typeof x[k]!=='number'||!Number.isFinite(x[k])||x[k]<a||x[k]>b))throw Error('v6 range');if('showLegend'in x&&typeof x.showLegend!=='boolean')throw Error('v6 boolean');
 p.font=lang==='en'?(x.latinFont||p.font):(x.zhFont||p.font);return profile(p,lang)}
function importData(raw){if(typeof raw!=='string'||raw.length>1500000)throw Error('Import size');let x=JSON.parse(raw);function guard(v){if(!v||typeof v!=='object')return;for(const[k,z]of Object.entries(v)){if(['__proto__','prototype','constructor','customArticle','fullText','css','javascript','html'].includes(k))throw Error('Unsafe property');guard(z)}}guard(x);if(x.schema==='q3d-reader-lab-export/1.0'){keys(x,['schema','preferences','records','notice']);x=x.preferences}if(x.schema===VERSION)return payload(x);
 if(x.schema!=='qd-reading-lab/6.0')throw Error('Unsupported schema');
 keys(x,['schema','timestamp','exportedAt','settings','profiles','activeLab','slots','records','fontReviews','notes','limitations','remember','positions','fontAuditPolicy','fontAudits','fontIdentity','purpose','resolvedFonts','article','networkDiagnostics','evidence']);
 if(x.article){keys(x.article,['id','title','characters','fingerprint','fullTextIncluded']);if(x.article.fullTextIncluded!==false)throw Error('Custom text forbidden')}
 if('remember'in x&&typeof x.remember!=='boolean')throw Error('Remember');const ps={};for(const l of LANGS)ps[l]=defaults(l);
 if(x.profiles!==undefined){keys(x.profiles,['en','zh-Hans','zh-Hant']);for(const[old,l]of [['en','en'],['zh-Hans','zh-CN'],['zh-Hant','zh-TW']])if(x.profiles[old]){keys(x.profiles[old],['settings','slots','lastId']);ps[l]=fromV6Settings(x.profiles[old].settings,l)}}
 else {const l={en:'en','zh-Hans':'zh-CN','zh-Hant':'zh-TW'}[x.activeLab||'zh-Hans'];if(!l)throw Error('Lab');ps[l]=fromV6Settings(x.settings,l)}
 if(x.settings)fromV6Settings(x.settings,{en:'en','zh-Hans':'zh-CN','zh-Hant':'zh-TW'}[x.activeLab||'zh-Hans']||'zh-CN');
 return {schema:VERSION,profiles:ps,remember:false,migration:true}; // Scores, claimed fonts and theme never become reader facts.
}
function safeReturn(input,base){try{const u=new URL(input,base),b=new URL(base);if(u.origin!==b.origin||!u.pathname.startsWith('/qdigest/')||u.pathname.startsWith('/qdigest/reading-lab')||u.username||u.password||/[\\]/.test(input))return null;if([...u.searchParams.keys()].some(k=>!['depth','mode'].includes(k))||/%(?:2f|5c|2e)/i.test(u.pathname))return null;if(u.searchParams.has('depth')&&!['lazy','full','quick'].includes(u.searchParams.get('depth')))return null;if(u.searchParams.has('mode')&&!['STANDARD','ADHD_FOCUS'].includes(u.searchParams.get('mode')))return null;return u.pathname+u.search+u.hash}catch{return null}}
const api={VERSION,LANGS,FONTS,FONT_LABELS,RANGES,defaults,profile,payload,importData,safeReturn};g.QDPreferencesSchema=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
