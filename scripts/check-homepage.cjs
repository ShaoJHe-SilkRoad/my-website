// Dependency-free regression checks. Canvas observations exercise the unmodified runtime.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'ambient.js'), 'utf8');

function environment({ mobile = false, reduced = false, scroll = 0, theme = 'light' } = {}) {
  const ops = { reads: 0, paints: 0, gradients: 0, widthWrites: 0, heightWrites: 0 };
  const events = new Map(), frames = new Map(), preferenceCallbacks = [];
  let nextFrame = 0, mutation, resizeCallback, paint;
  let heroLayout = { top: 80, bottom: 940, height: 860 };
  let anchorLayout = { top: 650, bottom: 822, height: 172 };
  const listen = (name, fn) => events.set(name, [...(events.get(name) || []), fn]);
  const preference = { matches: reduced, addEventListener: (_, fn) => preferenceCallbacks.push(fn) };
  const window = {
    innerWidth: mobile ? 390 : 1440, innerHeight: mobile ? 844 : 960,
    devicePixelRatio: 1.5, scrollX: 0, scrollY: scroll,
    addEventListener: listen, matchMedia: () => preference,
    requestAnimationFrame(fn) { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); }
  };
  const rect = layout => {
    ops.reads++;
    return { ...layout, top: layout.top - window.scrollY, bottom: layout.bottom - window.scrollY };
  };
  const hero = { getBoundingClientRect: () => rect(heroLayout) };
  const anchor = { getBoundingClientRect: () => rect(anchorLayout) };
  const gradient = () => ({ addColorStop() {} });
  const context = {
    setTransform() {}, beginPath() {}, moveTo() {}, lineTo() {}, fillRect() {},
    clearRect() { ops.paints++; paint = { modes: [], arcs: [] }; },
    stroke() { paint.modes.push(this.globalCompositeOperation); },
    fill() {}, arc(...args) { paint.arcs.push(args); },
    createLinearGradient() { ops.gradients++; return gradient(); },
    createRadialGradient: gradient
  };
  let width = 300, height = 150;
  const canvas = {
    style: {}, parentElement: { style: {} }, getContext: () => context,
    get width() { return width; }, set width(value) { width = value; ops.widthWrites++; },
    get height() { return height; }, set height(value) { height = value; ops.heightWrites++; }
  };
  const html = { dataset: { theme } };
  const document = {
    hidden: false, documentElement: html, addEventListener: listen,
    getElementById: id => id === 'ambient-field' ? canvas : null,
    querySelector: selector => selector === '.hero' ? hero : selector === '.signal-annotation' ? anchor : null
  };
  vm.runInNewContext(source, {
    window, document,
    MutationObserver: class { constructor(fn) { mutation = fn; } observe() {} },
    ResizeObserver: class { constructor(fn) { resizeCallback = fn; } observe() {} disconnect() {} }
  }, { filename: 'ambient.js' });
  function fire(name, event = {}) { for (const fn of events.get(name) || []) fn(event); }
  return {
    window, document, html, ops, canvas, frames, api: window.SHAOTING_AMBIENT,
    fire, paint: () => paint,
    tick(time) { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(time)); },
    scroll(value) { window.scrollY = value; fire('scroll'); },
    reduce(value) { preference.matches = value; preferenceCallbacks.forEach(fn => fn()); },
    theme(value) { html.dataset.theme = value; mutation(); },
    layout(heroValue, anchorValue) { if (heroValue) heroLayout = heroValue; if (anchorValue) anchorLayout = anchorValue; resizeCallback(); },
    locale() { html.lang = 'zh-Hans'; mutation(); }
  };
}

function mode(env, expected, message) {
  assert(env.paint().modes.length > 0, 'A signal trace was painted');
  assert(env.paint().modes.every(value => value === expected), message);
}
function highlight(env) {
  const dot = env.paint().arcs.find(arc => arc[2] === 1.8 || arc[2] === 2.5);
  assert(dot, 'Traveling highlight was rendered');
  return Array.from(dot.slice(0, 2));
}

// The selected light theme must survive a temporary dark Code blue takeover.
for (const state of ['running', 'paused', 'reduced', 'hidden', 'offscreen']) {
  const e = environment({ reduced: state === 'reduced' });
  if (state === 'paused') e.api.setPaused(true);
  mode(e, 'source-over', `${state}: NSR starts in the selected light palette`);
  if (state === 'hidden') { e.document.hidden = true; e.fire('visibilitychange'); }
  if (state === 'offscreen') e.scroll(950);
  const inactive = state !== 'running';
  if (inactive) assert.equal(e.frames.size, 0, `${state}: no animation loop`);
  e.api.setRhythm('vf');
  assert.equal(e.api.getRhythm(), 'vf');
  if (state === 'hidden') { e.document.hidden = false; e.fire('visibilitychange'); }
  if (state === 'offscreen') e.scroll(0);
  if (e.frames.size) e.tick(0);
  mode(e, 'screen', `${state}: VF paints with the dark palette`);
  assert.equal(e.html.dataset.theme, 'light', `${state}: saved preference unchanged`);
  e.api.setRhythm('nsr');
  if (e.frames.size) e.tick(20);
  mode(e, 'source-over', `${state}: leaving VF restores the light palette`);
  if (state === 'paused') { assert.equal(e.frames.size, 0); e.api.setPaused(false); }
  if (state === 'reduced') { assert.equal(e.frames.size, 0); e.reduce(false); }
  assert.equal(e.frames.size, 1, `${state}: resumes one animation loop`);
}
const palette = environment();
palette.api.setPaused(true);
palette.api.setRhythm('vf');
palette.theme('dark'); mode(palette, 'screen', 'Theme mutation keeps VF dark');
palette.theme('light'); mode(palette, 'screen', 'Light preference cannot dim VF');
palette.api.setRhythm('nsr'); mode(palette, 'source-over', 'New preference restored on NSR');
for (const hidden of [false, true]) {
  const e = environment(); e.api.setRhythm('vf'); e.tick(0);
  if (hidden) { e.document.hidden = true; e.fire('visibilitychange'); } else e.scroll(950);
  const paints = e.ops.paints;
  e.api.setRhythm('nsr');
  assert.equal(e.ops.paints, paints, 'Switching away from VF while invisible does not paint');
  assert.equal(e.frames.size, 0);
  if (hidden) { e.document.hidden = false; e.fire('visibilitychange'); } else e.scroll(0);
  mode(e, 'source-over', 'Invisible VF exit restores the light palette on reentry');
}

const scroll = environment({ mobile: true });
scroll.api.setPaused(true);
const baseline = { ...scroll.ops }, initialDot = highlight(scroll);
for (const y of [100, 250, 510, 200, 0, 450, 800, 850, 930, 941]) scroll.scroll(y);
assert.deepEqual(scroll.ops, baseline, 'Scrolling including hero exit causes no reads, paints, gradients, or bitmap resize');
assert.equal(scroll.frames.size, 0);
scroll.scroll(0);
assert.deepEqual(highlight(scroll), initialDot, 'Reentry preserves document-anchored signal');
assert.equal(scroll.frames.size, 0, 'Reentry respects pause');
const toolbar = { ...scroll.ops };
scroll.window.innerHeight = 744; scroll.fire('resize');
for (const key of ['widthWrites', 'heightWrites', 'gradients', 'paints']) assert.equal(scroll.ops[key], toolbar[key], `Toolbar resize: ${key}`);
scroll.scroll(150);
scroll.layout({ top: 80, bottom: 990, height: 910 }, { top: 700, bottom: 872, height: 172 });
scroll.locale();
assert.equal(scroll.canvas.style.height, '990px');
assert.equal(scroll.canvas.parentElement.style.height, '990px');
assert(Math.abs(highlight(scroll)[1] - initialDot[1] - 50) < 1e-8, 'Layout and locale relayout move the signal with its document anchor');
const deep = environment({ mobile: true, scroll: 400 });
deep.api.setPaused(true);
assert.deepEqual(highlight(deep), initialDot, 'Initial deep scroll renders the same document position');

// Reentry must not advance by time spent in another tab or outside the hero.
for (const hidden of [false, true]) {
  const e = environment(); e.tick(0); e.tick(34);
  const before = highlight(e);
  if (hidden) { e.document.hidden = true; e.fire('visibilitychange'); } else e.scroll(950);
  assert.equal(e.frames.size, 0);
  if (hidden) { e.document.hidden = false; e.fire('visibilitychange'); } else e.scroll(0);
  e.tick(60000);
  assert.deepEqual(highlight(e), before, 'Hidden/offscreen time does not jump the dot');
  assert.equal(e.frames.size, 1);
}
const cadence = [];
for (const hz of [60, 90, 120, 144, 240]) {
  const e = environment(); e.tick(0); const before = e.ops.paints;
  for (let i = 1; i <= hz; i++) e.tick(i * 1000 / hz);
  cadence.push(`${hz}Hz: ${e.ops.paints - before}`);
  assert.equal(e.ops.paints - before, 60, `${hz}Hz display: 60 paints per second`);
}

// Validate renderer output in both locales without relying on a browser parser to repair it.
const contentContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'content/homepage-content.js'), 'utf8'), contentContext);
const render = require(path.join(root, 'homepage.js'));
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
for (const lang of ['en', 'zh-Hans']) {
  const html = render(contentContext.window.SHAOTING_HOME_CONTENT[lang], lang);
  const stack = [], ids = new Set(), anchors = [];
  let h1 = 0, mains = 0;
  for (const match of html.matchAll(/<\/?([a-z][\w-]*)\b([^>]*)>/gi)) {
    const tag = match[1].toLowerCase(), attrs = match[2];
    if (match[0].startsWith('</')) { assert.equal(stack.pop(), tag, `${lang}: balanced ${tag}`); continue; }
    if (tag === 'h1') h1++;
    if (tag === 'main') mains++;
    const id = attrs.match(/\bid="([^"]+)"/);
    if (id) { assert(!ids.has(id[1]), `${lang}: unique ID ${id[1]}`); ids.add(id[1]); }
    const href = attrs.match(/\bhref="#([^"]+)"/);
    if (href) anchors.push(href[1]);
    if (tag === 'img') assert(/\balt="[^"]+"/.test(attrs), `${lang}: images have alternatives`);
    if (tag === 'a') assert(!stack.includes('a'), `${lang}: no nested links`);
    if (!voidTags.has(tag) && !/\/\s*$/.test(attrs)) stack.push(tag);
  }
  assert.equal(stack.length, 0, `${lang}: closed elements`);
  assert.equal(h1, 1); assert.equal(mains, 1);
  for (const anchor of anchors) assert(ids.has(anchor), `${lang}: anchor #${anchor} resolves`);
  assert(html.includes('id="main-content" tabindex="-1"'), `${lang}: skip target can receive focus`);
  for (const id of ['theme-toggle', 'motion-toggle', 'code-blue-toggle', 'copy-email', 'copy-status']) assert(ids.has(id), `${lang}: ${id} exists`);
  assert(html.includes(`data-language="${lang}" aria-pressed="true"`), `${lang}: active language state`);
}
console.log('PASS: light/VF palette and lifecycle; scroll and relayout; deep-scroll anchoring; hidden-time exclusion; both locale renderers.');
console.log(`Simulated paints/second: ${cadence.join(', ')}. This does not measure real-device frame time.`);
