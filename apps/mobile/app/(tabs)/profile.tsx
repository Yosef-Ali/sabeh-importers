import { type ComponentProps } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { MY_LISTINGS, CONVERSATIONS, STATUS_META, getMyStats, countByStatus, formatPrice } from "@/lib/mock-data";
import { colors, shadows } from "@/lib/theme";

const NAVY_BLURHASH = "L00000fQfQfQfQfQfQfQfQfQfQfQ";

type StatCard = { label: string; value: string; icon: ComponentProps<typeof Feather>["name"]; accent?: string };

/**
 * Profile / Seller Dashboard — mirrors the web /dashboard page:
 *  - Same 4 stats: Total Listings, Active, Total Views, Unread Messages
 *  - Status breakdown: Active / Pending Review / Sold / Expired / Draft
 *  - "Account Not Verified" prompt (mirrors web verificationStatus check)
 *  - Working navigation to Post, My Listings, Messages
 */
export default function ProfileScreen() {
  const router = useRouter();
  const stats = getMyStats();

  // Mirrors web STATUS_COLORS breakdown sidebar — single reduce pass, colors from STATUS_META
  const statusCounts = countByStatus(MY_LISTINGS);
  const breakdown = (Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((key) => ({
    label: STATUS_META[key].label,
    count: statusCounts[key] ?? 0,
    dot:   STATUS_META[key].color,
  }));

  const recentListings = MY_LISTINGS.slice(0, 5);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Navy header — mirrors web "Welcome back, {firstName}" */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.navy }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20, backgroundColor: colors.navy }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 11, color: colors.gold, textTransform: "uppercase", letterSpacing: 2 }}>
                Seller Dashboard
              </Text>
              <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 22, color: colors.surface, textTransform: "uppercase", letterSpacing: -0.5 }}>
                Welcome back, Abebe
              </Text>
              <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                Here's what's happening with your listings.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Settings"
              hitSlop={8}
              onPress={() =>
                Alert.alert("Settings", "Choose an action", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Edit Profile",
                    onPress: () => Alert.alert("Coming soon", "Profile editing will be available in the next release."),
                  },
                  {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: () => Alert.alert("Coming soon", "Sign-out will be available once authentication ships."),
                  },
                ])
              }
              style={{ width: 44, height: 44, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}
            >
              <Feather name="settings" size={18} color={colors.surface} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Stats Grid — mirrors web 4-card row ───────────────────────── */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 8 }}>
          {([
            { label: "Total Listings",  value: String(stats.total),                      icon: "package"        },
            { label: "Active",          value: String(stats.active),                     icon: "check-circle",   accent: "#10B981" },
            { label: "Total Views",     value: stats.totalViews.toLocaleString("en-US"), icon: "eye"            },
            { label: "Unread Messages", value: String(stats.unreadMessages),             icon: "message-circle", accent: stats.unreadMessages > 0 ? colors.gold : undefined },
          ] as StatCard[]).map((s) => (
            <View
              key={s.label}
              style={{
                width: "48%",
                backgroundColor: colors.surface,
                borderTopWidth: 3,
                borderTopColor: s.accent ?? colors.navy,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 14,
                gap: 6,
                ...shadows.hard,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.2, flex: 1 }}>
                  {s.label}
                </Text>
                <Feather name={s.icon} size={16} color={s.accent ?? colors.muted} />
              </View>
              <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 26, color: s.accent ?? colors.foreground, letterSpacing: -0.5, marginTop: 2 }}>
                {s.value}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Account Not Verified — mirrors web yellow prompt ───────────── */}
        <View style={{ marginHorizontal: 12, marginBottom: 8 }}>
          <View
            accessibilityRole="alert"
            style={{ backgroundColor: "#FEF3C7", borderWidth: 1, borderColor: "#FBBF24", padding: 12, flexDirection: "row", alignItems: "flex-start", gap: 10 }}
          >
            <Feather name="clock" size={18} color="#92400E" style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 13, color: "#78350F", textTransform: "uppercase", letterSpacing: 0.4 }}>
                Account Not Verified
              </Text>
              <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 13, color: "#78350F", marginTop: 4, lineHeight: 18 }}>
                Verify your account to get a badge and build buyer trust.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Quick Actions ──────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 12, gap: 8, marginBottom: 4 }}>
          <Button fullWidth onPress={() => router.push("/(tabs)/post" as any)}>
            + Post a Listing
          </Button>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button variant="outline" fullWidth onPress={() => router.push("/my-listings" as any)}>
              My Listings
            </Button>
            <Button variant="outline" fullWidth onPress={() => router.push("/(tabs)/messages" as any)}>
              {stats.unreadMessages > 0 ? `Messages (${stats.unreadMessages})` : "Messages"}
            </Button>
          </View>
        </View>

        {/* ── Recent Listings — mirrors web dashboard recent 5 ───────────── */}
        <View style={{ marginHorizontal: 12, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.5 }}>
              Recent Listings
            </Text>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="View all listings"
              hitSlop={8}
              onPress={() => router.push("/my-listings" as any)}
              style={{ paddingHorizontal: 8, paddingVertical: 6, marginRight: -8 }}
            >
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 12, color: colors.navy, textTransform: "uppercase", letterSpacing: 1 }}>
                View All →
              </Text>
            </Pressable>
          </View>

          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, ...shadows.hard }}>
            {recentListings.length === 0 ? (
              <View style={{ padding: 32, alignItems: "center", gap: 8 }}>
                <Feather name="package" size={32} color={colors.muted} />
                <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 14, color: colors.foreground, textTransform: "uppercase" }}>No listings yet</Text>
                <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 13, color: colors.muted, textAlign: "center" }}>Create your first listing to start selling</Text>
              </View>
            ) : (
              recentListings.map((listing, i) => {
                const sm = STATUS_META[listing.status];
                return (
                  <Pressable
                    key={listing.id}
                    onPress={() => router.push({ pathname: "/listing/[id]", params: { id: listing.id } } as any)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      gap: 12,
                      borderBottomWidth: i < recentListings.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                    }}
                  >
                    {/* Listing thumbnail — falls back to initial-on-navy when no image */}
                    <View style={{ width: 44, height: 44, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.gold, overflow: "hidden" }}>
                      {listing.imageUrls?.[0] ? (
                        <Image
                          source={{ uri: listing.imageUrls[0] }}
                          placeholder={NAVY_BLURHASH}
                          contentFit="cover"
                          transition={150}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 14, color: colors.gold }}>
                          {listing.seller.initial}
                        </Text>
                      )}
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 13, color: colors.foreground, textTransform: "uppercase" }} numberOfLines={1}>
                        {listing.title}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 11, color: colors.muted }}>
                          {formatPrice(listing.price, listing.currency)}
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Feather name="eye" size={12} color={colors.muted} />
                          <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 11, color: colors.muted }}>
                            {listing.viewCount}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Status badge — single-line, readable label */}
                    <View style={{ backgroundColor: sm.bg, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: sm.color + "60" }}>
                      <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: sm.color, textTransform: "uppercase", letterSpacing: 0.8 }}>
                        {sm.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>

        {/* ── Status Breakdown — mirrors web sidebar card ────────────────── */}
        <View style={{ marginHorizontal: 12, marginTop: 16 }}>
          <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
            Status Breakdown
          </Text>
          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, ...shadows.hard }}>
            {breakdown.map((item, i) => (
              <View
                key={item.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  borderBottomWidth: i < breakdown.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.dot }} />
                  <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 13, color: colors.muted }}>
                    {item.label}
                  </Text>
                </View>
                <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 13, color: colors.foreground }}>
                  {item.count}
                </Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
