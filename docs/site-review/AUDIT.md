# Site audit: aodareport.ca (AODA Report Desk)

Audited October 20, 2026, from the source in `ventures/aoda-2026/site/` and the preview build in `dist/` (home, guide, terms, privacy, accessibility, robots.txt, sitemap.xml, `sample/*`). Scores are out of 10 and judge the site against its job: turning an Ontario HR or operations manager, executive director or owner into a snapshot request, a fit call or an order before December 5, 2026.

## Scorecard

| Area | Score | One-line verdict |
| --- | ---: | --- |
| Conversion | 4 | One lead path (a mailto link) that fails silently for webmail users; no form, no lower-commitment option |
| Messaging and clarity | 7 | Specific, honest, benefit-led H1; weak on "is this for me?" and inconsistent terms (signer / certifier / senior officer) |
| Information architecture and navigation | 3 | No navigation on any page; inner pages are dead ends with a back link |
| Visual design | 3 | Reads as a draft document; no hierarchy, no visual anchors, no B2B credibility cues |
| Trust and proof | 6 | Honest disclaimers, guarantee, sample package and price comparison, but buried and unstyled; no "who is behind this" |
| Mobile | 5 | Fluid single column, but 3-column tables overflow at 320px and inline-link tap targets are small |
| Accessibility | 7 | Good basics (skip link, lang, captions, details/summary, contrast); missing landmarks/nav on inner pages, hidden-caption hack, no form patterns yet |
| Performance | 9 | About 2 KB CSS, no images or fonts; only GA is third-party. Keep it this way |
| Technical SEO | 4 | No canonical on most pages, no Open Graph, no favicon, no 404 page, thin sitemap without lastmod |
| On-page SEO and content | 5 | The guide is strong; the home title is weak and there is no page for "aoda compliance checklist" |
| Analytics and tracking | 6 | data-track hooks exist, but `generate_lead` counts clicks on a mailto, not actual requests |
| **Overall** | **5.4** | Honest, fast and accurate, but under-built for converting cold outreach traffic |

## Findings and fixes

### 1. Conversion (4/10)

| # | Finding | Fix |
| --- | --- | --- |
| C1 | The only primary call to action is `mailto:`. Buyers on Gmail/Outlook web or locked-down work PCs often get nothing (or an unconfigured mail app) when they click. | A real snapshot request form (name, work email, organization, website, Ontario employees, optional message, consent) with an email fallback. Keep a plain mailto option underneath. |
| C2 | The fit call is also a mailto (`booking_url`), so two of three CTAs depend on the visitor's mail setup. | Keep it (founder decision: no scheduling tool), but present it as "email to book", and give the form as the reliable path. |
| C3 | No lower-commitment path for visitors who are researching, not ready to share details. | A free printable "AODA 2026 certifier checklist" page (ungated) with a snapshot CTA at the end. |
| C4 | CTAs appear only at the very top and the very bottom; the long middle (requirements, packages, comparison, FAQ) has none. | CTA after the self-check, under each package, after the sample, after the FAQ, and in a sticky header button. |
| C5 | No self-qualification. Visitors must read a table to learn whether they file and which package fits. | An interactive "Do you need to file?" self-check (works without JavaScript) that ends in the right CTA. |
| C6 | No direct order path near the packages; "Email us" sits at the end of the page. | An "Order by invoice" button on each package card (`order_click`). |

### 2. Messaging and clarity (7/10)

| # | Finding | Fix |
| --- | --- | --- |
| M1 | The H1 is strong and specific. Keep the promise ("ready to certify in 10 business days"). | Keep; add a one-line "for whom" (Ontario businesses and non-profits with 20–199 employees). |
| M2 | "Signer", "certifier" and "senior officer" are used interchangeably. | Use "the senior officer who certifies (your certifier)" once, then "certifier" consistently. |
| M3 | The snapshot is described in a dense paragraph. | Show the three things in the snapshot as a short list next to the form. |
| M4 | No explicit "what you need to do" (buyer effort). The comparison table mentions "about an hour" only in passing. | State buyer effort in How it works: a 45-minute intake call, a review, a walkthrough. |
| M5 | Prices and terms are clear and honest (pilot price for the first five, December 5 cutoff). | Keep the real scarcity only; no countdowns or "spots left". |

### 3. Information architecture and navigation (3/10)

| # | Finding | Fix |
| --- | --- | --- |
| I1 | No `<nav>` or menu on any page; the guide's only link home is the business name. | Sticky header on every page: Packages, How it works, Sample, Guide, FAQ, plus a "Free snapshot" button; accessible mobile menu. |
| I2 | Terms, privacy and accessibility pages have a back arrow only and a minimal footer. | Shared header and a full footer (pages, resources, contact, disclaimers) on every page; breadcrumbs on inner pages. |
| I3 | The guide's 13 sections have no table of contents. | Table of contents with anchor links and "back to contents" affordance; in-page CTAs after sections 5 and 6. |
| I4 | Sample documents are reachable only through inline links in one sentence. | A sample section with four cards describing each document. |
| I5 | Internal links point to `index.html`, creating a second URL for the home page. | Link home as `./`, with a canonical tag on every page. |

### 4. Visual design (3/10)

| # | Finding | Fix |
| --- | --- | --- |
| V1 | Single 860px text column, default-looking tables and bullets; nothing signals an established, careful service. | A calm design system: navy/blue palette, CSS custom properties for colour, spacing and type scales, cards, tables, callouts, steps, badges. |
| V2 | The two price tiers look the same weight as everything else. | Package cards with price, pilot note, inclusions with check marks, and per-card CTAs; the 50–199 package marked as the main offer. |
| V3 | No visual of the deliverable. | A text-based (not image) "report preview" card in the hero showing the six questions and evidence statuses from the fictional sample. |
| V4 | No section rhythm; all H2s run together. | Alternate section backgrounds, eyebrow labels and consistent vertical spacing. |

### 5. Trust and proof (6/10)

| # | Finding | Fix |
| --- | --- | --- |
| T1 | Honest disclaimers (not lawyers, not government) exist but only in the footer and FAQ. | Keep them, and add a short "Independent and plain about it" trust strip near the top. Do not add testimonials, logos or counts we do not have. |
| T2 | Nobody is behind the service on the page. | A short "Who prepares your documents" section using the founder's real name and city, with no invented credentials (founder to approve). |
| T3 | The guarantee is a paragraph near the bottom. | A guarantee callout next to the packages and a full section below. |
| T4 | Data handling isn't addressed, although buyers share HR process details. | FAQ: what we ask for, that we never ask for portal logins or employee medical information, retention, and a link to the privacy notice. |
| T5 | Competitor price figures have a source note. Good. | Keep the note ("public pages, October 2026"). |

### 6. Mobile (5/10)

| # | Finding | Fix |
| --- | --- | --- |
| Mo1 | Three-column tables (requirements, comparison) are wider than 320px with long cells; the page scrolls sideways. | Wrap tables in a focusable, labelled scroll region; at narrow widths, stack the comparison table rows as cards. |
| Mo2 | Inline links are the only way to reach samples and the fit call; small tap targets. | Buttons and cards with at least 44px targets (WCAG 2.2 2.5.8 needs 24px; we aim higher). |
| Mo3 | The CTA scrolls away. | Sticky header with a compact "Free snapshot" button that stays visible next to the menu button. |

### 7. Accessibility (7/10)

| # | Finding | Fix |
| --- | --- | --- |
| A1 | Skip link, `lang="en-CA"`, table headers with `scope`, native details/summary, and good contrast are already right. | Keep. |
| A2 | Inner pages have no `<header>`/`<nav>` landmarks; the home `<header>` holds the H1 and lede (banner landmark used for hero content). | Banner = site header and nav only; hero inside `<main>`. |
| A3 | A table caption is hidden with the `.skip` class (meant for skip links). | A dedicated `.visually-hidden` utility. |
| A4 | Focus styles exist only for `.cta`, links and summary. | A global `:focus-visible` style with a 3px outline that has at least 3:1 contrast in both themes. |
| A5 | No `prefers-reduced-motion` handling (no motion yet; smooth scrolling would add some). | Smooth scrolling only when motion is allowed. |
| A6 | With a sticky header, focused elements could be hidden under it (WCAG 2.2 2.4.11). | `scroll-padding-top` on the root. |
| A7 | No form yet; a form will need labels, required indicators, error messages linked with `aria-describedby`, and an error summary. | Built into the new form. |

### 8. Performance (9/10)

| # | Finding | Fix |
| --- | --- | --- |
| P1 | No images, no web fonts, a 2 KB stylesheet. | Keep: system fonts, one stylesheet, one small script, inline SVG icons. |
| P2 | No favicon, so every page load requests `/favicon.ico` and gets a 404. | Self-hosted `favicon.svg`. |

### 9. Technical SEO (4/10)

| # | Finding | Fix |
| --- | --- | --- |
| S1 | Canonical tag only on the guide. | Canonical on every indexable page, built from `{{site_url}}`. |
| S2 | No Open Graph or Twitter tags; shared links in email or LinkedIn show no title card. | OG and Twitter tags on every page. (An OG image needs a PNG; see open decisions.) |
| S3 | JSON-LD only on the guide (FAQPage). | Home: ProfessionalService (areaServed Ontario), Service with CAD offers, FAQPage, WebSite. Guide: Article, FAQPage, BreadcrumbList. Checklist and inner pages: BreadcrumbList. |
| S4 | Sitemap lists 4 URLs, misses privacy, accessibility and three samples, and has no `lastmod`. | Every indexable page with `lastmod` 2026-10-20. |
| S5 | No `404.html` (GitHub Pages serves its own unbranded page). | A branded, noindex 404 page with root-relative links. |
| S6 | Legal pages have no meta description. | Unique descriptions everywhere. |

### 10. On-page SEO and content (5/10)

| # | Finding | Fix |
| --- | --- | --- |
| O1 | Home title "AODA Report Desk: AODA report ready" misses the main terms (Ontario, compliance report, 2026). | "AODA Compliance Report 2026, Done for You · Ontario" style title (under 60 characters) and a description with deadline and price. |
| O2 | The guide covers the gaps in the SERP study well (six questions, size-specific "yes", evidence list, portal steps, honest enforcement figures). | Keep the content; add TOC, "last checked" date, breadcrumb and design. |
| O3 | Nothing targets "aoda compliance checklist" (about 100/month, vendor-dominated and website-centric). | A printable, size-specific certifier checklist page that covers policies, training and HR, not only websites. |
| O4 | Home H2s ("What you get", "Questions") are generic. | Descriptive H2s with natural keywords ("AODA compliance report packages", "AODA compliance report FAQ"). |
| O5 | Internal links between home, guide and samples are thin. | Home ↔ guide ↔ checklist ↔ sample links in body copy and cards. |

### 11. Analytics and tracking (6/10)

| # | Finding | Fix |
| --- | --- | --- |
| G1 | `generate_lead` fires on a click on the mailto link, not on a sent request; it overstates leads. | Keep the click event (required) and add `form_submit_snapshot` on a valid form submission, plus `generate_lead` with `method: form` on the thank-you page. Mark `form_submit_snapshot` as the key event in GA. |
| G2 | `pricing_view` fires only from the guide. | Also on "See packages" buttons. |
| G3 | No events for checklist use. | `checklist_download` (link to the checklist) and `checklist_print` (print button). |
| G4 | No consent mechanism. GA runs on load. For Quebec visitors, Law 25 expects opt-in for tracking technologies. | Founder decision (see QA.md); the privacy notice discloses GA and opt-out. |
