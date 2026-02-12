---
page: seller-dashboard
---
Create the Seller Dashboard layout and "My Listings" view for Sabeh Importers.

**DESIGN SYSTEM (REQUIRED):**
[Refer to DESIGN.md for full specs]
- **Theme:** "Zone B" - Clean, functional, data-centric.
- **Colors:** White background, Slate accents. Green for primary actions.

**Components Required:**
1.  **Dashboard Sidebar:** Navigation (Overview, My Listings, Messages, Settings).
2.  **Dashboard Header:** Breadcrumbs, User Profile dropdown.
3.  **My Listings Table:**
    - Columns: Image, Title, Price, Status (Active/Pending), Actions (Edit/Delete).
    - Status Badges: Green (Active), Yellow (Pending), Red (Rejected).

**Structure:**
- `src/app/(dashboard)/layout.tsx` for the Sidebar/Header wrapper.
- `src/app/(dashboard)/my-listings/page.tsx` for the table view.