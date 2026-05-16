import { useState } from "react";
import { Pressable, View, Text } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Badge } from "./ui/badge";
import { colors, shadows } from "@/lib/theme";
import { type Listing, formatPrice } from "@/lib/mock-data";

// 1x1 blurhash — keeps the same navy tone the placeholder used to show, so
// images fade in from a brand-consistent bg instead of a flash of white.
const NAVY_BLURHASH = "L00000fQfQfQfQfQfQfQfQfQfQfQ";

/**
 * Listing tile for the home grid + search results. Tap → /listing/[id].
 */
export function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const thumbnail = listing.imageUrls?.[0];

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/listing/[id]", params: { id: listing.id } } as any)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        flex: 1,
        opacity: pressed ? 0.92 : 1,
        ...(listing.isPremium ? shadows.hardGold : shadows.hard),
      }}
    >
      {/* 4:3 thumbnail with floating badges (Featured / condition / id) */}
      <View
        style={{
          aspectRatio: 4 / 3,
          backgroundColor: colors.navy,
          borderBottomWidth: listing.isPremium ? 2 : 1,
          borderBottomColor: listing.isPremium ? colors.gold : colors.border,
          position: "relative",
        }}
      >
        {thumbnail && (
          <Image
            source={{ uri: thumbnail }}
            placeholder={NAVY_BLURHASH}
            contentFit="cover"
            transition={200}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
        {/* Badge row + ID strip overlay sits above the image */}
        <View style={{ flex: 1, padding: 8, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {listing.isPremium && <Badge variant="gold">Featured</Badge>}
            <View style={{ flex: 1 }} />
            <Badge variant={listing.condition === "NEW" ? "success" : "outline"}>
              {listing.condition}
            </Badge>
          </View>
          <Text
            style={{
              fontFamily: "SpaceMono_700Bold",
              fontSize: 9,
              color: "rgba(255,215,0,0.85)",
              textTransform: "uppercase",
              letterSpacing: 1.6,
              // Subtle dark-stroke shadow keeps the ID readable against any photo
              textShadowColor: "rgba(10,25,47,0.85)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            #{listing.id.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={{ padding: 10, gap: 6 }}>
        <Text
          style={{
            fontFamily: "SpaceMono_700Bold",
            fontSize: 9,
            color: colors.gold,
            textTransform: "uppercase",
            letterSpacing: 1.6,
          }}
        >
          {listing.category}
        </Text>
        <Text
          style={{
            fontFamily: "SpaceGrotesk_700Bold",
            fontSize: 13,
            fontWeight: "700",
            color: colors.foreground,
            textTransform: "uppercase",
          }}
          numberOfLines={2}
        >
          {listing.title}
        </Text>
        <Text
          style={{
            fontFamily: "SpaceGrotesk_700Bold",
            fontSize: 15,
            fontWeight: "700",
            color: colors.foreground,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {formatPrice(listing.price, listing.currency)}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 6,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>
            📍 {listing.location}
          </Text>
          <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>
            {listing.postedAt}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
