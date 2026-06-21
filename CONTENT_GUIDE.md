# Content Guide

This site is a static GitHub Pages style website for `shaotinghe.com`.

## Active Source Of Truth

- The active public homepage is `index.html`.
- Homepage styling, bilingual content, and rendering functions are inline in `index.html`.
- English homepage content lives in `CONTENT.en`.
- Simplified Chinese homepage content lives in `CONTENT["zh-Hans"]`.
- The linked note pages are `main-quest.html` and `side-quest.html`.
- Shared note page styling lives in `notes.css`.
- Current V3 homepage sections are:
  - `#top` Hero / Clinical Identity
  - `#practice` Practice Domains
  - `#timeline` Clinical Timeline
  - `#capability` Clinical Capability Index
  - `#education` Education & Registration
  - `#language` Language & Cross-Cultural Practice
  - `#systems` Technical / Systems Practice
  - `#contact` Contact

## Public-Safe Content Map

The V3 site uses public-safe professional facts only. It is a clinical dossier, not a raw resume archive.

Public-safe facts currently integrated:

- Identity: Shaoting He, RN; Registered Nurse, NSCN; critical care, senior health, and cross-system practice.
- Clinical positioning: critical care judgment, senior-health continuity, and practical clinical systems across Canadian and Chinese clinical environments.
- Critical care training and capabilities: ICU-trained / ICU-certified practice context, Coronary Care 1, BLS / ACLS, Blood Easy transfusion, hemodynamic monitoring, rhythm interpretation, rapid escalation, and clinical documentation.
- Practice domains: critical care, senior health, and cross-system practice.
- Timeline entries: Markham Stouffville Hospital 3WG Intensive Care Unit; Youyu County Hospital of Chinese Medicine 3F Internal Medicine supervised practice; Markham Stouffville Hospital Surgical / Short Stay clinical externship; North York General Hospital Senior Health Centre; Humber River Hospital 6E Intensive Care Unit; St. Michael's Hospital Fracture Clinic and General Medicine placements.
- Education and training: Bachelor of Science in Nursing, minor in Psychology, Toronto Metropolitan University collaborative nursing program, graduated with Distinction; Centennial College Intensive Care Training Program; Coronary Care 1; Conestoga College NURS8963 Transition to Nursing Practice, ongoing; CIHI InterRAI LTCF Essentials 1 & 2.
- Languages: English professional proficiency, Mandarin mother tongue, French A2 active learning, Spanish A1 leisure learning.

Owner approval required before publication:

- Phone number.
- Full registration, license, or private identification numbers.
- Raw resume PDF or raw certification artifacts.
- GPA, CPIT, or any credential wording whose exact public-safe naming has not been confirmed.
- Any private address, supervisor, reference, or internal employment detail.

Section content locations:

- Hero / Clinical Identity: `CONTENT.en.hero` and `CONTENT["zh-Hans"].hero`.
- Practice Domains: `CONTENT.en.sections.practice` and `CONTENT["zh-Hans"].sections.practice`.
- Clinical Timeline: `CONTENT.en.sections.timeline` and `CONTENT["zh-Hans"].sections.timeline`.
- Clinical Capability Index: `CONTENT.en.sections.capability` and `CONTENT["zh-Hans"].sections.capability`.
- Education & Registration: `CONTENT.en.sections.education` and `CONTENT["zh-Hans"].sections.education`.
- Language & Cross-Cultural Practice: `CONTENT.en.sections.language` and `CONTENT["zh-Hans"].sections.language`.
- Technical / Systems Practice: `CONTENT.en.sections.systems` and `CONTENT["zh-Hans"].sections.systems`.
- Contact: `CONTENT.en.sections.contact` and `CONTENT["zh-Hans"].sections.contact`.

English / Simplified Chinese parity rules:

- Every public-facing homepage fact must exist in both language objects in the same edit.
- Do not add a credential, employer, clinical capability, or privacy qualifier to one language only.
- Keep secondary-page visible titles professional: `Professional Direction` and `Technical Systems Practice`.
- Keep note-page filenames stable for existing links, even though the visible labels are professional.
- If a fact is too sensitive to publish in English, it is also too sensitive to publish in Chinese.

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
5. Preserve active V2 anchors: `#top`, `#practice`, `#timeline`, `#capability`, `#education`, `#language`, `#systems`, `#contact`, and `#main-content`.
6. Preserve contact links, social links, favicon paths, and root-level image paths unless every reference is updated and verified.

## Design Direction

- Current visual direction: Fresh Clinical Signal with controlled clinical depth.
- The homepage should feel authored, clinical, young, and editorial rather than like a resume dashboard.
- Logo usage is intentionally reduced: text identity in the header, favicon / social assets in metadata, and one quiet footer seal.
- Avoid decorative repeated logos, gamified labels, glass effects, and scattered dashboard cards.

## Brand Assets

- Keep the original high-resolution source files: `logo.png`, `logoB.png`, and `portrait-side-profile.png`.
- Active web references use optimized derivatives where needed, especially `portrait-side-profile-web.jpg` and `footer-logo-light.png`.
- `logo-web.png` and `logoB-web.png` remain available brand assets but are not required in the V3 header or hero.
- Favicon and touch assets are `favicon-16x16.png`, `favicon-32x32.png`, and `apple-touch-icon.png`.
- Social preview metadata uses `og-image.png`.
- Homepage metadata lives in the `<head>` of `index.html`; note-page metadata lives in `main-quest.html` and `side-quest.html`.
- Do not delete optimized derivatives unless all HTML, CSS, favicon, and Open Graph references are updated in the same pass.
- Future asset work: make hand-cropped icon/source art if the favicon needs sharper small-size recognition.

## Preview And Manual Checks

Preview locally:

```sh
python3 -m http.server 8000
```

Then check:

- Homepage loads at `http://localhost:8000/`.
- Header navigation works.
- Language toggle switches English and Simplified Chinese.
- Anchors scroll to the expected V2 sections.
- Contact navigation sets `#contact` and keeps the fixed header usable.
- Mobile layout keeps the wordmark visible and the nav horizontally usable.
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
