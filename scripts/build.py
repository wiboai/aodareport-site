#!/usr/bin/env python3
"""Build the aodareport.ca static site from src/ into dist/.

Tokens like {{business_name}} or {{prices.tier_b}} are filled from site.config.json.
Values still marked "{{PENDING: ...}}" are reported; --release refuses to build while any remain.
If site.config.json has "ga_measurement_id", a GA4 tag is injected into every HTML page, plus a click
listener that sends a GA event for any element with data-track="event_name" (and for mailto links).

    python3 scripts/build.py            # preview build
    python3 scripts/build.py --release  # fails if anything is pending
"""
import json, re, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKEN = re.compile(r"\{\{\s*([a-z0-9_.]+)\s*\}\}")
GA_SNIPPET = """<script async src="https://www.googletagmanager.com/gtag/js?id={gid}"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}
gtag('js',new Date());gtag('config','{gid}');
document.addEventListener('click',function(e){{var a=e.target.closest('a,button');if(!a)return;
var n=a.getAttribute('data-track')||((a.getAttribute('href')||'').indexOf('mailto:')===0?'email_click':null);
if(n)gtag('event',n,{{link_text:(a.textContent||'').trim().slice(0,80),link_url:a.getAttribute('href')||'',page_path:location.pathname}});}});
</script>
"""


def lookup(cfg, dotted):
    cur = cfg
    for part in dotted.split("."):
        cur = cur[part]
    return cur


def main():
    release = "--release" in sys.argv
    vdir = ROOT
    cfg = json.loads((ROOT / "site.config.json").read_text())
    src, dist = vdir / "src", vdir / "dist"
    if dist.exists():
        shutil.rmtree(dist)
    pending, missing = set(), set()
    for f in src.rglob("*"):
        out = dist / f.relative_to(src)
        if f.is_dir():
            continue
        out.parent.mkdir(parents=True, exist_ok=True)
        if f.suffix not in (".html", ".css", ".js", ".txt", ".xml", ".md"):
            shutil.copy2(f, out)
            continue

        def fill(m):
            try:
                val = lookup(cfg, m.group(1))
            except (KeyError, TypeError):
                missing.add(f"{f.name}: {m.group(1)}")
                return m.group(0)
            if isinstance(val, str) and val.startswith("{{PENDING"):
                pending.add(m.group(1))
            if isinstance(val, int) and m.group(1).startswith("prices."):
                return f"{val:,}"
            return str(val)

        text = f.read_text()
        for _ in range(3):  # values may contain tokens, e.g. booking_url -> {{contact_email}}
            text = TOKEN.sub(fill, text)
        if f.suffix == ".html" and cfg.get("ga_measurement_id"):
            text = text.replace("</head>", GA_SNIPPET.format(gid=cfg["ga_measurement_id"]) + "</head>", 1)
        out.write_text(text)
    for m in sorted(missing):
        print("unknown token:", m)
    for p in sorted(pending):
        print("pending:", p)
    if missing or (release and pending):
        sys.exit("build not releasable")
    print(f"built {dist.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
