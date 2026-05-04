import { Pressable, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Badge } from "./ui/badge";
import { colors, shadows } from "@/lib/theme";
import { type Listing, formatPrice } from "@/lib/mock-data";

/**
 * Listing tile for the home grid + search results. Tap → /listing/[id].
 * Image placeholder is a navy block — wire to expo-image with the real
 * thumbnail once the backend integration lands.
 */
export function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/listing/${listing.id}` as any)}
      style={({ pressed }) => [
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          flex: 1,
          opacity: pressed ? 0.92 : 1,
          ...(listing.isPremium ? shadows.hardGold : shadows.hard),
        },
      ]}
    >
      {/* Image placeholder — 4:3 navy block w/ blueprint dot grid */}
      <View
        style={{
          aspectRatio: 4 / 3,
          backgroundColor: colors.navy,
          borderBottomWidth: listing.isPremium ? 2 : 1,
          borderBottomColor: listing.isPremium ? colors.gold : colors.border,
          padding: 8,
          justifyContent: "space-between",
        }}
      >
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
            color: "rgba(255,215,0,0.5)",
            textTransform: "uppercase",
            letterSpacing: 1.6,
          }}
        >
          #{listing.id.toUpperCase()}
        </Text>
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
