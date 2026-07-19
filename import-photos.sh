#!/usr/bin/env bash
# Pull pending Taildrop photos, downscale them, and drop them into a directory.
# Usage: ./import-photos.sh [dest-dir]   (defaults to src/images)
# dest-dir may be any path, absolute or relative to where you run the script.
set -euo pipefail

# An explicit dest resolves from the caller's cwd; the default from the repo.
if [ -n "${1:-}" ]; then
  DEST="$(realpath -m "$1")"
  cd "$(dirname "$0")"
else
  cd "$(dirname "$0")"
  DEST="$(realpath -m src/images)"
fi
INCOMING="$(mktemp -d)"
trap 'rm -rf "$INCOMING"' EXIT

echo "==> Receiving Taildrop files"
tailscale file get "$INCOMING" || sudo tailscale file get "$INCOMING"

echo "==> Resizing into $DEST"
node scripts/resize-images.mjs "$INCOMING" "$DEST"

echo "==> Done. New images:"
ls -lh "$DEST"
