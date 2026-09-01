#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
MANIFEST_FILE="$ROOT_DIR/manifest.json"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Erro: python3 é necessário para gerar o pacote." >&2
  exit 1
fi

VERSION="$(python3 - <<'PY' "$MANIFEST_FILE"
import json
import sys

with open(sys.argv[1], encoding="utf-8") as manifest:
    print(json.load(manifest)["version"])
PY
)"

PACKAGE_NAME="ta-preenchido-v$VERSION.zip"
PACKAGE_PATH="$DIST_DIR/$PACKAGE_NAME"

INCLUDED_FILES=(
  "manifest.json"
  "background.js"
  "content.js"
  "popup.html"
  "popup.js"
  "options.html"
  "options.js"
  "icons/icon16.png"
  "icons/icon48.png"
  "icons/icon128.png"
)

mkdir -p "$DIST_DIR"
rm -f "$PACKAGE_PATH"

python3 - <<'PY' "$ROOT_DIR" "$PACKAGE_PATH" "${INCLUDED_FILES[@]}"
import os
import sys
import zipfile

root_dir = sys.argv[1]
package_path = sys.argv[2]
included_files = sys.argv[3:]

with zipfile.ZipFile(package_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
    for relative_path in included_files:
        absolute_path = os.path.join(root_dir, relative_path)
        if not os.path.isfile(absolute_path):
            raise SystemExit(f"Arquivo obrigatório não encontrado: {relative_path}")
        archive.write(absolute_path, relative_path)

with zipfile.ZipFile(package_path) as archive:
    names = archive.namelist()
    if "manifest.json" not in names:
        raise SystemExit("Erro: manifest.json não ficou na raiz do ZIP.")
PY

echo "Pacote gerado: $PACKAGE_PATH"
