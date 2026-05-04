import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import { colors, shadows } from "@/lib/theme";

/**
 * Bottom tab navigator — 5 tabs (Home, Search, Post[FAB], Messages, Profile).
 * Mirrors BottomTabs from Sabeh Mobile Flow.html: Post is an elevated gold
 * FAB in the center, others are mono-uppercase labels.
 *
 * Icons via @expo/vector-icons/Feather (already in package.json — no extra
 * install). Glyph names: home, search, plus, message-square, user.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "SpaceMono_700Bold",
          fontSize: 8,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 1.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Feather name="search" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "",
          tabBarIcon: () => (
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: colors.gold,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -16,
                ...shadows.hard,
              }}
            >
              <Feather name="plus" size={24} color={colors.navy} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: colors.destructive,
            color: colors.surface,
            fontSize: 9,
            fontFamily: "SpaceMono_700Bold",
          },
          tabBarIcon: ({ color }) => <Feather name="message-square" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
