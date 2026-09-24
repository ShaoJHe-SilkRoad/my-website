/* Static-first homepage. Editorial copy comes from the V6 contract on
   window.SHAOTING_HOME_CONTENT: meta, ui, hero, sections.*, footer.
   Language, theme, motion, and the Code blue signal stay in the page chrome. */
(function () {
  'use strict';
  var github = 'https://github.com/ShaoJHe-SilkRoad';
  var chrome = {
    en: {
      light: 'Switch to light theme',
      dark: 'Switch to dark theme',
      themeLocked: 'Exit Code blue to change the theme',
      motion: 'Pause background motion',
      resume: 'Resume background motion',
      reduced: 'Motion reduced by your device',
      github: 'GitHub',
      back: 'Back to top',
      copy: 'Copy email',
      copied: 'Email copied',
      copyFailed: 'Copy unavailable. Use the email link.',
      codeBlue: 'Code blue',
      codeBlueOn: 'Nurse joke: switch the waveform to V-Fib',
      codeBlueOff: 'Return the waveform to normal sinus rhythm',
      signalTitle: 'THE HUMAN SIGNAL',
      signalHint: 'Move to influence · Click to send a pulse',
      signalStill: 'Inspired by the rhythm of critical care',
      rhythmNormal: 'NSR / Sinus rhythm',
      rhythmVf: 'VF / Ventricular fibrillation',
      projectPreview: 'Open full UMA demo preview'
    },
    'zh-Hans': {
      light: '切换浅色主题',
      dark: '切换深色主题',
      themeLocked: '关闭 Code blue 后可切换主题',
      motion: '暂停背景动效',
      resume: '继续背景动效',
      reduced: '已遵循设备的减少动态效果设置',
      github: 'GitHub',
      back: '回到顶部',
      copy: '复制邮箱',
      copied: '邮箱已复制',
      copyFailed: '暂时无法复制，请使用邮件链接。',
      codeBlue: 'Code blue',
      codeBlueOn: '护理彩蛋：将波形切换为室颤',
      codeBlueOff: '将波形恢复为正常窦性心律',
      signalTitle: 'THE HUMAN SIGNAL',
      signalHint: '移动鼠标扰动波形 · 点击释放脉冲',
      signalStill: '灵感来自重症护理中的生命节律',
      rhythmNormal: 'NSR / 正常窦性心律',
      rhythmVf: 'VF / 心室颤动',
      projectPreview: '打开完整 UMA 演示预览'
    }
  };

  function e(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c];
    });
  }
  function lines(value) { return e(value).replace(/\n/g, '<br>'); }
  function arrow(kind) { return '<span aria-hidden="true">' + (kind || '↗') + '</span>'; }
  function icon(name) {
    var paths = {
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
      pause: '<path d="M9 5v14M15 5v14"/>',
      play: '<path d="m8 5 11 7-11 7Z"/>',
      copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
  }
  function list(value) { return Array.isArray(value) ? value : []; }
  function text(value) { return value == null ? '' : String(value); }
  function chromeText(lang, key) {
    var pack = chrome[lang] || chrome.en;
    return pack[key] || chrome.en[key] || '';
  }
  function uiText(c, lang, key) {
    return c.ui && c.ui[key] ? c.ui[key] : chromeText(lang, key);
  }
  function heading(kicker, title, summary) {
    return '<div class="section-heading" data-reveal><span class="eyebrow">' + e(kicker) + '</span><h2>' + lines(title) + '</h2>' + (summary ? '<p>' + e(summary) + '</p>' : '') + '</div>';
  }
  function tags(items, label) {
    var rows = list(items);
    if (!rows.length) return '';
    return '<ul class="tag-list"' + (label ? ' aria-label="' + e(label) + '"' : '') + '>' + rows.map(function (item) {
      return '<li>' + e(item) + '</li>';
    }).join('') + '</ul>';
  }
  function isExternal(href) { return /^(https?:)?\/\//.test(text(href)); }
  function anchor(href, label, cls) {
    var url = text(href);
    var mark = url.charAt(0) === '#' ? '↓' : '↗';
    var attrs = isExternal(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a class="' + (cls || 'text-link') + '" href="' + e(url) + '"' + attrs + '>' + e(label) + arrow(mark) + '</a>';
  }
  function pairs(items) {
    return list(items).map(function (item) {
      if (Array.isArray(item)) return { term: item[0], detail: item[1] };
      return { term: item && (item.title || item.term || item[0]), detail: item && (item.text || item.detail || item[1]) };
    }).filter(function (item) { return item.term || item.detail; });
  }
  function projectKey(project) {
    return text(project && (project.id || project.name || project.title)).toLowerCase();
  }
  function projectRank(project) {
    var key = projectKey(project);
    if (key === 'uma' || key.indexOf('uma') === 0) return 0;
    if (key === 'qdigest' || key === 'bid' || key.indexOf('qdigest') >= 0) return 1;
    return 2;
  }
  function projectEntries(section) {
    var items = Array.isArray(section) ? section : list(section && section.items);
    return items.map(function (project, index) { return { project: project, index: index }; }).sort(function (a, b) {
      return projectRank(a.project) - projectRank(b.project) || a.index - b.index;
    });
  }
  function projectClass(project) {
    var rank = projectRank(project);
    if (rank === 0) return 'uma';
    if (rank === 1) return 'bid';
    var id = text(project.id).toLowerCase().replace(/[^a-z0-9-]/g, '');
    return id || 'item';
  }
  function digestConcept(digest, project) {
    if (digest && (digest.title || list(digest.topics).length || digest.edition)) {
      var topics = list(digest.topics).map(function (topic, index) {
        return '<span><i aria-hidden="true">0' + (index + 1) + '</i>' + e(topic) + '</span>';
      }).join('');
      return '<div class="digest-concept"><div class="digest-top"><span>' + e(digest.label || '') + '</span><span>' + e(digest.language || '') + '</span></div><div class="digest-wordmark">' + e(digest.title || project.name || project.title) + (digest.subtitle ? '<span>' + e(digest.subtitle) + '</span>' : '') + '</div><div class="digest-rule" aria-hidden="true"></div><p class="digest-edition">' + e(digest.edition || project.caption || '') + '</p>' + (topics ? '<div class="digest-topics">' + topics + '</div>' : '') + (digest.bottom ? '<div class="digest-bottom">' + e(digest.bottom) + '</div>' : '') + '</div>';
    }
    return '<div class="digest-concept"><div class="digest-wordmark">' + e(project.name || project.title) + (project.subtitle ? '<span>' + e(project.subtitle) + '</span>' : '') + '</div><div class="digest-rule" aria-hidden="true"></div><p class="digest-edition">' + e(project.caption || project.headline || project.text || '') + '</p></div>';
  }
  function projectArt(project, lang, digest) {
    var slug = projectClass(project);
    var preview = uiText({ ui: {} }, lang, 'projectPreview');
    if (arguments.length > 1 && digest && digest.previewLabel) preview = digest.previewLabel;
    if (slug === 'uma') {
      return '<figure class="project-art uma-art"><div class="art-orbit" aria-hidden="true"></div><span class="art-label">UMA / macOS</span><a class="uma-preview" href="assets/projects/uma-public-preview.png" target="_blank" rel="noopener" aria-label="' + e(preview) + '"><img src="assets/projects/uma-public-preview.png" alt="' + e(project.caption || project.name || 'UMA') + '" width="740" height="1552" loading="lazy" decoding="async"></a><figcaption>' + e(project.caption || project.name || 'UMA') + '</figcaption></figure>';
    }
    return '<figure class="project-art bid-art">' + digestConcept(slug === 'bid' ? digest : null, project) + '<figcaption>' + e(project.caption || project.name || project.title || '') + '</figcaption></figure>';
  }
  function renderProjects(c, lang) {
    var section = c.sections && c.sections.projects;
    var work = c.sections && c.sections.work;
    var digest = c.sections && c.sections.digest;
    var entries = projectEntries(section);
    if (!entries.length && !(work && (work.title || work.intro || work.summary))) return '';
    var more = uiText(c, lang, 'more');
    var preview = uiText(c, lang, 'projectPreview');
    var cards = entries.map(function (entry) {
      var project = entry.project || {};
      var slug = projectClass(project);
      var id = text(project.id || slug);
      var primary = project.url ? anchor(project.url, project.primary || project.name || project.title, 'button button--small') : '';
      var secondary = project.secondary && project.secondaryUrl ? anchor(project.secondaryUrl, project.secondary) : '';
      var details = project.why || project.focus || project.invite
        ? '<details class="project-details"><summary>' + e(project.more || more) + '<span aria-hidden="true">+</span></summary><dl>' +
          (project.why ? '<div><dt>' + e(project.whyTitle || '') + '</dt><dd>' + e(project.why) + '</dd></div>' : '') +
          (project.focus ? '<div><dt>' + e(project.focusTitle || '') + '</dt><dd>' + e(project.focus) + '</dd></div>' : '') +
          (project.invite ? '<div><dt>' + e(project.inviteTitle || '') + '</dt><dd>' + e(project.invite) + '</dd></div>' : '') +
          '</dl></details>'
        : '';
      var artDigest = slug === 'bid' ? digest : null;
      if (artDigest) artDigest = Object.assign({ previewLabel: preview }, artDigest);
      return '<article class="project project--' + e(slug) + '" id="' + e(id) + '" data-reveal><div class="project-copy"><div class="project-meta"><span>' + e(project.kind || '') + '</span>' + (project.status ? '<span class="status-tag"><i aria-hidden="true"></i>' + e(project.status) + '</span>' : '') + '</div><div class="project-name"><h3>' + e(project.name || project.title) + '</h3>' + (project.subtitle ? '<span>' + e(project.subtitle) + '</span>' : '') + '</div>' + (project.headline ? '<h4>' + e(project.headline) + '</h4>' : '') + (project.description || project.text ? '<p>' + e(project.description || project.text) + '</p>' : '') + tags(project.tags || project.signals, project.name || project.title) + '<div class="project-actions">' + primary + secondary + '</div>' + details + '</div>' + projectArt(project, lang, artDigest || { previewLabel: preview }) + '</article>';
    }).join('');
    var head = work || (!Array.isArray(section) ? section : null);
    var intro = head ? heading(head.eyebrow, head.title, head.summary || head.intro) : '';
    var all = work && work.all ? anchor(github, work.all) : '';
    return '<section class="section work-section" id="projects"><div class="container"><div class="work-heading">' + intro + all + '</div>' + cards + '</div></section>';
  }
  function renderDigest(section, consumed) {
    if (!section || consumed) return '';
    var topics = list(section.topics).map(function (topic, index) {
      return '<span><i aria-hidden="true">0' + (index + 1) + '</i>' + e(topic) + '</span>';
    }).join('');
    return '<section class="section digest-section" id="digest"><div class="container"><div class="digest-concept"><div class="digest-top"><span>' + e(section.label || '') + '</span><span>' + e(section.language || '') + '</span></div><div class="digest-wordmark">' + e(section.title || '') + (section.subtitle ? '<span>' + e(section.subtitle) + '</span>' : '') + '</div><div class="digest-rule" aria-hidden="true"></div>' + (section.edition ? '<p class="digest-edition">' + e(section.edition) + '</p>' : '') + (topics ? '<div class="digest-topics">' + topics + '</div>' : '') + (section.bottom ? '<div class="digest-bottom">' + e(section.bottom) + '</div>' : '') + '</div></div></section>';
  }
  function renderFocus(section) {
    if (!section) return '';
    var cards = list(section.items).map(function (item, index) {
      var href = text(item.link || item.url);
      var label = text(item.label) || ('0' + (index + 1));
      var external = href && isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
      var body = '<span class="eyebrow">' + e(label) + '</span><div><h3>' + e(item.title) + '</h3><p>' + e(item.text) + '</p></div>';
      if (href) return '<a class="focus-item" href="' + e(href) + '"' + external + ' data-reveal>' + body + '<span class="focus-arrow" aria-hidden="true">↗</span></a>';
      return '<article class="focus-item" data-reveal>' + body + '</article>';
    }).join('');
    return '<section class="section focus-section" id="focus"><div class="container focus-layout"><div class="focus-intro">' + heading(section.eyebrow, section.title, section.summary || section.intro) + '</div><div class="focus-list">' + cards + '</div></div></section>';
  }
  function renderPractice(section, hero) {
    if (!section && !(hero && (hero.portraitLabel || hero.portraitText))) return '';
    var cards = list(section && section.items).map(function (item) {
      return '<article class="practice-card" data-reveal><h3>' + e(item.title) + '</h3><p>' + e(item.text) + '</p>' + tags(item.signals, item.title) + '</article>';
    }).join('');
    var portrait = '';
    if (hero && (hero.portraitLabel || hero.portraitText)) {
      portrait = '<figure class="portrait" data-reveal><div class="portrait-frame"><img src="portrait-side-profile-web.jpg" alt="' + e(hero.portraitLabel || 'Shaoting He') + '" width="1600" height="1200" loading="lazy" decoding="async"></div><figcaption>' + e(hero.portraitLabel || '') + (hero.portraitText ? '<span>' + e(hero.portraitText) + '</span>' : '') + '</figcaption></figure>';
    }
    return '<section class="section practice-section" id="practice"><div class="container">' + (section ? heading(section.eyebrow, section.title, section.summary) : '') + '<div class="practice-layout">' + portrait + '<div class="practice-grid">' + cards + '</div></div></div></section>';
  }
  function evidenceCard(item) {
    return '<article class="evidence-card" data-reveal><span class="eyebrow">' + e(item.kicker || '') + '</span><h3>' + e(item.title) + '</h3><p>' + e(item.text) + '</p>' + tags(item.signals, item.title) + '</article>';
  }
  function renderTimeline(section) {
    if (!section) return '';
    var asideItems = list(section.asideList).map(function (item) { return '<li>' + e(item) + '</li>'; }).join('');
    var aside = section.aside || asideItems
      ? '<aside class="timeline-aside">' + (section.aside ? '<p>' + e(section.aside) + '</p>' : '') + (asideItems ? '<ul>' + asideItems + '</ul>' : '') + '</aside>'
      : '';
    var folded = list(section.items).length
      ? '<details class="fold"><summary>' + e(section.disclosureTitle || section.title) + '<span aria-hidden="true">+</span></summary><div class="fold-body"><p class="fold-hint">' + e(section.disclosureSummary || '') + '</p><div class="evidence-grid">' + list(section.items).map(evidenceCard).join('') + '</div></div></details>'
      : '';
    return '<section class="section timeline-section" id="timeline"><div class="container">' + heading(section.eyebrow, section.title, section.summary) + '<div class="timeline-layout"><div class="evidence-grid">' + list(section.evidence).map(evidenceCard).join('') + '</div>' + aside + '</div>' + folded + '</div></section>';
  }
  function renderCapability(section) {
    if (!section) return '';
    var groups = list(section.groups).map(function (group) {
      return '<article class="capability-group"><h3>' + e(group.title) + '</h3><ul>' + list(group.items).map(function (item) { return '<li>' + e(item) + '</li>'; }).join('') + '</ul>' + (group.note ? '<p>' + e(group.note) + '</p>' : '') + '</article>';
    }).join('');
    return '<section class="section fold-section" id="capability"><div class="container">' + heading(section.eyebrow, section.title, section.summary) + '<details class="fold"><summary>' + e(section.disclosureTitle || section.title) + '<span aria-hidden="true">+</span></summary><div class="fold-body"><p class="fold-hint">' + e(section.disclosureSummary || '') + '</p><div class="capability-groups">' + groups + '</div></div></details></div></section>';
  }
  function renderPairs(section, id) {
    if (!section) return '';
    var rows = pairs(section.items).map(function (item) {
      return '<div><dt>' + e(item.term) + '</dt><dd>' + e(item.detail) + '</dd></div>';
    }).join('');
    return '<section class="section fold-section" id="' + e(id) + '"><div class="container">' + heading(section.eyebrow, section.title, section.summary) + '<details class="fold"><summary>' + e(section.disclosureTitle || section.title) + '<span aria-hidden="true">+</span></summary><div class="fold-body"><p class="fold-hint">' + e(section.disclosureSummary || '') + '</p><dl class="pair-list">' + rows + '</dl></div></details></div></section>';
  }
  function renderSystems(section) {
    if (!section) return '';
    var links = list(section.links).map(function (link) {
      var href = Array.isArray(link) ? link[0] : link.href || link.url;
      var label = Array.isArray(link) ? link[1] : link.label || link.title;
      var detail = Array.isArray(link) ? link[2] : link.text || link.detail;
      return '<a class="systems-link" href="' + e(href) + '"><strong>' + e(label) + '</strong><span>' + e(detail || '') + '</span></a>';
    }).join('');
    var feature = section.feature ? '<div class="systems-feature"><h3>' + e(section.featureTitle || '') + '</h3><p>' + e(section.feature) + '</p></div>' : '';
    return '<section class="section fold-section" id="systems"><div class="container">' + heading(section.eyebrow, section.title, section.summary) + '<details class="fold"><summary>' + e(section.disclosureTitle || section.title) + '<span aria-hidden="true">+</span></summary><div class="fold-body"><p class="fold-hint">' + e(section.disclosureSummary || '') + '</p>' + feature + '<div class="systems-links">' + links + '</div></div></details></div></section>';
  }
  function renderAbout(section) {
    if (!section) return '';
    var facts = list(section.facts).map(function (fact) { return '<li>' + e(fact) + '</li>'; }).join('');
    var details = section.clinical
      ? '<details class="clinical-details"><summary>' + e(section.detail || '') + '<span aria-hidden="true">+</span></summary><p>' + e(section.clinical) + '</p></details>'
      : '';
    return '<section class="section about-section" id="about"><div class="container about-layout"><figure class="portrait" data-reveal><div class="portrait-frame"><img src="portrait-side-profile-web.jpg" alt="' + e(section.caption || 'Shaoting He') + '" width="1600" height="1200" loading="lazy" decoding="async"></div><figcaption>' + e(section.caption || '') + '</figcaption></figure><div class="about-copy">' + heading(section.eyebrow, section.title, section.summary) + (section.intro ? '<p class="about-intro">' + e(section.intro) + '</p>' : '') + (section.body ? '<p>' + e(section.body) + '</p>' : '') + (section.end ? '<p>' + e(section.end) + '</p>' : '') + (facts ? '<ul class="about-facts">' + facts + '</ul>' : '') + details + '</div></div></section>';
  }
  function renderContact(section, c, lang) {
    if (!section) return '';
    var email = text(section.email);
    var mailto = 'mailto:' + email;
    var paths = list(section.paths);
    var panel = paths.length
      ? '<div class="contact-paths">' + paths.map(function (path) {
        var href = mailto + (path.subject ? '?subject=' + encodeURIComponent(path.subject) : '');
        return '<article class="contact-path" data-reveal><span class="eyebrow">' + e(path.number || '') + '</span><h3>' + e(path.title) + '</h3><p>' + e(path.text) + '</p><a href="' + e(href) + '">' + e(path.label || '') + arrow() + '</a></article>';
      }).join('') + '</div>'
      : '<div class="contact-panel" data-reveal>' +
        (section.location ? '<p class="contact-location">' + e(section.location) + '</p>' : '') +
        (section.text ? '<p>' + e(section.text) + '</p>' : '') +
        (section.ctaLabel ? '<a class="button" href="' + e(mailto) + '">' + e(section.ctaLabel) + arrow() + '</a>' : '') +
        '</div>';
    return '<section class="section contact-section" id="contact"><div class="container">' + heading(section.eyebrow, section.title, section.summary || section.intro) +
      panel + '<div class="email-row"><a class="email-link" href="' + e(mailto) + '">' + e(email) + arrow() + '</a><button class="copy-button js-only" id="copy-email" type="button">' + icon('copy') + '<span>' + e(uiText(c, lang, 'copy')) + '</span></button></div><p class="contact-footnote">' + e(section.footer || section.note || '') + '</p><p class="sr-only" id="copy-status" role="status" aria-live="polite"></p></div></section>';
  }

  function render(c, lang) {
    var zh = lang === 'zh-Hans';
    var ui = c.ui || {};
    var hero = c.hero || {};
    var meta = c.meta || {};
    var footer = c.footer || {};
    var sections = c.sections || {};
    var navItems = list(ui.nav);
    var nav = navItems.map(function (item) {
      return '<a href="#' + e(item[0]) + '" data-nav="' + e(item[0]) + '">' + e(item[1]) + '</a>';
    }).join('');
    var title = text(hero.title || hero.line1);
    var tail = text(hero.titleTail || (!hero.title && hero.line2 ? hero.line2 : ''));
    var actions = list(hero.actions);
    var primary = actions[0] ? anchor(actions[0][0], actions[0][1], 'button') : (hero.primary ? anchor('#projects', hero.primary, 'button') : '');
    var secondary = actions[1] ? anchor(actions[1][0], actions[1][1], 'hero-secondary') : (hero.secondary ? anchor(github, hero.secondary, 'hero-github') : '');
    var identitySource = list(hero.identity).length ? hero.identity : hero.credentials;
    var identity = list(identitySource).map(function (item) {
      if (Array.isArray(item)) return '<li><span>' + e(item[0]) + '</span>' + (item[1] ? e(item[1]) : '') + '</li>';
      if (item && typeof item === 'object') return '<li><span>' + e(item.title || item.term || '') + '</span>' + e(item.text || item.detail || '') + '</li>';
      return '<li>' + e(item) + '</li>';
    }).join('');
    var role = text(meta.role || '');
    var now = hero.current || hero.currentProjects
      ? '<a href="#focus" class="now-link"><span class="eyebrow">' + e(hero.current || '') + '</span>' + e(hero.currentProjects || '') + '<span aria-hidden="true">↘</span></a>'
      : '';
    var footerLead = footer.text || footer.identity || '';
    var footerNote = footer.note && footer.note !== footerLead ? footer.note : '';
    var digestConsumed = projectEntries(sections.projects).some(function (entry) { return projectRank(entry.project) === 1; });
    return '<a class="skip-link" href="#main-content">' + e(ui.skip || 'Skip to content') + '</a>' +
      '<header class="site-header"><div class="container header-row"><a class="brand" href="#top" aria-label="' + e(meta.siteName || 'Shaoting He') + '"><span class="brand-mark brand-mark--heritage" aria-hidden="true"></span><span class="brand-name">SHAOTING HE' + (role ? '<span>' + e(role) + '</span>' : '') + '</span></a><nav class="desktop-nav" aria-label="' + e(ui.navLabel || ui.menu || 'Primary') + '">' + nav + '</nav><div class="header-tools">' + anchor(github, uiText(c, lang, 'github'), 'github-header') + '<button class="code-blue js-only" id="code-blue-toggle" type="button" aria-pressed="false" title="' + e(uiText(c, lang, 'codeBlueOn')) + '"><span class="code-blue-dot" aria-hidden="true"></span>' + e(uiText(c, lang, 'codeBlue')) + '</button><button class="icon-button js-only" id="motion-toggle" type="button" aria-label="' + e(uiText(c, lang, 'motion')) + '" title="' + e(uiText(c, lang, 'motion')) + '">' + icon('pause') + '</button><button class="icon-button js-only" id="theme-toggle" type="button" aria-label="' + e(uiText(c, lang, 'light')) + '" title="' + e(uiText(c, lang, 'light')) + '">' + icon('sun') + '</button><div class="language-control js-only" role="group" aria-label="' + e(ui.language || 'Language') + '"><button type="button" data-language="en" aria-pressed="' + (!zh) + '">EN</button><button type="button" data-language="zh-Hans" aria-pressed="' + zh + '">中</button></div></div></div></header>' +
      '<main id="main-content" tabindex="-1"><section class="hero container" id="top"><div class="hero-copy"><div class="eyebrow hero-eyebrow"><span class="signal-dot" aria-hidden="true"></span>' + e(hero.eyebrow) + '</div><h1><span>' + e(title) + '</span>' + (tail ? '<span class="gradient-text">' + e(tail) + '</span>' : '') + '</h1>' + (hero.role || hero.statement ? '<p class="hero-statement">' + lines(hero.role || hero.statement) + '</p>' : '') + (hero.intro ? '<p class="hero-intro">' + e(hero.intro) + '</p>' : '') + '<div class="hero-actions">' + primary + secondary + '</div>' + (identity ? '<ul class="hero-credentials">' + identity + '</ul>' : '') + '</div><div class="signal-annotation"><span class="signal-index">01 / ' + e(hero.signalTitle || chromeText(lang, 'signalTitle')) + '</span><span class="signal-name" id="signal-rhythm" aria-live="polite">' + e(hero.rhythmNormal || chromeText(lang, 'rhythmNormal')) + '</span><span class="signal-hint">' + e(hero.signalHint || chromeText(lang, 'signalHint')) + '</span><span class="signal-still">' + e(hero.signalStill || chromeText(lang, 'signalStill')) + '</span></div><div class="hero-foot"><p>' + e(hero.portraitText || hero.note || '') + '</p>' + now + '</div></section>' +
      renderProjects(c, lang) +
      renderDigest(sections.digest, digestConsumed) +
      renderFocus(sections.focus) +
      renderAbout(sections.about) +
      renderPractice(sections.practice, hero) +
      renderTimeline(sections.timeline) +
      renderCapability(sections.capability) +
      renderPairs(sections.education, 'education') +
      renderPairs(sections.language, 'language') +
      renderSystems(sections.systems) +
      renderContact(sections.contact, c, lang) +
      '</main>' +
      '<footer class="site-footer"><div class="container footer-row"><div class="footer-identity"><span class="brand-mark brand-mark--heritage" aria-hidden="true"></span><div><p>' + e(footerLead) + '</p>' + (footerNote ? '<p>' + e(footerNote) + '</p>' : '') + '<span>' + e(footer.copyright || '') + '</span></div></div><div class="footer-links">' + anchor(github, uiText(c, lang, 'github')) + '<a href="#top">' + e(uiText(c, lang, 'back')) + ' ↑</a></div></div></footer>' +
      '<nav class="mobile-nav" aria-label="' + e(ui.navLabel || ui.menu || 'Primary') + '">' + nav + '</nav>';
  }

  if (typeof module !== 'undefined' && module.exports) { module.exports = render; return; }

  var content = window.SHAOTING_HOME_CONTENT;
  var app = document.getElementById('app');
  if (!content || !content.en || !content['zh-Hans'] || !app) return;
  var lang = 'en', manualPause = false, rhythm = 'nsr', observer = null, copyReset = null;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function read(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (error) { return fallback; } }
  function save(key, value) { try { localStorage.setItem(key, value); } catch (error) { /* Preferences remain usable for this page. */ } }
  function active() { return content[lang]; }
  function label(key) { return uiText(active(), lang, key); }
  function navItems() { return list(active().ui && active().ui.nav); }
  function contactEmail() {
    var section = active().sections && active().sections.contact;
    return section && section.email || '';
  }
  lang = read('site:language', /^zh/i.test(navigator.language) ? 'zh-Hans' : 'en');
  if (!content[lang]) lang = 'en';
  manualPause = read('site:motion', 'on') === 'off';
  function applyMotion() {
    var paused = manualPause || reduce.matches;
    document.documentElement.dataset.motion = paused ? 'off' : 'on';
    if (window.SHAOTING_AMBIENT) window.SHAOTING_AMBIENT.setPaused(manualPause);
    var btn = document.getElementById('motion-toggle');
    if (btn) {
      var name = reduce.matches ? label('reduced') : paused ? label('resume') : label('motion');
      btn.setAttribute('aria-label', name);
      btn.innerHTML = icon(paused ? 'play' : 'pause');
      btn.disabled = reduce.matches;
      btn.title = name;
    }
    if (paused) document.getAnimations().forEach(function (item) { item.cancel(); });
  }
  function applyRhythm() {
    document.documentElement.dataset.rhythm = rhythm;
    if (window.SHAOTING_AMBIENT && window.SHAOTING_AMBIENT.setRhythm) window.SHAOTING_AMBIENT.setRhythm(rhythm);
    var button = document.getElementById('code-blue-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(rhythm === 'vf'));
      button.title = rhythm === 'vf' ? label('codeBlueOff') : label('codeBlueOn');
    }
    var rhythmLabel = document.getElementById('signal-rhythm');
    var hero = active().hero || {};
    if (rhythmLabel) rhythmLabel.textContent = rhythm === 'vf' ? (hero.rhythmVf || label('rhythmVf')) : (hero.rhythmNormal || label('rhythmNormal'));
    applyTheme();
  }
  function applyTheme() {
    var light = document.documentElement.dataset.theme === 'light';
    var locked = rhythm === 'vf';
    var btn = document.getElementById('theme-toggle');
    var name = locked ? label('themeLocked') : light ? label('dark') : label('light');
    if (btn) {
      btn.disabled = locked;
      btn.setAttribute('aria-label', name);
      btn.title = name;
    }
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = locked ? '#160407' : light ? '#edf3f9' : '#030d1b';
  }
  function reveal() {
    if (observer) observer.disconnect();
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (document.documentElement.dataset.motion !== 'off' && entry.target.animate) entry.target.animate([{ opacity: .9 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
        observer.unobserve(entry.target);
      });
    }, { threshold: .1 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { observer.observe(el); });
  }
  function updateNav() {
    var id = '';
    var header = document.querySelector('header');
    var line = header ? header.getBoundingClientRect().bottom + 130 : 130;
    navItems().forEach(function (item) {
      var el = document.getElementById(item[0]);
      if (el && el.getBoundingClientRect().top <= line) id = item[0];
    });
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.dataset.nav === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function alignHash() {
    var id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { return; }
    var target = id && document.getElementById(id);
    if (!target) return;
    var details = target.matches('details') ? target : target.querySelector('details');
    if (details) details.open = true;
    requestAnimationFrame(function () { target.scrollIntoView({ block: 'start', behavior: 'auto' }); updateNav(); });
  }
  function hydrate() {
    var page = active();
    document.documentElement.lang = lang;
    document.title = page.meta.title;
    var description = page.meta.description || '';
    var social = page.meta.ogDescription || description;
    document.querySelectorAll('meta[name="description"]').forEach(function (node) { node.content = description; });
    document.querySelectorAll('meta[property="og:description"],meta[name="twitter:description"]').forEach(function (node) { node.content = social; });
    document.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]').forEach(function (node) { node.content = page.meta.title; });
    if (page.meta.siteName) document.querySelectorAll('meta[property="og:site_name"]').forEach(function (node) { node.content = page.meta.siteName; });
    document.documentElement.classList.add('js-ready');
    applyTheme();
    applyRhythm();
    applyMotion();
    reveal();
    updateNav();
  }
  if (lang !== 'en') app.innerHTML = render(content[lang], lang);
  hydrate();
  document.addEventListener('click', async function (event) {
    var language = event.target.closest('[data-language]');
    if (language) {
      var next = language.dataset.language;
      if (next === lang || !content[next]) return;
      var open = Array.from(document.querySelectorAll('details[open]')).map(function (details) {
        return details.id || (details.closest('section') && details.closest('section').id) || '';
      });
      var oldSection = Array.from(document.querySelectorAll('main > section')).reverse().find(function (section) {
        return section.getBoundingClientRect().top < innerHeight * .5;
      });
      var sectionId = oldSection && oldSection.id;
      var offset = oldSection && oldSection.getBoundingClientRect().top;
      lang = next;
      save('site:language', lang);
      app.innerHTML = render(content[lang], lang);
      open.forEach(function (id) {
        var el = id && document.getElementById(id);
        var details = el && (el.matches('details') ? el : el.querySelector('details'));
        if (details) details.open = true;
      });
      hydrate();
      if (sectionId) {
        var nextSection = document.getElementById(sectionId);
        if (nextSection) window.scrollBy({ top: nextSection.getBoundingClientRect().top - offset, behavior: 'instant' });
      }
      var pressed = document.querySelector('[data-language="' + lang + '"]');
      if (pressed) pressed.focus({ preventScroll: true });
      return;
    }
    if (event.target.closest('#code-blue-toggle')) { rhythm = rhythm === 'nsr' ? 'vf' : 'nsr'; applyRhythm(); return; }
    if (event.target.closest('#theme-toggle')) {
      var nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = nextTheme;
      save('sh-theme', nextTheme);
      applyTheme();
      return;
    }
    if (event.target.closest('#motion-toggle')) { manualPause = !manualPause; save('site:motion', manualPause ? 'off' : 'on'); applyMotion(); return; }
    if (event.target.closest('#copy-email')) {
      var btn = document.getElementById('copy-email');
      var status = document.getElementById('copy-status');
      status.textContent = '';
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(contactEmail());
        status.textContent = label('copied');
        btn.querySelector('span').textContent = label('copied');
        clearTimeout(copyReset);
        copyReset = setTimeout(function () {
          var current = document.querySelector('#copy-email span');
          if (current) current.textContent = label('copy');
          var region = document.getElementById('copy-status');
          if (region) region.textContent = '';
        }, 2500);
      } catch (error) {
        status.textContent = label('copyFailed');
        btn.querySelector('span').textContent = label('copyFailed');
      }
      return;
    }
    if (event.target.closest('.skip-link')) requestAnimationFrame(function () { document.getElementById('main-content').focus({ preventScroll: true }); });
  });
  var pending = false;
  window.addEventListener('scroll', function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; updateNav(); });
  }, { passive: true });
  window.addEventListener('hashchange', alignHash);
  window.addEventListener('resize', updateNav, { passive: true });
  if (reduce.addEventListener) reduce.addEventListener('change', applyMotion);
  window.addEventListener('load', alignHash, { once: true });
  if (location.hash) alignHash();
})();
