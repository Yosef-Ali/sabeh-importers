import { useState } from "react";
import { View, Text, ScrollView, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { SabehLogo } from "@/components/sabeh-logo";
import { ListingCard } from "@/components/listing-card";
import { CATEGORIES, LISTINGS } from "@/lib/mock-data";
import { colors, shadows } from "@/lib/theme";

/**
 * Home / Browse screen — Sabeh Mobile Flow SCREEN 2.
 * Header (logo + notif + avatar) → search bar → category chips → featured
 * banner → 2-col listings grid.
 */
export default function HomeScreen() {
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

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 6 }}
        style={{ flexGrow: 0, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        {CATEGORIES.map((cat) => {
          const active = cat === activeCategory;
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: active ? colors.gold : "transparent",
                borderWidth: 1,
                borderColor: active ? colors.navy : colors.border,
                marginRight: 6,
                ...(active ? shadows.hard : {}),
              }}
            >
              <Text
                style={{
                  color: active ? colors.navy : colors.muted,
                  fontFamily: "SpaceGrotesk_700Bold",
                  fontSize: 10,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 1.0,
                }}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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

            {/* Section header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingTop: 8,
                paddingBottom: 12,
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
