import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { LISTINGS } from "@/lib/mock-data";
import { colors, shadows } from "@/lib/theme";

const STATS = [
  { label: "Active", value: "12", hint: "Listings" },
  { label: "Views", value: "4.2k", hint: "This month" },
  { label: "Bids", value: "38", hint: "Pending" },
  { label: "Sold", value: "9", hint: "All-time" },
];

const ACTIVITY = [
  { id: "ev1", label: "Bid received", target: "BYD Atto 3", time: "12m" },
  { id: "ev2", label: "Listing approved", target: "Komatsu PC200", time: "1h" },
  { id: "ev3", label: "Buyer messaged", target: "Toyota Hilux", time: "3h" },
];

/**
 * Profile / Dashboard — Sabeh Mobile Flow SCREEN 4.
 * Navy header w/ Amharic greeting → 4 stat cards w/ gold top accent →
 * Create Listing CTA → recent listings → activity feed.
 */
export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Navy header */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.navy }}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 24,
            backgroundColor: colors.navy,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={{
                  fontFamily: "SpaceMono_700Bold",
                  fontSize: 9,
                  color: colors.gold,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Welcome Back
              </Text>
              <Text
                style={{
                  fontFamily: "SpaceGrotesk_700Bold",
                  fontSize: 24,
                  color: colors.surface,
                  textTransform: "uppercase",
                  letterSpacing: -0.5,
                }}
              >
                Abebe
              </Text>
              <Text
                style={{
                  fontFamily: "DMSans_400Regular",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                ሰላም አበበ · Habesha Motors
              </Text>
            </View>
            <Pressable
              style={{
                width: 36,
                height: 36,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="settings" size={16} color={colors.surface} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Stats grid — 2x2 with gold top accent */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 8 }}>
          {STATS.map((s) => (
            <View
              key={s.label}
              style={{
                width: "48%",
                backgroundColor: colors.surface,
                borderTopWidth: 3,
                borderTopColor: colors.gold,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 14,
                ...shadows.hard,
              }}
            >
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.4 }}>
                {s.label}
              </Text>
              <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 28, color: colors.foreground, marginTop: 4, letterSpacing: -0.5 }}>
                {s.value}
              </Text>
              <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 11, color: colors.muted, marginTop: 2 }}>
                {s.hint}
              </Text>
            </View>
          ))}
        </View>

        {/* Create Listing CTA */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Button fullWidth>+ Create New Listing</Button>
        </View>

        {/* Recent listings */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.5 }}>
              Your Recent Listings
            </Text>
            <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.gold, textTransform: "uppercase", letterSpacing: 1 }}>
              View all →
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {LISTINGS.slice(0, 2).map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </View>
        </View>

        {/* Activity feed */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            Recent Activity
          </Text>
          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, ...shadows.hard }}>
            {ACTIVITY.map((ev, i) => (
              <View
                key={ev.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 14,
                  borderBottomWidth: i === ACTIVITY.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border,
                  borderLeftWidth: 2,
                  borderLeftColor: colors.gold,
                }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.gold, textTransform: "uppercase", letterSpacing: 1.4 }}>
                    {ev.label}
                  </Text>
                  <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 13, color: colors.foreground, textTransform: "uppercase" }}>
                    {ev.target}
                  </Text>
                </View>
                <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>
                  {ev.time}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
