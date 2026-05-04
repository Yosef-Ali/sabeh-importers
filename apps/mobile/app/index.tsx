import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SabehLogo } from "@/components/sabeh-logo";
import { colors, shadows } from "@/lib/theme";

/**
 * Splash / welcome screen. Sabeh logo + Amharic eyebrow + "Get Started" CTA.
 * Mirrors SCREEN 1 of Sabeh Mobile Flow.html (navy bg, blueprint dot grid,
 * gold accent rule, version pinned bottom).
 *
 * Tapping "Get Started" routes into the (tabs) navigator, landing on Home.
 */
export default function Splash() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.navy,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
      }}
    >
      <SabehLogo size="lg" />

      <Text
        style={{
          fontFamily: "SpaceGrotesk_700Bold",
          fontSize: 44,
          color: colors.gold,
          letterSpacing: 4,
          marginTop: 24,
          fontWeight: "700",
        }}
      >
        SABEH
      </Text>
      <Text
        style={{
          fontFamily: "DMSans_400Regular",
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: 6,
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        MARKET
      </Text>

      <View style={{ width: 60, height: 3, backgroundColor: colors.gold, marginVertical: 32 }} />

      <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: "rgba(255,215,0,0.5)", marginBottom: 60 }}>
        ሳቤህ ገበያ
      </Text>

      <Pressable
        onPress={() => router.replace("/(tabs)" as any)}
        style={({ pressed }) => [
          {
            backgroundColor: colors.gold,
            paddingHorizontal: 48,
            paddingVertical: 14,
            transform: [{ translateX: pressed ? 2 : 0 }, { translateY: pressed ? 2 : 0 }],
            ...(pressed ? {} : shadows.hard),
          },
        ]}
      >
        <Text
          style={{
            color: colors.navy,
            fontFamily: "SpaceGrotesk_700Bold",
            fontSize: 13,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 1.4,
          }}
        >
          Get Started
        </Text>
      </Pressable>

      <Text
        style={{
          position: "absolute",
          bottom: 36,
          fontFamily: "SpaceMono_700Bold",
          fontSize: 9,
          color: "rgba(255,255,255,0.15)",
          textTransform: "uppercase",
          letterSpacing: 1.6,
        }}
      >
        v0.1.0 · 2026
      </Text>
    </View>
  );
}
