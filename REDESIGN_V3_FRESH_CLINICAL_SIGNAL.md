# Redesign V3 Fresh Clinical Signal

## Purpose

This is the implementation foundation for the next shaotinghe.com visual pass. It turns the supplied target look image and the Fresh Clinical Signal plan into an executable source-reference plan before production UI changes.

This file is a planning artifact only. Do not change production UI from this document branch.

## Source References

- Target look image: `/Users/juliushe/Downloads/Website target look.png`
  - Verified file type: PNG.
  - Verified size: 1536 x 1024.
  - Treat as a direction reference, not a literal screenshot to copy.
- Fresh Clinical Signal source plan: `/Users/juliushe/Downloads/shaoting_goal_mode_and_v3_plan_cn.md`
  - Direction: Fresh Clinical Signal.
  - Core idea: a young RN clinical signal station that is clear, smart, sharp, credible, memorable, human, and not template-like.
- Goal Mode reference: `/Users/juliushe/Downloads/codex_goal_mode_reference_cn.md`
  - Use goal-style implementation slices with outcome, context, constraints, verification, and stop conditions.
- Current repo guide: `CONTENT_GUIDE.md`.
- Current V2 plan: `REDESIGN_V2_PLAN.md`.

## Verified Repository Baseline

- Current branch: `redesign-v3-fresh-clinical-signal`.
- Active public homepage: `index.html`.
- Homepage styling, bilingual content, and rendering logic are inline in `index.html`.
- English homepage content lives in `CONTENT.en`.
- Simplified Chinese homepage content lives in `CONTENT["zh-Hans"]`.
- Active note pages: `main-quest.html` and `side-quest.html`.
- Shared note-page styling: `notes.css`.
- Local preview command: `python3 -m http.server 8000`, then open `http://localhost:8000/`.
- Static GitHub Pages assumptions stay in force: no build step, package manager, framework, server runtime, CMS, or deployment automation.
- Legacy/prototype files must remain inactive: `app.js`, `cms.html`, `content.json`, `locales/`, `site-content.js`, `site-render.js`.

## Verified Asset Baseline

Existing assets available in the repo:

- `portrait-side-profile-web.jpg`: 1200 x 800.
- `portrait-side-profile.png`: 1536 x 1024.
- `og-image.png`: 1200 x 630.
- `footer-logo-light.png`: 768 x 512.
- `logo-web.png`: 768 x 512.
- `logoB-web.png`: 768 x 512.
- `logo.png`: 1536 x 1024.
- `logoB.png`: 1536 x 1024.
- `favicon-32x32.png`: 32 x 32.
- `favicon-16x16.png`: 16 x 16.
- `apple-touch-icon.png`: 180 x 180.
- `assets/photos/README.md` lists optional photo filenames, but those photos are not currently present.

Asset implication for V3: use the existing portrait and brand assets first. Do not require new production imagery for the first implementation pass unless an explicit asset task adds it later.

## Target Look

The target image establishes a fresh clinical editorial system with stronger first-screen impact than V2:

- A dark navy rounded top bar on a pale clinical background.
- A large serif headline with short line lengths and strong rhythm.
- An asymmetric hero where the portrait is a true visual anchor, not a small profile ornament.
- A soft clinical-photo environment behind the person, with enough pale space for copy.
- Two clear primary actions below the hero copy.
- Credential chips in a single row on desktop and a compact vertical stack on mobile.
- A "What I Bring to Patient Care" capability band with icon-led columns.
- A pale blue Current Focus band with three concise cards.
- A dark quote band before a restrained multi-column footer.
- A right-side planning panel in the reference image showing the intended system: strategy, design system, responsive page design, development, content integration, QA, launch.
- Mobile reference: a device-shaped narrow layout with the same hierarchy, tighter nav, stacked chips, and content modules that feel like a modern digital card.

Do not copy the fake data in the target image literally. The target image includes examples such as full RN registration number and GPA/CPIT chips. Those are privacy or confirmation risks under `CONTENT_GUIDE.md` and must not be published without explicit owner approval.

## Design Direction

V3 direction: Fresh Clinical Signal.

The page should feel:

- Young and current, but not casual.
- Clinical and credible, but not like a resume ledger.
- Clear, sharp, and memorable, but not decorative.
- Human and personal, but not lifestyle-blog-like.
- Static-site simple, but polished enough to look intentionally designed.

Keep the RN identity as the primary story. Technical systems practice remains a supporting signal, not a competing identity.

## Palette

Target palette derived from the reference image:

- Ink navy: `#0E1B2D`.
- Deep blue: `#1F2F46`.
- Clinical blue: `#35506B`.
- Muted signal blue: `#5E7FA3`.
- Pale clinical blue: `#EAF2F8`.
- Soft white: `#F7FAFC`.

Implementation guidance:

- Use `#0E1B2D` for header, primary buttons, quote band, and high-emphasis text.
- Use `#F7FAFC` and `#EAF2F8` for the page background and Current Focus band.
- Use `#35506B` and `#5E7FA3` for borders, icons, hover states, and signal accents.
- Keep white surfaces clean and low-shadow. Avoid glassmorphism, heavy gradients, beige editorial palettes, purple-blue gradients, and dashboard-like dark slabs.
- Keep color contrast readable against pale backgrounds and the dark footer/quote band.

## Typography

Target image typography:

- Headings: Playfair Display style serif.
- Body/UI: Inter style sans serif.

Implementation options:

- Preferred V3: update the static Google Fonts link in `index.html` to Playfair Display for headings and Inter for body text.
- Acceptable fallback if font churn must be minimized: keep current Newsreader + Manrope only if the rendered result still matches the target's high-contrast serif headline and clean digital body feel.

Rules:

- Hero H1 should be large, serif, and line-broken intentionally.
- Body copy must stay concise and plain.
- Do not use negative letter spacing.
- Do not scale font size directly with viewport width beyond CSS `clamp()`.
- Use tighter UI labels for chips, buttons, nav, and cards.

## Spacing And Layout System

Use a controlled spacing scale:

- Page gutter: 24px desktop, 16px tablet, 14px mobile.
- Section vertical rhythm: 72-96px desktop, 56-72px tablet, 40-56px mobile.
- Card padding: 24px desktop, 18px tablet, 16px mobile.
- Chip gap: 18-24px desktop, 10-14px mobile.
- Max content width: about 1180-1240px.

Desktop structure:

- Header sits inside a rounded dark bar with enough top margin to show the pale page field.
- Hero uses a two-column or layered split: copy on the left, portrait/clinical visual on the right.
- Capability band uses 4 columns when width allows.
- Current Focus uses 3 cards.
- Footer uses brand, quick links, connect, and copyright columns.

Mobile structure:

- Header becomes compact and card-like.
- Hero becomes one column: brand, menu/language, headline, short intro, actions, chips, then capability modules.
- Content should feel like a young digital card, not a compressed desktop layout.

## Header Rules

- Keep the brand text visible: `Shaoting He, RN` or bilingual equivalent.
- Header height must be lower and cleaner than V2's dense fixed nav.
- Use a dark navy header on desktop.
- Nav labels should be short: Home, About, Clinical Practice, Experience, Skills, Current Study, Notes, Contact, plus language control.
- If labels overflow, shorten before reducing tap targets.
- Preserve language toggle behavior and current anchor behavior.
- Preserve `#contact` contact navigation.

## Hero Structure

Hero must answer in 3 seconds:

- Who: Shaoting He, RN.
- What: critical care nurse / RN practice.
- Why credible: critical care, senior health, cross-system practice, selected registration/training signals.
- Action: Clinical Practice and Contact.

Target hero content order:

1. Brand/header.
2. H1: a concise critical-care bedside statement.
3. Short intro paragraph, no resume dump.
4. Two actions: primary clinical-practice anchor and secondary contact anchor.
5. Credential chips.
6. Portrait/clinical visual.

Hero copy target:

- Prefer short, confident lines over long dossier summaries.
- Avoid stacking 10 facts in the hero.
- Keep Chinese and English content equivalent when implementation changes public copy.

## Portrait Treatment

- Use `portrait-side-profile-web.jpg` as the first production portrait candidate.
- If using the full source image, optimize or crop before public use.
- Portrait should be large enough to be a visual core in the hero.
- Crop should protect face, hair silhouette, upper torso, and clinical posture.
- Do not darken or blur the face.
- Avoid circular avatar treatment.
- Avoid placing the portrait in a small decorative card.
- Maintain useful `alt` text if the image conveys identity.

## Credential-Chip Rules

Credential chips should be signal objects, not a dense credential ledger.

Allowed chip types:

- `RN, NSCN` without full registration/license number.
- `Critical Care Training`.
- `BLS / ACLS`.
- `Coronary Care 1`.
- `Blood Easy`.
- `Hemodynamic Monitoring`.
- `Senior Health`.
- `Mandarin / English`.

Rules:

- 4 chips maximum in the hero.
- 3-6 words per chip where possible.
- Include a small icon or symbol treatment only if it is consistent and accessible.
- Desktop: single row or two balanced rows.
- Mobile: vertical stack or two-column mini grid with no overflow.
- Do not publish full registration numbers, GPA, CPIT, private identifiers, raw credential documents, or unconfirmed credential labels without owner approval.
- If a chip appears in English, the same fact must be represented in Chinese.

## Signal Board Rules

Replace the V2 capability ledger with a lighter Signal Board.

Signal Board groups:

- Critical Care.
- Cardiac / Rhythm.
- Senior Health.
- Cross-System.
- Communication.
- Systems Practice.

Each group:

- 3-5 keywords or short phrases.
- One concise support line maximum.
- No paragraph blocks.
- Use consistent icon, number, or line treatment.
- Use enough whitespace that the board scans in under 10 seconds.

Example structure:

- Critical Care: hemodynamics, escalation, ventilated-patient exposure, documentation.
- Cardiac / Rhythm: ECG awareness, rhythm interpretation, Coronary Care 1.
- Senior Health: dementia, dysphagia, falls, family communication.
- Cross-System: Canada/China clinical context, Mandarin review, care-plan clarity.
- Communication: SBAR, patient education, bilingual listening.
- Systems Practice: small tools, revision habits, documentation clarity.

## Current Focus Section

Add a Current Focus band after the first capability/practice signal area.

Target card count: 3.

Recommended cards:

- Clinical Practice.
- Continuing Education.
- Professional Growth.

Rules:

- Each card has a label, optional status chip, 1 short paragraph, and one small text link.
- Use pale clinical blue background for the section.
- Keep cards quiet and rectangular with modest radius.
- Avoid marketing claims, broad life-purpose copy, or job-search desperation.
- Keep current learning facts revalidated before publication.

## Timeline Treatment

V3 should transform V2's dense clinical timeline into a Motion Timeline or compact experience flow.

Order:

1. Markham Stouffville Hospital ICU.
2. Youyu County Hospital internal medicine supervised practice.
3. North York General Hospital Senior Health Centre.
4. Humber River ICU / student ICU consolidation context.
5. St. Michael's placements.
6. Technical Systems Practice as a supporting endpoint, not equal to RN practice.

Rules:

- Use year/setting markers and brief evidence lines.
- Keep role and organization readable.
- Avoid resume-like bullet walls.
- Mobile can stack as cards or a vertical rail.
- Motion is optional and must degrade cleanly under reduced motion.

## Quote And Footer Treatment

Quote band:

- Dark navy full-width band.
- One concise quote, no long manifesto.
- Attribution: `Shaoting He, RN`.
- Use serif text and centered rhythm.
- Do not use a testimonial unless it is real and approved.

Footer:

- Multi-column, restrained, and useful.
- Include brand summary, quick links, contact links, and copyright.
- Footer logo may stay as one quiet seal if it does not overpower the footer.
- Keep social/contact links verified before publication.
- No raw resume link unless explicitly approved.

## Motion Limits

Allowed:

- Subtle section reveals.
- Hover states on cards, chips, links, and buttons.
- Gentle timeline progress or rail accent.
- Reduced-motion-safe transitions under 420ms.

Not allowed:

- Parallax.
- Continuous animation loops.
- Motion that shifts layout.
- Cursor-following effects.
- Scroll-jacking.
- Animation required to read content.

Required:

- `prefers-reduced-motion: reduce` disables nonessential animation.
- No console errors.
- No visible layout shift during load.

## Asset Rules

- Keep all current favicon, touch icon, and Open Graph references valid unless every reference is updated in the same implementation pass.
- Do not reference `/Users/juliushe/Downloads/Website target look.png` from public HTML.
- Do not add third-party image dependencies for the first V3 implementation pass.
- If new production imagery is needed later, add it under the repo with clear names and dimensions, then update this plan and the QA checklist.
- Do not delete optimized derivatives unless every HTML, CSS, metadata, and social-preview reference is updated and verified.
- Optional `assets/photos/README.md` background names are not currently production-ready assets.

## Content Hierarchy

Target homepage order for V3:

1. Hero / Fresh Clinical Identity.
2. Credential signal chips.
3. What I Bring to Patient Care.
4. Current Focus.
5. Signal Board.
6. Motion Timeline / Experience Flow.
7. Education and Registration.
8. Language and Cross-Cultural Practice.
9. Technical Systems Practice as a support track.
10. Contact / quote / footer.

Content rules:

- Keep English and Chinese homepage facts in parity.
- Preserve public-safe resume facts.
- Recheck time-sensitive items before publication.
- Keep technical systems secondary.
- Do not overstate scope, registration, ICU certification, or language level.
- Use concise statements rather than resume paragraphs.

## Anti-Patterns

Do not implement V3 as:

- A raw resume archive.
- A hospital template.
- A generic personal portfolio.
- A SaaS landing page.
- A student project aesthetic.
- A wellness or coaching site.
- A dashboard of disconnected cards.
- A logo-heavy brand wall.
- A dark blue monotone page.
- A beige editorial page.
- A gamified clinical profile.
- A page that copies the target image's placeholder sensitive facts.

## Implementation Boundaries For Next Goal

Next implementation goal should start with header and hero only.

Allowed in the next implementation goal:

- `index.html` visual and content-structure changes.
- CSS and inline rendering changes inside `index.html`.
- Public-safe content edits in both `CONTENT.en` and `CONTENT["zh-Hans"]`.
- Existing asset references only, unless a new asset is explicitly added and verified.

Not allowed without separate approval:

- Editing or activating `app.js`, `cms.html`, `content.json`, `locales/`, `site-content.js`, or `site-render.js`.
- Deploying, pushing, or merging.
- Publishing sensitive credential numbers or private documents.
- Rewriting secondary pages before the hero/header pass is accepted.

## Audit Criteria

Before V3 production UI is accepted, verify:

- Static GitHub Pages compatibility remains intact.
- Active homepage is still `index.html`.
- No prototype/CMS files are activated.
- All public copy changes are bilingual where applicable.
- Header nav works on desktop, tablet, and mobile.
- Contact link sets `#contact`.
- Language toggle works and preserves layout.
- No horizontal overflow at 390px and 375px.
- Body `scrollWidth` is not greater than `clientWidth` at tested mobile widths.
- The hero first viewport is visibly closer to the target look: bigger serif headline, stronger portrait, dark header, clear chips, and lighter clinical background.
- The page is not a resume ledger.
- Existing note pages remain reachable and visually compatible.
- Favicon, touch icon, Open Graph image, portrait, and footer logo references resolve.
- Console is clean.
- `prefers-reduced-motion` behavior is safe.
- Banned-sensitive content search passes for full license numbers, GPA, CPIT, private address, supervisor/reference details, and raw credential artifact links.

## Self-Audit Of This Plan

- Target look defined: yes.
- Palette defined: yes.
- Typography defined: yes.
- Spacing defined: yes.
- Hero structure defined: yes.
- Mobile rules defined: yes.
- Portrait treatment defined: yes.
- Credential-chip rules defined: yes.
- Signal Board rules defined: yes.
- Current Focus section defined: yes.
- Quote/footer treatment defined: yes.
- Motion limits defined: yes.
- Asset rules defined: yes.
- Content hierarchy defined: yes.
- Anti-patterns defined: yes.
- Audit criteria defined: yes.
- Static GitHub Pages preserved: yes.
- Prototype/CMS files excluded: yes.
- Production UI changes made by this plan: no.
