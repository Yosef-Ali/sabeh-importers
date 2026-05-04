# Sabeh Mobile (Expo / React Native)

The native iOS + Android app, built with Expo SDK 51 + Expo Router 3 + NativeWind 4.
Implements the screens from `Sabeh Mobile Flow.html`: Splash → Home → Search → Listing Detail → Dashboard, with a bottom tab bar.

Lives at `apps/mobile/` as a sibling to the Next.js web app at the repo root. Fully independent — its own `package.json`, its own `node_modules`, no monorepo workspace setup required. The web app is untouched.

## Prerequisites

- **Node 20+** (same as the web app)
- **pnpm** (already installed; mobile uses the same package manager)
- **Expo Go** on your phone — free, on the App Store + Play Store. This is how you run the app on a real device for development without an Apple Developer account.
- (Optional, for simulators) **Xcode** + iOS Simulator on Mac. **Android Studio** + an emulator for Android.

## First run

```bash
cd apps/mobile
pnpm install
pnpm start
```

`pnpm start` opens the Expo dev server with a QR code in the terminal:

- **On your phone:** open Expo Go, scan the QR. The app loads over your local network in ~10 seconds.
- **On iOS Simulator:** press `i` in the terminal (Mac only, requires Xcode).
- **On Android Emulator:** press `a` in the terminal.
- **In a browser** (limited — RN-Web): press `w`.

## Project structure

```
apps/mobile/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx              # Root: loads fonts, mounts <Stack>
│   ├── index.tsx                # / → Splash (Get Started → /(tabs))
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tab navigator (5 tabs + gold FAB)
│   │   ├── index.tsx            # Home / Browse
│   │   ├── search.tsx           # Search with filter chips
│   │   ├── post.tsx             # Post a listing (placeholder)
│   │   ├── messages.tsx         # Inbox
│   │   └── profile.tsx          # Profile / Dashboard with stats
│   └── listing/
│       └── [id].tsx             # Listing detail (stack route)
├── components/
│   ├── ui/                      # Button, Card, Badge primitives
│   ├── sabeh-logo.tsx           # Brand mark (inline SVG)
│   └── listing-card.tsx         # 2-column grid tile
├── lib/
│   ├── theme.ts                 # Color/shadow tokens (StyleSheet form)
│   └── mock-data.ts             # Sample listings until backend wires up
├── tailwind.config.js           # NativeWind tokens — mirrors web Tailwind
├── global.css                   # @tailwind base/components/utilities
├── app.json                     # Expo config (icon, splash, scheme)
├── babel.config.js              # babel-preset-expo + nativewind/babel
├── metro.config.js              # withNativeWind wrapper
└── package.json                 # Independent — does NOT share with web
```

## Design system

Matches the web app's Sabeh design tokens 1:1:

- Colors: navy `#0A192F`, gold `#FFD700`, command white `#F8F9FA`
- Fonts: Space Grotesk (display), Space Mono (labels), DM Sans (body) — loaded via `@expo-google-fonts`
- Shapes: 0px border-radius everywhere (no rounded corners)
- Shadows: hard 4px navy offset (no blur) — see `lib/theme.ts → shadows.hard`. RN's native shadow API can't perfectly replicate the web `box-shadow: 4px 4px 0px #0A192F` with no blur; closest approximation is shipped.

## What's mocked vs. wired

| Surface | Status |
|---|---|
| Listings (Home / Search / Profile) | **Mocked** in `lib/mock-data.ts` — 6 sample listings |
| Listing detail | **Mocked** — looks up by `id` in mock data, falls back to first listing |
| Listing images | **Placeholders** — navy block with image number; replace with `expo-image` once backend hosts URLs |
| Auth | **None** — no login flow yet; profile screen shows hardcoded "Abebe" |
| Messages | **Mocked** — 3 hardcoded threads |
| Post a listing | **Placeholder** — single CTA, no form |
| Tab badge (3 messages) | **Hardcoded** — wire to actual unread count later |
| Push notifications | **Not configured** — needs Expo Notifications + a backend push endpoint |

## Backend integration plan (when ready)

1. Add a `/api/auth/token` endpoint to the Next.js app that exchanges email+password for a JWT (mobile clients can't use the web's httpOnly cookies).
2. Store the token in `expo-secure-store` (already in `package.json`).
3. Replace `lib/mock-data.ts` reads with `fetch` calls to existing `/api/listings`, `/api/marketplace`, etc. — set the JWT as `Authorization: Bearer <token>`.
4. Configure CORS on the Next.js API routes to allow the mobile app's origin (Expo dev server is `http://localhost:8081`; published apps come from the device with no Origin header).

## Distribution (when ready to ship)

- **Internal sharing today:** Expo Go QR is enough. Share the dev server URL with anyone on the same network.
- **TestFlight / Play Store internal track:** requires `eas build` (Expo Application Services). EAS account is free; iOS still needs a $99/yr Apple Developer account, Android needs a $25 one-time Google Play Console fee.
- **App Store / Play Store production:** standard Apple/Google review process.

## Known caveats

- Hard shadow on iOS uses `shadowColor` + 0 radius — works but iOS dims it slightly compared to the web's `box-shadow: 4px 4px 0px navy`. Pixel-perfect match would need a navy `<View>` rendered behind each shadowed element (deferred; visual delta is small).
- Splash assets (`assets/icon.png`, `assets/splash.png`, `assets/adaptive-icon.png`) referenced in `app.json` aren't created yet — Expo will use defaults until you add them. Generate from the existing `/public/Sabeh_Logo_Icon.svg`.
- Lucide is intentionally NOT used here (web uses `lucide-react`). Mobile uses `@expo/vector-icons/Feather` which has equivalent glyphs and zero install footprint.

## Common commands

```bash
pnpm start              # Dev server with QR
pnpm ios                # Open in iOS Simulator (Mac only)
pnpm android            # Open in Android emulator
pnpm web                # Open in browser (RN-Web — limited)
pnpm type-check         # tsc --noEmit
```
