#!/usr/bin/env bash
# Build and publish aodareport.ca: source lives on `main`, built output on `gh-pages` (GitHub Pages source).
# Requires gh auth with repo scope.   Usage: scripts/deploy.sh
set -euo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
repo=wiboai/aodareport-site
domain=aodareport.ca
python3 "$root/scripts/build.py" --release
echo "$domain" > "$root/dist/CNAME"
touch "$root/dist/.nojekyll"
tmp=$(mktemp -d)
cp -r "$root/dist"/. "$tmp"/
cd "$tmp"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$root" config user.name || echo publisher)" -c user.email="$(gh api user --jq .login)@users.noreply.github.com" \
  commit -qm "Deploy $(git -C "$root" rev-parse --short HEAD 2>/dev/null || echo local)"
git -c credential.helper= -c credential.helper='!gh auth git-credential' push -qf "https://github.com/$repo.git" gh-pages
echo "published gh-pages -> https://$domain"
