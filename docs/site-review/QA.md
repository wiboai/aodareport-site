# QA: new aodareport.ca site (October 20, 2026)

Everything below was run locally against `ventures/aoda-2026/dist/`, served on `localhost:8765`. Nothing was deployed, pushed or published. The snapshot form was never submitted to FormSubmit: in the tests, every request to `formsubmit.co` was intercepted and aborted inside the browser before it reached the network.

## 1. Build

`python3 tools/build_site.py aoda-2026` printed `built ventures/aoda-2026/dist` with **no `unknown token` lines and no `pending` lines**. A grep of `dist/` for `{{` found nothing left unfilled.

New `venture.json` keys:

| Key | Value | Used for |
| --- | --- | --- |
| `lead_form_action` | `https://formsubmit.co/{{contact_email}}` | Form `action`. Resolves to `https://formsubmit.co/hello@aodareport.ca`. Set it to `""` to switch to the mailto fallback. |
| `order_cutoff_label` | `December 5, 2026` | Human-readable cutoff in copy, so the date isn't hardcoded |
| `deadline_label` | `December 31, 2026` | Deadline in badges and the self-check |

Note: the build deletes `dist/CNAME`, as it did before. `tools/deploy_pages.sh` recreates it when given the domain argument.

## 2. Automated accessibility check: axe-core 4.10.2

- **Setup:** headless Chrome (`/usr/bin/google-chrome`) driven by playwright-core 1.48.2. Both packages were installed only in the scratch directory, with no global install.
- **Rule tags:** wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa and best-practice.
- **Coverage:** 9 pages × 3 widths (1280, 375 and 320 px) × light and dark = **54 runs**.
- **Result: 0 violations in all 54 runs** after two fixes:
  - The guide's TOC "Printable checklist" button lost its text colour to a `.toc-box a` rule.
  - The `[hidden]` attribute was overridden by `.btn { display: inline-flex }`.
- **"Incomplete" contrast items:** these are text over the hero gradients, which axe can't measure. I checked them by hand: the gradient runs from `--brand-soft` to `--bg`, and every text colour passes against both ends (see section 3).

Scripts and results are in the scratch directory: `/tmp/claude-1000/-home-wissem-projects-agnetic-entre/b81850b8-9bf2-4d07-8945-29f199a8e11f/scratchpad/webqa/` (`axe.mjs`, `axe_results.txt`, `interact.mjs`, `check.py`, `contrast.py`, `shots/`).

## 3. Contrast, computed from the palette (WCAG formula)

| Pair | Light | Dark |
| --- | ---: | ---: |
| Body text on background | 17.1 | 15.7 |
| Muted text on background / surface / brand-soft | 7.5 / 7.0 / 6.4 | 8.9 / 8.0 / 6.5 |
| Brand (links, eyebrows) on background / brand-soft | 8.4 / 7.2 | 9.7 / 7.1 |
| Button text on button | 8.4 | 9.6 |
| Warning badge / success badge | 7.6 / 6.9 | 9.2 / 8.4 |
| Error text on background / error summary | 6.6 / 5.8 | 10.1 / 8.7 |
| Form field border (non-text, needs 3:1) | 4.6 | 5.6 |
| Focus ring on background / brand-soft (needs 3:1) | 5.0 / 4.3 | 11.0 |

Inside the blue CTA bands, the focus ring switches to white (8.4:1).

## 4. Interaction tests (playwright, 375 px)

| Check | Result |
| --- | --- |
| First Tab stop | "Skip to main content" ✔ |
| Mobile menu | Opens with `aria-expanded="true"`; Escape closes it and returns focus to the button ✔ |
| Self-check | Choosing "50 to 199" shows only that result. The form's employee select is pre-set to 50–199. A `self_check` GA event fires ✔ |
| Empty form submission | Error summary receives focus, lists 6 linked errors, and 6 fields get `aria-invalid="true"`. Each error is tied to its field with `aria-describedby` ✔ |
| Valid submission (FormSubmit) | POST to `https://formsubmit.co/hello@aodareport.ca` (intercepted and aborted). Fields: name, email, organization, website, employees, message, consent=yes, `_honey`, `_subject`=New AODA snapshot request, `_template`=table, `_captcha`=false, `_next`=https://aodareport.ca/thanks.html, and `source_page`=`/free-aoda-snapshot.html?utm_source=test&pid=P001` (path plus query captured) ✔ |
| GA on valid submission | `form_submit_snapshot {method: form, employees, transport_type: beacon}`. The POST itself is not prevented ✔ |
| Mailto fallback (form action blanked) | Fires `form_submit_snapshot {method: mailto}` and `generate_lead {method: form_mailto}`, opens a pre-filled mailto, and shows a status message (`role="status"`) with the direct email address ✔ |
| thanks.html | Fires `generate_lead {method: form}` on load ✔ |
| CTA tracking | Hero snapshot button fires `generate_lead`; packages button fires `pricing_view` ✔ |
| JavaScript off | Navigation shows as a wrapped list; all 5 self-check results show as static content; print and clear buttons stay hidden; no horizontal scroll ✔ |
| 200% zoom (640 px CSS width) | No horizontal scroll on home, guide or checklist ✔ |
| 320 px | No horizontal scroll on any page. Tables become stacked label/value rows ✔ |

## 5. Visual check

I took full-page screenshots of every page at 1280, 375 and 320 px in light and dark. I reviewed home, guide, checklist and snapshot in detail, and also viewed the home page in the Claude Browser pane (375 px light, and dark).

Fixed during QA:
- `.page-body` and `.article-layout` were overriding `.wrap` side padding, so content touched the screen edge on mobile.
- The checklist legend wrapped awkwardly.
- The menu icon shrank at 320 px.
- At phone widths under 480 px, the header shows the logo mark only. The business name stays as accessible text, and the "Free snapshot" button and "Menu" stay visible.

## 6. Manual accessibility review

- One H1 per page, with no skipped heading levels on any page (checked by script).
- Landmarks: banner, main nav (`aria-label="Main"`), main, contentinfo, a breadcrumb nav and the TOC nav.
- Skip link on every page.
- `scroll-padding-top` stops the sticky header from covering focused or anchored content (WCAG 2.2, 2.4.11).
- Visible `:focus-visible` ring on everything. Cards that link as a whole show the ring on the card.
- Native `<details>` for accordions and native radios for the self-check, so both are keyboard operable by default.
- Every form field has a `<label>`. Hints and errors are linked with `aria-describedby`. Optional fields are marked "(optional)". The consent box is never pre-ticked.
- Target size: buttons, choices and summaries are at least 44 px tall.
- Smooth scrolling runs only under `prefers-reduced-motion: no-preference`. There are no other animations.
- No text in images. Icons are inline SVG with `aria-hidden`. The hero "report card" is real text.
- Tables use `<th scope>` and hidden captions. Stacked mobile tables label each cell with `data-label`.
- Remaining manual items: a real screen reader pass (NVDA or VoiceOver) was not done, and Windows High Contrast was not tested.

## 7. SEO and structure checks (script: `check.py`)

- **HTML:** no unclosed or mismatched tags and no duplicate ids on any page.
- **JSON-LD:** parses as valid JSON on every page that has it.
  - Home: ProfessionalService, WebSite, Service with 4 CAD Offers, and FAQPage (12 questions, matching the visible FAQ).
  - Guide: Article, FAQPage (14 questions) and BreadcrumbList.
  - Checklist: Article and BreadcrumbList.
  - Snapshot page: WebPage, a Service with a price-0 Offer, and BreadcrumbList.
  - Terms, privacy and accessibility: BreadcrumbList.
- **Internal links:** every internal link and `#anchor` resolves to an existing file or id. This includes the 404 page's root-relative links and the `sample/*.html` links.
- **Canonical:** `{{site_url}}/…` on every indexable page. `thanks.html` and `404.html` are `noindex,follow` with no canonical.
- **Social tags:** Open Graph and Twitter card tags on every page.
- **Sitemap and robots:** `sitemap.xml` lists the 11 indexable URLs with `lastmod` 2026-10-20 (home, snapshot, guide, checklist, 4 samples, terms, privacy, accessibility). `robots.txt` allows all and points to the sitemap.
- **Page weight (gzip):** home 13.4 KB, `style.css` 6.2 KB, `site.js` 3.0 KB, and an SVG favicon. No fonts, images or third-party code except the injected GA tag. No layout shift: the `js` class is set in `<head>` before first paint, and no content is injected above existing content.

## 8. Tracking hooks (all present)

| Event | Fires on |
| --- | --- |
| `generate_lead` | Every snapshot CTA, plus `thanks.html` (`method: form`) and the mailto fallback |
| `fit_call_click` | Fit call links |
| `order_click` | Order buttons (pre-filled order email) |
| `sample_view` | Sample links |
| `guide_view` | Guide links |
| `pricing_view` | Links to packages |
| `checklist_download` | Links to the checklist (new) |
| `checklist_print` | Print button on the checklist (new) |
| `form_submit_snapshot` | Valid form submission (new) |
| `form_error_snapshot` | Submission with errors (new) |
| `self_check` | Self-check choice, with `band` (new) |
| `email_click` | Plain mailto links, as before |

**Recommendation:** in GA4, mark `form_submit_snapshot` and the `thanks.html` `generate_lead` (`method=form`) as key events. `generate_lead` without `method` is a click on a CTA, which shows intent, not a lead.

## 9. Decisions for the founder

1. **Activate FormSubmit.** The first real submission sends an activation email to hello@aodareport.ca, and someone must click it. That mailbox has to exist first: it isn't created yet according to HANDOVER.md. Until it is activated, submissions are held. Consider switching `lead_form_action` to FormSubmit's random-string alias after activation, so the address isn't visible in the page source.
2. **Mailing address.** CASL consent requests should include a mailing address. The consent text currently names the business, city and email. Add the address to the consent label and footer once `mailing_address` is set.
3. **Founder name on the site.** The "Who prepares your documents" section names {{founder_name}}. Please confirm you want that public.
4. **The "we're new, no reviews yet" line.** It's honest and builds trust with careful buyers. Keep it or cut it.
5. **GA consent.** GA loads without a consent banner. That's reasonable under PIPEDA with the privacy notice, but Quebec's Law 25 expects opt-in for tracking. Decide whether to add a minimal consent toggle; it would also need privacy page changes.
6. **Open Graph image.** No `og:image`, because social platforms need a 1200×630 PNG and we can't render one without a design tool. Card previews will be text-only until one is added.
7. **Sample pages.** They are in the sitemap but have no link back to the site (constraint: leave them). Consider adding a "Back to AODA Report Desk" line in `tools/render_docs.py` templates.
8. **Competitor figures** in the comparison table (US$1,290/yr software, C$3,000–8,000 consultants) were observed in October 2026. Recheck them before the price changes.
9. **Price formatting in JSON-LD:** prices are strings filled from tokens. A price of C$1,000 or more would render as "1,000" (with the build's thousands separator), which schema validators may flag.

## 10. Update: no email-client links, plus a multi-intent request page (October 20, evening)

**Scope.** Changes were made at the founder's request; everything is still local only.

**No visitor action opens an email app.**
- Removed every mailto CTA and the JavaScript mailto fallback.
- `dist/` contains no `href="mailto:` at all. The only `mailto:` string left is inside the injected GA click listener, which is code, not a link.
- The contact email now appears as plain text in the footer, privacy, terms, accessibility and thanks pages.

**New wording for ordering.**
- Primary buttons now read **"Start my package"** and secondary buttons **"Book a 20-minute call"**.
- Every package CTA carries the same reassurance line: "No payment now. We confirm fit, then send an invoice (Interac e-Transfer or bank transfer)."
- The FAQ answer on payment and the "How it works" steps were updated to match.

**New `start.html` (noindex, not in the sitemap).**
- One accessible form with an intent choice: Free AODA snapshot, Start my package, or Book a 20-minute call.
- The package select appears only for the package intent, and the preferred call times field only for the call intent. Hidden fields are disabled, so they aren't submitted.
- With JavaScript off, every field shows, each labelled "(if you chose …)".
- `?intent=` and `?package=a|b` preselect the form.
- Hidden fields: `_subject` (set by JS from the intent and organization), `_template=table`, `_captcha=false`, `_next={{site_url}}/thanks.html?intent=…` (set by JS), `source_page`, and the `_honey` honeypot.

**Snapshot forms.** The home page and `free-aoda-snapshot.html` forms use the same POST approach, with a hidden `intent=snapshot`.

**Where former mailto CTAs now point.**
- `start.html?intent=call` (`fit_call_click`).
- `start.html?intent=package[&package=a|b]` (`order_click`).
- The on-page snapshot form or `free-aoda-snapshot.html` (`generate_lead`).

**`venture.json`.** `booking_url` is now `{{site_url}}/start.html?intent=call`. Site pages use relative `start.html?…` links so the local preview works.

**Events.**
- `form_submit_snapshot`, `form_submit_package` and `form_submit_call` fire on a valid submission, with beacon transport, and the POST proceeds normally.
- `form_error_<intent>` fires when the form has errors.
- `thanks.html` reads `?intent`, shows only that intent's next steps (all three show without JavaScript), and fires `generate_lead {method: form, intent}`.

**Test results** (playwright; FormSubmit requests intercepted and aborted):
- `?intent=package&package=b` preselects the Essentials package.
- An empty submission lists 7 linked errors.
- Switching to the call intent swaps the conditional fields and changes the button text to "Request my call".
- A valid call request POSTs with `_subject=New AODA call request (Org)` and `_next=…/thanks.html?intent=call`, and with `source_page` holding the original query.
- `thanks.html?intent=call` shows only the call section and fires `generate_lead` with `intent: call`.

**axe-core** was rerun on 13 page states (including start.html with each intent and `thanks.html?intent=package`) × 3 widths × light and dark: **0 violations in 78 runs**.

**Founder action before deploy.** `venture.json` currently has `"lead_form_action": ""` (the FormSubmit URL is parked in `lead_form_action_pending`). With it empty, the forms post to the current page. Set it to `https://formsubmit.co/{{contact_email}}`, rebuild, and complete FormSubmit activation from the hello@ mailbox.
