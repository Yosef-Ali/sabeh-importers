import { useState } from "react";
import { View, Text, Pressable, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SabehLogo } from "@/components/sabeh-logo";
import { ListingCard } from "@/components/listing-card";
import { CATEGORIES, LISTINGS } from "@/lib/mock-data";
import { colors, shadows } from "@/lib/theme";

type McIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
const CATEGORY_ICONS: Record<string, McIconName> = {
  Motors:      "car",
  Electronics: "cellphone",
  Machinery:   "hammer-wrench",
  Property:    "home-city",
  Industrial:  "factory",
  Agriculture: "sprout",
};
const GRID_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

/**
 * Home / Browse screen — Sabeh Mobile Flow SCREEN 2.
 * Header (logo + notif + avatar) → search bar → featured banner →
 * 3×2 category grid → 2-col listings grid.
 */
export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <SabehLogo size="sm" withWordmark tone="dark" />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications — opens messages"
              onPress={() => router.push("/(tabs)/messages" as any)}
              hitSlop={6}
              style={{
                width: 36,
                height: 36,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="bell" size={16} color={colors.foreground} />
            </Pressable>
            <View
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 14,
                height: 14,
                backgroundColor: colors.destructive,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: colors.surface, fontFamily: "SpaceMono_700Bold", fontSize: 8 }}>2</Text>
            </View>
          </View>
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: colors.navy,
              borderWidth: 1,
              borderColor: colors.gold,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.gold, fontFamily: "SpaceGrotesk_700Bold", fontSize: 14 }}>A</Text>
          </View>
        </View>
      </View>

      {/* Search bar */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: colors.surface,
          borderBottomWidth: 2,
          borderBottomColor: colors.gold,
        }}
      >
        <Pressable
          accessibilityRole="search"
          onPress={() => router.push("/(tabs)/search" as any)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Feather name="search" size={16} color={colors.muted} />
          <Text style={{ flex: 1, fontFamily: "DMSans_400Regular", fontSize: 13, color: colors.muted }}>
            Search listings… / ምርቶችን ይፈልጉ
          </Text>
          <Feather name="sliders" size={14} color={colors.muted} />
        </Pressable>
      </View>

      {/* Scroll body */}
      <FlatList
        data={LISTINGS}
        keyExtractor={(l) => l.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        ListHeaderComponent={
          <View>
            {/* Featured banner */}
            <View
              style={{
                margin: 16,
                marginBottom: 16,
                backgroundColor: colors.navy,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: colors.gold,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                ...shadows.hardGold,
              }}
            >
              <View style={{ gap: 4 }}>
                <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.gold, textTransform: "uppercase", letterSpacing: 2 }}>
                  ⭐ Featured
                </Text>
                <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 18, color: colors.surface, textTransform: "uppercase" }}>
                  Premium Listings
                </Text>
                <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 11, color: "rgba(255,215,0,0.6)" }}>
                  ልዩ ምርቶች
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="See all featured listings"
                onPress={() => router.push("/(tabs)/search" as any)}
                style={{
                  backgroundColor: colors.gold,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  ...shadows.hard,
                }}
              >
                <Text style={{ color: colors.navy, fontFamily: "SpaceGrotesk_700Bold", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>
                  See All
                </Text>
              </Pressable>
            </View>

            {/* Category grid — 3×2, tap-to-toggle filter */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingTop: 4,
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.5 }}>
                Categories / ምድቦች
              </Text>
              {activeCategory !== "All" && (
                <Pressable onPress={() => setActiveCategory("All")} hitSlop={8}>
                  <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.gold, textTransform: "uppercase", letterSpacing: 1 }}>
                    Clear ✕
                  </Text>
                </Pressable>
              )}
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
              {[0, 3].map((rowStart) => (
                <View key={rowStart} style={{ flexDirection: "row", gap: 8 }}>
                  {GRID_CATEGORIES.slice(rowStart, rowStart + 3).map((cat) => {
                    const active = cat === activeCategory;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setActiveCategory(active ? "All" : cat)}
                        style={{
                          flex: 1,
                          aspectRatio: 1.15,
                          backgroundColor: active ? colors.gold : colors.surface,
                          borderWidth: 1,
                          borderColor: active ? colors.navy : colors.border,
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          ...(active ? shadows.hard : {}),
                        }}
                      >
                        <MaterialCommunityIcons
                          name={CATEGORY_ICONS[cat]}
                          size={24}
                          color={active ? colors.navy : colors.foreground}
                        />
                        <Text
                          style={{
                            color: active ? colors.navy : colors.muted,
                            fontFamily: "SpaceGrotesk_700Bold",
                            fontSize: 9,
                            textTransform: "uppercase",
                            letterSpacing: 0.8,
                            textAlign: "center",
                          }}
                          numberOfLines={1}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Section header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingTop: 8,
                paddingBottom: 12,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.5 }}>
                Recent Listings
              </Text>
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.gold, textTransform: "uppercase", letterSpacing: 1 }}>
                See all →
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => <ListingCard listing={item} />}
      />
    </SafeAreaView>
  );
}
