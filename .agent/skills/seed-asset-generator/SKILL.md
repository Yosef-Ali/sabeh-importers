---
name: seed-asset-generator
description: Expert guidance for generating high-quality, diverse 5-image asset sets for seed products in the Sabeh Marketplace. Ensures consistent detail views across different product categories (Motors, Property, Electronics, etc.).
---

# Seed Asset Generator

This skill defines the standard procedure for generating and integrating a set of 5 unique images for each seed product in the marketplace.

## The 5-Image Pattern

Every high-quality seed product should have exactly 5 images representating different perspectives:

1.  **Hero Shot**: The primary view (Exterior for property, Front-side for car, Product-front for electronics).
2.  **Interior/Context 1**: The main living space, car dashboard, or product in use.
3.  **Detail/Context 2**: A secondary important area (Bedroom, Engine, Port details).
4.  **Utility/Context 3**: Kitchen, Rear/Trunk, or accessories.
5.  **Atmospheric/Context 4**: Pool at sunset, high-speed motion shot, or lifestyle background.

## Directory Structure

Images should be organized by category and product slug:
`public/images/products/[category]/[product-slug]/`

Example:
`public/images/products/property/luxury-villa/exterior.png`

## Generation Guidelines

Use the `generate_image` tool with the following prompt principles:
- **Style**: "Professional architectural photography", "Automotive editorial style", or "High-end product studio lighting".
- **Context**: Mention "inspired by Ethiopian aesthetics" or "modern Addis Ababa context" for property and local services.
- **Resolution**: Always specify "8k resolution, premium feel".

## Seeding Integration

In `src/db/seed.ts`, use the `detailedProducts` map constant to define these sets:

```typescript
const detailedProductAssets = {
  'luxury-villa': [
    '/images/products/property/luxury-villa/exterior.png',
    '/images/products/property/luxury-villa/living-room.png',
    // ... total 5
  ],
};
```

Update the generation loop to check this map before falling back to generic placeholder arrays.
