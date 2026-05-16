#!/usr/bin/env bash
# Capture screenshots of every key Sabeh Mobile screen via adb.
#
# Prerequisites:
#   - Android emulator running with the app loaded (Expo Go or dev build)
#   - `adb` on PATH (ships with Android SDK platform-tools)
#
# Usage:
#   ./scripts/capture-screenshots.sh
#
# Outputs to docs/screenshots/. Existing files are overwritten.
#
# How it works: for each route we deeplink Expo to the screen via
# `adb shell am start`, wait for the bundle to render, then `adb exec-out
# screencap -p` pulls a PNG straight off the device.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$SCRIPT_DIR/../docs/screenshots"
mkdir -p "$OUT"

# Check device is connected
if [ -z "$(adb devices | tail -n +2 | grep -v '^$' || true)" ]; then
  echo "✗ No Android device/emulator detected by adb." >&2
  echo "  Start the emulator and run \`pnpm start\` in apps/mobile, then retry." >&2
  exit 1
fi

# Resolve the Expo Go scheme + project URL.
# When running `pnpm start`, Metro hosts on port 8081 over the LAN — Expo Go's
# deep-link form is exp://<host>:8081/--/<route>.
HOST="${EXPO_HOST:-$(ipconfig getifaddr en0 2>/dev/null || echo 192.168.1.2)}"
EXPO_BASE="exp://$HOST:8081/--"

shoot() {
  local route="$1"
  local filename="$2"
  local label="$3"
  echo "  → $label  ($route)"
  adb shell am start -W -a android.intent.action.VIEW -d "$EXPO_BASE$route" >/dev/null
  sleep 4   # let Metro deliver + RN render
  adb exec-out screencap -p > "$OUT/$filename"
}

echo "Capturing screenshots from $HOST → $OUT"
shoot "/"                "01-splash.png"       "Splash"
shoot "/(tabs)"          "02-home.png"         "Home / Browse"
shoot "/(tabs)/search"   "03-search.png"       "Search"
shoot "/listing/a-44219" "04-listing-detail.png" "Listing Detail (BYD Atto 3)"
shoot "/(tabs)/post"     "05-post-listing.png" "Post a Listing — Step 1"
shoot "/(tabs)/messages" "06-messages.png"     "Messages Inbox"
shoot "/(tabs)/profile"  "07-dashboard.png"    "Seller Dashboard"
shoot "/my-listings"     "08-my-listings.png"  "My Listings"

echo "✓ Done — $(ls "$OUT" | wc -l | tr -d ' ') screenshots in docs/screenshots/"
