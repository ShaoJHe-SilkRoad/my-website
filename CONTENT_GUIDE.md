# Content Guide

This site is a static GitHub Pages style website for `shaotinghe.com`.

## Active Source Of Truth

- The active public homepage is `index.html`.
- Homepage styling, bilingual content, and rendering functions are inline in `index.html`.
- English homepage content lives in `CONTENT.en`.
- Simplified Chinese homepage content lives in `CONTENT["zh-Hans"]`.
- The linked note pages are `main-quest.html` and `side-quest.html`.
- Shared note page styling lives in `notes.css`.

## Legacy Files

The following files are legacy or prototype files and are not active in the current public site:

- `app.js`
- `cms.html`
- `content.json`
- `locales/`
- `site-content.js`
- `site-render.js`

Do not update those files for normal public-site content changes unless the CMS/prototype workflow is intentionally revived.

## Safe Update Workflow

1. Edit homepage copy in `index.html` only.
2. For every homepage wording change, update both English and Simplified Chinese content in the same pass.
3. Keep repeated UI labels aligned across nav, compact nav, section headings, back-link copy, metadata, and any accent-rendering logic.
4. Edit note-page copy directly in `main-quest.html` or `side-quest.html`.
5. Preserve anchors: `#top`, `#current`, `#icu`, `#ltc`, `#contact`, and `#main-content`.
6. Preserve contact links, social links, favicon paths, and root-level image paths unless every reference is updated and verified.

## Design Direction

- Current visual direction: quiet clinical editorial with controlled depth.
- The homepage should use a strong hero composition, visible logo lockups, restrained shadows, hairline borders, cool ivory / slate / blue-black color, and small champagne accents only when they clarify hierarchy.
- Avoid flattening every surface. Depth should come from layered paper fields, intentional contrast, and integrated portrait / credential modules rather than glass effects or scattered dashboard cards.

## Brand Assets

- Keep the original high-resolution source files: `logo.png`, `logoB.png`, and `portrait-side-profile.png`.
- Active web references use optimized derivatives: `logo-web.png`, `logoB-web.png`, and `portrait-side-profile-web.jpg`.
- Favicon and touch assets are `favicon-16x16.png`, `favicon-32x32.png`, and `apple-touch-icon.png`.
- Social preview metadata uses `og-image.png`.
- Homepage metadata lives in the `<head>` of `index.html`; note-page metadata lives in `main-quest.html` and `side-quest.html`.
- Do not delete optimized derivatives unless all HTML, CSS, favicon, and Open Graph references are updated in the same pass.
- Future asset work: make hand-cropped icon/source art if the favicon needs sharper small-size recognition.
- Future asset work: create a dedicated light footer logo so the dark footer does not depend on CSS filtering of `logoB-web.png`.

## Preview And Manual Checks

Preview locally:

```sh
python3 -m http.server 8000
```

Then check:

- Homepage loads at `http://localhost:8000/`.
- Header navigation works.
- Language toggle switches English and Simplified Chinese.
- Anchors scroll to the expected sections.
- Mobile layout keeps the wordmark visible.
- `main-quest.html` and `side-quest.html` match the homepage tone.
- Favicon files load from `favicon-32x32.png` and `favicon-16x16.png`.
- Social preview metadata points to an existing `og-image.png`.
- No references point to missing assets.
- No console errors appear in the browser.

## Review Cadence

Recheck time-sensitive information before publishing:

- Current job-search wording.
- Current learning items.
- Social links.
- Email address.
- Licensure, training, language, and clinical-scope statements.
