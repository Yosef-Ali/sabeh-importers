import { useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { MY_LISTINGS, STATUS_META, countByStatus, formatPrice, type ListingStatus } from "@/lib/mock-data";
import { colors, shadows } from "@/lib/theme";

const NAVY_BLURHASH = "L00000fQfQfQfQfQfQfQfQfQfQfQ";

/**
 * My Listings — mirrors the web /my-listings page.
 * Status filter chips (All / Active / Pending / Sold / Expired / Draft)
 * Row-style list matching web's ListingsTable.
 */

const FILTER_TABS: Array<{ label: string; value: ListingStatus | "ALL" }> = [
  { label: "All",     value: "ALL" },
  { label: "Active",  value: "ACTIVE" },
  { label: "Pending", value: "PENDING_REVIEW" },
  { label: "Sold",    value: "SOLD" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Draft",   value: "DRAFT" },
];

export default function MyListingsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<ListingStatus | "ALL">("ALL");

  // Pre-compute counts once so the chip row doesn't filter on every render
  const statusCounts = countByStatus(MY_LISTINGS);

  const filtered = filter === "ALL" ? MY_LISTINGS : MY_LISTINGS.filter((l) => l.status === filter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.surface }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Pressable
            onPress={() => router.back()}
            style={{ width: 36, height: 36, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
          >
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 16, color: colors.foreground, textTransform: "uppercase", letterSpacing: 0.4 }}>
              My Listings
            </Text>
            <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.4 }}>
              {MY_LISTINGS.length} total · {statusCounts["ACTIVE"] ?? 0} active
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/post" as any)}
            style={{ backgroundColor: colors.gold, paddingHorizontal: 12, paddingVertical: 8, ...shadows.hard }}
          >
            <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 10, color: colors.navy, textTransform: "uppercase", letterSpacing: 0.8 }}>
              + New
            </Text>
          </Pressable>
        </View>

        {/* Status filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 6 }}
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.value;
            const count = tab.value === "ALL"
              ? MY_LISTINGS.length
              : statusCounts[tab.value] ?? 0;
            return (
              <Pressable
                key={tab.value}
                onPress={() => setFilter(tab.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: active ? colors.navy : "transparent",
                  borderWidth: 1,
                  borderColor: active ? colors.navy : colors.border,
                  marginRight: 4,
                  ...(active ? shadows.hard : {}),
                }}
              >
                <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 10, color: active ? colors.gold : colors.muted, textTransform: "uppercase", letterSpacing: 1 }}>
                  {tab.label}
                </Text>
                <View style={{ backgroundColor: active ? colors.gold : colors.background, paddingHorizontal: 5, paddingVertical: 1 }}>
                  <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: active ? colors.navy : colors.muted }}>
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {/* Listings list */}
      <FlatList
        data={filtered}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 64, gap: 12 }}>
            <Feather name="package" size={40} color={colors.muted} />
            <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 14, color: colors.muted, textTransform: "uppercase" }}>
              No listings
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
        renderItem={({ item }) => {
          const sm = STATUS_META[item.status];
          return (
            <Pressable
              onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } } as any)}
              style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12, backgroundColor: colors.surface }}
            >
              {/* Listing thumbnail — fall back to status-colored swatch with initial */}
              <View style={{ width: 44, height: 44, backgroundColor: sm.bg, borderWidth: 1, borderColor: sm.color + "40", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {item.imageUrls?.[0] ? (
                  <Image
                    source={{ uri: item.imageUrls[0] }}
                    placeholder={NAVY_BLURHASH}
                    contentFit="cover"
                    transition={150}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 14, color: sm.color }}>
                    {item.seller.initial}
                  </Text>
                )}
              </View>

              {/* Info */}
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 13, color: colors.foreground, textTransform: "uppercase" }} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted }}>
                    {formatPrice(item.price, item.currency)}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                    <Feather name="eye" size={9} color={colors.muted} />
                    <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted }}>
                      {item.viewCount}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Status badge */}
              <View style={{ backgroundColor: sm.bg, paddingHorizontal: 7, paddingVertical: 4, borderWidth: 1, borderColor: sm.color + "40" }}>
                <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: sm.color, textTransform: "uppercase", letterSpacing: 1 }}>
                  {sm.label}
                </Text>
              </View>

              <Feather name="chevron-right" size={14} color={colors.muted} />
            </Pressable>
          );
        }}
      />
    </View>
  );
}
