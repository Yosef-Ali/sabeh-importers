# Design System: Sabeh Hybrid
**Project ID:** 15993632048680359095

## 1. Visual Theme & Atmosphere
**"Elevated Luxury, Ethiopian Soul"**

The design evokes a high-end auction house crossed with a sleek digital marketplace. The atmosphere is **cinematic and opulent** — deep, inky navy backgrounds contrast with warm, burnished gold accents, creating a sense of exclusivity and trust. The overall density is **restrained and spacious**, with generous whitespace allowing each element to command attention. The feeling is akin to a premium fashion magazine layout, not a cluttered classifieds board.

- **Marketplace (Hero):** Cinematic, immersive, full-bleed imagery with glassmorphic overlays. "Elevate Your Lifestyle."
- **Content Sections:** Airy cream-toned backgrounds (`#faf8f5`) with generous padding. Cards float with subtle shadows.
- **Footer & Navigation:** Deep, ink-like navy (`#1a2d4a`) with whisper-thin gold (`#FCDD09`) accents.

## 2. Color Palette & Roles

### Primary Brand Colors
- **Burnished Gold (#FCDD09):** The signature accent. Used for the logo wordmark, active navigation states, icon tints, CTA buttons, search accents, and all interactive highlights. It communicates luxury and premium value.
- **Deep Navy (#1a2d4a):** The dominant anchor. Used for the navigation bar, footer, hero section background, and primary text on light backgrounds. It communicates authority, trust, and depth.
- **Ink Navy (#0f1a2a):** A darker variant of Deep Navy. Used for the deepest backgrounds and heavy text contrast where extra weight is needed.

### Atmosphere Colors
- **Warm Cream (#faf8f5):** The primary body background. A barely-there warm tint that feels more inviting and premium than pure white. Used for section backgrounds and the overall page canvas.
- **Pure White (#ffffff):** Used for card surfaces, content containers, and text on dark backgrounds.

### Functional Colors
- **Text on Light:** Deep Navy (#1a2d4a) for headings, `text-gray-700` for body, `text-gray-400` / `text-gray-500` for captions and metadata.
- **Text on Dark:** White at varying opacities — `text-white/90` for primary, `text-white/80` for body, `text-white/50` for subtle labels, `text-white/30` for footer fine print.
- **Borders:** `border-gray-100` on cards (whisper-light), `border-primary/20` for gold-tinted separators, `border-white/10` for dark-background dividers.

## 3. Typography Rules
**Font Families:**
- **Display / Headings:** `Playfair Display` (Serif) — An elegant, editorial serif for all major headlines. Used with normal and italic weight. The italic style is used for emphasis keywords (e.g., *Lifestyle*, *Pocket*).
- **Body / UI:** `Lato` (Sans-serif) — A clean, friendly sans-serif for all body text, navigation labels, captions, and UI elements. Light (300), Regular (400), and Bold (700) weights.

**Hierarchy:**
- **H1 (Hero Display):** 5xl–7xl (48–72px), Playfair Display, tight tracking, white on dark.
- **H2 (Section Title):** 3xl–5xl (30–48px), Playfair Display, Deep Navy on light / White on dark.
- **H3 (Card/Component Title):** sm–base (14–16px), Lato Bold, Deep Navy.
- **Price:** xl (20px), Lato Bold, Deep Navy.
- **Body:** sm–lg (14–18px), Lato Regular/Light, gray-700 or white/80.
- **Caption / Labels:** `[10px]`–xs (10–12px), Lato Bold, uppercase tracking `[0.2em]`. Used extensively for navigation, category chips, timestamps, and micro-labels.

## 4. Component Stylings

### Navigation Bar (Glass Nav)
- **Shape:** Fixed, full-width, `h-20` (80px height).
- **Surface:** Glassmorphism — `backdrop-blur(12px)`, `rgba(26, 45, 74, 0.85)` semi-transparent Deep Navy.
- **Border:** Bottom border with `border-primary/20` (subtle gold glow).
- **Logo:** Burnished Gold, Playfair Display, bold, uppercase, italic, tracking-tighter, 3xl.
- **Nav Links:** White/80, uppercase, `[10px]` text, `tracking-[0.2em]`, bold. Hover → Gold.
- **CTA Button ("Place an Ad"):** Gold background, Deep Navy text, rounded, shadow-lg, `[10px]` tracking.

### Hero Section
- **Layout:** Full-viewport height (`85vh`), centered content, cinematic background image at 50% opacity.
- **Overlay:** Gradient from `navy-deep/60` at top through transparent to `cream` at bottom, creating a seamless color transition.
- **Search Bar (Glass):** `backdrop-blur(20px)`, `rgba(255, 255, 255, 0.1)` background, gold-tinted border, `rounded-xl`, heavy shadow (`shadow-2xl`). Contains segmented inputs with thin `border-white/10` dividers.

### Listing Cards
- **Shape:** `rounded-xl`, overflow hidden.
- **Surface:** White background, `border-gray-100`, `shadow-sm` at rest.
- **Hover:** `translateY(-4px)` lift with `shadow-xl` glow effect. Smooth transition.
- **Image Area:** `h-48`, `object-cover`. Overlay elements: heart icon (top-right, white/80 circle), "FEATURED" badge (bottom-left, Gold bg, Navy text, `[10px]` bold).
- **Content Area:** `p-4`. Price in xl bold Navy, title in sm gray-700, metadata row with Material icons at `[10px]` uppercase.

### Category Cards
- **Shape:** `rounded-xl`, `border-gray-100`, `shadow-sm`.
- **Surface:** White, centered layout.
- **Icon Container:** `w-16 h-16`, cream-toned circle (`bg-cream rounded-full`), icon in Gold.
- **Hover:** Shadow deepens to `shadow-md`, icon background shifts to `bg-primary/10`.
- **Text:** sm bold Navy title, `[10px]` gray-400 listing count.

### Category Chips (Sticky Bar)
- **Shape:** Horizontal scrolling row, sticky below nav (`top-20`), white bg.
- **Active State:** Gold text + Gold bottom border (2px).
- **Inactive:** Gray-500 text, transparent bottom border.
- **Text:** xs bold uppercase, `tracking-widest`.

### Buttons
- **Primary CTA:** Gold bg, Deep Navy text, rounded, `shadow-lg`. Hover → White bg.
- **Secondary:** White bg, Deep Navy text, rounded-lg.
- **App Download:** White bg, Deep Navy text, rounded-lg, icon + stacked text layout.

### Inputs & Search
- **Hero Search:** Glassmorphic, segmented with thin internal borders, Material icon tints in Gold.
- **Select Dropdowns:** Transparent background, white text, no ring.

## 5. Layout Principles
- **Max Width:** `max-w-7xl` (1280px), centered with `px-8` horizontal padding.
- **Grid:** Responsive — 1 col (<640px), 2 col (sm), 3 col (md), 4 col (lg) for listings. 6 col for categories.
- **Section Spacing:** `py-16`–`py-20` (64–80px vertical padding per section).
- **Card Gaps:** `gap-4`–`gap-6` (16–24px).
- **Footer:** 5-column grid on desktop, stacked on mobile. Deep Navy background with gold accents.

## 6. Design System Notes for Stitch Generation

**CRITICAL STITCH PROMPT CONTEXT:**
When generating new screens for this project, include the following style block to maintain visual consistency:

```
Theme: Premium luxury marketplace. Dark navy (#1a2d4a) + burnished gold (#FCDD09) + warm cream (#faf8f5).
Typography: Playfair Display (serif) for headings, Lato (sans-serif) for body. Extensive use of uppercase [10px] tracking-widest labels.
Components: Glassmorphic navigation, rounded-xl cards with hover-lift, gold accent icons, cinematic hero imagery.
Density: Spacious, editorial. Generous padding (py-16 to py-20). Max width 7xl.
Mood: Opulent yet approachable. Ethiopian soul with international luxury standards.
```
