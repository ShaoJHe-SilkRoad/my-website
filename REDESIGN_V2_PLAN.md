# Redesign V2 Plan

## Direction

V2 is a Clinical Dossier / Quiet Editorial Portfolio for `shaotinghe.com`.

The site should feel clinical, editorial, professional, calm, structured, and memorable. It should not read as a raw resume, dashboard, SaaS landing page, gamified profile, wellness template, or generic portfolio.

No framework, package manager, build step, CMS activation, deployment, or push is part of this branch before audit approval.

## Information Architecture

Active homepage sections:

1. Hero / Clinical Identity
2. Practice Domains
3. Clinical Timeline
4. Clinical Capability Index
5. Education & Registration
6. Language & Cross-Cultural Practice
7. Technical / Systems Practice
8. Contact

Secondary pages keep stable filenames for existing links:

- `main-quest.html` with visible title `Professional Direction`
- `side-quest.html` with visible title `Technical Systems Practice`

## Resume-Derived Content Map

Public-safe facts integrated in V2:

- Shaoting He, RN.
- Registered Nurse, NSCN.
- Clinical positioning: critical care judgment, senior-health continuity, and practical clinical systems across Canadian and Chinese clinical environments.
- Critical care training and context: ICU-trained / ICU-certified practice context, Coronary Care 1, BLS / ACLS, Blood Easy transfusion, hemodynamic monitoring, rhythm interpretation, rapid escalation, and clinical documentation.
- Practice domains: critical care, senior health, cross-system practice.
- Timeline evidence: Markham Stouffville Hospital 3WG Intensive Care Unit; Youyu County Hospital of Chinese Medicine 3F Internal Medicine supervised practice; Markham Stouffville Hospital Surgical / Short Stay clinical externship; North York General Hospital Senior Health Centre; Humber River Hospital 6E Intensive Care Unit; St. Michael's Hospital Fracture Clinic and General Medicine placements.
- Capability index: critical care monitoring; cardiac rhythm / ECG documentation; hemodynamic support; ventilation / airway support; CVAD / rapid infusion / hemodialysis exposure; senior-health communication; chronic disease care; infection control and safety; documentation and escalation.
- Education and training: Bachelor of Science in Nursing, minor in Psychology, Toronto Metropolitan University collaborative nursing program, graduated with Distinction; Centennial College Intensive Care Training Program; Coronary Care 1; Conestoga College NURS8963 Transition to Nursing Practice, ongoing; CIHI InterRAI LTCF Essentials 1 & 2.
- Languages: English professional proficiency, Mandarin mother tongue, French A2 active learning, Spanish A1 leisure learning.

## Sensitive Facts Not To Publish

Do not publish without explicit owner approval:

- Phone number.
- Full registration, license, or private identification numbers.
- Raw resume PDF or raw certification artifacts.
- GPA, CPIT, or credential wording whose exact public-safe naming has not been confirmed.
- Private address, supervisor, reference, internal employment, or personal identity details.

## Content Rules

- Preserve English / Simplified Chinese parity in `index.html`.
- Public homepage content lives in `CONTENT.en` and `CONTENT["zh-Hans"]`.
- Note-page copy lives directly in `main-quest.html` and `side-quest.html`.
- Legacy prototype files remain inactive: `app.js`, `cms.html`, `content.json`, `locales/`, `site-content.js`, and `site-render.js`.
- Logo usage stays restrained: text-first header identity, favicon / social assets in metadata, and one footer seal.

## Audit Criteria

- Static GitHub Pages compatibility remains intact.
- No framework, build system, package manager, CMS, or external service is introduced.
- Sticky header remains visible after scroll and anchor navigation.
- Contact navigation sets `#contact` and the active state correctly.
- Language toggle preserves content parity and anchor behavior.
- Desktop, tablet, and mobile layouts have no horizontal overflow.
- Note pages remain readable on mobile.
- No public-facing casual or gamified tone remains.
- No missing image, favicon, touch icon, or social-preview asset references.
- No console errors appear in browser preview.
- No deploy or push occurs until the V2 branch passes external audit.
