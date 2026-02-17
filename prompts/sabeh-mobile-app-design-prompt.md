# Sabeh Market — Mobile App UI Design Prompt for Google AI Studio (Gemini)

> **Purpose:** Paste this entire prompt into Google AI Studio (Gemini) to generate high-fidelity mobile app UI screen designs for the Sabeh Market import/export B2B marketplace. The designs must match the existing web platform design system exactly.

---

## ROLE & OBJECTIVE

You are a senior mobile UI/UX designer specializing in B2B marketplace applications. Design complete, pixel-perfect mobile app screens for **Sabeh Market** — an Ethiopian import/export B2B marketplace connecting international suppliers with Ethiopian businesses. The app supports **Amharic (አማርኛ)** and **English** bilingual interfaces.

Generate each screen as a high-fidelity mockup at **390 x 844px** (iPhone 14 / Android standard) resolution. Use the exact design tokens below — do not deviate from the brand.

---

## PART 1: DESIGN SYSTEM — EXACT TOKENS

### 1.1 Color Palette

#### Light Mode (Default)
| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| **Primary (Navy)** | `217 65% 11%` | `#0A192F` | Headers, primary buttons, text |
| **Primary Foreground** | `51 100% 50%` | `#FFD700` | Text on primary backgrounds |
| **Accent (Gold)** | `51 100% 50%` | `#FCDD09` | CTAs, highlights, badges, active states |
| **Accent Foreground** | `217 65% 11%` | `#0A192F` | Text on gold backgrounds |
| **Background** | `210 20% 98%` | `#F8F9FA` | App background |
| **Foreground** | `217 65% 11%` | `#0A192F` | Primary text |
| **Card** | `0 0% 100%` | `#FFFFFF` | Card surfaces |
| **Card Foreground** | `217 65% 11%` | `#0A192F` | Card text |
| **Secondary** | `217 65% 15%` | `#0D2240` | Secondary buttons, accents |
| **Secondary Foreground** | `210 20% 98%` | `#F8F9FA` | Text on secondary |
| **Muted** | `210 10% 90%` | `#E3E5E8` | Disabled states, dividers |
| **Muted Foreground** | `215 16% 47%` | `#647488` | Secondary text, labels |
| **Destructive** | `0 84.2% 60.2%` | `#EF4444` | Error states, delete buttons |
| **Border** | `214 32% 91%` | `#E2E8F0` | Card borders, dividers |
| **Input** | `214 32% 91%` | `#E2E8F0` | Input field borders |
| **Ring** | `217 65% 11%` | `#0A192F` | Focus rings |

#### Dark Mode
| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| **Primary (Gold)** | `52 97% 51%` | `#FCDD09` | Primary actions in dark mode |
| **Primary Foreground** | `217 48% 22%` | `#1D3461` | Text on gold in dark |
| **Background** | `217 48% 15%` | `#142440` | Dark app background |
| **Foreground** | `40 25% 97%` | `#F8F6F2` | Light text on dark |
| **Card** | `217 48% 18%` | `#1A3050` | Dark card surfaces |
| **Muted** | `217 30% 25%` | `#2D4562` | Dark muted surfaces |
| **Muted Foreground** | `217 20% 70%` | `#9DB0C8` | Secondary text in dark |
| **Border** | `217 30% 25%` | `#2D4562` | Dark borders |
| **Accent** | `52 97% 51%` | `#FCDD09` | Gold accent in dark |

#### Extended Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Navy Default** | `#1a2d4a` | Standard navy |
| **Navy Deep** | `#0a1628` | Deepest navy |
| **Navy Light** | `#2d4a6f` | Lighter navy |
| **Gold Default** | `#FCDD09` | Standard gold |
| **Gold Light** | `#FDE968` | Light gold |
| **Gold Dark** | `#a08339` | Subdued gold |
| **Cream Default** | `#faf8f5` | Warm background |
| **Cream Dark** | `#f0ebe3` | Slightly darker cream |

### 1.2 Typography

| Role | Font Family | Weights | Usage |
|------|-------------|---------|-------|
| **Display / Headers** | **Rajdhani** | 300, 400, 500, 600, 700 | Screen titles, section headers, hero text |
| **Body / UI** | **Plus Jakarta Sans** / **Inter** | 300, 400, 500, 600, 700 | Body text, labels, buttons |
| **Headline (Large Display)** | **Bebas Neue** | 400 | Splash screen, marketing banners |
| **Amharic** | **Noto Sans Ethiopic** | 100, 300, 400, 500, 700, 900 | All Amharic text |
| **Monospace** | System monospace (SF Mono / Roboto Mono) | 400 | Condition codes: `NEW_DELIVERY`, `SALVAGE`, `OP_GOOD`, `CERT_MINT` |

**Type Scale (Mobile):**
- Splash Title: Bebas Neue, 48px
- Screen Title: Rajdhani 600, 24px
- Section Header: Rajdhani 600, 18px
- Card Title: Jakarta 600, 16px
- Body: Jakarta 400, 14px
- Caption: Jakarta 400, 12px
- Monospace Code: SF Mono 400, 12px, uppercase, letter-spacing 0.05em
- Amharic Body: Noto Sans Ethiopic 400, 15px (slightly larger for readability)

### 1.3 Shadows

| Name | Value | Usage |
|------|-------|-------|
| **Hard** | `4px 4px 0px rgba(0,0,0,0.1)` | Default card shadow (industrial look) |
| **Hard Navy** | `4px 4px 0px #0A192F` | Emphasis cards, CTAs |
| **Hard Gold** | `4px 4px 0px #FFD700` | Premium/promoted cards |
| **Card** | `0 1px 3px 0 rgb(0 0 0 / 0.1)` | Subtle card elevation |
| **Card Hover** | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | Card lift on press |

### 1.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **Base (--radius)** | `2px` | Default — industrial tight corners |
| **Card** | `8px` | Cards with softer feel |
| **Button** | `4px` | Buttons — industrial style |
| **None** | `0px` | Squared industrial elements |
| **Full** | `9999px` | Pills, badges, avatars |

### 1.5 Spacing System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Card padding: 16px
- Section gap: 24px
- Screen horizontal padding: 16px
- Bottom tab bar height: 56px (Android) / 49px (iOS)
- Status bar: 44px (iOS) / 24px (Android)

### 1.6 Brand Identity Elements

**Logo:** Anchor icon with gold `#FCDD09` strokes on navy `#1E293B` background. 32x32px icon version for app icon.

**Visual Signature:**
- Maritime/industrial aesthetic — shipping, import/export theme
- Hard shadows (never soft gradients for shadows)
- Squared corners (0-4px default, never fully rounded cards)
- Monospace condition codes in ALL_CAPS with underscores
- Blueprint grid dot pattern: `20px x 20px` grid, 1px navy dots at 5% opacity
- Gold accent line (3px height) as section dividers
- Glass morphism: `backdrop-blur: 12-20px`, semi-transparent backgrounds

**Glass Effects:**
- Nav bar: `backdrop-blur: 12px`, `background: foreground/85%` (light) or `background/80%` (dark)
- Search bar: `backdrop-blur: 20px`, `background: foreground/5%`, `border: 1px solid primary/30%`
- Cards: `backdrop-blur: medium`, `background/60%`, `border: border/50%`

**Gradients:**
- Hero: Radial navy/blue ellipses + linear navy gradient
- Premium: Radial gold at 8% + radial navy at 15% + linear navy overlay
- Text gradient gold: `yellow-400 → yellow-200 → yellow-500`
- Text gradient navy: `blue-900 → blue-700 → blue-900`
- Image overlay: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)`

---

## PART 2: APP SCREEN SPECIFICATIONS

### Navigation Architecture

**Bottom Tab Bar (5 tabs):**
1. **Home** — Anchor icon — Browse marketplace
2. **Search** — Search icon — Search & filters
3. **Create** (+) — Plus in circle — Create listing (FAB-style center button, elevated, gold accent)
4. **Messages** — Message bubble icon — Conversations (badge count)
5. **Profile** — User icon — Dashboard & settings

**Admin Navigation:** Drawer/sidebar (same items as web admin sidebar: Dashboard, Listings, Users, Verifications, Promotions, Reports, Plans, AI Generator, Settings)

---

### SCREEN GROUP A: AUTHENTICATION (5 screens)

#### A1. Splash / Launch Screen
- Full navy `#0A192F` background
- Centered: Large anchor logo (gold strokes), 80x80px
- Below logo: "SABEH" in Bebas Neue, 48px, gold `#FCDD09`
- Below: "MARKET" in Rajdhani 300, 24px, white 60% opacity
- Bottom: Subtle gold accent line (3px)
- Blueprint dot grid pattern as background texture
- Fade-in animation, logo scales from 0.95 to 1.0

#### A2. Login Screen
- Top section: Navy background with anchor logo (small, 40x40) centered
- Below logo: "Welcome Back" in Rajdhani 600, 24px, white
- Subtitle: "ወደ ሳቤህ ገበያ እንኳን ደህና መጡ" in Noto Sans Ethiopic, 14px, gold light
- White card with hard shadow, containing:
  - Email input field (icon: Mail, border: `#E2E8F0`, radius: 4px)
  - Password input field (icon: Lock, show/hide toggle)
  - "Forgot Password?" link — gold text, right-aligned
  - "Sign In" button — full width, navy `#0A192F` bg, gold text, 4px radius, hard-navy shadow
  - Divider: "or" with lines
  - Google sign-in button (outline style)
- Bottom: "Don't have an account? Sign Up" — gold link

#### A3. Register Screen — Role Selection
- Same header as login (navy top with logo)
- "Join Sabeh Market" — Rajdhani 600, 24px
- "አባል ይሁኑ" subtitle in Amharic
- Two large selectable cards (hard shadow, 8px radius):
  - **Buyer** card: ShoppingBag icon (gold), "I want to buy" / "መግዛት እፈልጋለሁ", border highlights gold when selected
  - **Seller** card: Store icon (gold), "I want to sell" / "መሸጥ እፈልጋለሁ", border highlights gold when selected
- "Continue" button — gold `#FCDD09` bg, navy text, full width
- Bottom: "Already have an account? Sign In"

#### A4. Register Screen — Form
- Scrollable form card:
  - Full Name input
  - Company Name input
  - Email input
  - Phone input (with +251 Ethiopia prefix)
  - Password input (strength indicator bar)
  - Confirm Password
  - Checkbox: Accept Terms & Conditions
- "Create Account" button — gold bg, navy text, hard-gold shadow
- Progress indicator: Step 1 of 1 (or linked to onboarding)

#### A5. Forgot Password Screen
- Minimal design, navy header
- Envelope illustration or icon
- "Reset Password" title
- "Enter your email and we'll send you a reset link"
- Email input
- "Send Reset Link" button — navy bg, gold text
- "Back to Sign In" link

---

### SCREEN GROUP B: MARKETPLACE / BROWSE (8 screens)

#### B1. Home / Browse Screen
- **Status bar:** System default
- **Nav bar (glass):** Anchor logo (left), "Sabeh Market" in Rajdhani 600 (left of logo), Notification bell (right), Cart/Wishlist heart (right)
- **Search bar:** Glass effect, rounded-full, placeholder "Search products... / ምርቶችን ይፈልጉ..."
- **Category chips:** Horizontal scroll — "All", "Vehicles", "Electronics", "Machinery", "Construction", "Medical", "Agriculture", "Parts" — gold underline on active
- **Featured Banner:** Full-width card, navy gradient background, gold accent text "Premium Listings", see-all button
- **Listing Grid:** 2-column grid
  - Each card: Image (aspect 4:3, radius 8px top), overlay gradient at bottom
  - Badge: Condition code in monospace (`NEW_DELIVERY`), gold bg, navy text, pill shape
  - Title: Jakarta 600, 15px, 2-line clamp
  - Price: Rajdhani 700, 18px, gold color (or "Contact for Price")
  - Location: MapPin icon + city name, muted text, 12px
  - Seller verification badge (blue checkmark if verified)
  - Hard shadow on cards (`4px 4px 0px rgba(0,0,0,0.1)`)
- **Bottom Tab Bar:** 5 tabs as specified

#### B2. Search & Filter Screen
- Top: Large search input with auto-focus, glass background
- Recent searches (clock icon + text)
- Popular searches (trending tags, pill badges)
- When typing: Live suggestions dropdown
- Filter button → opens filter bottom sheet

#### B3. Filter Bottom Sheet
- Drag handle at top
- **Category:** Horizontal chips (multi-select)
- **Condition:** Chips — `NEW_DELIVERY`, `OP_GOOD`, `SALVAGE`, `CERT_MINT`, `REFURBISHED`
- **Price Range:** Dual slider (gold track, navy handles)
- **Location:** Dropdown selector
- **Sort By:** Radio list — Newest, Price Low→High, Price High→Low, Most Popular
- **Verification:** Toggle — "Verified Sellers Only"
- "Apply Filters" button (gold, full-width) + "Reset" link
- Results count preview: "Showing 142 listings"

#### B4. Category Detail Screen
- Category hero: Full-width image with navy gradient overlay
- Category name in Rajdhani 700, 28px, white
- Amharic name below in Noto Sans Ethiopic
- Sub-category chips below hero
- Listing grid (same card style as home)
- Sticky filter bar at top on scroll

#### B5. Listing Detail Screen
- **Image Gallery:** Full-width swipeable images, page indicator dots (gold active), share button overlay
- **Price Section:** Large price in Rajdhani 700, 28px + condition badge
- **Title:** Jakarta 700, 20px
- **Quick Info Row:** Location | Posted date | Views count
- **Gold accent line divider (3px)**
- **Description Section:** Expandable text, "Read more" link
- **Specifications:** Key-value pairs in a bordered table
  - Labels in muted text, values in bold
  - Condition code in monospace
- **Seller Card:** Avatar, name, verified badge, rating stars, "Contact Seller" button (navy bg, gold text), "View Profile" link
- **Similar Listings:** Horizontal scroll of cards
- **Bottom Action Bar (sticky):** "Contact Seller" (navy bg, gold text, full width) + Heart/Wishlist icon button

#### B6. Image Gallery (Full Screen)
- Black background
- Swipeable images, pinch to zoom
- Page counter: "3 / 8"
- Close (X) button top-right
- Thumbnail strip at bottom

#### B7. Seller Profile Screen
- Profile header: Cover image (navy gradient if none), avatar (64px, circular), seller name, verified badge
- Stats row: Listings count | Rating | Member since
- "Contact" button + "Report" link
- **Active Listings tab:** Grid of their products
- **Reviews tab:** Star ratings + text reviews
- **About tab:** Company info, location, description

#### B8. Wishlist / Saved Items Screen
- Grid of saved listing cards (same style as browse)
- Empty state: Heart icon, "No saved items yet", "Start browsing" CTA
- Swipe-to-remove gesture on cards

---

### SCREEN GROUP C: DASHBOARD (8 screens)

#### C1. Dashboard Home
- Welcome header: "Hello, [Name]" / "ሰላም, [ስም]"
- Quick stats cards (2x2 grid):
  - Active Listings (number + icon)
  - Total Views (number + trending arrow)
  - Messages (number + badge)
  - Wishlist Items (number + heart)
- Each stat card: White bg, hard shadow, gold accent line top (3px)
- **Recent Activity:** Timeline list (listing approved, new message, etc.)
- **Quick Actions:** "Create Listing" button (gold, prominent), "View Messages"

#### C2. My Listings Screen
- Tab bar: "Active" | "Pending" | "Draft" | "Expired"
- List of listing cards (horizontal layout):
  - Thumbnail (64x64, 8px radius)
  - Title, price, status badge (green Active, yellow Pending, gray Draft)
  - Views count, messages count
  - 3-dot menu (Edit, Promote, Deactivate, Delete)
- FAB: "+" Create Listing (gold bg, navy icon)
- Empty state per tab

#### C3. Create Listing Wizard — Step 1: Category
- Progress bar: Step 1 of 4, gold fill
- "Select Category" title
- Large category cards in grid (2 columns):
  - Icon + Category name
  - Gold border on selected
- Sub-category selector (appears after main category selection)
- "Next" button (gold, full width)

#### C4. Create Listing Wizard — Step 2: Details
- Progress bar: Step 2 of 4
- Form fields:
  - Title input
  - Description (multiline textarea, character count)
  - Condition dropdown: `NEW_DELIVERY`, `OP_GOOD`, `SALVAGE`, `CERT_MINT`, `REFURBISHED`
  - Price input (with currency: ETB/USD toggle)
  - "Contact for Price" toggle
  - Location selector
  - Specifications (dynamic key-value fields, "Add Field" button)
- "Back" + "Next" buttons

#### C5. Create Listing Wizard — Step 3: Photos
- Progress bar: Step 3 of 4
- Photo grid (3 columns):
  - First slot: Large "Add Photo" with camera icon (dashed border, gold icon)
  - Uploaded photos with X remove button
  - Drag to reorder
- "Minimum 1 photo, maximum 10"
- Cover photo indicator (star badge on first photo)
- **AI Generate button:** Sparkles icon, "Generate with AI" (links to AI image tool)
- "Back" + "Next" buttons

#### C6. Create Listing Wizard — Step 4: Review & Publish
- Progress bar: Step 4 of 4
- Preview card showing how listing will look
- All entered details in read-only format
- Edit links per section
- "Publish Listing" button — gold bg, hard-gold shadow, navy text, full width
- "Save as Draft" secondary button

#### C7. Messages List Screen
- Search bar at top
- Conversation list:
  - Avatar (48px, circular), sender name, verified badge
  - Last message preview (1 line, truncated)
  - Timestamp (relative: "2h ago")
  - Unread indicator (gold dot)
  - Product thumbnail (small, 32px) if conversation is about a listing
- Empty state: Message bubble icon, "No messages yet"

#### C8. Message Thread Screen
- Header: Back arrow, avatar + name, online status dot (green), listing title
- Messages: Chat bubbles
  - Sent: Navy bg, white text, right-aligned, 8px radius
  - Received: White bg (with border), navy text, left-aligned, 8px radius
  - Timestamps between message groups
  - Image messages (rounded, tappable)
- Listing card embedded at top of conversation (mini preview)
- Bottom input bar: Text input, camera button, send button (gold bg, navy icon)

---

### SCREEN GROUP D: ONBOARDING (1 multi-step screen)

#### D1. Onboarding Wizard (4 steps in 1 screen)
- Clean white background
- Step indicator: 4 dots, gold active, muted inactive
- **Step 1 — Profile:** Avatar upload (circular, camera overlay), name, phone
- **Step 2 — Company:** Company name, type (Importer/Exporter/Both), address, business license number
- **Step 3 — Plan Selection:** 3 plan cards stacked:
  - Basic (free): Muted border, simple features list
  - Professional: Gold border, "Popular" badge, expanded features
  - Enterprise: Navy bg, gold text, premium features
  - Each card: Plan name, price, feature checkmarks, "Select" button
- **Step 4 — Verification:** Upload business documents (file picker), ID upload, submission confirmation
- "Skip for Now" link + "Continue" button per step

---

### SCREEN GROUP E: SETTINGS (4 screens)

#### E1. Account Settings
- Profile section: Avatar, name, email, "Edit Profile" button
- Settings list (grouped):
  - **Account:** Change Password, Email Preferences, Language (English/አማርኛ)
  - **Notifications:** Push notifications toggle, Email notifications toggle, Message alerts toggle
  - **Appearance:** Dark mode toggle (sun/moon icon)
  - **Privacy:** Profile visibility, Contact preferences
  - **Support:** Help Center, Report a Problem, Terms of Service, Privacy Policy
  - **Danger Zone:** Deactivate Account (destructive red)
- "Sign Out" button at bottom (outline style, destructive)

#### E2. Verification Upload Screen
- Status card: Current verification status (Pending/Verified/Rejected) with appropriate icon and color
- Required documents list:
  - Business License (upload area with dashed border)
  - Trade License (upload area)
  - Tax ID (upload area)
  - Company Letterhead (optional)
- Upload state: Uploading spinner → Uploaded (green check) → Review pending (yellow clock)
- "Submit for Verification" button

#### E3. Notification Preferences
- Toggle list with descriptions:
  - New messages
  - Listing updates (approved/rejected)
  - Price alerts
  - Promotional offers
  - Weekly digest email
- Each toggle: Label, description, switch (gold when active)

#### E4. Language Selection
- Two large cards:
  - **English** — with small sample text preview
  - **አማርኛ (Amharic)** — with Amharic sample text
- Gold border on selected
- "App will restart to apply changes" note

---

### SCREEN GROUP F: ADMIN PANEL (9 screens)

> Admin uses a **drawer navigation** pattern instead of bottom tabs.

#### F1. Admin Dashboard
- Drawer menu button (hamburger) top-left
- "Admin Panel" title in Rajdhani 600
- Stats cards (2x2 grid):
  - Total Users (Users icon)
  - Active Listings (Package icon)
  - Pending Verifications (BadgeCheck icon)
  - Reports (Flag icon)
- Each card: Number (large, Rajdhani 700, 32px), label, small trend indicator, hard shadow
- **Charts:**
  - New listings line chart (last 30 days)
  - Revenue bar chart (if applicable)
- **Recent Activity feed:** Scrollable list of recent actions

#### F2. Admin — Listings Moderation
- Tab bar: "Pending Review" | "Active" | "Rejected" | "All"
- List items:
  - Listing thumbnail, title, seller name, submitted date
  - Status badge
  - "Approve" (green) + "Reject" (red) quick action buttons for pending
- Pull-to-refresh
- Search bar at top

#### F3. Admin — Users Management
- Search + filter bar
- User list:
  - Avatar, name, email, role badge (User/Seller/Admin), verification status
  - Joined date
  - Tap to view details
- User detail: Full profile, activity log, listings, "Ban User" / "Make Admin" actions

#### F4. Admin — Verifications
- Tabs: "Pending" | "Approved" | "Rejected"
- Cards for each verification request:
  - Company name, applicant name, submitted date
  - Document thumbnails (tappable to view full)
  - "Approve" / "Reject" buttons
  - Notes input field for rejection reason

#### F5. Admin — Promotions
- List of promoted listings
- "Create Promotion" button
- Promotion card: Listing preview, start/end date, position (Featured/Homepage/Category), status
- Edit/Delete actions

#### F6. Admin — Reports
- Tabs: "Open" | "In Review" | "Resolved"
- Report cards:
  - Reporter name, reported item/user, reason, date
  - "Review" button → detail view
  - Resolve/Dismiss actions

#### F7. Admin — Plans Management
- List of subscription plans
- Each plan card: Name, price, features list, subscriber count
- "Edit Plan" / "Deactivate" actions
- "Create New Plan" button

#### F8. Admin — AI Generator
- Two tabs: "Create Ad" | "Image Studio"
- **Create Ad tab:**
  - Product name input
  - Product details textarea
  - Language selector (EN/AM)
  - Tone selector chips (Professional, Casual, Luxury, Technical)
  - "Generate" button (sparkles icon)
  - Output card: Generated text with copy button
- **Image Studio tab:**
  - Prompt input (multiline)
  - Style selector chips: Product Shot, Lifestyle, Minimal, Dramatic
  - Optional: Reference image upload
  - Aspect ratio selector: 1:1, 16:9, 9:16, 4:3, 3:4
  - "Generate Image" button
  - Result: Full-width generated image preview with download/share buttons

#### F9. Admin — System Settings
- General: Platform name, description, contact email
- Features toggles: Maintenance mode, Registration enabled, AI features enabled
- Moderation: Auto-approve listings toggle, word filter
- System info: Version, last deploy, environment

---

### SCREEN GROUP G: INFORMATION PAGES (3 screens)

#### G1. Guide / Help Screen
- Accordion sections with chapter numbers:
  1. Getting Started
  2. For Buyers
  3. For Sellers
  4. Messaging
  5. Verification
  6. Pricing Plans
  7. AI Tools
  8. Admin Panel (visible to admins only)
- Each section: Icon, title (Rajdhani 600), expandable content
- Search bar at top for quick find
- "Contact Support" sticky button at bottom

#### G2. Pricing Plans Screen
- 3 plan cards stacked vertically:
  - **Basic (Free):** Muted border, limited features
  - **Professional:** Gold border, "Most Popular" ribbon badge, expanded features
  - **Enterprise:** Navy background, gold text, all features
- Feature comparison list with check/x marks
- "Current Plan" indicator for logged-in users
- "Upgrade" CTA button per plan (gold for Professional, navy for Enterprise)
- FAQ section at bottom

#### G3. About Screen
- Company info section
- Mission statement
- Team section (if applicable)
- Contact information
- Social media links
- App version info at bottom

---

### SCREEN GROUP H: UTILITY SCREENS (5 screens)

#### H1. Loading / Skeleton Screen
- Shimmer animation on placeholder blocks
- Matches the layout of the screen being loaded
- Pulse animation: opacity 1 → 0.7 → 1, 2s ease-in-out infinite
- Gradient shimmer: moving highlight, 2s infinite

#### H2. Empty State Screens
- Centered illustration/icon (64px, muted color)
- Title: "No [items] yet" in Rajdhani 600, 18px
- Description: Jakarta 400, 14px, muted text
- CTA button (gold or outline)
- Examples: No listings, No messages, No results, No notifications

#### H3. Error State Screen
- Warning/error icon (destructive color)
- "Something went wrong" title
- "Try again" button + "Go home" link

#### H4. Pull-to-Refresh
- Gold spinner/indicator at top of scrollable lists
- Anchor icon rotates during refresh

#### H5. Toast / Snackbar Notifications
- Bottom-positioned, navy bg, white text, gold action button
- Types: Success (green left border), Error (red left border), Info (blue left border)
- Auto-dismiss after 3 seconds
- Swipe to dismiss

---

## PART 3: PLATFORM-SPECIFIC ADAPTATIONS

### Android (Material Design 3)

**Navigation:**
- Bottom Navigation Bar (5 items, Material 3 style)
- Navigation Drawer for Admin
- Top App Bar: Rajdhani title, centered, with search action
- FAB for "Create Listing" — gold `#FCDD09`, navy icon, positioned above bottom nav

**Components:**
- Material 3 chips for filters and categories
- Bottom sheets for filters (modal bottom sheet)
- Snackbars for toast notifications (bottom-positioned)
- Material 3 switches for toggles
- Outlined text fields with border radius 4px
- Filled buttons with hard shadow

**Dynamic Color:**
- Seed color: Navy `#0A192F`
- Secondary seed: Gold `#FCDD09`
- Generate Material You palette from these seeds
- Maintain exact brand colors for key elements (don't let dynamic color override primary navy/gold)

**Typography Mapping:**
- displayLarge: Bebas Neue 400
- headlineLarge: Rajdhani 600
- headlineMedium: Rajdhani 600
- titleLarge: Jakarta 600
- titleMedium: Jakarta 600
- bodyLarge: Jakarta 400
- bodyMedium: Jakarta 400
- labelLarge: Jakarta 500
- labelSmall: System monospace (condition codes)

**Specific Android Patterns:**
- Edge-to-edge design (content behind system bars)
- Predictive back gesture support
- Share sheet for listing sharing
- Material 3 date/time pickers
- Splash screen API with animated anchor logo

### iOS (Human Interface Guidelines)

**Navigation:**
- UITabBar (5 items) with SF Symbol icons
- UINavigationController with large title style ("Sabeh Market")
- Sheet presentations for filters (medium → large detent)
- Action sheets for destructive actions

**Components:**
- SF Symbols for system icons (map to Lucide equivalents)
- UISwitch for toggles (tinted gold when on)
- Grouped UITableView style for settings
- Pull-to-refresh with custom gold spinner
- Context menus (long-press) on listing cards

**Typography Mapping:**
- largeTitle: Rajdhani 700 (custom, replacing SF Pro)
- title1: Rajdhani 600
- title2: Rajdhani 600
- headline: Jakarta 600
- body: Jakarta 400
- callout: Jakarta 400
- caption1: Jakarta 400
- caption2: System monospace (condition codes)

**Specific iOS Patterns:**
- Dynamic Type support (Accessibility)
- Haptic feedback: Light impact on button taps, medium on actions, notification on success/error
- Widget support: Quick listing stats widget (small/medium)
- Live Activities for order/delivery tracking (future)
- App Clips for quick listing view from shared links

---

## PART 4: INTERACTION & ANIMATION SPECIFICATIONS

### Transitions
- **Screen transitions:** Horizontal slide (push/pop), 300ms ease-out
- **Modal presentations:** Bottom-to-top slide, 350ms spring
- **Tab switches:** Cross-fade, 200ms ease
- **Bottom sheet:** Spring animation, velocity-based

### Card Interactions
- **Press:** translateY(-2px), shadow increases to card-hover, 200ms ease
- **Release:** Bounce back to original, 150ms ease
- **Long press:** Scale to 0.98, show context menu (iOS) or options (Android)
- **Swipe (wishlist):** Swipe-to-remove with red background reveal

### List Animations
- **Stagger enter:** Each item fades in with 50ms delay:
  - Child 1: 50ms delay
  - Child 2: 100ms delay
  - Child 3: 150ms delay
  - ...up to child 10: 500ms delay
- **Animation:** fade-in-up (translateY 20px → 0, opacity 0 → 1, 600ms ease-out)

### Image Gallery
- **Swipe:** Horizontal paging with momentum
- **Pinch to zoom:** Spring-based, min 1x, max 4x
- **Double tap:** Toggle between 1x and 2x zoom
- **Page indicator:** Dots with gold active, 6px diameter, 8px gap

### Loading States
- **Skeleton shimmer:** Background position -200% → 200%, 2s infinite
- **Pulse soft:** Opacity 1 → 0.7 → 1, 2s ease-in-out infinite
- **Float animation:** translateY(0) → translateY(-6px) → translateY(0), 3s ease-in-out infinite
- **Pull to refresh:** Custom anchor icon rotation

### Scroll Behavior
- **Glass nav bar:** Becomes translucent on scroll (`backdrop-blur: 12px`)
- **Sticky category bar:** Pins below nav bar on scroll
- **Parallax hero:** Image moves at 0.5x scroll speed
- **Scroll-to-top:** Floating button appears after scrolling 3 screens

### Micro-interactions
- **Like/Wishlist:** Heart fills with scale bounce (1 → 1.3 → 1, 300ms spring)
- **Send message:** Input slides up, message bubble animates in from right
- **Tab badge:** Gold dot bounces in on new notification
- **Verification badge:** Subtle pulse on first reveal

---

## PART 5: GENERATION INSTRUCTIONS

When generating each screen:

1. **Show both Light and Dark mode versions** side by side
2. **Use exact hex colors** from the token table — never approximate
3. **Include realistic content:**
   - Product names: "CAT 320D Excavator", "Toyota Hilux 2023 Double Cab", "Komatsu WA380 Wheel Loader"
   - Prices: "ETB 2,500,000" or "$45,000" or "Contact for Price"
   - Condition codes in monospace: `NEW_DELIVERY`, `OP_GOOD`, `SALVAGE`
   - Amharic text where appropriate: "ሳቤህ ገበያ", "ምርቶችን ይፈልጉ", "ዋጋ ያነጋግሩ"
   - Ethiopian locations: Addis Ababa, Dire Dawa, Mekelle, Hawassa
   - Seller names: "Abebe Trading PLC", "Habesha Motors", "Ethio-Import Co."
4. **Apply hard shadows** — this is the signature visual. Every card must have `4px 4px 0px` shadow
5. **Use industrial typography** — Rajdhani for headers, monospace for codes, never playful fonts
6. **Include the gold accent line** (3px) as a separator in key screens
7. **Show the blueprint dot grid** pattern subtly in backgrounds where appropriate
8. **Device frame:** Show within an iPhone 14 or Pixel 7 device frame
9. **Annotations:** Label key elements with their exact font, size, color, and spacing values

---

## SCREEN GENERATION ORDER

Generate screens in this priority order:

**Priority 1 — Core Flow (generate first):**
1. A1 — Splash Screen
2. A2 — Login Screen
3. B1 — Home / Browse Screen
4. B5 — Listing Detail Screen
5. C8 — Message Thread Screen

**Priority 2 — Key Flows:**
6. A3 — Register (Role Selection)
7. B3 — Filter Bottom Sheet
8. C1 — Dashboard Home
9. C3-C6 — Create Listing Wizard (all 4 steps)
10. C7 — Messages List

**Priority 3 — Supporting Screens:**
11. B2 — Search Screen
12. B4 — Category Detail
13. B7 — Seller Profile
14. D1 — Onboarding Wizard
15. E1 — Account Settings
16. G2 — Pricing Plans

**Priority 4 — Admin & Utility:**
17. F1 — Admin Dashboard
18. F2 — Listings Moderation
19. F8 — AI Generator
20. H1 — Skeleton Loading States
21. H2 — Empty States

---

## SUMMARY CHECKLIST

Before finalizing, verify:
- [ ] All 42+ screens are designed
- [ ] Both Light and Dark mode for each
- [ ] Both Android and iOS adaptations noted
- [ ] Exact hex colors used (no approximations)
- [ ] Rajdhani for headers, Jakarta for body, Bebas Neue for splash
- [ ] Hard shadows on all cards (`4px 4px 0px`)
- [ ] Industrial/maritime aesthetic maintained
- [ ] Monospace condition codes present
- [ ] Gold accent lines as dividers
- [ ] Glass morphism on nav bars
- [ ] Amharic text samples included
- [ ] Bottom tab bar with 5 items on all main screens
- [ ] Blueprint dot grid pattern in backgrounds
- [ ] Realistic Ethiopian B2B marketplace content
