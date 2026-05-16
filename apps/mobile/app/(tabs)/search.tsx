import { useState, useMemo } from "react";
import { View, Text, TextInput, ScrollView, Pressable, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ListingCard } from "@/components/listing-card";
import { LISTINGS, CATEGORIES } from "@/lib/mock-data";
import { colors, shadows } from "@/lib/theme";

type SortOption = { key: "newest" | "priceAsc" | "priceDesc" | "popular"; label: string };
const SORT_OPTIONS: SortOption[] = [
  { key: "newest", label: "Newest" },
  { key: "priceAsc", label: "Price: Low to High" },
  { key: "priceDesc", label: "Price: High to Low" },
  { key: "popular", label: "Most Viewed" },
];

/**
 * Search screen — live query + category filter matching web /search page.
 * Category chips mirror web's getCategories() list.
 */
export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState<SortOption["key"]>("newest");

  const results = useMemo(() => {
    let list = LISTINGS;
    if (activeCategory !== "All") {
      list = list.filter((l) => l.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.titleAm ?? "").includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q),
      );
    }
    // Sort — clone before sorting so we don't mutate the source array.
    list = [...list];
    if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
    else if (sort === "popular") list.sort((a, b) => b.viewCount - a.viewCount);
    // "newest" → original order (mock data already newest-first)
    return list;
  }, [query, activeCategory, sort]);

  const sortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "Newest";

  function openSortMenu() {
    Alert.alert("Sort by", undefined, [
      ...SORT_OPTIONS.map((opt) => ({
        text: opt.label + (opt.key === sort ? "  ✓" : ""),
        onPress: () => setSort(opt.key),
      })),
      { text: "Cancel", style: "cancel" as const },
    ]);
  }

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

      {/* Category chips — matches web's category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 6 }}
        style={{ flexGrow: 0, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        {CATEGORIES.map((cat) => {
          const active = cat === activeCategory;
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: active ? colors.navy : "transparent",
                borderWidth: 1,
                borderColor: active ? colors.navy : colors.border,
                marginRight: 4,
                ...(active ? shadows.hard : {}),
              }}
            >
              <Text style={{ color: active ? colors.gold : colors.muted, fontFamily: "SpaceGrotesk_700Bold", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
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
          {results.length} Results
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${sortLabel}, tap to change`}
          onPress={openSortMenu}
          hitSlop={6}
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Sort: {sortLabel}
          </Text>
          <Feather name="chevron-down" size={12} color={colors.muted} />
        </Pressable>
      </View>

      {/* Results grid */}
      <FlatList
        data={results}
        keyExtractor={(l) => l.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        renderItem={({ item }) => <ListingCard listing={item} />}
      />
    </SafeAreaView>
  );
}
