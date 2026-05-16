import { useState } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { colors, shadows } from "@/lib/theme";

/**
 * Sabeh button — gold bg, navy text, hard navy shadow on default. Native
 * equivalent of the web Button primitive (variants: default / outline /
 * ghost). Uses native StyleSheet for the hard shadow because NativeWind
 * can't express `shadow-color: navy + offset 4,4 + 0 blur` cleanly.
 *
 * Uses onPressIn/onPressOut + useState (instead of Pressable's style callback)
 * to avoid NativeWind's JSX transform swallowing function-style style props.
 */
type Variant = "default" | "outline" | "ghost";
type Size = "default" | "lg" | "sm";

const SIZE_PADDING: Record<Size, { px: number; py: number; fontSize: number }> = {
  sm: { px: 14, py: 8, fontSize: 11 },
  default: { px: 24, py: 12, fontSize: 13 },
  lg: { px: 32, py: 16, fontSize: 14 },
};

export function Button({
  children,
  variant = "default",
  size = "default",
  fullWidth = false,
  disabled = false,
  onPress,
  ...rest
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
} & Omit<PressableProps, "children">) {
  const [pressed, setPressed] = useState(false);

  const dims = SIZE_PADDING[size];
  const isPrimary = variant === "default";
  const isOutline = variant === "outline";

  const bg = isPrimary ? colors.gold : "transparent";
  const fg = isPrimary ? colors.navy : colors.foreground;
  const borderColor = isOutline ? colors.foreground : "transparent";

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={{
        backgroundColor: bg,
        paddingHorizontal: dims.px,
        paddingVertical: dims.py,
        borderWidth: isOutline ? 1 : 0,
        borderColor,
        borderRadius: 0,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? "100%" : undefined,
        transform: [
          { translateX: pressed && isPrimary ? 2 : 0 },
          { translateY: pressed && isPrimary ? 2 : 0 },
        ],
        ...(isPrimary && !pressed ? shadows.hard : {}),
      }}
      {...rest}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {typeof children === "string" ? (
          <Text
            style={{
              color: fg,
              fontFamily: "SpaceGrotesk_700Bold",
              fontSize: dims.fontSize,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              fontWeight: "700",
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}
