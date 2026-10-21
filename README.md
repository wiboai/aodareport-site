# aodareport.ca — AODA Report Desk website

Product codebase for the AODA Report Desk marketing site. Business records (offer, prospects, sales, delivery, decisions) live in Venture Lab: `/home/wissem/projects/venture_lab/ventures/aoda-2026` and `ideas/aoda-2026`.

| Path | What |
| --- | --- |
| `src/` | Page sources: HTML with `{{tokens}}`, `style.css`, `site.js`, icons, `sample/` (fictional sample package) |
| `site.config.json` | Token values (identity, prices, dates, form endpoint, GA4 ID). **Keep prices, dates and contact details in sync with `venture.json` in Venture Lab.** |
| `brand/` | Logo files and the brand guide (`BRAND.md`) |
| `scripts/build.py` | Builds `src/` into `dist/`, fills tokens, injects GA4 and click tracking. `--release` fails on unfilled or pending values |
| `scripts/deploy.sh` | Release build, then publishes `dist/` to the `gh-pages` branch, which GitHub Pages serves at aodareport.ca |

```bash
python3 scripts/build.py
```

```bash
scripts/deploy.sh
```

Hosting: GitHub Pages (repo `wiboai/aodareport-site`, branch `gh-pages`), custom domain aodareport.ca with HTTPS enforced, DNS at Namecheap. Lead forms post to FormSubmit and arrive at team@aodareport.ca. Analytics: GA4 `G-1F41188HY3`; Search Console has a verified domain property.

Migrated on October 21, 2026 from `venture_lab/ventures/aoda-2026/site` and `brand/` (no prior Git history). Deploying earlier force-pushed built output to `main`; from now on `main` holds the source.
