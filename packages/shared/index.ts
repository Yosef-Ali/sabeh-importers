/**
 * @sabeh/shared — code shared between the Next.js web app (root) and
 * the Expo mobile app (apps/mobile). Pure types and constants only;
 * NO React, no platform-specific APIs, no DB drivers.
 *
 * Resolution:
 *   - Web (Next.js):  via tsconfig path "@sabeh/shared/*" → "./packages/shared/*"
 *   - Mobile (Expo):  via tsconfig path + Metro `watchFolders` (see
 *                     apps/mobile/metro.config.js)
 */
export * from "./enums";
export * from "./categories";
export * from "./status-meta";
export * from "./format";
