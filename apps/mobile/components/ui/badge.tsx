import { View, Text } from "react-native";
import { colors } from "@/lib/theme";

/**
 * Sabeh badge — sharp corners, mono uppercase tracking-widest. Used for
 * condition tags, verified marks, status pills.
 */
type Variant = "default" | "gold" | "success" | "destructive" | "warning" | "outline";

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  default: { bg: colors.navy, fg: colors.surface, border: colors.navy },
  gold: { bg: colors.gold, fg: colors.navy, border: colors.gold },
  success: { bg: colors.success, fg: colors.surface, border: colors.success },
  destructive: { bg: colors.destructive, fg: colors.surface, border: colors.destructive },
  warning: { bg: "#FFFBEB", fg: "#92400e", border: colors.warning },
  outline: { bg: "transparent", fg: colors.foreground, border: colors.border },
};

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  const v = VARIANTS[variant];
  return (
    <View
      style={{
        backgroundColor: v.bg,
        borderWidth: 1,
        borderColor: v.border,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: v.fg,
          fontFamily: "SpaceMono_700Bold",
          fontSize: 9,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 1.4,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
