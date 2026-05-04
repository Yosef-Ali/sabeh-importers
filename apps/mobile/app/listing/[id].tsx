import { useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LISTINGS, formatPrice } from "@/lib/mock-data";
import { colors, shadows } from "@/lib/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SPECS: Array<[string, string]> = [
  ["Year", "2022"],
  ["Mileage", "45,000 km"],
  ["Fuel", "Petrol"],
  ["Transmission", "Automatic"],
  ["Condition", "Like New"],
  ["Import", "NEW DELIVERY"],
];

/**
 * Listing Detail — Sabeh Mobile Flow SCREEN 3.
 * Top bar (back + title + save) → swipeable image gallery with gold dot
 * indicators → price + condition badges → specs grid → seller card →
 * sticky bottom action bar (Make Offer / Contact).
 */
export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);

  const listing = LISTINGS.find((l) => l.id === id) ?? LISTINGS[0];
  const galleryCount = 4;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.surface }}>
        {/* Top bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              fontFamily: "SpaceGrotesk_700Bold",
              fontSize: 14,
              color: colors.foreground,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
            numberOfLines={1}
          >
            {listing.title}
          </Text>
          <Pressable
            onPress={() => setSaved((p) => !p)}
            style={{
              width: 36,
              height: 36,
              borderWidth: 1,
              borderColor: saved ? colors.destructive : colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather
              name="heart"
              size={16}
              color={saved ? colors.destructive : colors.foreground}
            />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Image gallery — horizontal pager */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setActiveImg(i);
          }}
        >
          {Array.from({ length: galleryCount }).map((_, i) => (
            <View
              key={i}
              style={{
                width: SCREEN_WIDTH,
                aspectRatio: 4 / 3,
                backgroundColor: colors.navy,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 11, color: "rgba(255,215,0,0.4)", textTransform: "uppercase", letterSpacing: 2 }}>
                Image {i + 1} / {galleryCount}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, paddingVertical: 12, backgroundColor: colors.surface }}>
          {Array.from({ length: galleryCount }).map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeImg ? 24 : 6,
                height: 3,
                backgroundColor: i === activeImg ? colors.gold : colors.border,
              }}
            />
          ))}
        </View>

        {/* Price + condition */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Badge variant={listing.condition === "NEW" ? "success" : "outline"}>
              {listing.condition}
            </Badge>
            {listing.isPremium && <Badge variant="gold">Premium</Badge>}
          </View>
          <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 24, color: colors.foreground, textTransform: "uppercase", letterSpacing: -0.4 }}>
            {listing.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
            <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 28, color: colors.foreground, letterSpacing: -0.5 }}>
              {formatPrice(listing.price, listing.currency)}
            </Text>
            <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: colors.gold, textTransform: "uppercase", letterSpacing: 1.2 }}>
              · OBO
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.4 }}>
              📍 {listing.location}
            </Text>
            <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.4 }}>
              {listing.postedAt}
            </Text>
          </View>
        </View>

        {/* Specs grid */}
        <View style={{ padding: 16, gap: 12, backgroundColor: colors.background }}>
          <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.6 }}>
            Specifications
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {SPECS.map(([k, v]) => (
              <View
                key={k}
                style={{
                  width: "48%",
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  padding: 12,
                  gap: 4,
                }}
              >
                <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.6 }}>
                  {k}
                </Text>
                <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 13, color: colors.foreground, textTransform: "uppercase" }}>
                  {v}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Seller card */}
        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 16,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              ...shadows.hard,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: colors.navy,
                borderWidth: 1,
                borderColor: colors.gold,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: colors.gold, fontFamily: "SpaceGrotesk_700Bold", fontSize: 18 }}>
                {listing.seller.initial}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 14, color: colors.foreground, textTransform: "uppercase" }}>
                {listing.seller.name}
              </Text>
              {listing.seller.verified ? (
                <Badge variant="success">Verified Seller</Badge>
              ) : (
                <Badge variant="outline">Standard</Badge>
              )}
            </View>
          </View>

          {/* Safety tip */}
          <View
            style={{
              marginTop: 12,
              padding: 12,
              borderLeftWidth: 4,
              borderLeftColor: colors.gold,
              backgroundColor: "rgba(255,215,0,0.06)",
            }}
          >
            <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: colors.gold, textTransform: "uppercase", letterSpacing: 1.6, marginBottom: 4 }}>
              Safety Tip
            </Text>
            <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: colors.foreground, lineHeight: 18 }}>
              Always inspect the asset in person. Use Sabeh escrow for payments — funds release only after verified delivery.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom action bar */}
      <SafeAreaView edges={["bottom"]} style={{ backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
        <View style={{ flexDirection: "row", gap: 12, padding: 12 }}>
          <View style={{ flex: 1 }}>
            <Button variant="outline" fullWidth>
              Make Offer
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button fullWidth>Contact</Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
