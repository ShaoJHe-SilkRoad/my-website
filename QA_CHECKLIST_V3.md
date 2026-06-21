# QA Checklist V3 Fresh Clinical Signal

Use this checklist for each V3 implementation pass. Do not treat a visual change as accepted until the relevant checks are complete.

## 1. Preflight

- Confirm branch is `redesign-v3-fresh-clinical-signal`.
- Confirm active homepage is `index.html`.
- Confirm public homepage content remains in `CONTENT.en` and `CONTENT["zh-Hans"]`.
- Confirm active note pages are `main-quest.html` and `side-quest.html`.
- Confirm shared note styling is `notes.css`.
- Confirm legacy/prototype files remain inactive: `app.js`, `cms.html`, `content.json`, `locales/`, `site-content.js`, `site-render.js`.
- Confirm no deployment, merge, push, or CMS activation happened during the implementation pass.

Suggested commands:

```sh
git branch --show-current
git status --short
rg -n "CONTENT =|CONTENT\\.en|zh-Hans|main-quest|side-quest|cms|content.json|site-content|site-render" index.html CONTENT_GUIDE.md
```

## 2. Source Reference Check

- Target look source exists: `/Users/juliushe/Downloads/Website target look.png`.
- Fresh Clinical Signal source exists: `/Users/juliushe/Downloads/shaoting_goal_mode_and_v3_plan_cn.md`.
- Goal Mode reference exists: `/Users/juliushe/Downloads/codex_goal_mode_reference_cn.md`.
- V3 source-reference plan exists: `REDESIGN_V3_FRESH_CLINICAL_SIGNAL.md`.
- This QA checklist exists: `QA_CHECKLIST_V3.md`.
- Target image is used only as reference; it is not referenced from production HTML.

Suggested commands:

```sh
sips -g pixelWidth -g pixelHeight "/Users/juliushe/Downloads/Website target look.png"
rg -n "Fresh Clinical Signal|Signal Board|Current Focus|target look|prototype|CMS" REDESIGN_V3_FRESH_CLINICAL_SIGNAL.md QA_CHECKLIST_V3.md
rg -n "/Users/juliushe/Downloads/Website target look.png|Website target look.png" index.html main-quest.html side-quest.html notes.css
```

Expected result for the last command: no production HTML/CSS references to the Downloads target image.

## 3. Asset Reference Check

Known existing production assets:

- `portrait-side-profile-web.jpg`
- `portrait-side-profile.png`
- `og-image.png`
- `footer-logo-light.png`
- `logo-web.png`
- `logoB-web.png`
- `logo.png`
- `logoB.png`
- `favicon-32x32.png`
- `favicon-16x16.png`
- `apple-touch-icon.png`

Suggested commands:

```sh
rg -n "src=|href=.*png|href=.*jpg|og:image|twitter:image" index.html main-quest.html side-quest.html notes.css
sips -g pixelWidth -g pixelHeight portrait-side-profile-web.jpg og-image.png footer-logo-light.png logo-web.png logoB-web.png favicon-32x32.png favicon-16x16.png apple-touch-icon.png
```

Pass criteria:

- Every referenced local image exists.
- No missing favicon/touch/social preview assets.
- No external production image dependency is added without explicit approval.
- New assets, if any, have dimensions documented.

## 4. Local Preview

Start local preview:

```sh
python3 -m http.server 8000
```

Open:

- `http://localhost:8000/`
- `http://localhost:8000/main-quest.html`
- `http://localhost:8000/side-quest.html`

Pass criteria:

- Homepage loads.
- Note pages load.
- No 404s for local assets.
- No browser console errors.
- Static GitHub Pages assumptions remain valid.

## 5. Visual Target Audit

Compare against the target look image and V3 plan.

Required desktop evidence:

- First viewport has a dark navy header.
- Hero has a large serif headline.
- Hero has a real portrait or clinical visual as a major anchor.
- Hero copy is concise.
- Two primary actions are visible.
- Credential chips are visible and not crowded.
- Capability/Signal area feels scan-first, not resume-first.
- Current Focus band exists when that implementation phase is reached.
- Quote/footer treatment is controlled and not logo-heavy.

Required mobile evidence at 390px and 375px:

- No horizontal overflow.
- Header brand remains visible.
- Navigation or menu does not crowd the brand.
- Hero headline wraps cleanly.
- Actions are tappable.
- Credential chips stack or grid without overflow.
- Portrait crop remains intentional.
- Signal Board and Current Focus cards are readable.

Browser measurements:

```js
document.documentElement.scrollWidth
document.documentElement.clientWidth
document.body.scrollWidth
document.body.clientWidth
location.hash
```

Pass criteria:

- `scrollWidth <= clientWidth` for `documentElement` and `body` at 390px and 375px.
- Contact navigation sets `location.hash` to `#contact`.

## 6. Interaction Check

- Header links navigate to the intended sections.
- Contact button/link navigates to `#contact`.
- Language toggle switches English and Simplified Chinese.
- Language toggle does not break the current layout.
- Focus outlines are visible.
- Hover states are subtle and consistent.
- Reduced-motion preference disables nonessential motion.

Suggested browser checks:

```js
document.querySelector('[href="#contact"]')?.click()
location.hash
document.querySelector('[data-language="zh-Hans"]')?.click()
document.documentElement.lang
document.querySelector('[data-language="en"]')?.click()
document.documentElement.lang
```

## 7. Content Safety Check

Search for sensitive or unapproved public details before accepting any production content change.

Do not publish without explicit owner approval:

- Phone number.
- Full registration/license/private ID numbers.
- GPA.
- CPIT.
- Private address.
- Supervisor names.
- Reference names.
- Raw resume PDF.
- Raw certification artifacts.
- Unconfirmed credential wording.

Suggested searches:

```sh
rg -n -i "phone|tel:|GPA|CPIT|license|licence|registration number|127749|supervisor|reference|resume\\.pdf|\\.pdf|address" index.html main-quest.html side-quest.html
rg -n -i "GPA|CPIT|127749" .
```

Pass criteria:

- Any matches are reviewed manually.
- No full private identifiers are published.
- English and Chinese content remain fact-equivalent.

## 8. Content Density Audit

For each visible section, confirm:

- Hero: no more than one short intro paragraph.
- Credential chips: maximum 4 in hero.
- Signal Board: 3-5 keywords per group.
- Current Focus: 3 cards maximum unless explicitly approved.
- Timeline: role, organization, and one evidence line per item.
- Systems Practice: clearly secondary to nursing identity.
- Contact: email-first, concise, no private phone/address by default.

Pass criteria:

- Page reads as Fresh Clinical Signal, not a resume ledger.
- ICU, senior health, China/cross-system, language, and systems-support signals are still represented.
- Copy remains public-safe and professionally conservative.

## 9. Accessibility And Performance Check

- Semantic landmarks exist: header, main, sections, footer.
- H1 appears once.
- Heading order is logical.
- Images have appropriate `alt` text or empty alt if decorative.
- Buttons/links have accessible names.
- Tap targets are comfortable on mobile.
- Color contrast is readable.
- No layout shift from late image sizing.
- No long-running animation.
- No console errors.

Suggested browser checks:

```js
document.querySelectorAll('h1').length
Array.from(document.images).map((img) => [img.currentSrc || img.src, img.complete, img.naturalWidth, img.naturalHeight, img.alt])
```

## 10. Final Acceptance Evidence

Every V3 implementation pass should report:

- Branch name.
- Files changed.
- Whether production UI changed.
- Whether prototype/CMS files stayed inactive.
- Active homepage source.
- Active CSS/JS source location.
- Existing image assets used and dimensions if relevant.
- Desktop visual notes or screenshot path.
- Mobile visual notes or screenshot path at 390px and 375px.
- Overflow measurements.
- Contact hash result.
- Language toggle result.
- Console status.
- Sensitive-content search result.
- Remaining blockers or risks before merge/deploy.

## 11. Documentation-Only Foundation Audit

For this foundation pass, acceptance requires:

- `REDESIGN_V3_FRESH_CLINICAL_SIGNAL.md` exists.
- `QA_CHECKLIST_V3.md` exists.
- No production UI files were modified by the V3 foundation patch.
- Branch is `redesign-v3-fresh-clinical-signal`.
- Target look image and Fresh Clinical Signal plan were found and verified.
- Active source files, asset paths, note pages, bilingual content location, and preview command were verified.
