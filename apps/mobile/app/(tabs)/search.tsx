import { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ListingCard } from "@/components/listing-card";
import { LISTINGS } from "@/lib/mock-data";
import { colors, shadows } from "@/lib/theme";

const FILTER_CHIPS = ["Condition", "Price", "Location", "Year"];

/**
 * Search screen — Sabeh Mobile Flow SCREEN 5.
 * Auto-focused search input + horizontal filter chips + results count + grid.
 */
export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Search header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderWidth: 1,
            borderColor: query.length > 0 ? colors.foreground : colors.border,
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 10,
            ...(query.length > 0 ? shadows.hard : {}),
          }}
        >
          <Feather name="search" size={16} color={colors.muted} />
          <TextInput
            placeholder="Search listings…"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            style={{
              flex: 1,
              fontFamily: "DMSans_400Regular",
              fontSize: 14,
              color: colors.foreground,
              padding: 0,
            }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Feather name="x" size={16} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 6 }}
        style={{ flexGrow: 0, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        {FILTER_CHIPS.map((chip) => (
          <Pressable
            key={chip}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: colors.border,
              marginRight: 6,
            }}
          >
            <Text
              style={{
                color: colors.foreground,
                fontFamily: "SpaceGrotesk_700Bold",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              {chip}
            </Text>
            <Feather name="chevron-down" size={12} color={colors.muted} />
          </Pressable>
        ))}
      </ScrollView>

      {/* Results header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
        }}
      >
        <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 14, color: colors.foreground, textTransform: "uppercase", letterSpacing: 0.4 }}>
          {LISTINGS.length} Results
        </Text>
        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Sort: Newest
          </Text>
          <Feather name="chevron-down" size={12} color={colors.muted} />
        </Pressable>
      </View>

      {/* Results grid */}
      <FlatList
        data={LISTINGS}
        keyExtractor={(l) => l.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        renderItem={({ item }) => <ListingCard listing={item} />}
      />
    </SafeAreaView>
  );
}
