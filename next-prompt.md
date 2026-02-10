---
page: product
---
The Product Detail Page for Sabeh Importers.

**DESIGN SYSTEM (REQUIRED):**
# Design System: Sabeh Importers
**Project ID:** sabeh-importers

## 1. Visual Theme & Atmosphere
The design aesthetic of Sabeh Importers balances professional reliability with cultural resonance. It combines a modern, clean interface appropriate for logistics and e-commerce with specific Ethiopian visual elements.
*   **Core App:** Functional, clean, and data-driven (Shadcn UI base).
*   **Proposal/Marketing:** Elegant, premium, and sophisticated. Uses deep distinctive colors (Navys and Golds) to convey authority and value.
*   **Cultural Connection:** Integrates Ethiopian heritage colors (Green, Yellow, Red) and Amharic typography naturally into the modern interface.

## 2. Color Palette & Roles

### Core System Colors (Shadcn)
*   **Background:** Clean White / Deep Dark (hsl var) - Base canvas.
*   **Foreground:** Slate-950 (#020617) - Primary text.
*   **Primary:** Green-600 (hsl var) - Main actions and highlights.
*   **Muted:** Slate-100 (hsl var) - Secondary backgrounds and disabled states.
*   **Border:** Slate-200 (hsl var) - Subtle dividers.

### Ethiopian Heritage Colors
Used for culturally specific highlights, badges, and decorative elements.
*   **Ethiopian Green:** #078930
*   **Ethiopian Yellow:** #FCDD09
*   **Ethiopian Red:** #DA121A
*   **Ethiopian Blue:** #0F47AF

### Proposal Theme (Premium)
Exclusive to the proposal and high-value marketing pages.
*   **Deep Navy:** #0a1628 - "Midnight Abyssal Blue" - Backgrounds and headers.
*   **Primary Navy:** #1a2d4a - "Corporate Trust Blue" - Section backgrounds.
*   **Light Navy:** #2d4a6f - "Steel Blue" - Accents and gradients.
*   **Primary Gold:** #c9a962 - "Antique Brass" - Headers, icons, borders.
*   **Light Gold:** #e8d5a3 - "Champagne" - Subtitles and highlights.
*   **Dark Gold:** #a08339 - "Bronze" - Text emphasis.
*   **Cream:** #faf8f5 - "Paper White" - Document background.

## 3. Typography Rules

### Font Families
*   **Inter:** Primary UI font. Clean, legible, modern sans-serif. Used for dashboard, forms, and general content.
*   **Montserrat:** Secondary sans-serif. Geometric and professional. Used for Proposal body text.
*   **Cormorant Garamond:** Serif accent. Elegant and classical. Used for Proposal headings and titles to convey prestige.
*   **Noto Sans Ethiopic:** Specialized font for Amharic content, ensuring legibility and cultural accuracy.

### Usage
*   **Headings:** Bold/Semibold weights. Cormorant Garamond for high-impact/formal headers; Inter for UI headers.
*   **Body:** Regular/Medium weights. Inter for readability.
*   **Amharic:** integrated seamlessly where localization is required.

## 4. Component Stylings

### Buttons & Actions
*   **Primary Buttons:** High contrast, rounded corners (0.5rem radius).
*   **Proposal Call-to-Actions:** Gradient backgrounds (Navy to Light Navy) or elegant outlines (Gold borders).

### Cards & Containers
*   **Standard Cards:** Clean white background, thin slate border, subtle shadow. Rounded corners (0.5rem).
*   **Proposal Cards:** "Paper" feel (Cream background), Gold accent borders (left or top), distinct shadows for depth.

### Visual Effects
*   **Gradients:** Used in generic backgrounds (Hero sections) and specific UI accents.
*   **Patterns:** Subtle SVG overlays (Ethiopian basket weave/geometric patterns) used for texture in premium sections.

## 5. Layout Principles
*   **Container Width:** Max-widths constrained for readability (typically max-w-7xl).
*   **Spacing:** Generous padding (p-12, p-[60px] in proposal) to create a sense of luxury and openness.
*   **Grid:** 12-column grid system (via Tailwind) for responsive layouts.
*   **Print Optimization:** Specific constraints (A4 aspect ratio) for document-based pages like the Proposal.

**Page Structure:**
1.  **Navbar:** Consistent with Shop page.
2.  **Breadcrumb:** Home > Shop > Vehicles > BYD Atto 3.
3.  **Product Details Section (2 Col):**
    *   **Left:** Image Gallery (Main image + thumbnail strip).
    *   **Right:** Title, Price, Ratings, "In Stock" badge, Color selection, Add to Cart, Short Description.
4.  **Tabs Section:** "Specifications", "Description", "Reviews".
5.  **Related Products:** Row of 4 cards.
6.  **Footer.**