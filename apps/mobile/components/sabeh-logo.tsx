import { View, Text } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { colors } from "@/lib/theme";

/**
 * Sabeh brand mark for native — navy box + gold-trimmed anchor SVG inline,
 * optionally with the SABEH wordmark to the right. Inlined SVG (not the
 * web's /Sabeh_Logo_Icon.svg from /public) since RN doesn't have an
 * equivalent of next/image with SVG support without an extra transformer.
 */
type Size = "sm" | "default" | "lg";

const SIZE_MAP: Record<Size, { box: number; svg: number; wordmark: number }> = {
  sm: { box: 32, svg: 18, wordmark: 16 },
  default: { box: 40, svg: 22, wordmark: 20 },
  lg: { box: 56, svg: 30, wordmark: 26 },
};

export function SabehLogo({
  size = "default",
  withWordmark = false,
  tone = "light",
}: {
  size?: Size;
  withWordmark?: boolean;
  /** "light" wordmark (white) for navy/gold surfaces, "dark" (navy) for light surfaces. */
  tone?: "light" | "dark";
}) {
  const dims = SIZE_MAP[size];

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View
        style={{
          width: dims.box,
          height: dims.box,
          backgroundColor: colors.navy,
          borderWidth: 1,
          borderColor: "rgba(255, 215, 0, 0.4)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg width={dims.svg} height={dims.svg} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C8 2 4 5 4 10c0 6 8 12 8 12s8-6 8-12c0-5-4-8-8-8z"
            stroke={colors.gold}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={12} cy={10} r={2.5} stroke={colors.gold} strokeWidth={1.8} />
          <Path
            d="M7 16l5 4 5-4"
            stroke={colors.gold}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line x1={12} y1={2} x2={12} y2={6} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      </View>
      {withWordmark && (
        <Text
          style={{
            fontFamily: "SpaceGrotesk_700Bold",
            fontSize: dims.wordmark,
            fontWeight: "700",
            color: tone === "light" ? colors.white : colors.navy,
            letterSpacing: -0.3,
            textTransform: "uppercase",
          }}
        >
          SABEH
        </Text>
      )}
    </View>
  );
}
