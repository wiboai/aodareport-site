# AODA Report Desk: brand guide

## The mark

A report page with a folded corner and a bold check. It says "your report, signed off." The gold fold is the single accent: the deadline, and a nod to Ontario's gold.

| File | Use |
| --- | --- |
| `logo-mark.svg` | Primary mark: website, favicon, documents |
| `logo-mark-mono.svg` | One colour (outline plus check, uses `currentColor`): print, fax, stamps, dark photos |
| `logo-full.svg` | Mark plus wordmark (uses system fonts; for print-critical use, set the wordmark in a document instead) |
| `logo-mark-512.png` | Raster mark: social profiles, structured data, email signature |
| `../site/apple-touch-icon.png`, `../site/favicon-32.png` | Device icons |
| `../site/og-image.png` | Social preview (1200×630) |

**Clear space:** at least the width of the fold (about 25% of the mark) on every side.
**Minimum size:** 16 px (favicon); 24 px wherever the wordmark sits beside it.
**Don't:** recolour the check, add shadows or gradients, rotate the mark, or put the navy mark on dark navy. On dark backgrounds, use a white tile behind it or the mono version in white.

## Wordmark

**AODA** in heavy weight (800) followed by **Report Desk** in medium weight (500), in the system UI font. On the website the wordmark is live text, not an image, so screen readers and translation tools can read it.

## Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| Brand navy `--brand` | #0b4f8a | #8cc2f5 | Mark page, buttons, links |
| Brand strong | #083b68 | #b5d8fa | Hover and pressed states |
| Accent gold `--accent` | #e3a21a | #f2b84b | The fold, deadline badges. Decorative only: never use it for text on white (contrast too low) |
| Ink `--fg` | #0f1c2e | #e9eef5 | Body text |
| Deep navy | #0b2a4a | — | Social image and dark panels |

Text on these backgrounds meets WCAG AA (see `site/style.css` header for computed ratios).

## Voice

Plain, calm and specific. We say "file on time, with proof behind every answer." We don't say "100% compliant", we don't use fines to scare people, and we don't show fake reviews. We are independent and not affiliated with the Government of Ontario, and that's said wherever someone could assume otherwise.

## Email signature

```
Wissem Zrelli
AODA Report Desk · Toronto, Ontario
aodareport.ca · team@aodareport.ca
```
