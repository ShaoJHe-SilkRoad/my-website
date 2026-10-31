/* Static-first portfolio. JavaScript adds language, motion and small interactions. */
(function () {
  'use strict';
  var github = 'https://github.com/ShaoJHe-SilkRoad';
  function e(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function lines(value) { return e(value).replace(/\n/g, '<br>'); }
  function arrow() { return '<span aria-hidden="true">↗</span>'; }
  function icon(name) {
    var paths = {sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',pause:'<path d="M9 5v14M15 5v14"/>',play:'<path d="m8 5 11 7-11 7Z"/>',github:'<path d="M9 19c-4 1-4-2-6-2m12 5v-3.9c0-1 .1-1.4-.5-2 3.5-.4 7-1.7 7-7.5A5.8 5.8 0 0 0 20 4.5a5.4 5.4 0 0 0-.1-4S18.7.1 16 2a14 14 0 0 0-8 0C5.3.1 4.1.5 4.1.5a5.4 5.4 0 0 0-.1 4A5.8 5.8 0 0 0 2.5 8.6c0 5.8 3.5 7.1 7 7.5-.6.6-.6 1.2-.5 2V22"/>',copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>'};
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';
  }
  // Decorative platform marks; the adjacent download text is the accessible name.
  function platformIcon(platform) {
    var shape = platform === 'macos'
      ? '<path d="M16.37 4.2c.78-.95 1.3-2.26 1.15-3.57-1.12.05-2.47.75-3.27 1.69-.72.83-1.35 2.17-1.18 3.44 1.24.1 2.51-.64 3.3-1.56ZM19.97 12.85c.03-3.07 2.5-4.55 2.61-4.62-1.43-2.09-3.64-2.37-4.42-2.4-1.88-.19-3.68 1.11-4.64 1.11-.96 0-2.44-1.08-4.01-1.05-2.06.03-3.96 1.19-5.02 3.03-2.14 3.72-.55 9.24 1.53 12.25 1.02 1.47 2.23 3.12 3.83 3.06 1.54-.06 2.12-.99 3.98-.99 1.85 0 2.38.99 4 .95 1.66-.03 2.71-1.5 3.72-2.98 1.17-1.71 1.65-3.37 1.68-3.45-.04-.02-3.23-1.24-3.26-4.91Z"/>'
      : '<path d="M1 1h10v10H1zM13 1h10v10H13zM1 13h10v10H1zM13 13h10v10H13z"/>';
    return '<svg class="platform-logo" data-platform="'+platform+'" viewBox="0 0 25 25" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">'+shape+'</svg>';
  }
  // ScreenSnap's lens, drawn as decoration; the figure caption carries the meaning.
  function snapLens() {
    var chrome='<stop offset="0" stop-color="#f8f8fa"/><stop offset=".38" stop-color="#bababf"/><stop offset=".58" stop-color="#ececf0"/><stop offset=".85" stop-color="#96969c"/><stop offset="1" stop-color="#cdcdd2"/>';
    return '<svg class="snap-lens" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs><linearGradient id="snap-chrome" x1="0" y1="0" x2="1" y2="1">'+chrome+'</linearGradient><linearGradient id="snap-chrome-rev" x1="0" y1="1" x2="0" y2="0">'+chrome+'</linearGradient><linearGradient id="snap-bevel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0c0e"/><stop offset="1" stop-color="#6e6e76"/></linearGradient><linearGradient id="snap-barrel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#222228"/><stop offset="1" stop-color="#060608"/></linearGradient><radialGradient id="snap-glass" cx=".43" cy=".43" r=".6"><stop offset="0" stop-color="#463a96"/><stop offset="1" stop-color="#04060f"/></radialGradient><linearGradient id="snap-glint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'+
      '<circle cx="100" cy="100" r="90" fill="url(#snap-chrome)"/><g fill="none" stroke-width="1"><circle cx="100" cy="100" r="88" stroke="#000" stroke-opacity=".08"/><circle cx="100" cy="100" r="85.5" stroke="#fff" stroke-opacity=".12"/><circle cx="100" cy="100" r="83" stroke="#000" stroke-opacity=".07"/><circle cx="100" cy="100" r="80.5" stroke="#fff" stroke-opacity=".1"/><circle cx="100" cy="100" r="78" stroke="#000" stroke-opacity=".08"/><circle cx="100" cy="100" r="75.5" stroke="#fff" stroke-opacity=".12"/></g><circle cx="100" cy="100" r="88.5" fill="none" stroke="#28282c" stroke-opacity=".6" stroke-width="3"/>'+
      '<circle cx="100" cy="100" r="72" fill="url(#snap-bevel)"/><circle cx="100" cy="100" r="67.5" fill="url(#snap-barrel)"/><path d="M42.68 79.14A61 61 0 0 1 157.32 79.14" fill="none" stroke="#fff" stroke-opacity=".13" stroke-width="3"/><circle cx="100" cy="100" r="52" fill="url(#snap-chrome-rev)"/><circle cx="100" cy="100" r="52" fill="#000" fill-opacity=".35"/><circle cx="100" cy="100" r="49.5" fill="#0a0a0c"/><circle cx="100" cy="100" r="45" fill="url(#snap-glass)"/>'+
      '<circle cx="100" cy="100" r="27" fill="none" stroke="#786edc" stroke-opacity=".27" stroke-width="2.4"/><circle cx="100" cy="100" r="15" fill="#02020a" fill-opacity=".47"/><text x="100" y="105.2" text-anchor="middle" font-family="Segoe UI, system-ui, sans-serif" font-weight="600" font-size="15" fill="#dcdcff" fill-opacity=".32">ALT+C</text><path d="M135.45 106.25A36 36 0 0 1 100 136" fill="none" stroke="#5adca0" stroke-opacity=".22" stroke-width="7"/><path d="M79.72 94.57A21 21 0 0 1 94.57 79.72" fill="none" stroke="#eb82dc" stroke-opacity=".2" stroke-width="5.4"/><path d="M84.25 127.28A31.5 31.5 0 0 1 71.45 113.31" fill="none" stroke="#fac85a" stroke-opacity=".18" stroke-width="4.2"/>'+
      '<g class="snap-glint"><ellipse cx="0" cy="0" rx="21" ry="9" fill="url(#snap-glint)" transform="translate(83.5 77.5) rotate(-35)"/><circle cx="120.1" cy="118.6" r="3.6" fill="#fff" fill-opacity=".55"/></g><circle cx="100" cy="100" r="45" fill="none" stroke="#000" stroke-opacity=".9" stroke-width="3"/></svg>';
  }
  function external(href,label,cls) { return '<a class="'+(cls||'text-link')+'" href="'+e(href)+'" target="_blank" rel="noopener noreferrer">'+e(label)+arrow()+'</a>'; }
  function heading(kicker,title,summary) { return '<div class="section-heading" data-reveal><span class="eyebrow">'+e(kicker)+'</span><h2>'+lines(title)+'</h2>'+(summary?'<p>'+e(summary)+'</p>':'')+'</div>'; }
  function projectActions(p,zh) {
    if (!p.downloads) return '<div class="project-actions"><a class="button button--small" href="'+e(p.url)+'">'+e(p.primary)+arrow()+'</a>'+(p.secondary?'<a class="text-link" href="'+e(p.secondaryUrl)+'">'+e(p.secondary)+'</a>':'')+'</div>';
    return '<div class="platform-downloads">'+p.downloads.map(function(d){return '<div class="platform-download">'+'<a class="button button--small" href="'+e(d.url)+'" target="_blank" rel="noopener noreferrer">'+platformIcon(d.platform)+'<span>'+e(d.label)+'</span>'+arrow()+'</a>'+'<p class="download-requirements">'+e(d.description)+'</p></div>';}).join('')+'</div><div class="project-actions"><a class="text-link" href="/auv/install/">'+(zh?'安装指南':'Installation guide')+'</a>'+external(p.releaseUrl,zh?'更新说明':'Release notes')+external(github+'/UMA','GitHub')+'<a class="text-link" href="/threados/">'+(zh?'线程工指南':'ThreadOS guide')+'</a><a class="text-link" href="/sectorium/">'+(zh?'分区工指南':'Sectorium guide')+'</a></div>';
  }
  function render(c,lang) {
    var zh=lang==='zh-Hans';
    var nav=c.nav.map(function(n){return '<a href="#'+e(n[0])+'" data-nav="'+e(n[0])+'">'+e(n[1])+'</a>';}).join('');
    var projects=c.projects.map(function(p){
      var art=p.id==='uma' ? '<figure class="project-art uma-art"><span class="art-label">AUV / macOS</span><a class="uma-preview" href="assets/auv-0151/auv-en.png" target="_blank" rel="noopener" aria-label="'+e(c.ui.projectPreview)+'"><img src="assets/auv-0151/auv-en.png" alt="'+e(p.caption)+'" width="1744" height="1256" loading="lazy" decoding="async"></a><figcaption><span>'+e(p.caption)+'</span><a class="preview-open" href="assets/auv-0151/auv-en.png" target="_blank" rel="noopener">'+e(c.ui.projectPreview)+'<span aria-hidden="true">↗</span></a></figcaption></figure>' : p.id==='screensnap' ? '<figure class="project-art snap-art">'+snapLens()+'<figcaption>'+e(p.caption)+'</figcaption></figure>' : '<figure class="project-art bid-art"><div class="digest-concept"><div class="digest-top"><span>'+e(c.digest.label)+'</span><span>'+e(c.digest.language)+'</span></div><div class="digest-wordmark">'+e(c.digest.title)+'<span>'+e(c.digest.subtitle)+'</span></div><div class="digest-rule" aria-hidden="true"></div><p class="digest-edition">'+e(c.digest.edition)+'</p><div class="digest-topics">'+c.digest.topics.map(function(t,i){return '<span><i aria-hidden="true">0'+(i+1)+'</i>'+e(t)+'</span>';}).join('')+'</div><div class="digest-bottom">'+e(c.digest.bottom)+'</div></div><figcaption>'+e(p.caption)+'</figcaption></figure>';
      return '<article class="project project--'+e(p.id)+'" id="'+e(p.id)+'" data-reveal><div class="project-copy"><div class="project-meta"><span>'+e(p.kind)+'</span><span class="status-tag"><i aria-hidden="true"></i>'+e(p.status)+'</span></div><div class="project-name"><h3>'+e(p.name)+'</h3><span>'+e(p.subtitle)+'</span></div><h4>'+e(p.headline)+'</h4><p>'+e(p.description)+'</p><ul class="tag-list" aria-label="'+e(p.name)+'">'+p.tags.map(function(t){return '<li>'+e(t)+'</li>';}).join('')+'</ul>'+projectActions(p,zh)+'<details class="project-details"><summary>'+e(c.ui.more)+'<span aria-hidden="true">+</span></summary><dl><div><dt>'+e(p.whyTitle)+'</dt><dd>'+e(p.why)+'</dd></div><div><dt>'+e(p.focusTitle)+'</dt><dd>'+e(p.focus)+'</dd></div><div><dt>'+e(p.inviteTitle)+'</dt><dd>'+e(p.invite)+'</dd></div></dl></details></div>'+art+'</article>';
    }).join('');
    return '<a class="skip-link" href="#main-content">'+e(c.ui.skip)+'</a>'+
      '<header class="site-header"><div class="container header-row"><a class="brand" href="#top" aria-label="Shaoting He"><span class="brand-mark brand-mark--heritage" aria-hidden="true"></span><span class="brand-name">SHAOTING HE<span>RN & BUILDER</span></span></a><nav class="desktop-nav" aria-label="'+e(c.ui.menu)+'">'+nav+'</nav><div class="header-tools">'+external(github,c.ui.github,'github-header')+'<button class="code-blue js-only" id="code-blue-toggle" type="button" aria-pressed="false" title="'+e(c.ui.codeBlueOn)+'"><span class="code-blue-dot" aria-hidden="true"></span>'+e(c.ui.codeBlue)+'</button><button class="icon-button js-only" id="motion-toggle" type="button" aria-label="'+e(c.ui.motion)+'" title="'+e(c.ui.motion)+'">'+icon('pause')+'</button><button class="icon-button js-only" id="theme-toggle" type="button" aria-label="'+e(c.ui.light)+'" title="'+e(c.ui.light)+'">'+icon('sun')+'</button><div class="language-control js-only" role="group" aria-label="'+e(c.ui.language)+'"><button type="button" data-language="en" aria-pressed="'+(!zh)+'">EN</button><button type="button" data-language="zh-Hans" aria-pressed="'+zh+'">中</button></div></div></div></header>'+
      '<main id="main-content" tabindex="-1"><section class="hero container" id="top"><div class="hero-copy"><div class="eyebrow hero-eyebrow"><span class="signal-dot" aria-hidden="true"></span>'+e(c.hero.eyebrow)+'</div><h1><span>'+e(c.hero.line1)+'</span><span class="gradient-text">'+e(c.hero.line2)+'</span></h1><p class="hero-statement">'+lines(c.hero.statement).replace(/<br>/g,'<br> ')+'</p><p class="hero-intro">'+e(c.hero.intro)+'</p><div class="hero-actions"><a class="button" href="#projects">'+e(c.hero.primary)+'<span aria-hidden="true">↓</span></a>'+external(github,c.hero.secondary,'hero-github')+'</div><ul class="hero-credentials">'+c.hero.credentials.map(function(t){return '<li>'+e(t)+'</li>';}).join('')+'</ul></div><div class="signal-annotation"><span class="signal-index">01 / '+e(c.hero.signalTitle)+'</span><span class="signal-name" id="signal-rhythm" aria-live="polite">'+e(c.hero.rhythmNormal)+'</span><span class="signal-hint">'+e(c.hero.signalHint)+'</span><span class="signal-still">'+e(c.hero.signalStill)+'</span></div><div class="hero-foot"><p>'+e(c.hero.note)+'</p><a href="#focus" class="now-link"><span class="eyebrow">'+e(c.hero.current)+'</span>'+e(c.hero.currentProjects)+'<span aria-hidden="true">↘</span></a></div></section>'+
      '<section class="section work-section" id="projects"><span class="anchor-alias" id="systems"></span><div class="container"><div class="work-heading">'+heading(c.work.eyebrow,c.work.title,c.work.intro)+external(github,c.work.all)+'</div>'+projects+'</div></section>'+
      '<section class="section focus-section" id="focus"><div class="container focus-layout">'+heading(c.focus.eyebrow,c.focus.title,c.focus.intro)+'<div class="focus-list">'+c.focus.items.map(function(item){return '<a class="focus-item" href="'+e(item.link)+'" data-reveal><span class="eyebrow">'+e(item.label)+'</span><div><h3>'+e(item.title)+'</h3><p>'+e(item.text)+'</p></div><span class="focus-arrow" aria-hidden="true">↗</span></a>';}).join('')+'</div></div></section>'+
      '<section class="section about-section" id="about"><span class="anchor-alias" id="timeline"></span><span class="anchor-alias" id="practice"></span><span class="anchor-alias" id="capability"></span><span class="anchor-alias" id="language"></span><div class="container about-layout"><figure class="portrait" data-reveal><div class="portrait-frame"><img src="portrait-side-profile-web.jpg" alt="Shaoting He / 何少霆" width="1600" height="1200" loading="lazy" decoding="async"></div><figcaption>'+e(c.about.caption)+'</figcaption></figure><div class="about-copy">'+heading(c.about.eyebrow,c.about.title)+'<p class="about-intro">'+e(c.about.intro)+'</p><p>'+e(c.about.body)+'</p><p>'+e(c.about.end)+'</p><ul class="about-facts">'+c.about.facts.map(function(f){return '<li>'+e(f)+'</li>';}).join('')+'</ul><details class="clinical-details" id="education"><summary>'+e(c.about.detail)+'<span aria-hidden="true">+</span></summary><p>'+e(c.about.clinical)+'</p></details></div></div></section>'+
      '<section class="section contact-section" id="contact"><div class="container">'+heading(c.contact.eyebrow,c.contact.title,c.contact.intro)+'<div class="contact-paths">'+c.contact.paths.map(function(p){return '<article class="contact-path" data-reveal><span class="eyebrow">'+e(p.number)+'</span><h3>'+e(p.title)+'</h3><p>'+e(p.text)+'</p><a href="mailto:'+e(c.contact.email)+'?subject='+encodeURIComponent(p.subject)+'">'+e(p.label)+arrow()+'</a></article>';}).join('')+'</div><div class="email-row"><a class="email-link" href="mailto:'+e(c.contact.email)+'">'+e(c.contact.email)+arrow()+'</a><button class="copy-button js-only" id="copy-email" type="button">'+icon('copy')+'<span>'+e(c.ui.copy)+'</span></button></div><p class="contact-footnote">'+e(c.contact.footer)+'</p><p class="sr-only" id="copy-status" role="status" aria-live="polite"></p></div></section></main>'+
      '<footer class="site-footer"><div class="container footer-row"><div class="footer-identity"><span class="brand-mark brand-mark--heritage" aria-hidden="true"></span><div><p>'+e(c.footer.identity)+'</p><span>'+e(c.footer.note)+'</span></div></div><div class="footer-links">'+external(github,'GitHub')+'<a href="#top">'+e(c.ui.back)+' ↑</a><span>'+e(c.footer.copyright)+'</span></div></div></footer><nav class="mobile-nav" aria-label="'+e(c.ui.menu)+'">'+nav+'</nav>';
  }
  // The same renderer generates static English HTML without a browser or dependencies.
  if (typeof module !== 'undefined' && module.exports) { render.platformIcon=platformIcon; module.exports=render; return; }
  var content=window.SHAOTING_HOME_CONTENT;
  var app=document.getElementById('app');
  if (!content || !content.en || !content['zh-Hans'] || !app) return;
  // Keep the complete static download choices if release data or cached content is incomplete.
  if (!['en','zh-Hans'].every(function(locale) { var p=content[locale].projects.find(function(p){return p.id==='uma';}); return p && p.downloads && p.downloads.length===2; })) return;
  var lang='en', manualPause=false, rhythm='nsr', observer=null, copyReset=null;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  function read(key,fallback) { try { return localStorage.getItem(key)||fallback; } catch(error) { return fallback; } }
  function save(key,value) { try { localStorage.setItem(key,value); } catch(error) { /* Preferences remain usable for this page. */ } }
  lang=read('site:language',/^zh/i.test(navigator.language)?'zh-Hans':'en');
  if (!content[lang]) lang='en';
  manualPause=read('site:motion','on')==='off';
  function applyMotion() {
    var paused=manualPause||reduce.matches;
    document.documentElement.dataset.motion=paused?'off':'on';
    if (window.SHAOTING_AMBIENT) window.SHAOTING_AMBIENT.setPaused(manualPause);
    var btn=document.getElementById('motion-toggle');
    if(btn) { var label=reduce.matches?content[lang].ui.reduced:paused?content[lang].ui.resume:content[lang].ui.motion;btn.setAttribute('aria-label',label);btn.innerHTML=icon(paused?'play':'pause');btn.disabled=reduce.matches;btn.title=label; }
    if(paused) document.getAnimations().forEach(function(a){a.cancel();});
  }
  function applyRhythm() {
    document.documentElement.dataset.rhythm=rhythm;
    if(window.SHAOTING_AMBIENT && window.SHAOTING_AMBIENT.setRhythm) window.SHAOTING_AMBIENT.setRhythm(rhythm);
    var button=document.getElementById('code-blue-toggle');
    if(button){button.setAttribute('aria-pressed',String(rhythm==='vf'));button.title=rhythm==='vf'?content[lang].ui.codeBlueOff:content[lang].ui.codeBlueOn;}
    var label=document.getElementById('signal-rhythm');
    if(label)label.textContent=rhythm==='vf'?content[lang].hero.rhythmVf:content[lang].hero.rhythmNormal;
    applyTheme();
  }
  function applyTheme() {
    var light=document.documentElement.dataset.theme==='light';
    var locked=rhythm==='vf';
    var btn=document.getElementById('theme-toggle'),label=locked?(lang==='zh-Hans'?'关闭 Code blue 后可切换主题':'Exit Code blue to change the theme'):light?content[lang].ui.dark:content[lang].ui.light;
    btn.disabled=locked;btn.setAttribute('aria-label',label);btn.title=label;
    document.querySelector('meta[name="theme-color"]').content=locked?'#160407':light?'#edf3f9':'#030d1b';
  }
  function reveal() {
    if(observer) observer.disconnect();
    if(!('IntersectionObserver' in window)) return;
    observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      if(document.documentElement.dataset.motion!=='off' && entry.target.animate) entry.target.animate([{opacity:.9},{opacity:1}],{duration:200,easing:'ease-out'});
      observer.unobserve(entry.target);
    });},{threshold:.1});
    document.querySelectorAll('[data-reveal]').forEach(function(el){observer.observe(el);});
  }
  function updateNav() {
    var id='', header=document.querySelector('header').getBoundingClientRect().bottom+130;
    content[lang].nav.forEach(function(n){var el=document.getElementById(n[0]);if(el.getBoundingClientRect().top<=header) id=n[0];});
    document.querySelectorAll('[data-nav]').forEach(function(a){if(a.dataset.nav===id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }
  function alignHash() {
    var id;try{id=decodeURIComponent(location.hash.slice(1));}catch(error){return;}
    var target=id&&document.getElementById(id);if(!target)return;
    if(target.matches('details'))target.open=true;
    requestAnimationFrame(function(){target.scrollIntoView({block:'start',behavior:'auto'});updateNav();});
  }
  function hydrate() {
    document.documentElement.lang=lang;
    document.title=content[lang].meta.title;
    document.querySelectorAll('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').forEach(function(m){m.content=content[lang].meta.description;});
    document.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]').forEach(function(m){m.content=content[lang].meta.title;});
    document.documentElement.classList.add('js-ready');
    applyTheme();applyRhythm();applyMotion();reveal();updateNav();
  }
  if(lang!=='en') app.innerHTML=render(content[lang],lang);
  hydrate();
  document.addEventListener('click',async function(event){
    var language=event.target.closest('[data-language]');
    if(language) {
      var next=language.dataset.language;if(next===lang)return;
      var open=Array.from(document.querySelectorAll('details[open]')).map(function(d){return d.closest('article')?d.closest('article').id:d.id;});
      var oldSection=Array.from(document.querySelectorAll('main > section')).reverse().find(function(s){return s.getBoundingClientRect().top<innerHeight*.5;});
      var sectionId=oldSection&&oldSection.id;
      var offset=oldSection&&oldSection.getBoundingClientRect().top;
      lang=next;save('site:language',lang);app.innerHTML=render(content[lang],lang);
      open.forEach(function(id){var el=document.getElementById(id);var d=el&&(el.matches('details')?el:el.querySelector('details'));if(d)d.open=true;});
      hydrate();
      if(sectionId) {var newSection=document.getElementById(sectionId);window.scrollBy({top:newSection.getBoundingClientRect().top-offset,behavior:'instant'});}
      document.querySelector('[data-language="'+lang+'"]').focus({preventScroll:true});
      return;
    }
    if(event.target.closest('#code-blue-toggle')) {rhythm=rhythm==='nsr'?'vf':'nsr';applyRhythm();return;}
    if(event.target.closest('#theme-toggle')) {var nextTheme=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=nextTheme;save('sh-theme',nextTheme);applyTheme();return;}
    if(event.target.closest('#motion-toggle')) {manualPause=!manualPause;save('site:motion',manualPause?'off':'on');applyMotion();return;}
    if(event.target.closest('#copy-email')) {
      var btn=document.getElementById('copy-email'),status=document.getElementById('copy-status');status.textContent='';
      try {if(!navigator.clipboard||!navigator.clipboard.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(content[lang].contact.email);status.textContent=content[lang].ui.copied;btn.querySelector('span').textContent=content[lang].ui.copied;clearTimeout(copyReset);copyReset=setTimeout(function(){var current=document.querySelector('#copy-email span');if(current)current.textContent=content[lang].ui.copy;var region=document.getElementById('copy-status');if(region)region.textContent='';},2500);}catch(error){status.textContent=content[lang].ui.copyFailed;btn.querySelector('span').textContent=content[lang].ui.copyFailed;}
      return;
    }
    if(event.target.closest('.skip-link')) requestAnimationFrame(function(){document.getElementById('main-content').focus({preventScroll:true});});
  });
  var pending=false;
  window.addEventListener('scroll',function(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;updateNav();});},{passive:true});
  window.addEventListener('hashchange',alignHash);
  window.addEventListener('resize',updateNav,{passive:true});
  if(reduce.addEventListener)reduce.addEventListener('change',applyMotion);
  window.addEventListener('load',alignHash,{once:true});
  if(location.hash)alignHash();
})();
