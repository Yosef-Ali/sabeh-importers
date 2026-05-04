import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/lib/theme";

const THREADS = [
  { id: "t1", who: "Habesha Motors", initial: "H", last: "Still available — when can you visit?", time: "2m", unread: 2 },
  { id: "t2", who: "Industrial Co", initial: "I", last: "Price negotiable for cash buyers.", time: "1h", unread: 0 },
  { id: "t3", who: "Selam Auto", initial: "S", last: "Sent the inspection report.", time: "Yesterday", unread: 1 },
];

/**
 * Messages list — Sabeh Mobile Flow common pattern. Each row: square
 * avatar, name + last message, unread count pill on right.
 */
export default function MessagesScreen() {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: colors.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
          Inbox
        </Text>
        <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 28, color: colors.foreground, textTransform: "uppercase", letterSpacing: -0.5 }}>
          Messages
        </Text>
      </View>

      <FlatList
        data={THREADS}
        keyExtractor={(t) => t.id}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 80 }} />}
        renderItem={({ item }) => (
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 16,
              backgroundColor: colors.surface,
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
                {item.initial}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 14, color: colors.foreground, textTransform: "uppercase" }}>
                {item.who}
              </Text>
              <Text
                style={{ fontFamily: "DMSans_400Regular", fontSize: 13, color: colors.muted }}
                numberOfLines={1}
              >
                {item.last}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>
                {item.time}
              </Text>
              {item.unread > 0 && (
                <View style={{ minWidth: 20, height: 20, paddingHorizontal: 6, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: colors.navy, fontFamily: "SpaceMono_700Bold", fontSize: 9, fontWeight: "700" }}>
                    {item.unread}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
