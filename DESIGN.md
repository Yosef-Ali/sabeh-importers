# Design System: Sabeh Authority
**Project ID:** 446157067143279543

## 1. Visual Theme & Atmosphere
**"Nautical Maritime Authority & Industrial Precision"**

The design has pivoted from luxury editorial to an **authoritative, industrial, and utilitarian** aesthetic. It evokes the feeling of a central maritime hub or a global naval command center. The atmosphere is **structured and precise**—dominated by deep nautical navies, industrial yellow accents, and sharp geometry. 

- **Atmosphere**: Utilitarian, reliable, high-trust, and command-focused.
- **Density**: Dense but organized, utilizing grid-blueprint backgrounds and hard-edged containers.
- **Vibe**: "International Maritime Standard" meets modern B2B industrial marketplace.

## 2. Color Palette & Roles

### Core Palette
- **Nautical Navy (#0A192F)**: The primary anchor. Used for headers, footers, primary CTA backgrounds, and deep backgrounds. Represents authority and trust.
- **Industrial Gold (#FFD700)**: The high-visibility accent. Used for interactive elements, highlights, verification badges, and primary branding.
- **Command Background (#F8F9FA)**: A clean, cool-toned gray-white used for the main page canvas.
- **Surface White (#FFFFFF)**: Used for cards and secondary section backgrounds to provide contrast.

### Functional Roles
- **Text Main (#0F172A)**: Deep slate-navy for maximum readability on light backgrounds.
- **Text Muted (#64748B)**: Medium gray for secondary labels and metadata.
- **Success Tone (#10B981)**: Used for "Verified" statuses and growth indicators.
- **Borders/Dividers (#E2E8F0)**: Used for subtle separation where hard shadows aren't applied.

## 3. Typography Rules

### Font Families
- **Display (Headings)**: `Space Grotesk` (Sans-serif) — A modern, geometric sans with a technical feel. Used for H1/H2 and major section titles.
- **Body & UI**: `DM Sans` (Sans-serif) — A clean, versatile sans for all descriptive copy and form labels.
- **Technical/Mono**: `Space Mono` (Monospace) — Used for "Command" identifiers, step counts (01. Marketplace), metadata IDs, and technical specifications.

### Hierarchy
- **Primary Headers**: 7xl (72px) / 4xl (36px), Space Grotesk, Bold, uppercase, tight tracking.
- **Body Text**: base (16px), DM Sans, Regular.
- **Labels/Commands**: xs (12px) / [10px], Space Mono, Bold, uppercase, tracking-widest.

## 4. Component Stylings

### Headers & Navigation
- **Header**: `h-20`, Nautical Navy background, translucent `border-b border-white/10`.
- **Navigation Links**: Space Mono, Bold, uppercase. Active link in Industrial Gold.
- **Logo Container**: `w-10 h-10` square, Industrial Gold background with Navy icon.

### Cards & Containers
- **General Cards**: White surface, `rounded-none` or `rounded-sm` (tight 2px-4px radius), 1px border.
- **Shadows (Signature)**: `shadow-hard` — a solid, non-diffused 4px offset shadow (`4px 4px 0px rgba(0, 0, 0, 0.1)` or `#0A192F`).
- **Highlights**: `bg-[#FFFBEB]` used for premium/pro listing cards to differentiate from standard inventory.

### Buttons
- **Primary CTA**: Industrial Gold background, Nautical Navy text, `rounded-none`, `shadow-hard-navy`. Transitions to `translate-x-[2px] translate-y-[2px]` on hover.
- **Secondary**: Transparent with 1px border, Nautical Navy or White text.
- **Command Buttons**: Space Grotesk, Bold, uppercase, large (py-4), high impact.

### Inputs & Forms
- **Command Inputs**: Large, segmented inputs with Space Grotesk text, `shadow-hard`.
- **Selects/Dropdowns**: Simple, border-less in hero sections, or border-sm in forms.

## 5. Layout Principles
- **Grid Layout**: Strong use of `grid-blueprint` (20px radial dots) for background texture.
- **Max Width**: `max-w-[1440px]` with `px-8` standard padding.
- **Spacing**: Generous vertical padding (`py-24`) to separate distinct "Command" tiers.
- **Grid Gaps**: `gap-8` for main sections, `gap-6` for inventory feeds.

## 6. Stitch Generation Prompt (Authority Mode)
```
Theme: Industrial Maritime Authority. Nautical Navy (#0A192F) + Industrial Gold (#FFD700) + Command White (#F8F9FA).
Typography: Space Grotesk (headings), Space Mono (technical/mono), DM Sans (body).
Shapes: Square corners (rounded-none), Hard non-diffused shadows (4px 4px 0px #0A192F). Blueprint grid backgrounds.
Components: Segmented search bars, industrial icons, high-contrast command buttons, verified badges.
Mood: Authoritative, secure, high-precision, industrial marketplace.
```
