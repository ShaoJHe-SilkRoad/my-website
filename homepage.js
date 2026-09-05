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
  function external(href,label,cls) { return '<a class="'+(cls||'text-link')+'" href="'+e(href)+'" target="_blank" rel="noopener noreferrer">'+e(label)+arrow()+'</a>'; }
  function heading(kicker,title,summary) { return '<div class="section-heading" data-reveal><span class="eyebrow">'+e(kicker)+'</span><h2>'+lines(title)+'</h2>'+(summary?'<p>'+e(summary)+'</p>':'')+'</div>'; }
  function render(c,lang) {
    var zh=lang==='zh-Hans';
    var nav=c.nav.map(function(n){return '<a href="#'+e(n[0])+'" data-nav="'+e(n[0])+'">'+e(n[1])+'</a>';}).join('');
    var projects=c.projects.map(function(p){
      var art=p.id==='uma' ? '<figure class="project-art uma-art"><div class="art-orbit" aria-hidden="true"></div><span class="art-label">UMA / macOS</span><a class="uma-preview" href="assets/projects/uma-public-preview.png" target="_blank" rel="noopener" aria-label="'+e(c.ui.projectPreview)+'"><img src="assets/projects/uma-public-preview.png" alt="'+e(p.caption)+'" width="740" height="1552" loading="lazy" decoding="async"></a><figcaption>'+e(p.caption)+'</figcaption></figure>' : '<figure class="project-art bid-art"><div class="digest-concept"><div class="digest-top"><span>'+e(c.digest.label)+'</span><span>'+e(c.digest.language)+'</span></div><div class="digest-wordmark">'+e(c.digest.title)+'<span>'+e(c.digest.subtitle)+'</span></div><div class="digest-rule" aria-hidden="true"></div><p class="digest-edition">'+e(c.digest.edition)+'</p><div class="digest-topics">'+c.digest.topics.map(function(t,i){return '<span><i aria-hidden="true">0'+(i+1)+'</i>'+e(t)+'</span>';}).join('')+'</div><div class="digest-bottom">'+e(c.digest.bottom)+'</div></div><figcaption>'+e(p.caption)+'</figcaption></figure>';
      return '<article class="project project--'+e(p.id)+'" id="'+e(p.id)+'" data-reveal><div class="project-copy"><div class="project-meta"><span>'+e(p.kind)+'</span><span class="status-tag"><i aria-hidden="true"></i>'+e(p.status)+'</span></div><div class="project-name"><h3>'+e(p.name)+'</h3><span>'+e(p.subtitle)+'</span></div><h4>'+e(p.headline)+'</h4><p>'+e(p.description)+'</p><ul class="tag-list" aria-label="'+e(p.name)+'">'+p.tags.map(function(t){return '<li>'+e(t)+'</li>';}).join('')+'</ul><div class="project-actions">'+(p.id==='uma'?external(p.url,p.primary,'button button--small'): '<a class="button button--small" href="'+e(p.url)+'">'+e(p.primary)+arrow()+'</a>')+(p.secondary?external(p.secondaryUrl,p.secondary):'')+'</div><details class="project-details"><summary>'+e(c.ui.more)+'<span aria-hidden="true">+</span></summary><dl><div><dt>'+e(p.whyTitle)+'</dt><dd>'+e(p.why)+'</dd></div><div><dt>'+e(p.focusTitle)+'</dt><dd>'+e(p.focus)+'</dd></div><div><dt>'+e(p.inviteTitle)+'</dt><dd>'+e(p.invite)+'</dd></div></dl></details></div>'+art+'</article>';
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
  if (typeof module !== 'undefined' && module.exports) { module.exports=render; return; }
  var content=window.SHAOTING_HOME_CONTENT;
  var app=document.getElementById('app');
  if (!content || !content.en || !content['zh-Hans'] || !app) return;
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
