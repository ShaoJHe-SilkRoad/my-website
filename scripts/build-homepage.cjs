// Run node scripts/build-homepage.cjs after editing homepage content or markup.
const fs=require('fs'),vm=require('vm');
const root=require('path').resolve(__dirname,'..');
const context={window:{}};vm.runInNewContext(fs.readFileSync(root+'/content/auv-releases.js','utf8'),context);vm.runInNewContext(fs.readFileSync(root+'/content/homepage-content.js','utf8'),context);
const render=require(root+'/homepage.js');
const escape=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
// English at /, Chinese at /zh/: each language is a complete static page search engines can read.
const pages={en:{file:'/index.html',url:'https://shaotinghe.com/',locale:'en_CA',imageAlt:'Shaoting He — ICU nurse and independent builder, illustrated on a Toronto ferry'},
  'zh-Hans':{file:'/zh/index.html',url:'https://shaotinghe.com/zh/',locale:'zh_CN',imageAlt:'何少霆 — ICU 护士与独立开发者，在多伦多渡轮上的插画肖像'}};
// Structured data: who the site is about and what they have published, in the page's language.
function structuredData(c,lang,page){
  const site='https://shaotinghe.com/',p=id=>c.projects.find(x=>x.id===id),zh=lang==='zh-Hans';
  const app=(id,os,extra)=>Object.assign({'@type':'SoftwareApplication',name:p(id).name,description:p(id).description,operatingSystem:os,applicationCategory:'UtilitiesApplication',offers:{'@type':'Offer',price:'0',priceCurrency:'CAD'},author:{'@id':site+'#person'}},extra);
  const data={'@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':site+'#website',url:page.url,name:'Shaoting He',inLanguage:lang,publisher:{'@id':site+'#person'}},
    {'@type':'Person','@id':site+'#person',name:'Shaoting He',alternateName:'何少霆',url:site,image:site+'portrait-ferry-web.jpg',
      jobTitle:zh?'ICU 注册护士，独立开发者':'ICU registered nurse and independent builder',knowsLanguage:['en','zh'],
      knowsAbout:['Critical care nursing','Health research communication','Software development'],sameAs:['https://github.com/ShaoJHe-SilkRoad']},
    app('uma','macOS, Windows',{url:site+'#uma',downloadUrl:'https://github.com/ShaoJHe-SilkRoad/UMA/releases',softwareVersion:context.window.AUV_RELEASES.macos.version}),
    app('screensnap','Windows',{url:site+'screensnap/'}),
    {'@type':'WebSite',name:'QDigest',url:site+'qdigest/',description:p('bid').description,inLanguage:['en','zh-CN'],author:{'@id':site+'#person'}}]};
  return '<script type="application/ld+json">'+JSON.stringify(data).replace(/</g,'\\u003c')+'</script>';
}
fs.mkdirSync(root+'/zh',{recursive:true});
for (const [lang,page] of Object.entries(pages)) {
const c=context.window.SHAOTING_HOME_CONTENT[lang];
fs.writeFileSync(root+page.file,`<!DOCTYPE html>
<html lang="${lang}" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.meta.title}</title>
<meta name="description" content="${escape(c.meta.description)}">
<meta property="og:title" content="${escape(c.meta.title)}">
<meta property="og:description" content="${escape(c.meta.description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Shaoting He">
<meta property="og:url" content="${page.url}">
<meta property="og:locale" content="${page.locale}">
<meta property="og:image" content="https://shaotinghe.com/og-image.png?v=20261031">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escape(page.imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(c.meta.title)}">
<meta name="twitter:description" content="${escape(c.meta.description)}">
<meta name="twitter:image" content="https://shaotinghe.com/og-image.png?v=20261031">
<link rel="canonical" href="${page.url}">
<link rel="alternate" hreflang="en" href="https://shaotinghe.com/">
<link rel="alternate" hreflang="zh-Hans" href="https://shaotinghe.com/zh/">
<link rel="alternate" hreflang="x-default" href="https://shaotinghe.com/">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta name="theme-color" content="#070c12">
<meta name="color-scheme" content="dark light">
<meta name="robots" content="index, follow">
${structuredData(c,lang,page)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&amp;family=Geist:wght@300..700&amp;family=Geist+Mono:wght@400..600&amp;family=Instrument+Serif:ital@1&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/homepage.css?v=site-20261105f">
<script>(function(){try{var t=localStorage.getItem('sh-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark';}catch(e){}})();</script>
<script defer src="/content/auv-releases.js?v=auv-0172"></script>
<script defer src="/content/homepage-content.js?v=site-20261105f"></script>
<script defer src="/ambient.js?v=site-20261105f"></script>
<script defer src="/homepage.js?v=site-20261105f"></script>
</head>
<body>
<div class="ambient-backdrop" aria-hidden="true"><canvas id="ambient-field" aria-hidden="true"></canvas></div>
<div id="app">${render(c,lang)}</div>
</body>
</html>
`);
}

// The install page remains static and bilingual; release metadata has one source.
const releases=context.window.AUV_RELEASES;
const safe=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
let guide=fs.readFileSync(root+'/auv/install/index.html','utf8');
for(const lang of ['en','zh-Hans']) {
 const buttons='<div class="platform-downloads">'+['windows','macos'].map(platform=>{const r=releases[platform],name=platform==='windows'?'Windows':'macOS',label=(lang==='en'?'Download for '+name:'下载 '+name+' 版')+' · v'+r.version;return '<div class="platform-download"><a class="button button--small" href="'+safe(r.url)+'">'+render.platformIcon(platform)+'<span>'+safe(label)+'</span></a><p class="download-requirements">'+safe(r.requirements[lang])+'</p></div>';}).join('')+'</div>';
 const begin='<!--AUV-DOWNLOADS:'+lang+'-->',end='<!--/AUV-DOWNLOADS:'+lang+'-->',a=guide.indexOf(begin),b=guide.indexOf(end);
 if(a<0||b<0)throw Error('Missing install download markers: '+lang);
 guide=guide.slice(0,a+begin.length)+buttons+guide.slice(b);
}
fs.writeFileSync(root+'/auv/install/index.html',guide);
