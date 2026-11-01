(function () {
  'use strict';
  // Installation shows both languages in reading order; product guides use the language switch.
  var bilingual = document.body.dataset.languageMode === 'both';
  function language(lang) {
    if (bilingual) return;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-language]').forEach(function (element) {
      element.hidden = element.dataset.language !== lang;
    });
    document.querySelectorAll('[data-set-language]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.setLanguage === lang));
    });
    var title = document.querySelector('[data-language="' + lang + '"] h1');
    // Pages for other products name themselves with data-product; AUV guides keep the default.
    var product = document.body.dataset.product || 'AUV';
    if (title) document.title = title.textContent + (title.textContent === product ? '' : ' — ' + product) + ' | Shaoting He';
    try { localStorage.setItem('site:language', lang); } catch (error) {}
  }
  document.querySelectorAll('[data-set-language]').forEach(function (button) {
    button.addEventListener('click', function () { language(button.dataset.setLanguage); });
  });
  var lang = 'en';
  try {
    lang = localStorage.getItem('site:language') === 'zh-Hans' ? 'zh-Hans' : 'en';
    document.documentElement.dataset.theme = localStorage.getItem('sh-theme') === 'light' ? 'light' : 'dark';
  } catch (error) {}
  language(lang);
  document.getElementById('guide-theme').addEventListener('click', function () {
    var theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('sh-theme', theme); } catch (error) {}
  });
})();
