import { useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions, Alert } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LISTINGS, formatPrice } from "@/lib/mock-data";
import { openWhatsApp, openPhoneCall } from "@/lib/contact";
import { useFavorite } from "@/lib/favorites";
import { colors, shadows } from "@/lib/theme";

// 1x1 navy blurhash — see components/listing-card.tsx
const NAVY_BLURHASH = "L00000fQfQfQfQfQfQfQfQfQfQfQ";

// WhatsApp brand green — used sparingly so it doesn't fight the navy/gold palette
const WHATSAPP_GREEN = "#25D366";

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

  const listing = LISTINGS.find((l) => l.id === id) ?? LISTINGS[0];
  const { saved, toggle: toggleSaved } = useFavorite(listing.id);
  // Fall back to one empty slot so the gallery always renders something —
  // a listing with no photos still gets a placeholder + dot indicator.
  const images = listing.imageUrls?.length ? listing.imageUrls : [undefined];

  // Pre-filled WhatsApp message — keeps the buyer→seller intro consistent
  // and signals that the inquiry came from Sabeh, not a random number.
  const whatsappMessage =
    `Hi ${listing.seller.name}, I'm interested in your "${listing.title}" ` +
    `(${formatPrice(listing.price, listing.currency)}) on Sabeh. Is it still available?`;
  const sellerPhone = listing.seller.phone;

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
            accessibilityRole="button"
            accessibilityLabel={saved ? "Remove from saved" : "Save listing"}
            accessibilityState={{ selected: saved }}
            onPress={toggleSaved}
            hitSlop={8}
            style={{
              width: 36,
              height: 36,
              borderWidth: 1,
              borderColor: saved ? colors.destructive : colors.border,
              backgroundColor: saved ? "rgba(220,38,38,0.08)" : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather
              name="heart"
              size={16}
              color={saved ? colors.destructive : colors.foreground}
              style={saved ? { /* filled look via color only — feather has no filled heart */ } : undefined}
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
          {images.map((uri, i) => (
            <View
              key={i}
              style={{
                width: SCREEN_WIDTH,
                aspectRatio: 4 / 3,
                backgroundColor: colors.navy,
              }}
            >
              {uri ? (
                <Image
                  source={{ uri }}
                  placeholder={NAVY_BLURHASH}
                  contentFit="cover"
                  transition={250}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 11, color: "rgba(255,215,0,0.4)", textTransform: "uppercase", letterSpacing: 2 }}>
                    No image
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        {images.length > 1 && (
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, paddingVertical: 12, backgroundColor: colors.surface }}>
            {images.map((_, i) => (
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
        )}

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
        <View style={{ flexDirection: "row", gap: 8, padding: 12, alignItems: "stretch" }}>
          <Button
            variant="outline"
            fullWidth
            onPress={() => {
              Alert.alert(
                "Make an Offer",
                `Send an offer to ${listing.seller.name} for "${listing.title}"?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Send via WhatsApp",
                    onPress: () =>
                      sellerPhone &&
                      openWhatsApp(
                        sellerPhone,
                        `Hi ${listing.seller.name}, I'd like to make an offer on your "${listing.title}". What's the lowest you'd accept?`,
                      ),
                  },
                ],
              );
            }}
          >
            Make Offer
          </Button>

          {/* WhatsApp CTA — primary contact channel for Ethiopian buyers */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Message ${listing.seller.name} on WhatsApp`}
            disabled={!sellerPhone}
            onPress={() => sellerPhone && openWhatsApp(sellerPhone, whatsappMessage)}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: WHATSAPP_GREEN,
              paddingHorizontal: 12,
              opacity: sellerPhone ? 1 : 0.4,
              ...shadows.hard,
            }}
          >
            <FontAwesome name="whatsapp" size={18} color={colors.white} />
            <Text style={{ color: colors.white, fontFamily: "SpaceGrotesk_700Bold", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.2 }}>
              WhatsApp
            </Text>
          </Pressable>

          {/* Tel: fallback — one tap call for buyers who prefer voice */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Call ${listing.seller.name}`}
            disabled={!sellerPhone}
            onPress={() => sellerPhone && openPhoneCall(sellerPhone)}
            style={{
              width: 48,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.foreground,
              opacity: sellerPhone ? 1 : 0.4,
            }}
          >
            <Feather name="phone" size={18} color={colors.foreground} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
