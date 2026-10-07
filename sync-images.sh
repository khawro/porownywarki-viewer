#!/usr/bin/env bash
# Kopiuje screenshoty z /workspace/porownywarki-ubezpieczen/ do images/
# i przebudowuje images.json
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="${1:-/workspace/porownywarki-ubezpieczen}"
DEST="$ROOT/images"
mkdir -p "$DEST"

shopt -s nullglob
copied=0
for f in "$SRC"/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}; do
  base="$(basename "$f")"
  cp -f "$f" "$DEST/$base"
  copied=$((copied + 1))
done

python3 - "$DEST" "$ROOT/images.json" << 'PY'
import json, sys
from pathlib import Path
img_dir = Path(sys.argv[1])
out = Path(sys.argv[2])
exts = {".png", ".jpg", ".jpeg", ".webp"}
files = sorted(p.name for p in img_dir.iterdir() if p.is_file() and p.suffix.lower() in exts)
manifest = []
for name in files:
    stem = Path(name).stem
    title = stem.replace("_", " ").replace("-", " ")
    manifest.append({"file": name, "title": title, "src": f"images/{name}"})
out.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Manifest: {len(manifest)} plików → {out}")
PY

echo "Skopiowano / zsynchronizowano: $copied plików z $SRC"
