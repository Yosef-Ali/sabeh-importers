#!/usr/bin/env node
/**
 * Render the original Sabeh Mobile Flow design mockups (a React+Babel
 * single-file HTML doc) into per-phone PNGs for the README.
 *
 * Use this when you want to refresh the "design intent" screenshots
 * without an emulator. For LIVE app captures off a running emulator,
 * use `scripts/capture-screenshots.sh` instead.
 *
 * Prerequisites:
 *   - Node 20+
 *   - Playwright installed locally (`pnpm add -D playwright` or use npx)
 *   - The mockup HTML at the path passed via SABEH_MOCKUP_HTML env var,
 *     OR at the default location `/tmp/sabeh-mobile-flow.html`.
 *
 * Why HTTP-served and not file://: the mockup script-tag-loads a sibling
 * `tweaks-panel.jsx`. Browsers block sibling fetches under file:// origin.
 *
 * Why a tweaks-panel stub: the original mockup imports a dev-only tweaks
 * panel that isn't shipped in the artifact. We stub it so React mounts.
 *
 * Output: docs/screenshots/{01-splash,02-home,03-search,04-listing-detail,07-dashboard}.png
 */
import { chromium } from "playwright";
import { existsSync, mkdirSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";

const HERE        = dirname(fileURLToPath(import.meta.url));
const APP_ROOT    = resolve(HERE, "..");
const OUT         = resolve(APP_ROOT, "docs/screenshots");
const MOCKUP_HTML = process.env.SABEH_MOCKUP_HTML || "/tmp/sabeh-mobile-flow.html";
const STUB_DIR    = "/tmp";
const STUB_FILE   = `${STUB_DIR}/tweaks-panel.jsx`;
const PORT        = 8765;

if (!existsSync(MOCKUP_HTML)) {
  console.error(`✗ Mockup HTML not found at ${MOCKUP_HTML}`);
  console.error(`  Set SABEH_MOCKUP_HTML=/path/to/file.html, or place it at /tmp/sabeh-mobile-flow.html`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

// Stub the dev-only tweaks panel — must be served alongside the mockup HTML.
writeFileSync(STUB_FILE, `
window.useTweaks    = (defaults) => [defaults || {}, () => {}];
window.TweaksPanel  = () => null;
window.TweakSection = () => null;
window.TweakToggle  = () => null;
`);

// If the mockup isn't already in /tmp, copy it there so the stub sits next to it.
if (dirname(MOCKUP_HTML) !== STUB_DIR) {
  writeFileSync(`${STUB_DIR}/sabeh-mobile-flow.html`, readFileSync(MOCKUP_HTML));
}

// Start a tiny HTTP server in /tmp so script-tag fetches work.
const server = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: STUB_DIR, stdio: "ignore" });
process.on("exit", () => server.kill());
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.setDefaultTimeout(120_000);
page.on("pageerror", (e) => console.warn("[pageerror]", e.message.slice(0, 150)));

await page.goto(`http://localhost:${PORT}/sabeh-mobile-flow.html`);

// Babel compiles 4000+ lines of JSX in-browser — poll for the screen labels.
let mounted = false;
for (let i = 0; i < 60; i++) {
  await page.waitForTimeout(1000);
  if (await page.evaluate(() => /0[0-9]\s*·\s*[A-Z]/.test(document.body.innerText))) {
    mounted = true;
    break;
  }
}
if (!mounted) {
  console.error("✗ React never mounted within 60s — check the mockup HTML for missing deps.");
  await browser.close();
  process.exit(2);
}
await page.waitForTimeout(2000); // settle fonts/layout

// Resize viewport to fit the entire stacked-phones doc so element-screenshots can scroll.
const dim = await page.evaluate(() => ({
  w: document.documentElement.scrollWidth,
  h: document.documentElement.scrollHeight,
}));
await page.setViewportSize({ width: Math.max(dim.w, 1200), height: dim.h + 100 });
await page.waitForTimeout(800);

// Each phone has a "0N · NAME" label inside its frame. Walk up from the label
// to the phone-sized container and tag it with a stable attribute.
const found = await page.evaluate(() => {
  const labels = Array.from(document.querySelectorAll("*"))
    .filter((el) =>
      /^\s*0[1-9]\s*·\s*[A-Z]/.test((el.textContent || "").trim().split("\n")[0] || "")
      && el.children.length === 0,
    );
  const out = [];
  labels.forEach((label, idx) => {
    let cur = label;
    for (let n = 0; n < 12 && cur; n++) {
      const r = cur.getBoundingClientRect();
      if (r.width >= 320 && r.width <= 700 && r.height >= 500) {
        cur.setAttribute("data-phone-idx", String(idx));
        out.push({ idx, label: label.textContent.trim() });
        return;
      }
      cur = cur.parentElement;
    }
  });
  return out;
});

// Map the source order (Splash → Home → Search → Listing Detail → Dashboard)
// to README filenames. Order is intentional: it follows the user journey.
const FILES = ["01-splash.png", "02-home.png", "03-search.png", "04-listing-detail.png", "07-dashboard.png"];
for (let i = 0; i < found.length && i < FILES.length; i++) {
  const phone = page.locator(`[data-phone-idx="${found[i].idx}"]`);
  await phone.screenshot({ path: `${OUT}/${FILES[i]}`, scale: "device" });
  console.log(`✓ ${FILES[i]}  ←  ${found[i].label}`);
}

await browser.close();
console.log(`\nDone. ${found.length} mockup(s) saved to ${OUT}`);
