/**
 * Sabeh design tokens — exported for cases where StyleSheet (not NativeWind)
 * is needed (e.g. shadow color on iOS, dynamic style construction).
 *
 * Mirrors apps/mobile/tailwind.config.js + the web Tailwind config so the
 * two surfaces stay visually aligned.
 */
export const colors = {
  navy: "#0A192F",
  navyDeep: "#060d17",
  navyLight: "#1a2d4a",
  gold: "#FFD700",
  goldLight: "#FDE968",
  goldDark: "#a08339",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  foreground: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  success: "#10B981",
  destructive: "#EF4444",
  warning: "#FCD34D",
  white: "#FFFFFF",
} as const;

/**
 * The signature Sabeh "hard shadow": 4px navy offset, no blur. iOS native
 * shadow API and Android elevation can't perfectly replicate this — closest
 * approximation here. For pixel-perfect, render a navy <View> behind the
 * element with translateX/Y(4).
 */
export const shadows = {
  hard: {
    shadowColor: colors.navy,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  hardGold: {
    shadowColor: colors.gold,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
} as const;
