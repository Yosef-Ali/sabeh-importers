import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { CONVERSATIONS } from "@/lib/mock-data";
import { colors } from "@/lib/theme";

// CONVERSATIONS is static mock data — hoist derived value to avoid recomputing each render
const TOTAL_UNREAD = CONVERSATIONS.reduce((s, c) => s + c.unreadCount, 0);

/**
 * Messages inbox — mirrors the web /messages page.
 * Lists buyer-seller conversations; tapping opens the thread.
 */
export default function MessagesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface }}>
        <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: colors.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
          Inbox
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 26, color: colors.foreground, textTransform: "uppercase", letterSpacing: -0.5 }}>
            Messages
          </Text>
          {TOTAL_UNREAD > 0 && (
            <View style={{ backgroundColor: colors.gold, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 2 }}>
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: colors.navy }}>
                {TOTAL_UNREAD} unread
              </Text>
            </View>
          )}
        </View>
      </View>

      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(c) => c.id}
        style={{ backgroundColor: colors.surface }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 32, paddingTop: 64 }}>
            <Feather name="inbox" size={40} color={colors.muted} />
            <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 16, color: colors.muted, textTransform: "uppercase" }}>
              No messages yet
            </Text>
            <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 13, color: colors.muted, textAlign: "center" }}>
              When you chat with buyers or sellers, conversations appear here.
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 76 }} />
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: "/messages/[id]", params: { id: item.id } } as any)}
            style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 16, backgroundColor: item.unreadCount > 0 ? "rgba(255,215,0,0.04)" : colors.surface }}
          >
            {/* Avatar */}
            <View style={{ width: 48, height: 48, backgroundColor: colors.navy, borderWidth: 1, borderColor: item.unreadCount > 0 ? colors.gold : "rgba(10,25,47,0.15)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: item.unreadCount > 0 ? colors.gold : "rgba(255,215,0,0.4)", fontFamily: "SpaceGrotesk_700Bold", fontSize: 18 }}>
                {item.otherParty.initial}
              </Text>
            </View>

            {/* Content */}
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 14, color: colors.foreground, textTransform: "uppercase" }}>
                {item.otherParty.name}
              </Text>
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: colors.gold, textTransform: "uppercase", letterSpacing: 1.2 }} numberOfLines={1}>
                {item.listingTitle}
              </Text>
              <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 13, color: item.unreadCount > 0 ? colors.foreground : colors.muted }} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>

            {/* Right side */}
            <View style={{ alignItems: "flex-end", gap: 6 }}>
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>
                {item.lastTime}
              </Text>
              {item.unreadCount > 0 ? (
                <View style={{ minWidth: 20, height: 20, paddingHorizontal: 6, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: colors.navy, fontFamily: "SpaceMono_700Bold", fontSize: 9 }}>
                    {item.unreadCount}
                  </Text>
                </View>
              ) : (
                <Feather name="chevron-right" size={14} color={colors.muted} />
              )}
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
