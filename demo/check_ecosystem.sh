#!/bin/sh
# Run this repo's checker (Silver) against every published Prax Systems repo.
# Uses ../<repo> when it is already cloned next to this one; otherwise makes a shallow clone in a
# temporary folder. Needs git and Python 3, no key. Exit code 1 if any repo fails.
set -u
OWNER="${OWNER:-claudiucalomfirescu}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
status=0
for name in llm-proxy-log llm-proxy-firewall vxc-motors-sim llm-session-console; do
  dir="$HERE/../$name"
  if [ ! -f "$dir/prax.yaml" ]; then
    dir="$TMP/$name"
    git clone -q --depth 1 "https://github.com/$OWNER/$name" "$dir" || { echo "$name: clone failed"; status=1; continue; }
  fi
  python3 "$HERE/tools/prax_check.py" "$dir" --level silver | sed "s|^$dir|$name|" || status=1
done
exit $status
