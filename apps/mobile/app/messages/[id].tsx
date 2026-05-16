import { useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { CONVERSATIONS } from "@/lib/mock-data";
import { colors, shadows } from "@/lib/theme";

/**
 * Conversation Thread — mirrors the web /messages/[id] page.
 * Buyer ↔ Seller message bubbles, reply input at bottom.
 */
export default function ConversationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const conv = CONVERSATIONS.find((c) => c.id === id) ?? CONVERSATIONS[0];

  const [messages, setMessages] = useState(conv.messages);
  const [draft, setDraft] = useState("");

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `m${Date.now()}`, text, isMine: true, time: "Now" }]);
    setDraft("");
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
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

            {/* Avatar */}
            <View style={{ width: 36, height: 36, backgroundColor: colors.navy, borderWidth: 1, borderColor: colors.gold, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.gold, fontFamily: "SpaceGrotesk_700Bold", fontSize: 14 }}>
                {conv.otherParty.initial}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 14, color: colors.foreground, textTransform: "uppercase" }}>
                {conv.otherParty.name}
              </Text>
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.2 }} numberOfLines={1}>
                Re: {conv.listingTitle}
              </Text>
            </View>

            {conv.otherParty.verified && (
              <View style={{ backgroundColor: "rgba(16,185,129,0.1)", paddingHorizontal: 6, paddingVertical: 3 }}>
                <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: "#10B981", textTransform: "uppercase", letterSpacing: 1 }}>
                  Verified
                </Text>
              </View>
            )}
          </View>

          {/* Listing context bar */}
          <View style={{ backgroundColor: "rgba(10,25,47,0.04)", borderBottomWidth: 1, borderBottomColor: colors.border, padding: 10, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather name="package" size={12} color={colors.muted} />
            <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.2 }} numberOfLines={1}>
              Listing: {conv.listingTitle}
            </Text>
          </View>
        </SafeAreaView>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf: item.isMine ? "flex-end" : "flex-start",
                maxWidth: "78%",
                gap: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: item.isMine ? colors.navy : colors.surface,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: item.isMine ? colors.navy : colors.border,
                  borderLeftWidth: item.isMine ? 1 : 3,
                  borderLeftColor: item.isMine ? colors.navy : colors.gold,
                  ...(item.isMine ? {} : shadows.hard),
                }}
              >
                <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 14, color: item.isMine ? colors.surface : colors.foreground, lineHeight: 20 }}>
                  {item.text}
                </Text>
              </View>
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: colors.muted, textTransform: "uppercase", letterSpacing: 1, alignSelf: item.isMine ? "flex-end" : "flex-start" }}>
                {item.time}
              </Text>
            </View>
          )}
        />

        {/* Reply bar */}
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, padding: 10 }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Type a message…"
              placeholderTextColor={colors.muted}
              style={{
                flex: 1,
                fontFamily: "DMSans_400Regular",
                fontSize: 14,
                color: colors.foreground,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.background,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
              multiline
              maxLength={1000}
            />
            <Pressable
              onPress={send}
              style={{
                width: 44,
                height: 44,
                backgroundColor: draft.trim() ? colors.gold : colors.border,
                alignItems: "center",
                justifyContent: "center",
                ...(draft.trim() ? shadows.hard : {}),
              }}
            >
              <Feather name="send" size={18} color={draft.trim() ? colors.navy : colors.muted} />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}
